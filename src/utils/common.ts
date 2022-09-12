/*
 * @Author: yangrongxin
 * @Date: 2022-09-12 15:40:22
 * @LastEditors: yangrongxin
 * @LastEditTime: 2022-09-12 15:41:59
 */

// 将当前元素滚动到视图区域
export function lastEleScrollTop(selector: string): void {
  Array.from(document.querySelectorAll(selector))
    ?.at(-1)
    ?.scrollIntoView({ behavior: 'smooth' });
}