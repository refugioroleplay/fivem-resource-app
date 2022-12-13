<template>
  <slot v-if="render" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import useResource from "@/composables/useResource";

const { onNuiMessage } = useResource();
const render = ref(false);

interface NuiDisplayApp {
  render: boolean;
}

onNuiMessage<NuiDisplayApp>("displayApp", (data) => {
  render.value = data.render;
});
</script>
