export function addAMemo(memo) {
    const topHeight = 20;
    const titleHeight = 20;
    const bottomHeight = 20;
	var newNode = document.createElement("div");
    newNode.setAttribute("class", "memo");
    newNode.setAttribute("id", memo.id);
    newNode.style.top = memo.posY + "px";
    newNode.style.left = memo.posX + "px";
    newNode.style.width = memo.width + "px";
    newNode.innerHTML =
        `<div class=\"top\" style = \"height:${topHeight}px\">
        <div class = \"dragPin\"></div>
        <input class=\"hide\" type=\"button\" value=\"^\">
        <input class=\"add\" type=\"button\" value=\"+\">
        <input class=\"delete\" type=\"button\" value=\"-\"></div>
        <div contentEditable = true class = \"title\" style = \"height:${titleHeight}px\">${memo.title}</div>
        <div contentEditable = true class = \"body\" style = \"height:${memo.height-topHeight-titleHeight-bottomHeight}px\">${memo.body}</div>
        <div class = \"bottom\" style = \"height:${bottomHeight}px\">
        <input class=\"save\" type=\"button\" value=\"save\"></div>
        <div class = \"resizer\"></div></div>`;

    if (memo.isHidden){
        newNode.style.height = "60px";
        newNode.getElementsByClassName("body")[0].style.display = "none";
        newNode.getElementsByClassName("resizer")[0].style.display = "none";
    } else
        newNode.style.height = memo.height + "px";
   
    
    var givenNode = document.getElementById("board");
    givenNode.appendChild(newNode);
    
    
    // var givenNode = document.getElementById(givenId);
    // givenNode.parentNode.insertBefore(newNode, givenNode.nextSibling);

    return newNode;
}

export function deleteAMemo(id){
    var targetNode = document.getElementById(id);
    targetNode.parentNode.removeChild(targetNode);
}

export function deleteAllMemos(){
    var existingPinBoard = document.getElementsById("board");
	existingPinBoard.innerHTML = ""; // clean board
}

export function toggleHide(memoNode, {height, isHidden}){
    let topNode = memoNode.getElementsByClassName("top")[0];
    let titleNode = memoNode.getElementsByClassName("title")[0];
    let bodyNode = memoNode.getElementsByClassName("body")[0];
    let bottomNode = memoNode.getElementsByClassName("bottom")[0];
    let resizerNode = memoNode.getElementsByClassName("resizer")[0];
    
    if(isHidden){
        memoNode.style.height = "60px";
        bodyNode.style.display = 'none';
        resizerNode.style.display = "none";        
    } else {
        const height = parseInt(topNode.style.height.replace("px", "")) + 
                parseInt(titleNode.style.height.replace("px", "")) + 
                parseInt(bodyNode.style.height.replace("px", "")) + 
                parseInt(bottomNode.style.height.replace("px", ""));
        console.log(height)
        memoNode.style.height = height+"px";
        bodyNode.style.display = 'block';
        resizerNode.style.display = "block";
    }
}