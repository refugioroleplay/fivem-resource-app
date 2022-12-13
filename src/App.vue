<template>
  <FivemResource>
    <div>
      <h1>Fivem Resource App</h1>
      <p>{{ resourceName }}</p>
    </div>
  </FivemResource>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useResource, FivemResource } from "@/FivemResourcePlugin";

const { resourceName, emulateNuiMessage } = useResource();

onMounted(() => {
  emulateNuiMessage("displayApp", { render: true });
});
</script>
