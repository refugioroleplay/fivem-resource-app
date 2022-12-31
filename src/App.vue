<template>
  <FivemResource>
    <div>
      <h1>Fivem Resource App</h1>
      <p>{{ resourceName }}</p>
      <p>Your current vrp user id: {{ vrpUserId }}</p>
      <p>Server timestamp: {{ serverTimestamp }}</p>
    </div>
  </FivemResource>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useResource, FivemResource } from "@/FivemResourcePlugin";
import { vrpMessage } from "@/client";

const { resourceName, sendMessage, registerMockRequestNuiToClient } =
  useResource();
registerMockRequestNuiToClient(vrpMessage);

const vrpUserId = ref(0);
const serverTimestamp = ref(0);
async function requestVrpId() {
  const res = await sendMessage<{ userId: number }>("requestVrpId");
  vrpUserId.value = res.userId;
}

async function requestServerTimestamp() {
  const res = await sendMessage<{ timestamp: number }>(
    "requestServerTimestamp"
  );
  serverTimestamp.value = res.timestamp;
}

watchEffect(() => {
  const timeoutId = setInterval(requestServerTimestamp, 1000);
  return () => clearTimeout(timeoutId);
});

requestVrpId();
</script>
