let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
let mouseup = null;
let targetDate = null;
let innerFlag = false;
let dragStartX;
let dragStartY;
let id_8;
let itemTargetParent;
let itemId;
let itemValue;
let itemDeco;
let itemClass;
let itemBG;
let box1 = document.getElementById('box1');
let box2 = document.getElementById('box2');
let tempDay = document.getElementById('tempDay');
let holiday = document.getElementById('holidaaaay');
let dropdown = document.getElementById('dropdown');
let ローカルストレージ = localStorage.getItem('ローカルストレージ') ? JSON.parse(localStorage.getItem('ローカルストレージ')) : [];
let box1Data = localStorage.getItem('box1Data') ? JSON.parse(localStorage.getItem('box1Data')) : [];
let box2Data = localStorage.getItem('box2Data') ? JSON.parse(localStorage.getItem('box2Data')) : [];
let holidayData = localStorage.getItem('holidayData') ? JSON.parse(localStorage.getItem('holidayData')) : [];
let tempDayData = localStorage.getItem('tempDayData') ? JSON.parse(localStorage.getItem('tempDayData')) : [];
let lastDate;
let previousMonth;
let previousMonthLastDate;
let nextMonth;
let MonthDateLength;
let hamburgerStorage = localStorage.getItem('hamburgerStorage') ? JSON.parse(localStorage.getItem('hamburgerStorage')) : [];
let colorPicker1 = document.getElementById('color1');
let colorPicker1_edit = document.getElementById('color1_edit');
let colorPicker2 = document.getElementById('color2');
let colorPicker2_edit = document.getElementById('color2_edit');
let colorPicker3 = document.getElementById('color3');
let colorPicker3_edit = document.getElementById('color3_edit');
let sizePicker = document.getElementById('sizing');
let sizePicker_edit = document.getElementById('sizing_edit');
let fontPicker = document.getElementById('fontTypes');
let fontPicker_edit = document.getElementById('fontTypes_edit');
let judgmentModalTypes;     //教科を追加するためのモーダル、編集するためのモーダルのどちらを開いたか判別する

//　↓ストレージ保存用オブジェクト
let g_drag_obj;
//↓デフォルトの右クリック禁止
let contextmenu_function = () => {
	event.preventDefault();
}
document.oncontextmenu = contextmenu_function;
// HTML要素を取得し、それぞれの要素を対応する変数に格納している。
const calendar = document.getElementById('calendar');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const backDrop = document.getElementById('modalBackDrop');
const subjTitleInput = document.getElementById('textarea');
const trashCan = document.getElementById('trashCan');
const trashArea = document.getElementById('trashArea');
const hamburger1 = document.getElementById('ハンバーガー1');
const hamburger2 = document.getElementById('ハンバーガー2');


//mousedownしたときのｘ座標をdragStartXとして取得　なおwindow全体から取得できる
window.addEventListener('mousedown', function getCoordinate(e){
  dragStartX = e.clientX;
  dragStartY = e.clientY;
});

tempDay.addEventListener('dragstart', (e) => getInfo(e.target.id,e.target.id));  //バグ取り

hamburger1.addEventListener("click", () => {
  if(hamburger1.innerText === "土日を表示"){
    hamburger1.innerText = "土日を削除";
  }else{
    hamburger1.innerText = "土日を表示";
  }
  hamburgerStorage = {
    I: hamburger1.innerText,
    II: hamburger2.innerText,
  };
  localStorage.setItem('hamburgerStorage', JSON.stringify(hamburgerStorage));
  load();
});

hamburger2.addEventListener("click", () => {
  if(hamburger2.innerText === "前月、翌月の日を削除"){
    hamburger2.innerText = "前月、翌月の日を表示";
  }else{
    hamburger2.innerText = "前月、翌月の日を削除";
  }
  hamburgerStorage = {
    I: hamburger1.innerText,
    II: hamburger2.innerText,
  };
  localStorage.setItem('hamburgerStorage', JSON.stringify(hamburgerStorage));
  load();
});

const getClass = (e) => {
  itemClass = e.target.className;
  if(itemClass === ""){
    itemClass = e.target.closest("[draggable='true']").className;
  }

  itemTargetParent = e.target.parentNode;
  if(itemTargetParent.class !== "location"){
    itemTargetParent = e.target.closest(".location");
  }
  if(itemClass === "holidayItem"){
    itemTargetParent = e.target.closest(".holidayLocation");
  }
};

// ドラッグ開始イベントを定義
const handleDragStart = (e) => {
  //↓🗑表示
  if(dragStartX < box1.getBoundingClientRect().left || dragStartY > holiday.getBoundingClientRect().bottom){
  trashCan.src = "../static/img/trashCan.png";
  trashArea.style.backgroundColor = "#ff7f7f";
  }
  e.target.classList.add("dragging");
  // ドロップ効果の設定
  e.dataTransfer.effectAllowed = "copyMove";

  // 転送するデータの設定
  const { id } = e.target;
  //ストレージ保存用、ドラッグしたオブジェクトを保存しておく
  g_drag_obj=e.target;
  e.dataTransfer.setData("application/json", JSON.stringify({ id }));
};

// ドラッグ終了イベントを定義
const handleDragEnd = (e) => {
  e.target.classList.remove("dragging");
  trashCan.src = "";
  trashArea.style.backgroundColor = "";
};

// 要素が重なった際のイベントを定義
const handleDragEnter = (e) => {
  if(itemClass !== "tempDay"){
    // 子要素へのドラッグを制限
    if ([...e.target.classList].includes("item") || [...e.target.classList].includes("bigItem") || e.target.classList.length === 0) {
      return;
    }

    if(itemClass === "item"){
      e.target.classList.add("over");
    }

    if(itemClass === "bigItem"){
      if(e.target.id.slice( -1 ) === "1" || e.target.id.slice( -1 ) === "3"){
        if(!e.target.nextElementSibling.children[1]){
          e.target.nextElementSibling.classList.add("over");
          e.target.classList.add("over");
        }
      }else{
        if(!e.target.previousElementSibling.children[1]){
          e.target.previousElementSibling.classList.add("over");
          e.target.classList.add("over");
        }
      }
    }
   
    if(itemClass === "holidayItem"){
      let countUndefined=0;
      for(i=1; i<e.target.parentNode.children.length; i++){
        if(!e.target.parentNode.children[i].children[1]){
          countUndefined++;
        }
      }
      if(countUndefined===8){
        for(i=1; i<e.target.parentNode.children.length; i++){
          e.target.parentNode.children[i].classList.add("over");
        }
      }
    }
  }
};

// 要素が離れた際のイベントを定義
const handleDragLeave = (e) => {
  e.target.classList.remove("over");

  if(itemClass === "bigItem"){
    if(!e.target.children[1]){
      if(e.target.id.slice( -1 ) === "1" || e.target.id.slice( -1 ) === "3"){
        e.target.nextElementSibling.classList.remove("over");
      }else if(e.target.id.slice( -1 ) === "2" || e.target.id.slice( -1 ) === "4"){
        e.target.previousElementSibling.classList.remove("over");
      }
    }
  }

  if(itemClass === "holidayItem"){
    for(i=1; i<e.target.parentNode.children.length; i++){
      e.target.parentNode.children[i].classList.remove("over");
    }
  }
}

// 要素が重なっている最中のイベントを定義
const handleDragOver = (e) => {
  // 要素が重なった際のブラウザ既定の処理を変更
  e.preventDefault();

  // 子要素へのドラッグを制限
  if ([...e.target.classList].includes("item") || [...e.target.classList].includes("bigItem") || [...e.target.classList].includes("holidayItem") || e.target.classList.length === 0) {
    // ドラッグ不可のドロップ効果を設定
    e.dataTransfer.dropEffect = "none";
    return;
  }

  // ドロップ効果の設定
  if (event.ctrlKey) {
    // e.dataTransfer.dropEffect = "copy";
  } else {
    e.dataTransfer.dropEffect = "move";
  }

  if(itemClass==="bigItem"){
    if(e.target.id.slice( -1 ) === "1" || e.target.id.slice( -1 ) === "3"){
      if(e.target.nextElementSibling.children[1]){
        e.dataTransfer.dropEffect = "none";
      }
    }else{
        if(e.target.previousElementSibling.children[1]){
        e.dataTransfer.dropEffect = "none";
      }
    }
  }

  if(itemClass==="holidayItem"){
    for(i=1; i<e.target.parentNode.children.length; i++){
      if(e.target.parentNode.children[i].children[1]){
        e.dataTransfer.dropEffect = "none";
      }
    }
  }
};

const handleDrop = (e) => {
  deleteSubj();
  e.preventDefault();
  e.target.classList.remove("over");

  if(itemClass==="bigItem"){
    e.target.classList.add("fatParent");
    if(e.target.id.slice( -1 ) === "1" || e.target.id.slice( -1 ) === "3"){
      e.target.nextElementSibling.remove();
      e.target.id = e.target.id.slice( 0,-1 ) + e.target.id.slice( -1 ) + (parseInt(e.target.id.slice( -1 ), 10) + 1);
    }else{
      e.target.previousElementSibling.remove();
      e.target.id = e.target.id.slice( 0,-1 ) + (parseInt(e.target.id.slice( -1 ), 10) - 1) + e.target.id.slice( -1 );
    }

    parentLosesWeight();    //親の大きさをもとに戻す
  }

  if(itemClass === "holidayItem"){
    e.target.id = 'holiday';
    e.target.classList.remove("location");
    e.target.classList.add("holidayLocation");
    e.target.children[0].remove();  // ドロップしたlocationのhiddenPeriodを削除
    let parentDiv = e.target.parentNode;

    for(i=9; i--;){
      if(e.target !== parentDiv.children[i] && parentDiv.children[i] !== parentDiv.children[0]){
        parentDiv.children[i].remove();
      }
    }
    holidayOperation();    //親を削除した後、8個のlocationを生成
  }

  // ブラウザ外からのファイルドロップを制限
  if (e.dataTransfer.files.length > 0 || itemClass === "tempDay") {
    return;
  }

  // 転送データの取得
  const { id } = JSON.parse(e.dataTransfer.getData("application/json"));

  //ctrlを押す　または　itemのｘ座標　> box1の左端のｘ座標  のときに複製
  if (dragStartX > box1.getBoundingClientRect().left && dragStartY < holiday.getBoundingClientRect().bottom){ //event.ctrlKey ||  
    // 要素の複製
    const oldItem = document.getElementById(id);
    const newItem = oldItem.cloneNode(true);
    // const newId = `item${[...document.querySelectorAll(".item")].length + [...document.querySelectorAll(".bigItem")].length + 1}`;
    const newId = `${e.target.parentNode.id + "_" + e.target.id}`;
    if(itemClass !== "holidayItem"){
      newItem.id = newId;
    }else{
      newItem.id = `${e.target.parentNode.id + "_holiday"}`
    }

    newItem.classList.remove("dragging");

    // cloneNode() で引き継げない要素
    newItem.addEventListener("mousedown", getClass, false);
    newItem.addEventListener("dragstart", handleDragStart, false);
    newItem.addEventListener("dragend", handleDragEnd, false);
    newItem.addEventListener('contextmenu',function (e){
      getInfo(newItem.parentNode.parentNode.getAttribute('id'),newItem.id,newItem.innerText,newItem.innerHTML,newItem.style.backgroundColor); //itemの親の親のid,itemのid,itemのvalue
      document.getElementById('contextmenu').style.left=dragStartX+"px";
      document.getElementById('contextmenu').style.top=dragStartY+"px";
      document.getElementById('contextmenu').style.display="block";
    });

    // ドロップ先に要素を追加する
    e.target.appendChild(newItem);
  } else {
    // ↓ドロップ先に要素を追加する
    e.target.appendChild(g_drag_obj);
    g_drag_obj.id=g_drag_obj.parentNode.parentNode.getAttribute('id')+'_'+g_drag_obj.parentNode.getAttribute('id');
  }
}; //👈ここまでhandleDrop

// ↓↓↓tempDayのためだけのイベント
const DragEnterForDay = (e) => {
  if(itemClass==="tempDay"){
    // innerFlag = true;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    // if ([...e.target.classList].includes("location") || [...e.target.classList].includes("item") || [...e.target.classList].includes("bigItem") || e.target.classList.length === 0) {
    //   return;
    // }
    // e.target.classList.add("overForDay");
  }
};

const DragLeaveForDay = (e) => {
  if(itemClass==="tempDay"){
    // if (innerFlag === false) {
    //   //フラグがセットされていない場合、クラスを削除
    //   e.target.classList.remove("overForDay");
    // }
  }
};

const DragOverForDay = (e) => {
  if(itemClass==="tempDay"){
    // innerFlag = false;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
};

const DropForDay = (e) => {
  if(itemClass==="tempDay"){
    let tempDayChild = document.querySelectorAll("#tempDay [draggable='true']"); 
    let getDay = e.target.closest(".day");
    let getDayChild = ローカルストレージ.filter(e => e.date === getDay.id);
    // getDay.classList.remove("overForDay");

    if(getDayChild.length > 0){
      //↓↓↓ローカルストレージ上の教科を削除
      ローカルストレージ = ローカルストレージ.filter(e => e.date !== getDay.id);
      localStorage.setItem('ローカルストレージ', JSON.stringify(ローカルストレージ));

      //↓↓↓画面上のitemを削除
      for(i=0; i<getDayChild.length; i++){
        let removeTarget = document.getElementById(getDayChild[i].id);
        if(removeTarget.className !== null){  //removeTargetがbigItemの時とholidayItem
          if(removeTarget.className === "bigItem"){
            itemTargetParent = removeTarget.parentNode;
            parentLosesWeight();
          }else if(removeTarget.className === "holidayItem"){
            itemTargetParent = removeTarget.parentNode;
            holidayOperation();
          }
        }
        if(removeTarget.className !== "holidayItem"){
          document.getElementById(getDayChild[i].id).remove();
        }
      }
    }

    if(tempDayChild.length !== 0){
      if(tempDayChild[0].className !== "holidayItem"){  //tempDayに乗っているitemがholidayItemか否か判別
        for(i=0; i<tempDayChild.length; i++){
          ローカルストレージ.push({
            date: getDay.id,
            period: tempDayChild[i].parentNode.id,
            id: getDay.id+"_"+tempDayChild[i].parentNode.id,
            value: tempDayChild[i].innerText,
            decoration: tempDayChild[i].innerHTML,
            backgroundColor: tempDayChild[i].style.backgroundColor,
          });
          localStorage.setItem('ローカルストレージ', JSON.stringify(ローカルストレージ));

          let tempDayCopySubj = document.createElement('div');
          tempDayCopySubj.id = getDay.id+"_"+tempDayChild[i].parentNode.id;
          tempDayCopySubj.className = tempDayChild[i].className;
          tempDayCopySubj.innerHTML = tempDayChild[i].innerHTML;
          tempDayCopySubj.style.backgroundColor = tempDayChild[i].style.backgroundColor;
          tempDayCopySubj.draggable = true;
          let parentDiv = getDay.querySelector(`#${tempDayChild[i].parentNode.id}`);
          if(parentDiv === null){
            parentDiv = getDay.querySelector(`#${tempDayChild[i].parentNode.id.slice( 0,-1 )}`);
            parentDiv.classList.add("fatParent");
            parentDiv.id = tempDayChild[i].parentNode.id;
            parentDiv.nextElementSibling.remove();
          }
          parentDiv.appendChild(tempDayCopySubj);
          
          tempDayCopySubj.addEventListener("dragstart", handleDragStart, false);
          tempDayCopySubj.addEventListener("dragend", handleDragEnd, false);
          tempDayCopySubj.addEventListener("mousedown", getClass, false);
          tempDayCopySubj.addEventListener('contextmenu',function (e){
            getInfo(tempDayCopySubj.parentNode.parentNode.getAttribute('id'),tempDayCopySubj.id,tempDayCopySubj.innerText,tempDayCopySubj.innerHTML,tempDayCopySubj.style.backgroundColor);
            document.getElementById('contextmenu').style.left=dragStartX+"px";
            document.getElementById('contextmenu').style.top=dragStartY+"px";
            document.getElementById('contextmenu').style.display="block";
          });
        }
      }else{
        //tempDayに乗っているのがholidayの時に実行
        ローカルストレージ.push({
          date: getDay.id,
          period: "holiday",
          id: getDay.id + "_holiday",
          value: tempDayChild[0].innerText,
          decoration: tempDayChild[0].innerHTML,
          backgroundColor: tempDayChild[0].style.backgroundColor,
        });
        localStorage.setItem('ローカルストレージ', JSON.stringify(ローカルストレージ));

        for(let i=9; i--;){
          if(getDay.children[i] !== getDay.children[0]){
            getDay.children[i].remove();
          }
        }
        const holidayLocation = document.createElement('div');
        holidayLocation.addEventListener('dragstart', (e) => getInfo(e.target.parentNode.parentNode.id,e.target.id,e.target.innerText,e.target.innerHTML,e.target.style.backgroundColor));
        holidayLocation.classList.add('holidayLocation');
        getDay.appendChild(holidayLocation);

        const holidayItem = document.createElement('div');
        holidayItem.classList.add('holidayItem');
        holidayItem.draggable = true;
        holidayItem.id = getDay.id+"_holiday";
        holidayItem.innerHTML = tempDayChild[0].innerHTML;
        holidayItem.style.backgroundColor = tempDayChild[0].style.backgroundColor;
        holidayLocation.appendChild(holidayItem);
        
        holidayItem.addEventListener("dragstart", handleDragStart, false);
        holidayItem.addEventListener("dragend", handleDragEnd, false);
        holidayItem.addEventListener("mousedown", getClass, false);
        if(!holidayItem.parentNode.parentNode.className.includes("fade")){
          holidayItem.addEventListener('contextmenu',function (e){
            getInfo(holidayItem.parentNode.parentNode.getAttribute('id'),holidayItem.id,holidayItem.innerText,holidayItem.innerHTML,holidayItem.style.backgroundColor); //itemの親の親のid,itemのid,itemのvalue
            document.getElementById('contextmenu').style.left=dragStartX+"px";
            document.getElementById('contextmenu').style.top=dragStartY+"px";
            document.getElementById('contextmenu').style.display="block";
          });
        }
      } 
    }
  }
};

//box1に20個のdivを生成(即時関数)
(function forBox1() {
  for(i=1; i<21; i++){
    const box1Location = document.createElement('div');
    box1Location.classList.add('box1Location');
    box1Location.id = 'box1-' + i;
    box1.appendChild(box1Location);
  }
}());

(function forBox2() {
  for(i=1; i<9; i++){
    const box2Location = document.createElement('div');
    box2Location.classList.add('box2Location');
    box2Location.id = 'box2-' + i;
    box2.appendChild(box2Location);
  }
}());

(function forHoliday() {
  const holidayLocation = document.createElement('div');
  holidayLocation.classList.add('holidayLocation');
  holidayLocation.addEventListener('dragstart', (e) => getInfo(e.target.parentNode.parentNode.id,e.target.id));  //バグ取り
  holiday.appendChild(holidayLocation);
}());

(function forTempDay() {
  for(i=1; i<9; i++){
    const tempSubjLocation = document.createElement('div');
    tempSubjLocation.classList.add('location');

    const displayPeriod = document.createElement('div');
    displayPeriod.className = "hiddenPeriod";
    if(i <= 4){
      tempSubjLocation.id = "I-" + i;
      displayPeriod.innerText="\n1年\n" + i + "限目";
    }else{
      tempSubjLocation.id = "II-" + (i-4);
      displayPeriod.innerText="\n2年\n" + (i-4) + "限目";
    }
    tempSubjLocation.appendChild(displayPeriod);

    tempSubjLocation.addEventListener('mouseover', (e) => periodInline(e.target));
    tempSubjLocation.addEventListener('mouseout', (e) => periodNone(e.target));
    tempSubjLocation.addEventListener('dragstart', (e) => getInfo(e.target.parentNode.parentNode.id,e.target.id));
    tempSubjLocation.addEventListener('drop', () => {
      if(itemClass === "holidayItem"){
        tempDayData.push({
          period: "holiday",
          id: g_drag_obj.id,
          value: g_drag_obj.innerText,
          decoration: g_drag_obj.innerHTML,
          backgroundColor: `${g_drag_obj.style.backgroundColor}`,
        });
        localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
      }else{
        if(itemClass === "bigItem"){
          if(tempSubjLocation.id.slice( -1 ) === "1" || tempSubjLocation.id.slice( -1 ) === "3"){
            tempDayData.push({
              period: tempSubjLocation.id.slice( 0,-1 ) + tempSubjLocation.id.slice( -1 ) + (parseInt(tempSubjLocation.id.slice( -1 ), 10) + 1),
              id: g_drag_obj.id,
              value: g_drag_obj.innerText,
              decoration: g_drag_obj.innerHTML,
              backgroundColor: `${g_drag_obj.style.backgroundColor}`,
            });
            localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
          }else{
            tempDayData.push({
              period: tempSubjLocation.id.slice( 0,-1 ) + (parseInt(tempSubjLocation.id.slice( -1 ), 10) - 1) + tempSubjLocation.id.slice( -1 ),
              id: g_drag_obj.id,
              value: g_drag_obj.innerText,
              decoration: g_drag_obj.innerHTML,
              backgroundColor: `${g_drag_obj.style.backgroundColor}`,
            });
            localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
          }
        }else{
          tempDayData.push({
            period: tempSubjLocation.id,
            id: g_drag_obj.id,
            value: g_drag_obj.innerText,
            decoration: g_drag_obj.innerHTML,
            backgroundColor: `${g_drag_obj.style.backgroundColor}`,
          });
          localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
        }
      }
    });
  
    // tempSubjLocation.addEventListener('dragstart', (e) => getInfo(dayString,e.target.id));
    // tempSubjLocation.addEventListener('drop', () => registerDate(dayString)); 日にちを取得
    tempDay.appendChild(tempSubjLocation);
    tempDay.addEventListener("mousedown", getClass, false);
  }
}());

function registerDate(date) {
  mouseup = date;
}

//テンプレートの教科を再生成
function regenerateBoxSubj(){
  for(let i = 0; i < box1Data.length; i++){
    let parent_element = document.getElementById(box1Data[i].id.slice( 0, -6 )); //後ろから6文字(_child)を削除
    const subjDiv = document.createElement('div');
    subjDiv.classList.add('item');
    subjDiv.draggable = true;
    subjDiv.id = box1Data[i].id;
    subjDiv.innerHTML = box1Data[i].decoration;
    subjDiv.style.backgroundColor = box1Data[i].backgroundColor;
    subjDiv.classList.add(box1Data[i].class)

    // subjDiv.innerText = box1Data[i].value;
    parent_element.appendChild(subjDiv);
  }
}
regenerateBoxSubj();

function regenerateBoxSubj2(){
  for(let i = 0; i < box2Data.length; i++){
    let parent_element = document.getElementById(box2Data[i].id.slice( 0, -6 )); //後ろから6文字(_child)を削除
    const subjDiv = document.createElement('div');
    subjDiv.classList.add('bigItem');
    subjDiv.draggable = true;
    subjDiv.id = box2Data[i].id;
    subjDiv.innerHTML = box2Data[i].decoration;
    subjDiv.style.backgroundColor = box2Data[i].backgroundColor;
    parent_element.appendChild(subjDiv);
  }
}
regenerateBoxSubj2();

function regenerateHolidayItem(){
  if(holidayData.length !== 0){
    let parent_element = holiday.children[1];
    const holidayItem = document.createElement('div');
    holidayItem.classList.add('holidayItem');
    holidayItem.draggable = true;
    holidayItem.id = holidayData.id;
    holidayItem.innerHTML = holidayData.decoration;
    holidayItem.style.backgroundColor = holidayData.backgroundColor;
    parent_element.appendChild(holidayItem);
  }
}
regenerateHolidayItem();

function regenerateTempDaySubj(){
  if(tempDayData.length !== 0){
    if(tempDayData[0].period === "holiday"){
      // holidayを生成するときの処理
      for(let i=9; i--;){
        if(tempDay.children[i] !== tempDay.children[0]){
          tempDay.children[i].remove();
        }
      }
      const holidayLocation = document.createElement('div');
      holidayLocation.addEventListener('dragstart', (e) => getInfo(e.target.parentNode.parentNode.id,e.target.id,e.target.innerText,e.target.innerHTML,e.target.style.backgroundColor));
      holidayLocation.classList.add('holidayLocation');
      tempDay.appendChild(holidayLocation);
      const holidayItem = document.createElement('div');
      holidayItem.classList.add('holidayItem');
      holidayItem.draggable = true;
      holidayItem.id = tempDay.id+"_holiday";
      holidayItem.innerHTML = tempDayData[0].decoration;
      holidayItem.style.backgroundColor = tempDayData[0].backgroundColor;
      holidayLocation.appendChild(holidayItem);
    }else{
      for(i=0; i<tempDayData.length; i++){
        let dayWithSubj = tempDayData[i];
        let subjDiv = document.createElement('div');
        subjDiv.draggable = true;
        subjDiv.id = "temp_"+dayWithSubj.period;
        subjDiv.innerHTML = dayWithSubj.decoration;
        subjDiv.style.backgroundColor = dayWithSubj.backgroundColor;
        if(dayWithSubj.period.slice( 1,-1 ) === '-' || dayWithSubj.period.slice( 1,-1 ) === 'I-'){
          // itemを生成するときの処理
          subjDiv.classList.add('item');
          document.getElementById(dayWithSubj.period).appendChild(subjDiv);
        }else{
          // bigItemを生成するときの処理
          subjDiv.classList.add("bigItem");
          let parentDiv = document.getElementById(dayWithSubj.period.slice( 0,-1 ));
          parentDiv.classList.add("fatParent");
          parentDiv.id = dayWithSubj.period;
          parentDiv.nextElementSibling.remove();
          parentDiv.appendChild(subjDiv);
        }
      }
    }
  }
}
regenerateTempDaySubj();


function getInfo(date,iid,value,HTML,BG){
  let childElement = document.getElementById(iid);
  id_8 = (childElement.parentNode.getAttribute('id'));
  targetDate = date;
  itemId = iid;
  itemValue = value;
  itemDeco = HTML;
  itemBG = BG;
}

// targetDateかつid_8の教科をローカルストレージから削除
function deleteSubj(){
  if(itemClass === "holidayItem"){
    ローカルストレージ = ローカルストレージ.filter(e => e.date !== targetDate || e.period !== "holiday");
    localStorage.setItem('ローカルストレージ', JSON.stringify(ローカルストレージ));
  }else{
    ローカルストレージ = ローカルストレージ.filter(e => e.date !== targetDate || e.period !== id_8);
    localStorage.setItem('ローカルストレージ', JSON.stringify(ローカルストレージ));
  }

  if(dragStartX > box1.getBoundingClientRect().left && dragStartY > holiday.getBoundingClientRect().bottom){
    tempDayData = tempDayData.filter(e => e.period !== id_8);
    if(itemClass === "holidayItem"){
      tempDayData = [];
    }
    localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
  }
}

function deleteBoxSubj(){
  if(dragStartX > box1.getBoundingClientRect().left && dragStartY < holiday.getBoundingClientRect().bottom){
    box1Data = box1Data.filter(e => e.id !== itemId);
    box2Data = box2Data.filter(e => e.id !== itemId);
    if(itemClass === "holidayItem"){
      holidayData = [];
    }
    localStorage.setItem('box1Data', JSON.stringify(box1Data));
    localStorage.setItem('box2Data', JSON.stringify(box2Data));
    localStorage.setItem('holidayData', JSON.stringify(holidayData));
  }
}

//menu2を押したときにこの関数を実行
function openModal() {
  let editText = document.getElementById("editText");
  let titleinput = document.getElementById("eventTitleInput");
  let period = itemId.substr(itemId.indexOf('_') + 1);
  judgmentModalTypes = "edit";
  newEventModal.style.display = 'block';
  titleinput.innerHTML = itemDeco;
  titleinput.style.backgroundColor = itemBG;
  // document.getElementById('cancelButton').addEventListener('click', closeModal);
  backDrop.style.display = 'block';
  editText.innerText = `${targetDate}\n`; //モーダルの上のテキストをitemの日付にする
  if(itemClass === "item"){
    titleinput.style.width = "50px";
    titleinput.style.height = "60px";
    if(period.slice(0,2) === "I-"){
      editText.innerText = `${editText.innerText}1年${period.slice(-1)}時限目`;
    }else{
      editText.innerText = `${editText.innerText}2年${period.slice(-1)}時限目`;
    }
    if(editText.innerText.slice(0,4) === "box1"){
      editText.innerText = "1時限分の教科";
    }
  }else if(itemClass === "bigItem"){
    titleinput.style.width = "100px";
    titleinput.style.height = "60px";

    if(period.slice(0,2) === "I-"){
      editText.innerText = `${editText.innerText}1年${period.slice(-2,-1)},${period.slice(-1)}時限目`;
    }else{
      editText.innerText = `${editText.innerText}2年${period.slice(-2,-1)},${period.slice(-1)}時限目`;
    }
    if(editText.innerText.slice(0,4) === "box2"){
      editText.innerText = "2時限分の教科";
    }
  }else if(itemClass === "holidayItem"){
    editText.innerText = `${editText.innerText}休日`;
    titleinput.style.width = "156px";
    titleinput.style.height = "111px";
    if(editText.innerText.slice(0,1) === "h"){
      editText.innerText = "holiday";
    }
  }
}

function openModalToAddSubj(){
  judgmentModalTypes = "add";
  modalToAddSubj.style.display = 'block';
  backDrop.style.display = 'block';
  if(input){
    if(input.id === "add1"){
      box1.style.position = 'relative';
      box1.style.zIndex = '11';
    }else if(input.id === "add2"){
        box2.style.position = 'relative';
        box2.style.zIndex = '11';
    }else if(input.id === "addHoli"){
        holiday.style.position = 'relative';
        holiday.style.zIndex = '11';
    }
  }
}

//配列(dataArray)を日付の小さい順に並び変える
function compareFunc(a, b) {
  let dateA = new Date(a.split('|')[1]);
  let dateB = new Date(b.split('|')[1]);
  // 日付を比較（昇順）
  return dateA - dateB;
}
//配列(dataArray2Color)を日付の小さい順に並び変える
function compareFunc2(a, b) {
  let dateA = new Date(a.split('_')[0]);
  let dateB = new Date(b.split('_')[0]);
  return dateA - dateB;
}

// Sleep関数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

//↓asyncはsleepを実行するために必要
async function sendToServer(){
  // サーバ変数のインスタンス生成
  let monthDisplay = document.getElementById("monthDisplay").innerText;  //左上に表示されている月と年を取得(例:2月 2024)
  let month = monthDisplay.slice(0,monthDisplay.indexOf('月')); //"月"より前の文字列を取得
  let year = monthDisplay.slice(monthDisplay.indexOf(' ') + 1); //スペース以降の文字列を取得
  let currentMonthData = ローカルストレージ.filter(e => e.date.slice(0,e.date.indexOf('/')) === month && e.date.slice(-4) === year);
  let data;
  let data2;
  let dataArray = [];
  let dataArray2CangeColor = []; //送信された教科の色を変えるためだけの配列
  let elementBgColor = [];

  for(i=0; i<currentMonthData.length; i++){
    let oldDate = new Date(currentMonthData[i].date);
    let formatted_date=`${oldDate.getMonth() + 1}/${oldDate.getDate()}/${oldDate.getFullYear()}`
    // let formatted_date=`${oldDate.getFullYear()}-${oldDate.getMonth() + 1}-${oldDate.getDate()}`
    
    if(currentMonthData[i].period.slice(0,2) === "I-"){
      data = 'one|'+ formatted_date +'|'+ currentMonthData[i].period +'|'+ currentMonthData[i].value +'|'+ currentMonthData[i].decoration +'|'+ currentMonthData[i].backgroundColor;
    }else if(currentMonthData[i].period.slice(0,2) === "II"){
      data = 'two|'+ formatted_date +'|'+ currentMonthData[i].period +'|'+ currentMonthData[i].value +'|'+ currentMonthData[i].decoration +'|'+ currentMonthData[i].backgroundColor;
    }else{
      //holidayのとき
      data = 'two|'+ formatted_date +'|'+ currentMonthData[i].period +'|'+ currentMonthData[i].value +'|'+ currentMonthData[i].decoration +'|'+ currentMonthData[i].backgroundColor;
      data2 = 'one|'+ formatted_date +'|'+ currentMonthData[i].period +'|'+ currentMonthData[i].value +'|'+ currentMonthData[i].decoration +'|'+ currentMonthData[i].backgroundColor;
      dataArray.push(data2);

      dataArray2CangeColor.push(currentMonthData[i].date +'_'+ currentMonthData[i].period);
      //↑dataArrayとdataArray2CangeColorのlengthを揃えるためにpush。
    }
    dataArray.push(data);
    dataArray2CangeColor.push(currentMonthData[i].date +'_'+ currentMonthData[i].period);
  }
  dataArray.sort(compareFunc);   //配列(dataArray)を日付の小さい順に並び変える
  dataArray2CangeColor.sort(compareFunc2);

  const val = new XMLHttpRequest();
  val.open('POST', '/delete');
  val.send(month + '|' + year);

  for(i=0; i<dataArray.length; i++){
    let element = document.getElementById(`${dataArray2CangeColor[i]}`);
    //教科の元のBackgroundColorをelementBgColorに格納
    if(element.style.backgroundColor !== "red"){
      elementBgColor.push(element.style.backgroundColor);
    }else{
      elementBgColor.push(elementBgColor[elementBgColor.length-1]);
    }
    await sleep(300);
    val.open('POST', '/schedule');
    val.send(dataArray[i]);
    element.style.backgroundColor = "red";
  }

  for(i=0; i<dataArray.length; i++){
    let element = document.getElementById(`${dataArray2CangeColor[i]}`);
    element.style.backgroundColor = "dodgerblue";
  }
  await sleep(500);  //青色の時間
  //教科の背景色を元に戻す
  for(i=0; i<dataArray.length; i++){
    let element = document.getElementById(`${dataArray2CangeColor[i]}`);
    element.style.backgroundColor = elementBgColor[i];
  }
  // alert("教科が送られました。(ﾉ ;ω;)ﾉ ⌒ 📕📘📗");
  // backDropToSendSubj.style.display = 'none';
}

function periodInline(target) {
  if(target.closest(".location") !== null){     // holidayLocationで発生するエラーを削除
    if(!target.closest(".location").children[1]){
      target.closest(".location").children[0].style.display="inline";
    }
  }
}

function periodNone(target) {
  if(target.closest(".location") !== null){     // holidayLocationで発生するエラーを削除
    if(!target.closest(".location").children[1]){
      target.closest(".location").children[0].style.display="none";
    }
  }
}

// カレンダーの表示を更新するための処理を行う
// 現在の日付や指定した月の日付情報を取得して、カレンダーに反映させる。
function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setDate(1);
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();    //monthはインデックス値（今日の月-１=month）
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  previousMonth = new Date(year,month-1); //前月の情報取得
  nextMonth = new Date(year,month+1); //翌月の情報取得
  previousMonthLastDate = new Date(year, month, 0).getDate();  //前月の最終日取得

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
  MonthDateLength = paddingDays + daysInMonth;

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('ja', { month: 'long' })} ${year}`;

  calendar.innerHTML = ''; 

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = `${i - paddingDays}\n`;

      daySquare.id = `${month + 1}/${i - paddingDays}/${year}`;

      const dayWithSubj_I1 = ローカルストレージ.find(e => e.date === dayString && e.period === 'I-1');
      const dayWithSubj_I2 = ローカルストレージ.find(e => e.date === dayString && e.period === 'I-2');
      const dayWithSubj_I3 = ローカルストレージ.find(e => e.date === dayString && e.period === 'I-3');
      const dayWithSubj_I4 = ローカルストレージ.find(e => e.date === dayString && e.period === 'I-4');
      const dayWithSubj_II1 = ローカルストレージ.find(e => e.date === dayString && e.period === 'II-1');
      const dayWithSubj_II2 = ローカルストレージ.find(e => e.date === dayString && e.period === 'II-2');
      const dayWithSubj_II3 = ローカルストレージ.find(e => e.date === dayString && e.period === 'II-3');
      const dayWithSubj_II4 = ローカルストレージ.find(e => e.date === dayString && e.period === 'II-4');
      const dayWithSubj_I12 = ローカルストレージ.find(e => e.date === dayString && e.period === 'I-12');
      const dayWithSubj_I34 = ローカルストレージ.find(e => e.date === dayString && e.period === 'I-34');
      const dayWithSubj_II12 = ローカルストレージ.find(e => e.date === dayString && e.period === 'II-12');
      const dayWithSubj_II34 = ローカルストレージ.find(e => e.date === dayString && e.period === 'II-34');
      const dayWithHoliday = ローカルストレージ.find(e => e.date === dayString && e.period === 'holiday');

      //今日の日付を目立たせる
      if (i - paddingDays === day && nav === 0) {
        daySquare.classList.add('currentDay');
        // daySquare.id = 'currentDay';
      }

      for(let x = 1; x <= 8; x++){
        const subjectLocation = document.createElement('div');
        subjectLocation.classList.add("location");
        const displayPeriod = document.createElement('div');
        displayPeriod.className = "hiddenPeriod";

        if(x <= 4){
          subjectLocation.id = "I-" + x;
          displayPeriod.innerText="\n1年\n" + x + "限目";
        }else{
          subjectLocation.id = "II-" + (x-4);
          displayPeriod.innerText="\n2年\n" + (x-4) + "限目";
        }

        //↓教科がdropしたオブジェクトの日付を取得
        subjectLocation.addEventListener('drop', () => registerDate(dayString));
        subjectLocation.addEventListener('mouseover', (e) => periodInline(e.target));
        subjectLocation.addEventListener('mouseout', (e) => periodNone(e.target));
        subjectLocation.addEventListener('drop', () => {
          if(itemClass === "holidayItem"){
            ローカルストレージ.push({
              date: mouseup,
              period: "holiday",
              id: mouseup + "_holiday",
              value: g_drag_obj.innerText,
              decoration: g_drag_obj.innerHTML,
              backgroundColor: `${g_drag_obj.style.backgroundColor}`,
            });
          }else{
            if(itemClass === "bigItem"){
              if(subjectLocation.id.slice( -1 ) === "1" || subjectLocation.id.slice( -1 ) === "3"){
                ローカルストレージ.push({
                  date: mouseup,
                  period: subjectLocation.id.slice( 0,-1 ) + subjectLocation.id.slice( -1 ) + (parseInt(subjectLocation.id.slice( -1 ), 10) + 1),
                  id: mouseup + "_" + subjectLocation.id.slice( 0,-1 ) + subjectLocation.id.slice( -1 ) + (parseInt(subjectLocation.id.slice( -1 ), 10) + 1),
                  value: g_drag_obj.innerText,
                  decoration: g_drag_obj.innerHTML,
                  backgroundColor: `${g_drag_obj.style.backgroundColor}`,
                });
                }else{
                  ローカルストレージ.push({
                    date: mouseup,
                    period: subjectLocation.id.slice( 0,-1 ) + (parseInt(subjectLocation.id.slice( -1 ), 10) - 1) + subjectLocation.id.slice( -1 ),
                    id: mouseup + "_" + subjectLocation.id.slice( 0,-1 ) + (parseInt(subjectLocation.id.slice( -1 ), 10) - 1) + subjectLocation.id.slice( -1 ),
                    value: g_drag_obj.innerText,
                    decoration: g_drag_obj.innerHTML,
                    backgroundColor: `${g_drag_obj.style.backgroundColor}`,
                  });
                }
            }else{
              if(itemClass !== "tempDay"){
                ローカルストレージ.push({
                  date: mouseup,
                  period: subjectLocation.id,
                  id: mouseup + "_" + subjectLocation.id,
                  value: g_drag_obj.innerText,
                  decoration: g_drag_obj.innerHTML,
                  backgroundColor: `${g_drag_obj.style.backgroundColor}`,
                });
              }
            }
          }
        });
        
        subjectLocation.addEventListener('dragstart', (e) => getInfo(dayString,e.target.id));
        //↓box1,box2にある教科からも、id_8とdateの値を取得するため(バグ取り)
        box1.addEventListener('dragstart', (e) => getInfo(dayString,e.target.id));
        box2.addEventListener('dragstart', (e) => getInfo(dayString,e.target.id));

        daySquare.appendChild(subjectLocation);
        subjectLocation.appendChild(displayPeriod);
        }

      if (dayWithSubj_I1){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_I1.date+"_"+dayWithSubj_I1.period;
        subjDiv.innerHTML = dayWithSubj_I1.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_I1.backgroundColor;
        // subjDiv.innerText = dayWithSubj_I1.value;

        let searchChild = daySquare.children[1];
        searchChild.appendChild(subjDiv);
      }
      if (dayWithSubj_I2){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_I2.date+"_"+dayWithSubj_I2.period;
        subjDiv.innerHTML = dayWithSubj_I2.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_I2.backgroundColor;

        let searchChild = daySquare.children[2];
        searchChild.appendChild(subjDiv);
      }
      if (dayWithSubj_I3){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_I3.date+"_"+dayWithSubj_I3.period;
        subjDiv.innerHTML = dayWithSubj_I3.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_I3.backgroundColor;

        let searchChild = daySquare.children[3];
        searchChild.appendChild(subjDiv);
      }
      if (dayWithSubj_I4){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_I4.date+"_"+dayWithSubj_I4.period;
        subjDiv.innerHTML = dayWithSubj_I4.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_I4.backgroundColor;

        let searchChild = daySquare.children[4];
        searchChild.appendChild(subjDiv);
      }
      if (dayWithSubj_II1){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_II1.date+"_"+dayWithSubj_II1.period;
        subjDiv.innerHTML = dayWithSubj_II1.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_II1.backgroundColor;

        let searchChild = daySquare.children[5];
        searchChild.appendChild(subjDiv);
      }
      if (dayWithSubj_II2){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_II2.date+"_"+dayWithSubj_II2.period;
        subjDiv.innerHTML = dayWithSubj_II2.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_II2.backgroundColor;

        let searchChild = daySquare.children[6];
        searchChild.appendChild(subjDiv);
      }
      if (dayWithSubj_II3){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_II3.date+"_"+dayWithSubj_II3.period;
        subjDiv.innerHTML = dayWithSubj_II3.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_II3.backgroundColor;

        let searchChild = daySquare.children[7];
        searchChild.appendChild(subjDiv);
      }
      if (dayWithSubj_II4){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_II4.date+"_"+dayWithSubj_II4.period;
        subjDiv.innerHTML = dayWithSubj_II4.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_II4.backgroundColor;

        let searchChild = daySquare.children[8];
        searchChild.appendChild(subjDiv);
      }
      //↓↓↓bigItem再生成
      if (dayWithSubj_I12){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('bigItem');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_I12.date+"_"+dayWithSubj_I12.period;
        subjDiv.innerHTML = dayWithSubj_I12.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_I12.backgroundColor;

        let searchChild = daySquare.children[1]
        searchChild.classList.add("fatParent");
        searchChild.id = "I-12";
        searchChild.nextElementSibling.remove();
        searchChild.appendChild(subjDiv);
      }
      if (dayWithSubj_I34){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('bigItem');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_I34.date+"_"+dayWithSubj_I34.period;
        subjDiv.innerHTML = dayWithSubj_I34.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_I34.backgroundColor;

        if(daySquare.children[1].id === "I-1"){
          let searchChild = daySquare.children[3];
          searchChild.classList.add("fatParent");
          daySquare.children[3].id = "I-34";
          daySquare.children[4].remove();
          searchChild.appendChild(subjDiv);
        }else{
          let searchChild = daySquare.children[2];
          searchChild.classList.add("fatParent");
          daySquare.children[2].id = "I-34";
          daySquare.children[3].remove();
          searchChild.appendChild(subjDiv);
          }
      }
      if (dayWithSubj_II12){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('bigItem');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_II12.date+"_"+dayWithSubj_II12.period;
        subjDiv.innerHTML = dayWithSubj_II12.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_II12.backgroundColor;
        let searchChild = daySquare.children[daySquare.children.length-4];
        searchChild.classList.add("fatParent");
        searchChild.id = "II-12";
        searchChild.nextElementSibling.remove();
        searchChild.appendChild(subjDiv);
      }
      if (dayWithSubj_II34){
        const subjDiv = document.createElement('div');
        subjDiv.classList.add('bigItem');
        subjDiv.draggable = true;
        subjDiv.id = dayWithSubj_II34.date+"_"+dayWithSubj_II34.period;
        subjDiv.innerHTML = dayWithSubj_II34.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_II34.backgroundColor;
        let searchChild = daySquare.children[daySquare.children.length-2];
        searchChild.classList.add("fatParent");
        searchChild.id = "II-34";
        searchChild.nextElementSibling.remove();
        searchChild.appendChild(subjDiv);
      }
      if (dayWithHoliday){
        for(let i=9; i--;){
          if(daySquare.children[i] !== daySquare.children[0]){
            daySquare.children[i].remove();
          }
        }
        const holidayLocation = document.createElement('div');
        holidayLocation.addEventListener('dragstart', (e) => getInfo(e.target.parentNode.parentNode.id,e.target.id,e.target.innerText,e.target.innerHTML,e.target.style.backgroundColor));
        holidayLocation.classList.add('holidayLocation');
        daySquare.appendChild(holidayLocation);

        const holidayItem = document.createElement('div');
        holidayItem.classList.add('holidayItem');
        holidayItem.draggable = true;
        holidayItem.id = dayWithHoliday.id;
        holidayItem.innerHTML = dayWithHoliday.decoration;
        holidayItem.style.backgroundColor = dayWithHoliday.backgroundColor;
        holidayLocation.appendChild(holidayItem);
      }

      // daySquare.addEventListener('click', () => openModal(dayString));
      // daySquare.addEventListener('drop', () => registerDate(dayString));
    } else {
      daySquare.classList.add('padding');
    }
    calendar.appendChild(daySquare);
    lastDate = calendar.children[paddingDays + daysInMonth-1];
  }//ここまで　for(let i = 1; i <= paddingDays + daysInMonth; i++)


  // ↓↓↓右クリックメニューイベント
  document.getElementById('menu1').onclick = function(e){
    deleteSubj();
    deleteBoxSubj();
    document.getElementById(itemId).remove();
    if(itemClass === "bigItem"){
      parentLosesWeight();  //親の大きさをもとに戻す
    }
    if(itemClass === "holidayItem"){
      holidayOperation();
    }
  }
  document.getElementById('menu2').onclick = function(e){
    openModal();
  }
  // document.getElementById('menu3').onclick = function(e){
  //   copySubj();
  // }
  // ↑↑↑右クリックメニューイベント

  //一番最初のハンバーガーメニューのtext
  if(!hamburgerStorage.I){
    hamburgerStorage = {
      I: "土日を削除",
      II: "前月、翌月の日を削除",
      III: "ごみ箱を表示しない",
    };
  }
  //ハンバーガーのtextをhamburgerStorageから取得
  hamburger1.innerText = hamburgerStorage.I;
  hamburger2.innerText = hamburgerStorage.II;

  if(hamburger2.innerText === "前月、翌月の日を削除"){
    displayPreNexDate();  //前月と翌月の日を表示
  }

  if(hamburger1.innerText === "土日を表示"){
    removeSatSun(); //土日削除
  }else{
    document.getElementById("Sat").innerText = '土曜日';
    document.getElementById("Sun").innerText = '日曜日';
  }

  const locations = [...document.querySelectorAll(".location")];
  const days = [...document.querySelectorAll(".day")];
  const items = [...document.querySelectorAll(".item")];
  const bigItems = [...document.querySelectorAll(".bigItem")];
  const holidayItems = [...document.querySelectorAll(".holidayItem")];

  for (const location of locations) {
    if (!location.parentNode.classList.contains('fade')){
      location.addEventListener("dragenter", handleDragEnter, false);
      location.addEventListener("dragleave", handleDragLeave, false);
      location.addEventListener("dragover", handleDragOver, false);
      location.addEventListener("drop", handleDrop, false);
    }
  }

  for (const day of days) {
    if (!day.classList.contains('padding') && !day.classList.contains('fade')) {
      day.addEventListener("dragenter", DragEnterForDay, false);
      day.addEventListener("dragleave", DragLeaveForDay, false);
      day.addEventListener("dragover", DragOverForDay, false);
      day.addEventListener("drop", DropForDay, false);
    }
  }

  // アイテムにイベントを登録
  for (const item of items) {
    item.addEventListener("dragstart", handleDragStart, false);
    item.addEventListener("dragend", handleDragEnd, false);
    item.addEventListener("mousedown", getClass, false);
  
    //右クリックメニューを表示
    if(!item.parentNode.parentNode.className.includes("fade")){
      item.addEventListener('contextmenu',function (e){
        getInfo(item.parentNode.parentNode.getAttribute('id'),item.id,item.innerText,item.innerHTML,item.style.backgroundColor); //itemの親の親のid,itemのid,itemのvalue
        document.getElementById('contextmenu').style.left=dragStartX+"px";
        document.getElementById('contextmenu').style.top=dragStartY+"px";
        document.getElementById('contextmenu').style.display="block";
      });
      document.body.addEventListener('click',function (e){
        document.getElementById('contextmenu').style.display="none";
      });
    }
  }

  for (const bigItem of bigItems) {
    bigItem.addEventListener("dragstart", handleDragStart, false);
    bigItem.addEventListener("dragend", handleDragEnd, false);
    bigItem.addEventListener("mousedown", getClass, false);
  
    //右クリックメニューを表示
    if(!bigItem.parentNode.parentNode.className.includes("fade")){
      bigItem.addEventListener('contextmenu',function (e){
        getInfo(bigItem.parentNode.parentNode.getAttribute('id'),bigItem.id,bigItem.innerText,bigItem.innerHTML,bigItem.style.backgroundColor); //itemの親の親のid,itemのid,itemのvalue
        document.getElementById('contextmenu').style.left=dragStartX+"px";
        document.getElementById('contextmenu').style.top=dragStartY+"px";
        document.getElementById('contextmenu').style.display="block";
      });
      document.body.addEventListener('click',function (e){
        document.getElementById('contextmenu').style.display="none";
      });
    }
  }

  for (const holidayItem of holidayItems){
    holidayItem.addEventListener("dragstart", handleDragStart, false);
    holidayItem.addEventListener("dragend", handleDragEnd, false);
    holidayItem.addEventListener("mousedown", getClass, false);
    if(!holidayItem.parentNode.parentNode.className.includes("fade")){
      holidayItem.addEventListener('contextmenu',function (e){
        getInfo(holidayItem.parentNode.parentNode.getAttribute('id'),holidayItem.id,holidayItem.innerText,holidayItem.innerHTML,holidayItem.style.backgroundColor); //itemの親の親のid,itemのid,itemのvalue
        document.getElementById('contextmenu').style.left=dragStartX+"px";
        document.getElementById('contextmenu').style.top=dragStartY+"px";
        document.getElementById('contextmenu').style.display="block";
      });
      document.body.addEventListener('click',function (e){
        document.getElementById('contextmenu').style.display="none";
      });
    }
  }
} //load()

// ↓ゴミ箱専用のイベント
const handleDragEnter2 = (e) => {
  if(dragStartX < box1.getBoundingClientRect().left || dragStartY > holiday.getBoundingClientRect().bottom){
    if(itemClass !== "tempDay"){
      trashCan.src = "../static/img/trashCan_lidOpend.png";
    }
  }
}
const handleDragLeave2 = (e) => {
  if(dragStartX < box1.getBoundingClientRect().left || dragStartY > holiday.getBoundingClientRect().bottom){
    if(itemClass !== "tempDay"){
      trashCan.src = "../static/img/trashCan.png";
    }
  }
}
const handleDragOver2 = (e) => {
  // 要素が重なった際のブラウザ既定の処理を変更
  e.preventDefault();
  // ドロップ効果の設定
  if (event.ctrlKey) {
    e.dataTransfer.dropEffect = "copy";
  } else {
    e.dataTransfer.dropEffect = "move";
  }
};
const handleDrop2 = (e) => {
  deleteSubj();
  if(dragStartX < box1.getBoundingClientRect().left || dragStartY > holiday.getBoundingClientRect().bottom){
    if(itemClass !== "tempDay"){
      document.getElementById(itemId).remove();
    }
  }
  // 要素がドロップされた際のブラウザ既定の処理を変更
  e.preventDefault();
  e.target.classList.remove("over");
  if(itemClass === "bigItem"){
    parentLosesWeight();  //親の大きさをもとに戻す
  }
  if(itemClass === "holidayItem"){
    holidayOperation();
  }
};
//↑ゴミ箱専用のイベント

trashArea.addEventListener("dragenter", handleDragEnter2, false);
trashArea.addEventListener("dragleave", handleDragLeave2, false);
trashArea.addEventListener("dragover", handleDragOver2, false);
trashArea.addEventListener("drop", handleDrop2, false);

// モーダルを閉じるための処理を行う。入力フィールドや表示を初期化し、モーダルを非表示にする。
function closeModal() {
  newEventModal.style.display = 'none';
  load();
  if(modalToAddSubj.style.display === 'none'){
    backDrop.style.display = 'none';
  }
}

function closeModalToAddSubj(){
  modalToAddSubj.style.display = 'none';
  backDrop.style.display = 'none';
  box1.style.position = 'static';
  box2.style.position = 'static';
  holiday.style.position = 'static';
}

// 新しいイベントを保存するための処理を行う。
// 入力されたデータを処理し、ローカルストレージにイベント情報を保存する。
function saveEvent() {
  if(targetDate === 'box1'){
    let detectSubj = box1Data.find(e => e.decoration === itemDeco); //ローカルストレージのinnerHTMLと右クリックした教科のinnerHTMLが一致した教科を変数に保存
    box1Data.find(e => e.value === itemValue).value = document.getElementById('eventTitleInput').innerText;
    box1Data.find(e => e.decoration === itemDeco).decoration = document.getElementById('eventTitleInput').innerHTML;
    detectSubj.backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
    localStorage.setItem('box1Data', JSON.stringify(box1Data));
    document.getElementById(itemId).innerHTML = document.getElementById('eventTitleInput').innerHTML;
    document.getElementById(itemId).style.backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
  }else{
    if(targetDate === 'box2'){
      let detectSubj = box2Data.find(e => e.decoration === itemDeco);
      box2Data.find(e => e.value === itemValue).value = document.getElementById('eventTitleInput').innerText;
      box2Data.find(e => e.decoration === itemDeco).decoration = document.getElementById('eventTitleInput').innerHTML;
      detectSubj.backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
      localStorage.setItem('box2Data', JSON.stringify(box2Data));
      document.getElementById(itemId).innerHTML = document.getElementById('eventTitleInput').innerHTML;
      document.getElementById(itemId).style.backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
    }else{
      if(targetDate === 'holiday'){
        holidayData.value = document.getElementById('eventTitleInput').innerText;
        holidayData.decoration = document.getElementById('eventTitleInput').innerHTML;
        holidayData.backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
        localStorage.setItem('holidayData', JSON.stringify(holidayData));
        document.getElementById(itemId).innerHTML = document.getElementById('eventTitleInput').innerHTML;
        document.getElementById(itemId).style.backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
      }else{
        if(targetDate === 'tempDay'){
          if(itemClass === "holidayItem"){
            tempDayData[0].value = document.getElementById('eventTitleInput').innerText;
            tempDayData[0].decoration = document.getElementById('eventTitleInput').innerHTML;
            tempDayData[0].backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
            localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
            document.getElementById(itemId).innerHTML = document.getElementById('eventTitleInput').innerHTML;
            document.getElementById(itemId).style.backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
          }else{
            tempDayData.find(e =>e.period === id_8).value = document.getElementById('eventTitleInput').innerText;
            tempDayData.find(e =>e.period === id_8).decoration = document.getElementById('eventTitleInput').innerHTML;
            tempDayData.find(e =>e.period === id_8).backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
            localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
            document.getElementById(itemId).innerHTML = document.getElementById('eventTitleInput').innerHTML;
            document.getElementById(itemId).style.backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
          }
        }else{
          if(itemClass !== "holidayItem"){
            // itemClassがitemとbigItemのときの処理
            ローカルストレージ.find(e => e.date === targetDate && e.period === id_8).value = document.getElementById('eventTitleInput').innerText;
            ローカルストレージ.find(e => e.date === targetDate && e.period === id_8).decoration = document.getElementById('eventTitleInput').innerHTML;
            ローカルストレージ.find(e => e.date === targetDate && e.period === id_8).backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
            localStorage.setItem('ローカルストレージ', JSON.stringify(ローカルストレージ));
          }else{
            // itemClassがholidayItemのときの処理
            ローカルストレージ.find(e => e.date === targetDate).value = document.getElementById('eventTitleInput').innerText;
            ローカルストレージ.find(e => e.date === targetDate).decoration = document.getElementById('eventTitleInput').innerHTML;
            ローカルストレージ.find(e => e.date === targetDate).backgroundColor = document.getElementById('eventTitleInput').style.backgroundColor;
            localStorage.setItem('ローカルストレージ', JSON.stringify(ローカルストレージ));
          }
        }
      }
    }
  }
  closeModal();
}

// イベントを削除するための処理を行います。
// 選択されたイベントを削除し、ローカルストレージを更新する。
function deleteEvent() {
  // events = events.filter(e => e.date !== clicked);
  // localStorage.setItem('events', JSON.stringify(events));
  // closeModal();
}

//この教科を複製を押すと教科が点滅
function copySubj(){
  let flg=true;
  function change(){
    if( flg ){
        document.getElementById(itemId).style='background-color:#87cefa';
    }else{
        document.getElementById(itemId).style='background-color:#fff';
    }
    flg = !flg;
    setTimeout( change,500 );
  }
  change();
}

// 各種ボタンのクリックイベントを初期化するための処理を行う。
function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });
}

//追加ボタンを押したときの処理
function identifyFunction(){
  let textarea_element = document.getElementById('textarea');
  if(textarea_element.innerText.includes("|")){
    alert('「 | 」は使用できません。');
  }else if(input.id === "add1"){
    addSubject();   //1時限分の教科を追加
  }else if(input.id === "add2"){
    addSubject2();  //2時限分の教科を追加
  }else if(input.id === "addHoli"){
    addholiday();   //holidayを追加
  }
}

//教科を追加
function addSubject(){
  let box1array = [];
  for(i=0; i<box1.children.length; i++){
    box1array.push(box1.children[i].innerText);
  }

  if(document.getElementById('textarea').innerText.trim() && box1array.includes(document.getElementById('textarea').innerText) !== true && box1array.includes("")){
    let textarea_element = document.getElementById('textarea');
    let subject = document.createElement('div');
    let backgroundColor = document.getElementById('textarea').style.backgroundColor;

    subject.classList.add("item");
    subject.draggable = "true";
    subject.id = box1.children[box1array.indexOf("")].id + '_child';     //itemの親となるbox1Locationのidとitemのidを紐付ける(box1-13 ↔ box1-13_child)
    subject.innerHTML = document.getElementById('textarea').innerHTML;   //                                                 (↑親のid)    (↑子のid)
    subject.style.backgroundColor = backgroundColor;

    box1Data.push({
        id: subject.id,
        value: textarea_element.innerText,
        decoration: document.getElementById('textarea').innerHTML,
        backgroundColor: `${backgroundColor}`,
      });
      
    localStorage.setItem('box1Data', JSON.stringify(box1Data));
    box1.children[box1array.indexOf("")].appendChild(subject);

    subject.addEventListener("dragstart", handleDragStart, false);
    subject.addEventListener("dragend", handleDragEnd, false);
    subject.addEventListener("mousedown", getClass, false);
    subject.addEventListener('contextmenu',function (e){
      getInfo(subject.parentNode.parentNode.getAttribute('id'),subject.id,subject.innerText,subject.innerHTML,subject.style.backgroundColor); //itemの親の親のid,itemのid,itemのvalue
      document.getElementById('contextmenu').style.left=dragStartX+"px";
      document.getElementById('contextmenu').style.top=dragStartY+"px";
      document.getElementById('contextmenu').style.display="block";
    });

  }else if(box1array.includes("") === false){
    alert('これ以上、教科を追加することはできません。');
  }else if(document.getElementById('textarea').innerText.trim() === ""){
    alert('教科名を入力してください。');
  }else if(box1array.includes(document.getElementById('textarea').innerText)){
    alert('すでに同じ教科が登録されています。');
  }
}

//２scaleの教科追加
function addSubject2(){
  let box2array = [];
  for(i=0; i<box2.children.length; i++){
    box2array.push(box2.children[i].innerText);
  }
  
  if(document.getElementById('textarea').innerText.trim() && box2array.includes(document.getElementById('textarea').innerText) !== true && box2array.includes("")){
    let textarea_element = document.getElementById('textarea');
    let bigItem = document.createElement('div');
    let backgroundColor = document.getElementById('textarea').style.backgroundColor;

    bigItem.classList.add("bigItem");
    bigItem.draggable = "true";
    bigItem.id = box2.children[box2array.indexOf("")].id + '_child';
    bigItem.innerHTML = document.getElementById('textarea').innerHTML;
    bigItem.style.backgroundColor = backgroundColor;

    box2Data.push({
        id: bigItem.id,
        value: textarea_element.innerText,
        decoration: document.getElementById('textarea').innerHTML,
        backgroundColor: `${backgroundColor}`,
      });
      
    localStorage.setItem('box2Data', JSON.stringify(box2Data));
    box2.children[box2array.indexOf("")].appendChild(bigItem);

    bigItem.addEventListener("dragstart", handleDragStart, false);
    bigItem.addEventListener("dragend", handleDragEnd, false);
    bigItem.addEventListener("mousedown", getClass, false);
    bigItem.addEventListener('contextmenu',function (e){
      getInfo(bigItem.parentNode.parentNode.getAttribute('id'),bigItem.id,bigItem.innerText,bigItem.innerHTML,bigItem.style.backgroundColor); //itemの親の親のid,itemのid,itemのvalue
      document.getElementById('contextmenu').style.left=dragStartX+"px";
      document.getElementById('contextmenu').style.top=dragStartY+"px";
      document.getElementById('contextmenu').style.display="block";
    });
  

  }else if(box2array.includes("") === false){
    alert('これ以上、教科を追加することはできません。');
  }else if(document.getElementById('textarea').innerText.trim() === ""){
    alert('教科名を入力してください。');
  }else if(box2array.includes(document.getElementById('textarea').innerText)){
    alert('すでに同じ教科が登録されています。');
  }
}

//holidayの教科追加
function addholiday(){
  if(holidayData.length === 0){
    if(document.getElementById('textarea').innerText.trim()){
      let textarea_element = document.getElementById('textarea');
      let holidayItem = document.createElement('div');
      let backgroundColor = document.getElementById('textarea').style.backgroundColor;

      holidayItem.classList.add("holidayItem");
      holidayItem.draggable = "true";
      holidayItem.id = 'holiday_child';
      holidayItem.innerHTML = document.getElementById('textarea').innerHTML;
      holidayItem.style.backgroundColor = backgroundColor;

      holidayData = {
        id: holidayItem.id,
        value: textarea_element.innerText,
        decoration: document.getElementById('textarea').innerHTML,
        backgroundColor: `${backgroundColor}`,
      };

      localStorage.setItem('holidayData', JSON.stringify(holidayData));
      holiday.children[1].appendChild(holidayItem);

      holidayItem.addEventListener("dragstart", handleDragStart, false);
      holidayItem.addEventListener("dragend", handleDragEnd, false);
      holidayItem.addEventListener("mousedown", getClass, false);
      holidayItem.addEventListener('contextmenu',function (){
        getInfo(holidayItem.parentNode.parentNode.getAttribute('id'),holidayItem.id,holidayItem.innerText,holidayItem.innerHTML,holidayItem.style.backgroundColor);
        document.getElementById('contextmenu').style.left=dragStartX+"px";
        document.getElementById('contextmenu').style.top=dragStartY+"px";
        document.getElementById('contextmenu').style.display="block";   
      });
    }else{
      alert('休日の名前を入力してください。');
    }
  }else if(holidayData){
    alert('これ以上、休日を追加することはできません。');
  }
}

//親が痩せ、痩せた親の次に要素を追加
function parentLosesWeight(){
  if(dragStartX < box1.getBoundingClientRect().left || dragStartY > box2.getBoundingClientRect().bottom){
    itemTargetParent.classList.remove("fatParent");
    itemTargetParent.id = itemTargetParent.id.slice( 0,-1 );
    let originalPeriod = itemTargetParent.children[0].innerText;
    if(originalPeriod.slice(2,-2) === "2" || originalPeriod.slice(2,-2) === "4"){
      itemTargetParent.children[0].innerText = `${"\n"+originalPeriod.slice(0,2)+"\n"}` +  (parseInt(originalPeriod[2]) - 1) + originalPeriod.slice(3);
    }

    let reviveSubj = document.createElement('div');
    reviveSubj.classList.add('location');
    reviveSubj.id = itemTargetParent.id.slice( 0,-1 ) + (parseInt(itemTargetParent.id.slice( -1 ), 10) + 1);
    let displayPeriod = document.createElement('div');
    displayPeriod.className = "hiddenPeriod";
 
    if(reviveSubj.id.slice( 0,2 ) === "I-"){
      displayPeriod.innerText="\n1年\n" + reviveSubj.id.slice(-1) + "限目"
    }else{
      displayPeriod.innerText="\n2年\n" + reviveSubj.id.slice(-1) + "限目"
    }
    reviveSubj.appendChild(displayPeriod);

    reviveSubj.addEventListener('mouseover', (e) => periodInline(e.target));
    reviveSubj.addEventListener('mouseout', (e) => periodNone(e.target));
    reviveSubj.addEventListener("dragenter", handleDragEnter, false);
    reviveSubj.addEventListener("dragleave", handleDragLeave, false);
    reviveSubj.addEventListener("dragover", handleDragOver, false);
    reviveSubj.addEventListener("drop", handleDrop, false);
    reviveSubj.addEventListener('dragstart', (e) => getInfo(reviveSubj.parentNode.id,e.target.id));
    reviveSubj.addEventListener('drop', () => registerDate(reviveSubj.parentNode.id));
    reviveSubj.addEventListener('drop', () => {
      if(reviveSubj.getBoundingClientRect().right < box1.getBoundingClientRect().left && dragStartY < holiday.getBoundingClientRect().bottom){
        if(itemClass === "holidayItem"){
          ローカルストレージ.push({
            date: mouseup,
            period: "holiday",
            id: mouseup + "_holiday",
            value: g_drag_obj.innerText,
            decoration: g_drag_obj.innerHTML,
            backgroundColor: `${g_drag_obj.style.backgroundColor}`,
          });
          localStorage.setItem('ローカルストレージ', JSON.stringify(ローカルストレージ));
        }else{
          ローカルストレージ.push({
            date: mouseup,
            period: reviveSubj.id,
            id: g_drag_obj.id,
            value: g_drag_obj.innerText,
            decoration: g_drag_obj.innerHTML,
            backgroundColor: `${g_drag_obj.style.backgroundColor}`,
          });
          localStorage.setItem('ローカルストレージ', JSON.stringify(ローカルストレージ));
        }
      }else{
        if(reviveSubj.getBoundingClientRect().right > box1.getBoundingClientRect().left){          
          tempDayData.push({
            period: reviveSubj.id,
            id: g_drag_obj.id,
            value: g_drag_obj.innerText,
            decoration: g_drag_obj.innerHTML,
            backgroundColor: `${g_drag_obj.style.backgroundColor}`,
          });
          localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
        }
      }
    });
    itemTargetParent.parentNode.insertBefore(reviveSubj,itemTargetParent.nextElementSibling);
  }
}

//親を削除した後、8個のlocationを生成(holidayItemを動かしたときに実行)
function holidayOperation(){
  if(dragStartX < box1.getBoundingClientRect().left || dragStartY > holiday.getBoundingClientRect().bottom){
    let removeTargetParent = itemTargetParent.parentNode;
    itemTargetParent.remove();

    for(let i = 1; i <= 8; i++){
      let subjectLocation = document.createElement('div');
      subjectLocation.classList.add("location");
      let displayPeriod = document.createElement('div');
      displayPeriod.className = "hiddenPeriod";

      if(i <= 4){
        subjectLocation.id = "I-" + i;
        displayPeriod.innerText="\n1年\n" + i + "限目";
      }else{
        subjectLocation.id = "II-" + (i-4);
        displayPeriod.innerText="\n2年\n" + (i-4) + "限目";
      }

      subjectLocation.addEventListener('drop', () => registerDate(removeTargetParent.id));
      subjectLocation.addEventListener('mouseover', (e) => periodInline(e.target));
      subjectLocation.addEventListener('mouseout', (e) => periodNone(e.target));
      subjectLocation.addEventListener('drop', () => {
        if(subjectLocation.getBoundingClientRect().right < box1.getBoundingClientRect().left){
          // ↓↓↓普通のDayに乗っているlocationのイベントを割り当てる(tempDayではない)
          if(itemClass === "holidayItem"){
            ローカルストレージ.push({
              date: mouseup,
              period: "holiday",
              id: mouseup + "_holiday",
              value: g_drag_obj.innerText,
              decoration: g_drag_obj.innerHTML,
              backgroundColor: `${g_drag_obj.style.backgroundColor}`,
            });
          }else{
            if(itemClass === "bigItem"){
              if(subjectLocation.id.slice( -1 ) === "1" || subjectLocation.id.slice( -1 ) === "3"){
                ローカルストレージ.push({
                  date: mouseup,
                  period: subjectLocation.id.slice( 0,-1 ) + subjectLocation.id.slice( -1 ) + (parseInt(subjectLocation.id.slice( -1 ), 10) + 1),
                  id: mouseup + "_" + subjectLocation.id.slice( 0,-1 ) + subjectLocation.id.slice( -1 ) + (parseInt(subjectLocation.id.slice( -1 ), 10) + 1),
                  value: g_drag_obj.innerText,
                  decoration: g_drag_obj.innerHTML,
                  backgroundColor: `${g_drag_obj.style.backgroundColor}`,
                });
              }else{
                ローカルストレージ.push({
                  date: mouseup,
                  period: subjectLocation.id.slice( 0,-1 ) + (parseInt(subjectLocation.id.slice( -1 ), 10) - 1) + subjectLocation.id.slice( -1 ),
                  id: mouseup + "_" + subjectLocation.id.slice( 0,-1 ) + (parseInt(subjectLocation.id.slice( -1 ), 10) - 1) + subjectLocation.id.slice( -1 ),
                  value: g_drag_obj.innerText,
                  decoration: g_drag_obj.innerHTML,
                  backgroundColor: `${g_drag_obj.style.backgroundColor}`,
                });
              }
            }else{
              if(itemClass !== "tempDay"){
                ローカルストレージ.push({
                  date: mouseup,
                  period: subjectLocation.id,
                  id: mouseup + "_" + subjectLocation.id,
                  value: g_drag_obj.innerText,
                  decoration: g_drag_obj.innerHTML,
                  backgroundColor: `${g_drag_obj.style.backgroundColor}`,
                });
              }
            }
          }
        }else{
          // ↓↓↓tempDayのlocationにイベントを割り当てる
          if(itemClass === "holidayItem"){
            tempDayData.push({
              period: "holiday",
              id: g_drag_obj.id,
              value: g_drag_obj.innerText,
              decoration: g_drag_obj.innerHTML,
              backgroundColor: `${g_drag_obj.style.backgroundColor}`,
            });
            localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
          }else{
            if(itemClass === "bigItem"){
              if(subjectLocation.id.slice( -1 ) === "1" || subjectLocation.id.slice( -1 ) === "3"){
                tempDayData.push({
                  period: subjectLocation.id.slice( 0,-1 ) + subjectLocation.id.slice( -1 ) + (parseInt(subjectLocation.id.slice( -1 ), 10) + 1),
                  id: g_drag_obj.id,
                  value: g_drag_obj.innerText,
                  decoration: g_drag_obj.innerHTML,
                  backgroundColor: `${g_drag_obj.style.backgroundColor}`,
                });
                localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
              }else{
                tempDayData.push({
                  period: subjectLocation.id.slice( 0,-1 ) + (parseInt(subjectLocation.id.slice( -1 ), 10) - 1) + subjectLocation.id.slice( -1 ),
                  id: g_drag_obj.id,
                  value: g_drag_obj.innerText,
                  decoration: g_drag_obj.innerHTML,
                  backgroundColor: `${g_drag_obj.style.backgroundColor}`,
                });
                localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
              }
            }else{
              tempDayData.push({
                period: subjectLocation.id,
                id: g_drag_obj.id,
                value: g_drag_obj.innerText,
                decoration: g_drag_obj.innerHTML,
                backgroundColor: `${g_drag_obj.style.backgroundColor}`,
              });
              localStorage.setItem('tempDayData', JSON.stringify(tempDayData));
            }
          }
        }
      });
      subjectLocation.addEventListener("dragenter", handleDragEnter, false);
      subjectLocation.addEventListener("dragleave", handleDragLeave, false);
      subjectLocation.addEventListener("dragover", handleDragOver, false);
      subjectLocation.addEventListener("drop", handleDrop, false);

      subjectLocation.addEventListener('dragstart', (e) => getInfo(removeTargetParent.id,e.target.id));
      removeTargetParent.appendChild(subjectLocation);
      subjectLocation.appendChild(displayPeriod);
    }
  }
}

//土日を削除
function removeSatSun(){
  const indexes = [0, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41];
  document.getElementById("Sat").innerText = '';
  document.getElementById("Sun").innerText = '';
  //↓↓↓許容できるエラーの削除
  try{
    if(calendar.children[6].innerText.slice( 0,1 ) === "1"){
      for(i=0; i<=6; i++){
        calendar.firstChild.remove();
      }
    }
    
    //例外が発生する可能性のある処理
    indexes.forEach(index => {
      if(lastDate === calendar.children[index]){
        while(calendar.children[index].nextElementSibling){
          calendar.children[index].nextElementSibling.remove();
        }
      }
      calendar.children[index].classList.add('padding');
      
      while (calendar.children[index].firstChild) {
        calendar.children[index].removeChild(calendar.children[index].firstChild);
      }
      calendar.children[index].removeEventListener("dragenter", DragEnterForDay, false);
      calendar.children[index].removeEventListener("dragleave", DragLeaveForDay, false);
      calendar.children[index].removeEventListener("dragover", DragOverForDay, false);
      calendar.children[index].removeEventListener("drop", DropForDay, false);
    });
  }catch(e){
    //例外が発生した場合の処理
  }
}

//前、翌月の日を表示
function displayPreNexDate(){
  const previousPaddingLength = document.querySelectorAll('.padding').length;
  const previousDateString = previousMonth.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'numeric',
  });
  let nextPaddingLength = null;
  const nextDateString = nextMonth.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'numeric',
  });
  if(MonthDateLength<36){
    nextPaddingLength = 35-MonthDateLength;
  }else{
    nextPaddingLength = 42-MonthDateLength;
  }

  for(i=0; i<previousPaddingLength; i++){
    let previousMonthDate = calendar.children[i];
    previousMonthDate.innerText = `${previousMonthLastDate-previousPaddingLength+i+1}\n`;
    previousMonthDate.classList.remove("padding");
    previousMonthDate.classList.add("fade");
    previousMonthDate.id = `${previousDateString.replace('/', `/${previousMonthLastDate-previousPaddingLength+i+1}/`)}`;
    for(let x = 1; x <= 8; x++){
      const subjectLocation = document.createElement("div");
      subjectLocation.classList.add("location");
      subjectLocation.style.backgroundColor = '#f5f5f5';
      if(x <= 4){
        subjectLocation.id = "I-" + x;
      }else{
        subjectLocation.id = "II-" + (x-4);
      }
      previousMonthDate.appendChild(subjectLocation);
    }

    const dayWithSubj_I1 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'I-1');
    const dayWithSubj_I2 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'I-2');
    const dayWithSubj_I3 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'I-3');
    const dayWithSubj_I4 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'I-4');
    const dayWithSubj_II1 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'II-1');
    const dayWithSubj_II2 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'II-2');
    const dayWithSubj_II3 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'II-3');
    const dayWithSubj_II4 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'II-4');
    const dayWithSubj_I12 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'I-12');
    const dayWithSubj_I34 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'I-34');
    const dayWithSubj_II12 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'II-12');
    const dayWithSubj_II34 = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'II-34');
    const dayWithHoliday = ローカルストレージ.find(e => e.date === previousMonthDate.id && e.period === 'holiday');

    if (dayWithSubj_I1){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_I1.date+"_"+dayWithSubj_I1.period;
      subjDiv.innerHTML = dayWithSubj_I1.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I1.backgroundColor;
      
      let searchChild = previousMonthDate.children[1];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_I2){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_I2.date+"_"+dayWithSubj_I2.period;
      subjDiv.innerHTML = dayWithSubj_I2.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I2.backgroundColor;

      let searchChild = previousMonthDate.children[2];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_I3){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_I3.date+"_"+dayWithSubj_I3.period;
      subjDiv.innerHTML = dayWithSubj_I3.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I3.backgroundColor;

      let searchChild = previousMonthDate.children[3];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_I4){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_I4.date+"_"+dayWithSubj_I4.period;
      subjDiv.innerHTML = dayWithSubj_I4.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I4.backgroundColor;

      let searchChild = previousMonthDate.children[4];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_II1){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_II1.date+"_"+dayWithSubj_II1.period;
      subjDiv.innerHTML = dayWithSubj_II1.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II1.backgroundColor;

      let searchChild = previousMonthDate.children[5];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_II2){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_II2.date+"_"+dayWithSubj_II2.period;
      subjDiv.innerHTML = dayWithSubj_II2.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II2.backgroundColor;

      let searchChild = previousMonthDate.children[6];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_II3){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_II3.date+"_"+dayWithSubj_II3.period;
      subjDiv.innerHTML = dayWithSubj_II3.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II3.backgroundColor;

      let searchChild = previousMonthDate.children[7];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_II4){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_II4.date+"_"+dayWithSubj_II4.period;
      subjDiv.innerHTML = dayWithSubj_II4.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II4.backgroundColor;

      let searchChild = previousMonthDate.children[8];
      searchChild.appendChild(subjDiv);
    }
    //↓↓↓bigItem再生成
    if (dayWithSubj_I12){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_I12.date+"_"+dayWithSubj_I12.period;
      subjDiv.innerHTML = dayWithSubj_I12.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I12.backgroundColor;

      let searchChild = previousMonthDate.children[1]
      searchChild.classList.add("fatParent");
      searchChild.id = "I-12";
      searchChild.nextElementSibling.remove();
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_I34){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_I34.date+"_"+dayWithSubj_I34.period;
      subjDiv.innerHTML = dayWithSubj_I34.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I34.backgroundColor;

      if(previousMonthDate.children[1].id === "I-1"){
        let searchChild = previousMonthDate.children[3];
        searchChild.classList.add("fatParent");
        previousMonthDate.children[3].id = "I-34";
        previousMonthDate.children[4].remove();
        searchChild.appendChild(subjDiv);
      }else{
        let searchChild = previousMonthDate.children[2];
        searchChild.classList.add("fatParent");
        previousMonthDate.children[2].id = "I-34";
        previousMonthDate.children[3].remove();
        searchChild.appendChild(subjDiv);
        }
    }
    if (dayWithSubj_II12){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_II12.date+"_"+dayWithSubj_II12.period;
      subjDiv.innerHTML = dayWithSubj_II12.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II12.backgroundColor;
      let searchChild = previousMonthDate.children[previousMonthDate.children.length-4];
      searchChild.classList.add("fatParent");
      searchChild.id = "II-12";
      searchChild.nextElementSibling.remove();
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_II34){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_II34.date+"_"+dayWithSubj_II34.period;
      subjDiv.innerHTML = dayWithSubj_II34.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II34.backgroundColor;
      let searchChild = previousMonthDate.children[previousMonthDate.children.length-2];
      searchChild.classList.add("fatParent");
      searchChild.id = "II-34";
      searchChild.nextElementSibling.remove();
      searchChild.appendChild(subjDiv);
    }
    if (dayWithHoliday){
      for(let i=9; i--;){
        if(previousMonthDate.children[i] !== previousMonthDate.children[0]){
          previousMonthDate.children[i].remove();
        }
      }
      const holidayLocation = document.createElement('div');
      holidayLocation.classList.add('holidayLocation');
      holidayLocation.style.backgroundColor = '#f5f5f5';
      previousMonthDate.appendChild(holidayLocation);
      const holidayItem = document.createElement('div');
      holidayItem.classList.add('holidayItem');
      holidayItem.id = dayWithHoliday.id;
      holidayItem.innerHTML = dayWithHoliday.decoration;
      holidayItem.style.backgroundColor = dayWithHoliday.backgroundColor;
      holidayLocation.appendChild(holidayItem);
    }
  }

  for(i=1; i<=nextPaddingLength; i++){
    let nextMonthDate = document.createElement('div');
    nextMonthDate.innerText = `${i}\n`;
    nextMonthDate.classList.add("day");
    nextMonthDate.classList.add("fade");
    nextMonthDate.id = `${nextDateString.replace('/', `/${i}/`)}`;
    calendar.appendChild(nextMonthDate);
    for(let x = 1; x <= 8; x++){
      const subjectLocation = document.createElement("div");
      subjectLocation.classList.add("location");
      subjectLocation.style.backgroundColor = '#f5f5f5';
      if(x <= 4){
        subjectLocation.id = "I-" + x;
      }else{
        subjectLocation.id = "II-" + (x-4);
      }
      nextMonthDate.appendChild(subjectLocation);
    }

    const dayWithSubj_I1 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'I-1');
    const dayWithSubj_I2 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'I-2');
    const dayWithSubj_I3 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'I-3');
    const dayWithSubj_I4 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'I-4');
    const dayWithSubj_II1 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'II-1');
    const dayWithSubj_II2 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'II-2');
    const dayWithSubj_II3 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'II-3');
    const dayWithSubj_II4 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'II-4');
    const dayWithSubj_I12 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'I-12');
    const dayWithSubj_I34 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'I-34');
    const dayWithSubj_II12 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'II-12');
    const dayWithSubj_II34 = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'II-34');
    const dayWithHoliday = ローカルストレージ.find(e => e.date === nextMonthDate.id && e.period === 'holiday');

    if (dayWithSubj_I1){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_I1.date+"_"+dayWithSubj_I1.period;
      subjDiv.innerHTML = dayWithSubj_I1.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I1.backgroundColor;
      
      let searchChild = nextMonthDate.children[1];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_I2){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_I2.date+"_"+dayWithSubj_I2.period;
      subjDiv.innerHTML = dayWithSubj_I2.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I2.backgroundColor;

      let searchChild = nextMonthDate.children[2];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_I3){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_I3.date+"_"+dayWithSubj_I3.period;
      subjDiv.innerHTML = dayWithSubj_I3.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I3.backgroundColor;

      let searchChild = nextMonthDate.children[3];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_I4){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_I4.date+"_"+dayWithSubj_I4.period;
      subjDiv.innerHTML = dayWithSubj_I4.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I4.backgroundColor;

      let searchChild = nextMonthDate.children[4];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_II1){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_II1.date+"_"+dayWithSubj_II1.period;
      subjDiv.innerHTML = dayWithSubj_II1.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II1.backgroundColor;

      let searchChild = nextMonthDate.children[5];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_II2){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_II2.date+"_"+dayWithSubj_II2.period;
      subjDiv.innerHTML = dayWithSubj_II2.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II2.backgroundColor;

      let searchChild = nextMonthDate.children[6];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_II3){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_II3.date+"_"+dayWithSubj_II3.period;
      subjDiv.innerHTML = dayWithSubj_II3.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II3.backgroundColor;

      let searchChild = nextMonthDate.children[7];
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_II4){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_II4.date+"_"+dayWithSubj_II4.period;
      subjDiv.innerHTML = dayWithSubj_II4.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II4.backgroundColor;

      let searchChild = nextMonthDate.children[8];
      searchChild.appendChild(subjDiv);
    }
    //↓↓↓bigItem再生成
    if (dayWithSubj_I12){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_I12.date+"_"+dayWithSubj_I12.period;
      subjDiv.innerHTML = dayWithSubj_I12.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I12.backgroundColor;

      let searchChild = nextMonthDate.children[1]
      searchChild.classList.add("fatParent");
      searchChild.id = "I-12";
      searchChild.nextElementSibling.remove();
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_I34){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_I34.date+"_"+dayWithSubj_I34.period;
      subjDiv.innerHTML = dayWithSubj_I34.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_I34.backgroundColor;

      if(nextMonthDate.children[1].id === "I-1"){
        let searchChild = nextMonthDate.children[3];
        searchChild.classList.add("fatParent");
        nextMonthDate.children[3].id = "I-34";
        nextMonthDate.children[4].remove();
        searchChild.appendChild(subjDiv);
      }else{
        let searchChild = nextMonthDate.children[2];
        searchChild.classList.add("fatParent");
        nextMonthDate.children[2].id = "I-34";
        nextMonthDate.children[3].remove();
        searchChild.appendChild(subjDiv);
        }
    }
    if (dayWithSubj_II12){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_II12.date+"_"+dayWithSubj_II12.period;
      subjDiv.innerHTML = dayWithSubj_II12.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II12.backgroundColor;
      let searchChild = nextMonthDate.children[nextMonthDate.children.length-4];
      searchChild.classList.add("fatParent");
      searchChild.id = "II-12";
      searchChild.nextElementSibling.remove();
      searchChild.appendChild(subjDiv);
    }
    if (dayWithSubj_II34){
      const subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_II34.date+"_"+dayWithSubj_II34.period;
      subjDiv.innerHTML = dayWithSubj_II34.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_II34.backgroundColor;
      let searchChild = nextMonthDate.children[nextMonthDate.children.length-2];
      searchChild.classList.add("fatParent");
      searchChild.id = "II-34";
      searchChild.nextElementSibling.remove();
      searchChild.appendChild(subjDiv);
    }
    if (dayWithHoliday){
      for(let i=9; i--;){
        if(nextMonthDate.children[i] !== nextMonthDate.children[0]){
          nextMonthDate.children[i].remove();
        }
      }
      const holidayLocation = document.createElement('div');
      holidayLocation.classList.add('holidayLocation');
      holidayLocation.style.backgroundColor = '#f5f5f5';
      nextMonthDate.appendChild(holidayLocation);
      const holidayItem = document.createElement('div');
      holidayItem.classList.add('holidayItem');
      holidayItem.id = dayWithHoliday.id;
      holidayItem.innerHTML = dayWithHoliday.decoration;
      holidayItem.style.backgroundColor = dayWithHoliday.backgroundColor;
      holidayLocation.appendChild(holidayItem);
    }
  }

}

initButtons();
load();