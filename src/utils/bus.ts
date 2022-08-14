

class Bus {
    private checkedCnt : number;
    constructor(){
        this.checkedCnt = 0;
    }
    checkPlus(){
        this.checkedCnt = this.checkedCnt + 1;
    }
    checkMinus(){
        this.checkedCnt -= 1;
    }
    setCheckCnt(val:number) {
        this.checkedCnt = val;
    }
    getCheckCnt() {
        return this.checkedCnt;
    }
}

export default new Bus()