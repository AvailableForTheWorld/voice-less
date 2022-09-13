<!--
 * @Author: yangrongxin
 * @Date: 2022-09-06 22:28:43
 * @LastEditors: yangrongxin
 * @LastEditTime: 2022-09-13 22:33:49
-->

<script lang="ts" setup>
import { ref, onUpdated } from 'vue';
import { Search } from '@element-plus/icons-vue'
const searchValue = ref<string>('');
const curSearchValue = ref<string>('');
const searchCurrentCount = ref<number>(0);
const searchTotalCount = ref<number>(0);

const resultRecord = ref<number[]>([]);

onUpdated(() => {
    // 重置搜索条件
    if ( searchValue.value !== curSearchValue.value ) {
        searchCurrentCount.value = 0;
        searchTotalCount.value = 0;
        resultRecord.value = [];
        props?.list.forEach(item => item.content = item.originalContent || item.content);
    }
});

const props = defineProps<{
    list: any[]
}>()

const searchResult = () => {
    if ( !Array.isArray(props?.list) && (props?.list as any[]).length === 0 ) {
        return; 
    }
    // 记录当前搜索项目
    curSearchValue.value = searchValue.value;
    // 搜索到最后一个结果 继续搜索返回第一条
    if ( resultRecord.value.length !== 0 && resultRecord.value.length === searchCurrentCount.value ) {
        searchCurrentCount.value = 0;
    }
    // 后续搜索
    if ( resultRecord.value.length !== 0 ) {
        const topIndex = resultRecord.value[searchCurrentCount.value];
        if ( typeof topIndex !== 'number' || topIndex === -1 ) return
        props?.list.forEach(function(item, index) {
            if ( topIndex === index ) {
                item.content = item.originalContent.replace(new RegExp(item.originalContent),'<font color="red">$&</font>')
                const ele = document.querySelector(`div.user-message:nth-child(${index + 1})`)
                ele?.scrollIntoView({ behavior: 'smooth' });
            } else {
                item.content = item.originalContent || item.content;
            }
        })
        if ( searchTotalCount.value !== 0 ) searchCurrentCount.value ++;
        return;
    }
    // 第一次搜索记录所有搜索数据
    props?.list.forEach(function(item, index) {
        const startIndex = ( item.originalContent || item.content ).indexOf(searchValue.value);
        if ( startIndex !== -1 ) {
            if ( !item.originalContent ) item.originalContent = item.content;
            resultRecord.value.push(index);
            if ( searchTotalCount.value === 0 ) {
                item.content = item.originalContent.replace(new RegExp(item.originalContent),'<font color="red">$&</font>')
                const ele = document.querySelector(`div.user-message:nth-child(${index + 1})`)
                ele?.scrollIntoView({ behavior: 'smooth' });
            }
            if ( searchCurrentCount.value === 0 ) searchTotalCount.value++;
        } else {
            if ( !item.originalContent ) item.originalContent = item.content;
            item.content = item.originalContent || item.content;
        }
    })
    if ( searchTotalCount.value !== 0 ) searchCurrentCount.value ++;
}

</script>

<template>
    <div class="message-search">
        <el-input
            v-model="searchValue"
            placeholder="搜索"
            @keyup.enter="searchResult"
        >
            <template #append>
                <el-icon color="#000"><Search /></el-icon>
            </template>
        </el-input>
        <div>
            <span>当前第{{searchCurrentCount}}个</span>
            <span>/</span>
            <span>共{{searchTotalCount}}个结果</span>
        </div>
    </div>
</template>



<style lang="scss">
    .message-search {
        display: flex;
        align-items: center;
        >.el-input {
            flex: 1;
        }
        > div {
            color: #999;
            font-size: 12px;
        }
    }
</style>