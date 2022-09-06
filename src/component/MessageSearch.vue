<!--
 * @Author: yangrongxin
 * @Date: 2022-09-06 22:28:43
 * @LastEditors: yangrongxin
 * @LastEditTime: 2022-09-06 23:02:07
-->

<script lang="ts" setup>
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue'
const searchValue = ref<string>('');

const searchReasult = () => {
    const allContent = Array.from(document.querySelectorAll('.text-content'));
    const ele = allContent.find(fi => fi.innerHTML === searchValue.value);
    ele?.scrollIntoView({ behavior: 'smooth' });
    // TODO: 存储前一次结果
}

</script>

<template>
    <el-input
        v-model="searchValue"
        placeholder="搜索"
        @keyup.enter="searchReasult"
    >
        <template #append>
            <el-icon color="#000"><Search /></el-icon>
        </template>
    </el-input>
</template>



<style lang="scss">

</style>