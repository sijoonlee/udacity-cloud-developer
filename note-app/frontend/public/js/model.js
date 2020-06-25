import { APICalls } from './api.js';
 
const defaultMemo = { 
    title: "", 
    body: "",
    posX: 100,
    posY: 100,
    width: 100,
    height: 100,
    isHidden: false,
    isDeleted: false
}

const DEBUGLOG = false;

export class Model {
    constructor(token) {
        this.webBoard = [];
        this.apiCalls = new APICalls(token);
    }
    loadBoard = async () => {
    
        await this.apiCalls.loadAllMemos().then(data => {
            this.webBoard = [...data.item]; // clear up
        })
        if(DEBUGLOG) 
            console.log(webBoard);
        return this.webBoard;
    }

    addAMemo = async (memo = defaultMemo) => {
        await this.apiCalls.createAMemo(memo).then(data => { // backend will generate unique id
            this.webBoard.push(data.item);
            memo = {...data.item}
        })
        if(DEBUGLOG) 
            console.log(this.webBoard);
        return memo;
    }
    saveAMemo = async (id) => {
        const index = this.findAMemo(id);
        console.log(this.webBoard[index])
        const memo = await this.apiCalls.updateAMemo(this.webBoard[index])
        if(DEBUGLOG) 
            console.log(this.webBoard);
        return memo;
    }
    
    findAMemo = (id) => {
        var index = -1;
        for ( var cursor in this.webBoard) {
            if ( this.webBoard[cursor].id === id ) {
                index = cursor;
                break;
            }
        }
        return index;
    }
    
    deleteAMemo = async (id) => {
        const index = this.findAMemo(id);
        this.webBoard[index].isDeleted  = true;
        await this.apiCalls.deleteAMemo(this.webBoard[index].id);
        if(DEBUGLOG) 
            console.log(this.webBoard);   
        //this.webBoard.splice(findMemo(id),1);
    }
    
    updateAMemo = (memo) => {
        const index = this.findAMemo(memo.id);
        const updates = Object.keys(memo)
        updates.forEach((update) => {
            if(update != "id"){
                this.webBoard[index][update] = memo[update]
            }
                
        });
        if(DEBUGLOG) 
            console.log(this.webBoard);
    }
    
    toggleHide = (id) => {
        const index = this.findAMemo(id);
        this.webBoard[index].isHidden = !this.webBoard[index].isHidden;
        return {height:this.webBoard[index].height, isHidden: this.webBoard[index].isHidden};  
    }
    


}