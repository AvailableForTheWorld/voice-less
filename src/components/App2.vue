<template>
  <div >{{ groupName }}</div>
</template>

<script lang="ts" setup>
import type { AppContext } from "@netless/window-manager";

import { computed, inject, onMounted, ref, watchEffect } from "vue";

const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");

const storage = context.createStorage("Group", { groupName: '大音希声' });
const real_count = ref(storage.state.groupName);

const groupName = computed<string>({
  get: () => real_count.value,
  set: (groupName) => storage.setState({ groupName }),
});

onMounted(() =>
  storage.addStateChangedListener(() => {
    real_count.value = storage.state.groupName;
  })
);

watchEffect(() => {
  console.log("App.vue: groupName =", groupName.value);
});
</script>
