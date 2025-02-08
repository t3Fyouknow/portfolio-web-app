// 背景色のbutttonが押されたときに実行
function colorChanged1() {
    let userSelection = getSelection();

    if(userSelection.rangeCount > 0){
        let selectedTextRange = userSelection.getRangeAt(0);
        sanitize(selectedTextRange);
        if(judgmentModalTypes==="add"){
            checkNode(textarea, selectedTextRange);
        }else{
            checkNode(eventTitleInput, selectedTextRange);
        }
    }
}

// 文字色のbuttonが押されたときに実行
function colorChanged2() {
    let userSelection = getSelection();

    if(userSelection.rangeCount > 0){
        let selectedTextRange = userSelection.getRangeAt(0);
        sanitize(selectedTextRange);
        if(judgmentModalTypes==="add"){
            checkNode2(textarea, selectedTextRange);
        }else{
            checkNode2(eventTitleInput, selectedTextRange);
        }
    }
}

// 教科色のbuttonが押されたときに実行(教科全体の背景色を変更)
function colorChanged3() {
    if(judgmentModalTypes==="add"){
        textarea.style.backgroundColor = colorPicker3.value;
    }else{
        eventTitleInput.style.backgroundColor = colorPicker3_edit.value;
    }
}

function makeTransparent() {
    if(judgmentModalTypes==="add"){
        textarea.style.backgroundColor = "";
    }else{
        eventTitleInput.style.backgroundColor = "";
    }
}

//sizePickerの中にoptionを生成
for(let i = 5; i <= 50; i++){
    let option = document.createElement("option");
    option.value = i;
    option.text = i;
    sizePicker.add(option);
}
sizePicker.value = "13";  //初期値を13に指定

//edit用
for(let i = 5; i <= 50; i++){
    let option = document.createElement("option");
    option.value = i;
    option.text = i;
    sizePicker_edit.add(option);
}
sizePicker_edit.value = "13";

// 大きさのbuttonが押されたときに実行
function sizeChanged() {
    let userSelection = getSelection();

    if(userSelection.rangeCount > 0){
        let selectedTextRange = userSelection.getRangeAt(0);
        sanitize(selectedTextRange);
        if(judgmentModalTypes==="add"){
            checkNode3(textarea, selectedTextRange);
        }else{
            checkNode3(eventTitleInput, selectedTextRange);
        }
    }
}

// フォントのbuttonが押されたときに実行
function fontChanged() {
    let userSelection = getSelection();

    if(userSelection.rangeCount > 0){
        let selectedTextRange = userSelection.getRangeAt(0);
        sanitize(selectedTextRange);
        if(judgmentModalTypes==="add"){
            checkNode4(textarea, selectedTextRange);
        }else{
            checkNode4(eventTitleInput, selectedTextRange);
        }
    }
}

// B
function applyBold() {
    let userSelection = getSelection();

    if(userSelection.rangeCount > 0){
        let selectedTextRange = userSelection.getRangeAt(0);
        sanitize(selectedTextRange);
        if(judgmentModalTypes==="add"){
            checkNode_B(textarea, selectedTextRange);
        }else{
            checkNode_B(eventTitleInput, selectedTextRange);
        }
    }
}

// I
function applyItalic() {
    let userSelection = getSelection();

    if(userSelection.rangeCount > 0){
        let selectedTextRange = userSelection.getRangeAt(0);
        sanitize(selectedTextRange);
        if(judgmentModalTypes==="add"){
            checkNode_I(textarea, selectedTextRange);
        }else{
            checkNode_I(eventTitleInput, selectedTextRange);
        }
    }
}

// U
function applyUnderline() {
    let userSelection = getSelection();

    if(userSelection.rangeCount > 0){
        let selectedTextRange = userSelection.getRangeAt(0);
        sanitize(selectedTextRange);
        if(judgmentModalTypes==="add"){
            checkNode_U(textarea, selectedTextRange);
        }else{
            checkNode_U(eventTitleInput, selectedTextRange);
        }
    }
}

// カラーピッカーの色が変更されたときに実行される関数(背景色用)
function buttonColorChange1(){
    if(judgmentModalTypes === "add"){
        document.getElementById('BGbutton').style.backgroundColor = colorPicker1.value;
    }else{
        document.getElementById('BGbutton_edit').style.backgroundColor = colorPicker1_edit.value;
    }
}

// カラーピッカー2の色が変更されたときに実行される関数(文字色用)
function buttonColorChange2(){
    if(judgmentModalTypes === "add"){
        document.getElementById('Textbutton').style.color = colorPicker2.value;
    }else{
        document.getElementById('Textbutton_edit').style.color = colorPicker2_edit.value;
    }
}

//カラーピッカー3
function buttonColorChange3(){
    if(judgmentModalTypes === "add"){
        document.getElementById('SubjColor').style.backgroundColor = colorPicker3.value;
    }else{
        document.getElementById('SubjColor_edit').style.backgroundColor = colorPicker3_edit.value;
    }
}

// フォント
function butttonFontChange(){
    let font_element = fontPicker.querySelector('option[value="' + fontPicker.value + '"]');
    let ToGetStyle = window.getComputedStyle(font_element);
    let font_element_edit = fontPicker_edit.querySelector('option[value="' + fontPicker_edit.value + '"]');
    let ToGetStyle_edit = window.getComputedStyle(font_element_edit);
    if(judgmentModalTypes==="add"){
        document.getElementById('fontbutton').style.fontFamily = ToGetStyle.getPropertyValue('font-family');
        document.getElementById('fontTypes').style.fontFamily = ToGetStyle.getPropertyValue('font-family');
    }else{
        document.getElementById('fontbutton_edit').style.fontFamily = ToGetStyle_edit.getPropertyValue('font-family');
        document.getElementById('fontTypes_edit').style.fontFamily = ToGetStyle_edit.getPropertyValue('font-family');
    }
}

// 前処理
function sanitize(range){
    // 開始点がテキストノードの中だったら
    if(range.startContainer.nodeType == Node.TEXT_NODE){
        // テキストノードをRangeの開始点の位置で2つに分ける
        let latter = range.startContainer.splitText(range.startOffset);
        // Rangeの開始点をテキストノードの外側にする
        range.setStartBefore(latter);
    }
    // 終了点にも同様の処理
    if(range.endContainer.nodeType == Node.TEXT_NODE){
        let latter = range.endContainer.splitText(range.endOffset);
        range.setEndBefore(latter);
    }
}

function checkNode(node, range){
    let nodeRange = new Range();
    nodeRange.selectNode(node);

    if(range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0 && range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0){
        // nodeRangeはrangeに囲まれている
        // → このノード全体を着色して終わり
        if(node.nodeType == Node.TEXT_NODE){
            // テキストノードの場合はspanで囲む
            let span = document.createElement('span');
            // まずspanをテキストノードの直前に設置
            node.parentNode.insertBefore(span, node);
            // テキストノードをspanの中に移す
            span.appendChild(node);
            if(judgmentModalTypes === "add"){
                span.style.backgroundColor = colorPicker1.value;
            }else{
                span.style.backgroundColor = colorPicker1_edit.value;
            }
        }else{
            if(judgmentModalTypes === "add"){
                node.style.backgroundColor = colorPicker1.value;
            }else{
                node.style.backgroundColor = colorPicker1_edit.value;
            }
        }
    }else if(range.compareBoundaryPoints(Range.START_TO_END, nodeRange) <=0 || range.compareBoundaryPoints(Range.END_TO_START, nodeRange) >=0){
        // nodeRangeとrangeは重なっていない
        // →このノードをこれ以上調べる必要はない
        return;
    }else{
        // このノードは一部rangeに含まれている
        for(let i=0; i<node.childNodes.length; i++){
            // 子ノードをひとつずつ調べる
            checkNode(node.childNodes[i], range);
        }
    }
}

function checkNode2(node, range){
    let nodeRange = new Range();
    nodeRange.selectNode(node);

    if(range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0 && range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0){
        if(node.nodeType == Node.TEXT_NODE){
            let span = document.createElement('span');
            node.parentNode.insertBefore(span, node);
            span.appendChild(node);
            if(judgmentModalTypes === "add"){
                span.style.color = colorPicker2.value;
            }else{
                span.style.color = colorPicker2_edit.value;
            }
        }else{
            if(judgmentModalTypes === "add"){
                node.style.color = colorPicker2.value;
            }else{
                node.style.color = colorPicker2_edit.value;
            }
        }
    }else if(range.compareBoundaryPoints(Range.START_TO_END, nodeRange) <=0 || range.compareBoundaryPoints(Range.END_TO_START, nodeRange) >=0){
        return;
    }else{
        for(let i=0; i<node.childNodes.length; i++){
            checkNode2(node.childNodes[i], range);
        }
    }
}

function checkNode3(node, range){
    let nodeRange = new Range();
    nodeRange.selectNode(node);

    if(range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0 && range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0){
        if(node.nodeType == Node.TEXT_NODE){
            let span = document.createElement('span');
            node.parentNode.insertBefore(span, node);
            span.appendChild(node);
            if(judgmentModalTypes==="add"){
                span.style.fontSize = sizePicker.value + "px";
            }else{
                span.style.fontSize = sizePicker_edit.value + "px";
            }
        }else{
            if(judgmentModalTypes==="add"){
                node.style.fontSize = sizePicker.value + "px";
            }else{
                node.style.fontSize = sizePicker_edit.value + "px";
            }
        }
    }else if(range.compareBoundaryPoints(Range.START_TO_END, nodeRange) <=0 || range.compareBoundaryPoints(Range.END_TO_START, nodeRange) >=0){
        return;
    }else{
        for(let i=0; i<node.childNodes.length; i++){
            checkNode3(node.childNodes[i], range);
        }
    }
}

function checkNode4(node, range){
    let nodeRange = new Range();
    let font_element = fontPicker.querySelector('option[value="' + fontPicker.value + '"]');
    let ToGetStyle = window.getComputedStyle(font_element);
    let font_element_edit = fontPicker.querySelector('option[value="' + fontPicker_edit.value + '"]');
    let ToGetStyle_edit = window.getComputedStyle(font_element_edit);
    nodeRange.selectNode(node);

    if(range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0 && range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0){
        if(node.nodeType == Node.TEXT_NODE){
            let span = document.createElement('span');
            node.parentNode.insertBefore(span, node);
            span.appendChild(node);
            if(judgmentModalTypes==="add"){
                span.style.fontFamily = ToGetStyle.getPropertyValue('font-family');
            }else{
                span.style.fontFamily = ToGetStyle_edit.getPropertyValue('font-family');
            }
        }else{
            if(judgmentModalTypes==="add"){
                node.style.fontFamily = ToGetStyle.getPropertyValue('font-family');
            }else{
                node.style.fontFamily = ToGetStyle_edit.getPropertyValue('font-family');
            }
        }
    }else if(range.compareBoundaryPoints(Range.START_TO_END, nodeRange) <=0 || range.compareBoundaryPoints(Range.END_TO_START, nodeRange) >=0){
        return;
    }else{
        for(let i=0; i<node.childNodes.length; i++){
            checkNode4(node.childNodes[i], range);
        }
    }
}


function checkNode_B(node, range){
    let nodeRange = new Range();
    nodeRange.selectNode(node);

    if(range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0 && range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0){
        if(node.nodeType == Node.TEXT_NODE){
            let span = document.createElement('span');
            node.parentNode.insertBefore(span, node);
            span.appendChild(node);
            span.style.fontWeight = "bold";
        }else{
            node.style.fontWeight = "bold";
        }
    }else if(range.compareBoundaryPoints(Range.START_TO_END, nodeRange) <=0 || range.compareBoundaryPoints(Range.END_TO_START, nodeRange) >=0){
        return;
    }else{
        for(let i=0; i<node.childNodes.length; i++){
            checkNode_B(node.childNodes[i], range);
        }
    }
}

function checkNode_I(node, range){
    let nodeRange = new Range();
    nodeRange.selectNode(node);

    if(range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0 && range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0){
        if(node.nodeType == Node.TEXT_NODE){
            let span = document.createElement('span');
            node.parentNode.insertBefore(span, node);
            span.appendChild(node);
            span.style.fontStyle = "italic";
        }else{
            node.style.fontStyle = "italic";
        }
    }else if(range.compareBoundaryPoints(Range.START_TO_END, nodeRange) <=0 || range.compareBoundaryPoints(Range.END_TO_START, nodeRange) >=0){
        return;
    }else{
        for(let i=0; i<node.childNodes.length; i++){
            checkNode_I(node.childNodes[i], range);
        }
    }
}

function checkNode_U(node, range){
    let nodeRange = new Range();
    nodeRange.selectNode(node);
    console.log(node);

    if(range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0 && range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0){
        if(node.nodeType == Node.TEXT_NODE){
            let span = document.createElement('span');
            node.parentNode.insertBefore(span, node);
            span.appendChild(node);
            console.log(window.getComputedStyle(span).getPropertyValue('text-decoration'));
            if(span.style.textDecoration === "underline"){
                span.style.textDecoration = "";
            }else{
                span.style.textDecoration = "underline";
                console.log(window.getComputedStyle(span).getPropertyValue('text-decoration'));
            }
        }else{
            if(node.style.textDecoration === "underline"){
                node.style.textDecoration = "";
            }else{
                node.style.textDecoration = "underline";
            }
            // node.style.textDecoration = "underline";
        }
    }else if(range.compareBoundaryPoints(Range.START_TO_END, nodeRange) <=0 || range.compareBoundaryPoints(Range.END_TO_START, nodeRange) >=0){
        return;
    }else{
        for(let i=0; i<node.childNodes.length; i++){
            checkNode_U(node.childNodes[i], range);
        }
    }
}