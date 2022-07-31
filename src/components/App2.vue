<template>
  <div>
    <button @click="insertMedia">插入视频</button>
  </div>
</template>

<script lang="ts" setup>
import type { AppContext } from "@netless/window-manager";
import type { FastboardApp } from "@netless/fastboard-core";
import { computed, inject, onMounted, ref, watchEffect } from "vue";

debugger;
// console.log("fasterboard",window.fastboard);

const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");

const insertMedia : () => void = async () => {
  const fastborad:FastboardApp = window.fastboard;
  const mid = await fastboard.insertMedia('测试','https://lanhu-cdn.oss-cn-shenzhen.aliyuncs.com/video/ts.mp4');
  console.log("mid: ",mid)
}

// const storage = context.createStorage("counter", { count: 0 });
// const real_count = ref(storage.state.count);

// const count = computed<number>({
//   get: () => real_count.value,
//   set: (count) => storage.setState({ count }),
// });

// onMounted(() =>
//   storage.addStateChangedListener(() => {
//     real_count.value = storage.state.count;
//   })
// );

// watchEffect(() => {
//   console.log("App.vue: count =", count.value);
// });
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
