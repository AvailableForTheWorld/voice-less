import { defineStore } from "pinia";

export const useCheckBox = defineStore('checkbox',{
    state: () => {
        return {
            isFullChecked: false,
            checkedCnt: 0,
            sum: 0,
        }
    },
    getters: {

    },
    actions: {
        setFullChecked(boolValue:boolean){
            this.isFullChecked = boolValue;
        },
        setCheckedCnt(val : number) {
            this.checkedCnt = val;
        },
        cntPlus(){
            this.checkedCnt++;
        },
        cntMinus(){
            this.checkedCnt--;
        },
        setSum(val : number){
            this.sum = val;
        }
    }
})