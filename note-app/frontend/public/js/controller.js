
import { Model } from './model.js';
import { APICalls } from './api.js';
import * as view from './view.js';

let model = null;
const bindEvent = (memoNode) => { //memoNode = memo div

    let id = memoNode.id;
    let titleNode = memoNode.getElementsByClassName("title")[0];
    let bodyNode = memoNode.getElementsByClassName("body")[0];
    let topNode = memoNode.getElementsByClassName("top")[0];
    let bottomNode = memoNode.getElementsByClassName("bottom")[0]
    let hideButtonNode = memoNode.getElementsByClassName("hide")[0];
    let addButtonNode = memoNode.getElementsByClassName("add")[0];
    let deleteButtonNode = memoNode.getElementsByClassName("delete")[0];
    let dragPinNode = memoNode.getElementsByClassName("dragPin")[0];
    let resizerNode = memoNode.getElementsByClassName("resizer")[0];
    let saveNode = memoNode.getElementsByClassName("save")[0];

    titleNode.addEventListener("input", ()=>{
        model.updateAMemo({id: id, title: titleNode.innerHTML});
    });

    bodyNode.addEventListener("input", ()=>{
        model.updateAMemo({id: id, body: bodyNode.innerHTML});
    });
    
    saveNode.addEventListener("click", async ()=>{
        await model.saveAMemo(id);
    });

    deleteButtonNode.addEventListener("click", ()=>{
        model.deleteAMemo(id)
        view.deleteAMemo(id)
    });

    addButtonNode.addEventListener("click", async ()=>{
        const newMemo = await model.addAMemo(); //add memo into array at the next index of prevousId
        newMemo.posX = parseInt(memoNode.style.left.slice(0,-2),10) + parseInt(memoNode.style.width.slice(0,-2),10)+10; 
        newMemo.posY = parseInt(memoNode.style.top.slice(0,-2),10);
        const newMemoNode = view.addAMemo(newMemo); //add memo into node at the next to given id
        bindEvent(newMemoNode);
    });

    hideButtonNode.addEventListener("click", ()=>{
        const setValues = model.toggleHide(id);
        view.toggleHide(memoNode, setValues);    
    });

    dragPinNode.addEventListener("mousedown", () => { // elmnt : pinBox div
        var e = window.event;
        e.preventDefault();
        let beforePosX = e.clientX;
        let beforePosY = e.clientY;
        let afterPosX;
        let afterPosY;
        let memoPosX;
        let memoPosY;
        
        // call a function whenever the cursor moves:
        document.onmousemove = function (e) {
            // calculate the new cursor position:
            afterPosX = beforePosX - e.clientX;
            afterPosY = beforePosY - e.clientY;
            beforePosX = e.clientX;
            beforePosY = e.clientY;
            // set the element's new position
            memoPosY = memoNode.offsetTop - afterPosY;
            memoPosX = memoNode.offsetLeft - afterPosX;
            memoNode.style.top = memoPosY + "px";
            memoNode.style.left = memoPosX + "px";
        }
    
        // stop moving when mouse button is released
        document.onmouseup = function (e) {
            document.onmouseup = null;
            document.onmousemove = null;
            model.updateAMemo({id:id, posX: memoPosX, posY: memoPosY})
        }
    }); 

    resizerNode.addEventListener("mousedown", ()=>{
        var e = window.event;
        e.preventDefault();
        let width = parseInt(memoNode.style.width.replace("px",""))
        let height = parseInt(memoNode.style.height.replace("px", ""))
        let minHeight = 100;
        let minWidth = 100;
        document.onmousemove = (e) => {
            if ((e.clientY - memoNode.offsetTop) < minHeight )
                height = minHeight;
            else height = e.clientY - memoNode.offsetTop;
            if ((e.clientX - memoNode.offsetLeft) < minWidth )
                width = minWidth;
            else width = e.clientX - memoNode.offsetLeft;

            memoNode.style.width = width + 'px'
            memoNode.style.height = height + 'px';
            
            let titleHeight = parseInt(titleNode.style.height.replace("px",""));
            let topHeight = parseInt(topNode.style.height.replace("px",""));
            let bottomHeight = parseInt(bottomNode.style.height.replace("px",""));
            bodyNode.style.height = (height - titleHeight - topHeight - bottomHeight) + 'px';
        }
        document.onmouseup = (e) => {
            document.onmouseup = null;
            document.onmousemove = null;
            width = parseInt(memoNode.style.width.replace("px",""))
            height = parseInt(memoNode.style.height.replace("px", ""))
            model.updateAMemo({id, width, height})
        }

    });
}

const run = async (token) => {
    const apiCalls = new APICalls(token);
    model = new Model(token)
    let webBoard = await model.loadBoard();
    for ( let i in webBoard){
        let memoNode = view.addAMemo(webBoard[i]);
        bindEvent(memoNode);
    }

    var addNode = document.getElementsByClassName("addAMemo")[0];
    addNode.addEventListener("click", async ()=>{
        console.log("addNode clicked");
        const memo = await model.addAMemo();
        const memoNode = view.addAMemo(memo);
        bindEvent(memoNode);
    });

    var uploadNode = document.getElementsByClassName("uploadPic")[0];
    uploadNode.addEventListener('change', async (e)=> {
        const file = e.target.files[0]
        const result = await apiCalls.getUploadUrl();
        console.log(result.uploadUrl, file)
        await apiCalls.uploadFile(result.uploadUrl, file)
        console.log(result.uploadUrl.split("?")[0])
        document.getElementById("board").style.backgroundImage =  `url("${result.uploadUrl.split("?")[0]}")`;
    })

    try {
        let result = await apiCalls.getAccessImageUrl();
        console.log(result)
        document.getElementById("board").style.backgroundImage =  `url("${result.uploadUrl.attachmentUrl.split("?")[0]}")`;
    } catch (e) {
        document.getElementById("board").style.backgroundImage =  `url("../image/explain.jpg")`;
    }
}

export default run;