import { computed, inject } from "vue";

export function injectOrThrow<T>(name: string): T {
  const injectResult = inject<T>(name);
  if (!injectResult) {
    throw new Error(`Injection for ${name} not found in this context.`);
  }
  return injectResult;
}

export default function useResource() {
  const subscribeToNuiMessage = injectOrThrow<any>("subscribeToNuiMessage");
  const getMockRequestNuiToClient = inject<any>("getMockRequestNuiToClient");

  const resourceName = computed(() => GetParentResourceName());

  function onNuiMessage<T>(eventName: string, callback: (data: T) => void) {
    subscribeToNuiMessage(eventName, callback);
  }

  async function sendMessage<T>(path: string, body?: any): Promise<T> {
    if (isDevelopmentEnvironment()) {
      return mockMessage(path, body);
    }

    const result = await fetch(`https://${resourceName.value}/${path}`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return result.json();
  }

  async function mockMessage<T>(path: string, body?: any): Promise<T> {
    return getMockRequestNuiToClient?.value.get(path)?.(body);
  }

  function emulateNuiMessage(eventName: string, data: any) {
    isFivemEnvironment() &&
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            type: eventName,
            ...data,
          },
        })
      );
  }

  function registerMockRequestNuiToClient(...mocks: FivemResourceClient[]) {
    if (!isDevelopmentEnvironment()) {
      return;
    }
    const mockRequestNuiToClient = injectOrThrow<any>(
      "getMockRequestNuiToClient"
    );

    mocks.forEach((mock) => {
      Object.keys(mock).forEach((key) => {
        mockRequestNuiToClient.value.set(key, mock[key]);
      });
    });
  }

  return {
    onNuiMessage,
    sendMessage,
    resourceName,
    mockMessage,
    emulateNuiMessage,
    registerMockRequestNuiToClient,
  };
}

export interface FivemResourceClient {
  [key: string]: (data: any) => any;
}

export function defineClientMessage(client: () => FivemResourceClient) {
  return client();
}
