<template>
  <slot v-if="render" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import useResource from "@/composables/useResource";

const props = withDefaults(defineProps<{ renderInDevelopment?: boolean }>(), {
  renderInDevelopment: true,
});

const { onNuiMessage } = useResource();
const render = ref(isDevelopmentEnvironment() && props.renderInDevelopment);

interface NuiDisplayApp {
  render: boolean;
}

onNuiMessage<NuiDisplayApp>("displayApp", (data) => {
  render.value = data.render;
});
</script>
