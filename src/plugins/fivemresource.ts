import { ref, type Plugin } from "vue";

export interface FivemResourcePluginOptions {
  debug: boolean;
  defaultResourceName: string;
}

const FivemResourcePlugin: Plugin = {
  install(app, pluginOptions: FivemResourcePluginOptions) {
    if (window["GetParentResourceName"]) {
      import.meta.env.FIVEM = true;
      log("Running into FiveM environment mode");
    }

    const options = Object.assign(
      {
        debug: true,
        defaultResourceName: "development-fivem-resource-app",
      },
      pluginOptions
    );

    function log(...args: any[]) {
      if (options.debug) {
        console.log(...args);
      }
    }

    if (!import.meta.env.FIVEM) {
      window.GetParentResourceName = () => options.defaultResourceName;
    }

    const nuiEventSubscribers = ref<Map<String, Array<Function>>>(new Map());

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
