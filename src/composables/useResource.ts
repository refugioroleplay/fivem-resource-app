import { computed, inject } from "vue";

function injectOrThrow<T>(name: string): T {
  const injectResult = inject<T>(name);
  if (!injectResult) {
    throw new Error(`Injection for ${name} not found in this context.`);
  }
  return injectResult;
}

export default function useResource() {
  const subscribeToNuiMessage = injectOrThrow<any>("subscribeToNuiMessage");
  const resourceName = computed(() => GetParentResourceName());

  function onNuiMessage<T>(eventName: string, callback: (data: T) => void) {
    subscribeToNuiMessage(eventName, callback);
  }

  function emulateNuiMessage(eventName: string, data: any) {
    if (isFivemEnvironment()) {
      return;
    }

    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: eventName,
          ...data,
        },
      })
    );
  }

  return {
    onNuiMessage,
    emulateNuiMessage,
    resourceName,
  };
}
