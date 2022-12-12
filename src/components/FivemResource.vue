<template>
  <slot v-if="render" />
</template>

<script setup lang="ts">
import useResource from "@/composables/useResource";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const render = ref(false);
const { onNuiMessage } = useResource();

onNuiMessage<{ render: boolean; locationName?: string }>(
  "displayApp",
  (data) => {
    render.value = data.render;
    if (data.locationName) {
      router.push({
        name: data.locationName,
      });
    }
  }
);
</script>
