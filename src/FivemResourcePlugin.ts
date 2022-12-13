import { ref, type Plugin } from "vue";
import { FivemResource } from "@/components";
import useResource from "@/composables/useResource";

interface FivemResourcePluginOptions {
  debug: boolean;
  defaultResourceName: string;
}

const defaultFivemResourcePluginOptions: FivemResourcePluginOptions = {
  debug: false,
  defaultResourceName: "fivem-resource-app",
};

const FivemResourcePlugin: Plugin = {
  install(app, pluginOptions: FivemResourcePluginOptions) {
    const options = Object.assign(
      defaultFivemResourcePluginOptions,
      pluginOptions
    );

    const isFivemEnvironment = window["GetParentResourceName"] != null;
    window.isFivemEnvironment = () => isFivemEnvironment;

    if (isFivemEnvironment) {
      log("Running into FiveM environment mode");
    } else {
      log("Running into Web environment mode");
      window.GetParentResourceName = () => options.defaultResourceName;
    }

    function log(...args: any[]) {
      if (options.debug) {
        console.log(...args);
      }
    }

    const nuiEventSubscribers = ref<Map<String, Array<Function>>>(new Map());

    app.component("FivemResource", FivemResource);
    app.provide(
      "subscribeToNuiMessage",
      (eventName: string, callback: Function) => {
        const local = nuiEventSubscribers.value;
        const callbacks = local.get(eventName) || [];
        callbacks.push(callback);
        local.set(eventName, callbacks);
      }
    );

    function onMessageReceive(event: any) {
      const eventName = event.data?.type;
      if (!eventName) return;
      nuiEventSubscribers.value.get(eventName)?.forEach((callback) => {
        callback(event.data);
      });
    }

    app.mixin({
      mounted() {
        window.addEventListener("message", onMessageReceive);
      },
      unmounted() {
        window.removeEventListener("message", onMessageReceive);
      },
    });
  },
};

export default FivemResourcePlugin;
export { useResource, FivemResource };
