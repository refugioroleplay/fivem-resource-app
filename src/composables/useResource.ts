import { inject } from "vue";

interface OnNuiMessageCallback<T> {
  (data: T): void;
}

function injectOrThrow<T>(name: string): T {
  const injectResult = inject<T>(name);
  if (!injectResult) {
    throw new Error(`Injection for ${name} not found in this context.`);
  }
  return injectResult;
}

export default function useResource() {
  const subscribeToNuiMessage = injectOrThrow<any>("subscribeToNuiMessage");

  function getResourceName() {
    return GetParentResourceName();
  }

  function onNuiMessage<T>(
    eventName: string,
    callback: OnNuiMessageCallback<T>
  ) {
    subscribeToNuiMessage(eventName, callback);
  }

  function emulateNuiMessage(eventName: string, data: any) {
    if (import.meta.env.FIVEM) {
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
    getResourceName,
  };
}
