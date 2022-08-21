import { defineStore } from "pinia";

export const useCheckBox = defineStore('checkbox',{
    state: () => {
        return {
            isFullChecked: false,
            checkedCnt: 0,
            sum: 0,
            isCheckboxShow: false,
        }
    },
    getters: {
        Sum: (state)=> state.sum
    },
    actions: {
        setFullChecked(boolValue:boolean){
            this.isFullChecked = boolValue;
            if(boolValue){
                this.checkedCnt = this.sum;
            }
            else {
                this.checkedCnt = 0;
            }
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
        },
        setCheckboxShow(val : boolean){
            this.isCheckboxShow = val;
        }
    }
})