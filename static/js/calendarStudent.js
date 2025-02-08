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
let holiday = document.getElementById('holiday');
let dropdown = document.getElementById('dropdown');
let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : [];
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
const hamburger3 = document.getElementById('ハンバーガー3');


//mousedownしたときのｘ座標をdragStartXとして取得　なおwindow全体から取得できる
window.addEventListener('mousedown', function getCoordinate(e){
  dragStartX = e.clientX;
  dragStartY = e.clientY;
});

hamburger1.addEventListener("click", () => {
  if(hamburger1.innerText === "土日を表示"){
    hamburger1.innerText = "土日を削除";
  }else{
    hamburger1.innerText = "土日を表示";
  }
  hamburgerStorage = {
    I: hamburger1.innerText,
    II: hamburger2.innerText,
    // III: hamburger3.innerText,
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
    // III: hamburger3.innerText,
  };
  localStorage.setItem('hamburgerStorage', JSON.stringify(hamburgerStorage));
  load();
});

// hamburger3.addEventListener("click", () => {
// });

const getClass = (e) => {
  itemClass = e.target.className;
  // if(itemClass === ""){
  //   itemClass = e.target.closest("[draggable='true']").className;
  // }

  itemTargetParent = e.target.parentNode;
  if(itemTargetParent.class !== "location"){
    itemTargetParent = e.target.closest(".location");
  }
  if(itemClass === "holidayItem"){
    itemTargetParent = e.target.closest(".holidayLocation");
  }
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

function registerDate(date) {
  mouseup = date;
}

function getInfo(date,iid,value,HTML,BG){
  let childElement = document.getElementById(iid);
  id_8 = (childElement.parentNode.getAttribute('id'));
  targetDate = date;
  itemId = iid;
  itemValue = value;
  itemDeco = HTML;
  itemBG = BG;
}

// Sleep関数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

async function getFromServer(){

  if (localStorage.getItem("dataSent")) {
    return;
  }

  let userData = document.getElementById("ps").innerText +  '|';
  let monthDisplay = document.getElementById("monthDisplay").innerText;  //左上に表示されている月と年を取得(例:2月 2024)
  let year = monthDisplay.slice(monthDisplay.indexOf(' ') + 1); //スペース以降の文字列を取得
  let month = monthDisplay.slice(0,monthDisplay.indexOf('月')); //"月"より前の文字列を取得

  userData += month + '|' + year
  //送信データ例userData:2A01_two_Feb
  //httpﾘｸｴｽﾄのｲﾝｽﾀﾝｽ化、ｸﾗｲｱﾝﾄ(js)<->ｻｰﾊﾞ(python)間で通信するためのｵﾌﾞｼﾞｪｸﾄ
  val = new XMLHttpRequest();
  
  //URLを指定してPOST通信を確立～val.open('通信種類', 'ｻｰﾊﾞURL');～
  val.open('POST', '/getSchedule');
  val.send(userData);

  //ｻｰﾊﾞからﾘﾀｰﾝが帰ってきたら実行されるｲﾍﾞﾝﾄ（ﾘｽﾅｰ）
  val.onreadystatechange = () => {
    if(val.readyState === 4 && val.status === 200) {
      //responseTextﾒｿｯﾄﾞで帰ってきた文字列を取得
      //文字列の処理
      window.localStorage.setItem("userData", val.responseText);
    }
  }
}

function  calculationForLateArrivals(startTime,arrivalTime){
  const d = new Date();
  let m = startTime.split(':');
  d.setHours(+m[0], +m[1], +m[2]);
  const time1 = d.getTime();
  m = arrivalTime.split(':');
  d.setHours(+m[0], +m[1], +m[2]);
  const time2 = d.getTime();
  const caluculation = Math.abs(time1 - time2);
  let diffTime = new Date(caluculation).toISOString().slice(11, 19);
  let splitdiffTime = diffTime.split(':');
  return splitdiffTime;
}

function caluculationForBalloon(attendDiv){
  // balloon要素の幅と高さを取得
  const balloonWidth = document.getElementById('balloon').offsetWidth;
  const balloonHeight = document.getElementById('balloon').offsetHeight;

  // attendDiv要素の幅と高さを取得
  const attendDivWidth = attendDiv.offsetWidth;
  const attendDivHeight = attendDiv.offsetHeight;

  // attendDiv要素の左上の座標を取得
  const attendDivRect = attendDiv.getBoundingClientRect();
  const attendDivLeft = attendDivRect.left;
  const attendDivBottom = attendDivRect.bottom;

  // balloon要素をattendDivのbottomに配置するための座標を計算
  const balloonLeft = attendDivLeft + (attendDivWidth - balloonWidth) / 2;
  const balloonTop = attendDivBottom - balloonHeight;

  return  [balloonLeft, balloonTop];
}
// カレンダーの表示を更新するための処理を行う
// 現在の日付や指定した月の日付情報を取得して、カレンダーに反映させる。
async function load() {
  await sleep(100);
  userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : [];
  const dt = new Date();
  const eternalDt = new Date();
  
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

  // getFromServer();
  
  calendar.innerHTML = ''; 

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = `${i - paddingDays}\n`;

      daySquare.id = `${month + 1}/${i - paddingDays}/${year}`;

      const dayWithSubj_1 = userData[0].find(e => e.date === dayString && e.period.substr(e.period.indexOf('-') + 1) === '1');
      const dayWithSubj_2 = userData[0].find(e => e.date === dayString && e.period.substr(e.period.indexOf('-') + 1) === '2');
      const dayWithSubj_3 = userData[0].find(e => e.date === dayString && e.period.substr(e.period.indexOf('-') + 1) === '3');
      const dayWithSubj_4 = userData[0].find(e => e.date === dayString && e.period.substr(e.period.indexOf('-') + 1) === '4');
      const dayWithSubj_12 = userData[0].find(e => e.date === dayString && e.period.substr(e.period.indexOf('-') + 1) === '12');
      const dayWithSubj_34 = userData[0].find(e => e.date === dayString && e.period.substr(e.period.indexOf('-') + 1) === '34');
      const dayWithHoliday = userData[0].find(e => e.date === dayString && e.period === 'holiday');
      const attendance_1 = userData[1].find(e => e.date === dayString && e.period.substr(e.period.indexOf('-') + 1) === '1');
      const attendance_2 = userData[1].find(e => e.date === dayString && e.period.substr(e.period.indexOf('-') + 1) === '2');
      const attendance_3 = userData[1].find(e => e.date === dayString && e.period.substr(e.period.indexOf('-') + 1) === '3');
      const attendance_4 = userData[1].find(e => e.date === dayString && e.period.substr(e.period.indexOf('-') + 1) === '4');

      //今日の日付を目立たせる
      if (i - paddingDays === day && nav === 0) {
        daySquare.classList.add('currentDay');
        // daySquare.id = 'currentDay';
      }

      for(let x = 1; x <= 8; x++){
        const subjectLocation = document.createElement('div');
        subjectLocation.classList.add("location");

        if(x <= 4){
          subjectLocation.id = "schedule" + x;
        }else{
          subjectLocation.id = "period" + (x-4);
        }

        daySquare.appendChild(subjectLocation);
      }

      if (dayWithSubj_1){
        let dateParts = dayWithSubj_1.date.split("/");
        let month = dateParts[0]-1; //月はindexだから1引く
        let day = dateParts[1];
        let year = dateParts[2];
        let period_1 = new Date(year, month, day, 10, 30, 0); //1時限目が終わったときの時刻
        let compareDate = eternalDt > period_1;  //period_1は今現在から見て過去

        let subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.id = dayWithSubj_1.date+"_"+dayWithSubj_1.period;
        // subjDiv.innerText = dayWithSubj_1.subject;
        subjDiv.innerHTML = dayWithSubj_1.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_1.backgroundColor;
        let searchChild = daySquare.children[1];
        searchChild.appendChild(subjDiv);
        if(!attendance_1 && compareDate){
          let attendDiv = document.createElement('div');
          let searchChild = daySquare.children[daySquare.children.length-4];
          let span = document.createElement('div');
          let cross = document.createElement('img');
          attendDiv.classList.add('item');
          attendDiv.id = "attendance2";
          attendDiv.style.overflow = "hidden";
          span.innerText = "1";
          span.style.color = "yellow";
          span.style.backgroundColor = "black";
          attendDiv.appendChild(span);
          searchChild.appendChild(attendDiv);
          cross.src = "../static/img/cross.png";
          attendDiv.appendChild(cross);
        }
      }
      if (dayWithSubj_2){
        let dateParts = dayWithSubj_2.date.split("/");
        let month = dateParts[0]-1; //月はindexだから1引く
        let day = dateParts[1];
        let year = dateParts[2];
        let period_2 = new Date(year, month, day, 12, 25, 0); //2時限目が終わったときの時刻
        let compareDate = eternalDt > period_2;  //period_2は今現在から見て過去

        let subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.id = dayWithSubj_2.date+"_"+dayWithSubj_2.period;
        // subjDiv.innerText = dayWithSubj_2.subject;
        subjDiv.innerHTML = dayWithSubj_2.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_2.backgroundColor;

        let searchChild = daySquare.children[2];
        searchChild.appendChild(subjDiv);
        if(!attendance_2 && compareDate){
          let attendDiv = document.createElement('div');
          let searchChild = daySquare.children[daySquare.children.length-3];
          let span = document.createElement('div');
          let cross = document.createElement('img');
          attendDiv.classList.add('item');
          attendDiv.id = "attendance2";
          attendDiv.style.overflow = "hidden";
          span.innerText = "2";
          span.style.color = "yellow";
          span.style.backgroundColor = "black";
          attendDiv.appendChild(span);
          searchChild.appendChild(attendDiv);
          cross.src = "../static/img/cross.png";
          attendDiv.appendChild(cross);
        }
      }
      if (dayWithSubj_3){
        let dateParts = dayWithSubj_3.date.split("/");
        let month = dateParts[0]-1; //月はindexだから1引く
        let day = dateParts[1];
        let year = dateParts[2];
        let period_3 = new Date(year, month, day, 14, 40, 0); //3時限目が終わったときの時刻 
        let compareDate = eternalDt > period_3;  //period_3は今現在から見て過去

        let subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.id = dayWithSubj_3.date+"_"+dayWithSubj_3.period;
        // subjDiv.innerText = dayWithSubj_3.subject;
        subjDiv.innerHTML = dayWithSubj_3.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_3.backgroundColor;

        let searchChild = daySquare.children[3];
        searchChild.appendChild(subjDiv);

        if(!attendance_3 && compareDate){
          let attendDiv = document.createElement('div');
          let searchChild = daySquare.children[daySquare.children.length-2];
          let span = document.createElement('div');
          let cross = document.createElement('img');
          attendDiv.classList.add('item');
          attendDiv.id = "attendance2";
          attendDiv.style.overflow = "hidden";
          span.innerText = "3";
          span.style.color = "yellow";
          span.style.backgroundColor = "black";
          attendDiv.appendChild(span);
          searchChild.appendChild(attendDiv);
          cross.src = "../static/img/cross.png";
          attendDiv.appendChild(cross);
        }
      }
      if (dayWithSubj_4){
        let dateParts = dayWithSubj_4.date.split("/");
        let month = dateParts[0]-1; //月はindexだから1引く
        let day = dateParts[1];
        let year = dateParts[2];
        let period_4 = new Date(year, month, day, 16, 25, 0); //4時限目が終わったときの時刻 
        let compareDate = eternalDt > period_4;  //period_4は今現在から見て過去

        let subjDiv = document.createElement('div');
        subjDiv.classList.add('item');
        subjDiv.id = dayWithSubj_4.date+"_"+dayWithSubj_4.period;
        // subjDiv.innerText = dayWithSubj_4.subject;
        subjDiv.innerHTML = dayWithSubj_4.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_4.backgroundColor;
        let searchChild = daySquare.children[4];
        searchChild.appendChild(subjDiv);

        if(!attendance_4 && compareDate){
          let attendDiv = document.createElement('div');
          let searchChild = daySquare.children[daySquare.children.length-1];
          let span = document.createElement('div');
          let cross = document.createElement('img');
          attendDiv.classList.add('item');
          attendDiv.id = "attendance2";
          attendDiv.style.overflow = "hidden";
          span.innerText = "4";
          span.style.color = "yellow";
          span.style.backgroundColor = "black";
          attendDiv.appendChild(span);
          searchChild.appendChild(attendDiv);
          cross.src = "../static/img/cross.png";
          attendDiv.appendChild(cross);
        }
      }
      if (dayWithSubj_12){
        let dateParts = dayWithSubj_12.date.split("/");
        let month = dateParts[0]-1; //月はindexだから1引く
        let day = dateParts[1];
        let year = dateParts[2];
        let period_1 = new Date(year, month, day, 10, 30, 0); //1時限目が終わったときの時刻
        let period_2 = new Date(year, month, day, 12, 15, 0); //2時限目が終わったときの時刻
        let compareDate1 = eternalDt > period_1;  //period_1は今現在から見て過去
        let compareDate2 = eternalDt > period_2;  //period_2は今現在から見て過去

        let subjDiv = document.createElement('div');
        subjDiv.classList.add('bigItem');
        subjDiv.id = dayWithSubj_12.date+"_"+dayWithSubj_12.period;
        // subjDiv.innerHTML = dayWithSubj_12.subject;
        subjDiv.innerHTML = dayWithSubj_12.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_12.backgroundColor;

        let searchChild = daySquare.children[1]
        searchChild.classList.add("fatParent");
        searchChild.id = dayWithSubj_12.period;
        searchChild.nextElementSibling.remove();
        searchChild.appendChild(subjDiv);
        if(!attendance_1 && compareDate1){
          let attendDiv = document.createElement('div');
          let searchChild = daySquare.children[daySquare.children.length-4];
          let span = document.createElement('div');
          let cross = document.createElement('img');
          attendDiv.classList.add('item');
          attendDiv.id = "attendance2";
          attendDiv.style.overflow = "hidden";
          span.innerText = "1";
          span.style.color = "yellow";
          span.style.backgroundColor = "black";
          attendDiv.appendChild(span);
          searchChild.appendChild(attendDiv);
          cross.src = "../static/img/cross.png";
          attendDiv.appendChild(cross);
        }
        if(!attendance_2 && compareDate2){
          let attendDiv = document.createElement('div');
          let searchChild = daySquare.children[daySquare.children.length-3];
          let span = document.createElement('div');
          let cross = document.createElement('img');
          attendDiv.classList.add('item');
          attendDiv.id = "attendance2";
          attendDiv.style.overflow = "hidden";
          span.innerText = "2";
          span.style.color = "yellow";
          span.style.backgroundColor = "black";
          attendDiv.appendChild(span);
          searchChild.appendChild(attendDiv);
          cross.src = "../static/img/cross.png";
          attendDiv.appendChild(cross);
        }
      }
      if (dayWithSubj_34){
        let dateParts = dayWithSubj_34.date.split("/");
        let month = dateParts[0]-1; //月はindexだから1引く
        let day = dateParts[1];
        let year = dateParts[2];
        let period_3 = new Date(year, month, day, 14, 40, 0); //3時限目が終わったときの時刻
        let period_4 = new Date(year, month, day, 16, 25, 0); //4時限目が終わったときの時刻
        let compareDate3 = eternalDt > period_3;  //period_3は今現在から見て過去
        let compareDate4 = eternalDt > period_4;  //period_4は今現在から見て過去

        let subjDiv = document.createElement('div');
        subjDiv.classList.add('bigItem');
        subjDiv.id = dayWithSubj_34.date+"_"+dayWithSubj_34.period;
        // subjDiv.innerHTML = dayWithSubj_34.subject;
        subjDiv.innerHTML =  dayWithSubj_34.decoration;
        subjDiv.style.backgroundColor = dayWithSubj_34.backgroundColor;

        // if(daySquare.children[1].id.substr(daySquare.children[1].id.indexOf('-') + 1) === "1"){
        if(daySquare.children[1].id === "schedule1"){
          let searchChild = daySquare.children[3];
          searchChild.classList.add("fatParent");
          daySquare.children[3].id = dayWithSubj_34.period;
          daySquare.children[4].remove();
          searchChild.appendChild(subjDiv);
        }else{
          let searchChild = daySquare.children[2];
          searchChild.classList.add("fatParent");
          daySquare.children[2].id = dayWithSubj_34.period;
          daySquare.children[3].remove();
          searchChild.appendChild(subjDiv);
        }
        if(!attendance_3 && compareDate3){
          let attendDiv = document.createElement('div');
          let searchChild = daySquare.children[daySquare.children.length-2];
          let span = document.createElement('div');
          let cross = document.createElement('img');
          attendDiv.classList.add('item');
          attendDiv.id = "attendance2";
          attendDiv.style.overflow = "hidden";
          span.innerText = "3";
          span.style.color = "yellow";
          span.style.backgroundColor = "black";
          attendDiv.appendChild(span);
          searchChild.appendChild(attendDiv);
          cross.src = "../static/img/cross.png";
          attendDiv.appendChild(cross);
        }
        if(!attendance_4 && compareDate4){
          let attendDiv = document.createElement('div');
          let searchChild = daySquare.children[daySquare.children.length-1];
          let span = document.createElement('div');
          let cross = document.createElement('img');
          attendDiv.classList.add('item');
          attendDiv.id = "attendance2";
          attendDiv.style.overflow = "hidden";
          span.innerText = "4";
          span.style.color = "yellow";
          span.style.backgroundColor = "black";
          attendDiv.appendChild(span);
          searchChild.appendChild(attendDiv);
          cross.src = "../static/img/cross.png";
          attendDiv.appendChild(cross);
        }
      }
      if (dayWithHoliday){
        for(let i=9; i--;){
          if(daySquare.children[i] !== daySquare.children[0]){
            daySquare.children[i].remove();
          }
        }
        const holidayLocation = document.createElement('div');
        holidayLocation.classList.add('holidayLocation');
        daySquare.appendChild(holidayLocation);

        const holidayItem = document.createElement('div');
        holidayItem.classList.add('holidayItem');
        holidayItem.id = dayWithHoliday.id;
        // holidayItem.innerHTML = dayWithHoliday.subject;
        holidayItem.innerHTML = dayWithHoliday.decoration;
        holidayItem.style.backgroundColor = dayWithHoliday.backgroundColor;
        holidayLocation.appendChild(holidayItem);
      }
      if (attendance_1){
        const attendDiv = document.createElement('div');
        const searchChild = daySquare.children[daySquare.children.length-4];
        attendDiv.classList.add('item');
        attendDiv.id = "attendance1";
        const span = document.createElement('div');
        span.innerText = "1";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.style.overflow = "hidden";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);

        if(attendance_1.subject === "〇"){
          let circle = document.createElement('img');
          circle.src = "../static/img/circle.png";
          attendDiv.appendChild(circle);
        }else{
          let triangle = document.createElement('img');
          triangle.src = "../static/img/triangle.png";
          attendDiv.appendChild(triangle);

          let startTime = "8:50:00";
          let arrivalTime = attendance_1.time;
          let splitTime = attendance_1.time.split(':');
          let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

          triangle.addEventListener('mouseover',function (){
            balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"8時50分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
            let balloonSize = caluculationForBalloon(attendDiv);
            document.getElementById('balloon').style.left=balloonSize[0]+"px";
            document.getElementById('balloon').style.top=balloonSize[1]+"px";
            document.getElementById('balloon').style.display="block";
          });
          attendDiv.addEventListener('mouseleave',function (e){
            document.getElementById('balloon').style.display="none";
          });
        }
      }
      if (attendance_2){
        const attendDiv = document.createElement('div');
        const searchChild = daySquare.children[daySquare.children.length-3];
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        const span = document.createElement('div');
        span.innerText = "2";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.style.overflow = "hidden";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);

        if(attendance_2.subject === "〇"){
          let circle = document.createElement('img');
          circle.src = "../static/img/circle.png";
          attendDiv.appendChild(circle);
        }else{
          let triangle = document.createElement('img');
          triangle.src = "../static/img/triangle.png";
          attendDiv.appendChild(triangle);

          let startTime = "10:35:00";
          let arrivalTime = attendance_2.time;
          let splitTime = attendance_2.time.split(':');
          let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

          triangle.addEventListener('mouseover',function (){
            balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"10時35分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
            let balloonSize = caluculationForBalloon(attendDiv);
            document.getElementById('balloon').style.left=balloonSize[0]+"px";
            document.getElementById('balloon').style.top=balloonSize[1]+"px";
            document.getElementById('balloon').style.display="block";
          });
          attendDiv.addEventListener('mouseleave',function (e){
            document.getElementById('balloon').style.display="none";
          });
        }
      }
      if (attendance_3){
        const attendDiv = document.createElement('div');
        const searchChild = daySquare.children[daySquare.children.length-2];
        attendDiv.classList.add('item');
        attendDiv.id = "attendance3";
        const span = document.createElement('div');
        span.innerText = "3";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.style.overflow = "hidden";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);

        if(attendance_3.subject === "〇"){
          let circle = document.createElement('img');
          circle.src = "../static/img/circle.png";
          attendDiv.appendChild(circle);
        }else{
          let triangle = document.createElement('img');
          triangle.src = "../static/img/triangle.png";
          attendDiv.appendChild(triangle);

          let startTime = "13:00:00";
          let arrivalTime = attendance_3.time;
          let splitTime = attendance_3.time.split(':');
          let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

          triangle.addEventListener('mouseover',function (){
            balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"13時00分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
            let balloonSize = caluculationForBalloon(attendDiv);
            document.getElementById('balloon').style.left=balloonSize[0]+"px";
            document.getElementById('balloon').style.top=balloonSize[1]+"px";
            document.getElementById('balloon').style.display="block";
          });
          attendDiv.addEventListener('mouseleave',function (e){
            document.getElementById('balloon').style.display="none";
          });
        }

      }
      if (attendance_4){
        const attendDiv = document.createElement('div');
        const searchChild = daySquare.children[daySquare.children.length-1];
        attendDiv.classList.add('item');
        attendDiv.id = "attendance4";
        const span = document.createElement('div');
        span.innerText = "4";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.style.overflow = "hidden";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        if(attendance_4.subject === "〇"){
          let circle = document.createElement('img');
          circle.src = "../static/img/circle.png";
          attendDiv.appendChild(circle);
        }else{
          let triangle = document.createElement('img');
          triangle.src = "../static/img/triangle.png";
          attendDiv.appendChild(triangle);

          let startTime = "14:45:00";
          let arrivalTime = attendance_4.time;
          let splitTime = attendance_4.time.split(':');
          let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

          triangle.addEventListener('mouseover',function (){
            balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"14時45分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
            let balloonSize = caluculationForBalloon(attendDiv);
            document.getElementById('balloon').style.left=balloonSize[0]+"px";
            document.getElementById('balloon').style.top=balloonSize[1]+"px";
            document.getElementById('balloon').style.display="block";
          });
          attendDiv.addEventListener('mouseleave',function (e){
            document.getElementById('balloon').style.display="none";
          });
        }
      }
      // daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }
    calendar.appendChild(daySquare);
    lastDate = calendar.children[paddingDays + daysInMonth-1];
  }//ここまで　for(let i = 1; i <= paddingDays + daysInMonth; i++)

  //一番最初のハンバーガーメニューのtext
  if(!hamburgerStorage.I){
    hamburgerStorage = {
      I: "土日を削除",
      II: "前月、翌月の日を削除",
    };
  }
  //ハンバーガーのtextをhamburgerStorageから取得
  hamburger1.innerText = hamburgerStorage.I;
  hamburger2.innerText = hamburgerStorage.II;
  // hamburger3.innerText = hamburgerStorage.III;

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

  for (const location of locations) {
    if (!location.parentNode.classList.contains('fade')){
      location.addEventListener("dragenter", handleDragEnter, false);
      location.addEventListener("dragleave", handleDragLeave, false);
      location.addEventListener("dragover", handleDragOver, false);
    }
  }
} //load()

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

//土日を削除
function removeSatSun(){
  const indexes = [0, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41];
  document.getElementById("Sat").innerText = '';
  document.getElementById("Sun").innerText = '';
  //  ↓↓↓ ”許容できるエラー”の削除
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
    });
  }catch(e){
    //例外が発生した場合の処理
  }
}

//前、翌月の日を表示
function displayPreNexDate(){
  const eternalDt = new Date();
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

    const dayWithSubj_1 = userData[0].find(e => e.date === previousMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '1');
    const dayWithSubj_2 = userData[0].find(e => e.date === previousMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '2');
    const dayWithSubj_3 = userData[0].find(e => e.date === previousMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '3');
    const dayWithSubj_4 = userData[0].find(e => e.date === previousMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '4');
    const dayWithSubj_12 = userData[0].find(e => e.date === previousMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '12');
    const dayWithSubj_34 = userData[0].find(e => e.date === previousMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '34');
    const attendance_1 = userData[1].find(e => e.date === previousMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '1');
    const attendance_2 = userData[1].find(e => e.date === previousMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '2');
    const attendance_3 = userData[1].find(e => e.date === previousMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '3');
    const attendance_4 = userData[1].find(e => e.date === previousMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '4');
    const dayWithHoliday = userData[0].find(e => e.date === previousMonthDate.id && e.period === 'holiday');


    if (dayWithSubj_1){
      let dateParts = dayWithSubj_1.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_1 = new Date(year, month, day, 10, 30, 0); //1時限目が終わったときの時刻
      let compareDate = eternalDt > period_1;  //period_1は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_1.date+"_"+dayWithSubj_1.period;
      // subjDiv.innerText = dayWithSubj_1.subject;
      subjDiv.innerHTML = dayWithSubj_1.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_1.backgroundColor;
      let searchChild = previousMonthDate.children[1];
      searchChild.appendChild(subjDiv);
      if(!attendance_1 && compareDate){
        let attendDiv = document.createElement('div');
        let searchChild = previousMonthDate.children[previousMonthDate.children.length-4];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "1";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
    }
    if (dayWithSubj_2){
      let dateParts = dayWithSubj_2.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_2 = new Date(year, month, day, 12, 25, 0); //2時限目が終わったときの時刻
      let compareDate = eternalDt > period_2;  //period_2は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_2.date+"_"+dayWithSubj_2.period;
      // subjDiv.innerText = dayWithSubj_2.subject;
      subjDiv.innerHTML = dayWithSubj_2.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_2.backgroundColor;

      let searchChild = previousMonthDate.children[2];
      searchChild.appendChild(subjDiv);
      if(!attendance_2 && compareDate){
        let attendDiv = document.createElement('div');
        let searchChild = previousMonthDate.children[previousMonthDate.children.length-3];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "2";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
    }
    if (dayWithSubj_3){
      let dateParts = dayWithSubj_3.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_3 = new Date(year, month, day, 14, 40, 0); //3時限目が終わったときの時刻 
      let compareDate = eternalDt > period_3;  //period_3は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_3.date+"_"+dayWithSubj_3.period;
      // subjDiv.innerText = dayWithSubj_3.subject;
      subjDiv.innerHTML = dayWithSubj_3.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_3.backgroundColor;

      let searchChild = previousMonthDate.children[3];
      searchChild.appendChild(subjDiv);

      if(!attendance_3 && compareDate){
        let attendDiv = document.createElement('div');
        let searchChild = previousMonthDate.children[previousMonthDate.children.length-2];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "3";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
    }
    if (dayWithSubj_4){
      let dateParts = dayWithSubj_4.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_4 = new Date(year, month, day, 16, 25, 0); //4時限目が終わったときの時刻 
      let compareDate = eternalDt > period_4;  //period_4は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_4.date+"_"+dayWithSubj_4.period;
      // subjDiv.innerText = dayWithSubj_4.subject;
      subjDiv.innerHTML = dayWithSubj_4.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_4.backgroundColor;
      let searchChild = previousMonthDate.children[4];
      searchChild.appendChild(subjDiv);

      if(!attendance_4 && compareDate){
        let attendDiv = document.createElement('div');
        let searchChild = previousMonthDate.children[previousMonthDate.children.length-1];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "4";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
    }
    if (dayWithSubj_12){
      let dateParts = dayWithSubj_12.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_1 = new Date(year, month, day, 10, 30, 0); //1時限目が終わったときの時刻
      let period_2 = new Date(year, month, day, 12, 15, 0); //2時限目が終わったときの時刻
      let compareDate1 = eternalDt > period_1;  //period_1は今現在から見て過去
      let compareDate2 = eternalDt > period_2;  //period_2は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_12.date+"_"+dayWithSubj_12.period;
      // subjDiv.innerHTML = dayWithSubj_12.subject;
      subjDiv.innerHTML = dayWithSubj_12.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_12.backgroundColor;

      let searchChild = previousMonthDate.children[1]
      searchChild.classList.add("fatParent");
      searchChild.id = dayWithSubj_12.period;
      searchChild.nextElementSibling.remove();
      searchChild.appendChild(subjDiv);
      if(!attendance_1 && compareDate1){
        let attendDiv = document.createElement('div');
        let searchChild = previousMonthDate.children[previousMonthDate.children.length-4];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "1";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
      if(!attendance_2 && compareDate2){
        let attendDiv = document.createElement('div');
        let searchChild = previousMonthDate.children[previousMonthDate.children.length-3];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "2";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
    }
    if (dayWithSubj_34){
      let dateParts = dayWithSubj_34.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_3 = new Date(year, month, day, 14, 40, 0); //3時限目が終わったときの時刻
      let period_4 = new Date(year, month, day, 16, 25, 0); //4時限目が終わったときの時刻
      let compareDate3 = eternalDt > period_3;  //period_3は今現在から見て過去
      let compareDate4 = eternalDt > period_4;  //period_4は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_34.date+"_"+dayWithSubj_34.period;
      // subjDiv.innerHTML = dayWithSubj_34.subject;
      subjDiv.innerHTML = dayWithSubj_34.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_34.backgroundColor;

      if(previousMonthDate.children[1].id.substr(previousMonthDate.children[1].id.indexOf('-') + 1) === "1"){
        let searchChild = previousMonthDate.children[3];
        searchChild.classList.add("fatParent");
        previousMonthDate.children[3].id = dayWithSubj_34.period;
        previousMonthDate.children[4].remove();
        searchChild.appendChild(subjDiv);
      }else{
        let searchChild = previousMonthDate.children[2];
        searchChild.classList.add("fatParent");
        previousMonthDate.children[2].id = dayWithSubj_34.period;
        previousMonthDate.children[3].remove();
        searchChild.appendChild(subjDiv);
      }
      if(!attendance_3 && compareDate3){
        let attendDiv = document.createElement('div');
        let searchChild = previousMonthDate.children[previousMonthDate.children.length-2];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "3";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
      if(!attendance_4 && compareDate4){
        let attendDiv = document.createElement('div');
        let searchChild = previousMonthDate.children[previousMonthDate.children.length-1];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "4";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
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
      // holidayItem.innerHTML = dayWithHoliday.subject;
      holidayItem.innerHTML = dayWithHoliday.decoration;
      holidayItem.style.backgroundColor = dayWithHoliday.backgroundColor;
      holidayLocation.appendChild(holidayItem);
    }
    if (attendance_1){
      const attendDiv = document.createElement('div');
      const searchChild = previousMonthDate.children[previousMonthDate.children.length-4];
      attendDiv.classList.add('item');
      attendDiv.id = "attendance1";
      const span = document.createElement('div');
      span.innerText = "1";
      span.style.color = "yellow";
      span.style.backgroundColor = "black";
      attendDiv.style.overflow = "hidden";
      attendDiv.appendChild(span);
      searchChild.appendChild(attendDiv);

      if(attendance_1.subject === "〇"){
        let circle = document.createElement('img');
        circle.src = "../static/img/circle.png";
        attendDiv.appendChild(circle);
      }else{
        let triangle = document.createElement('img');
        triangle.src = "../static/img/triangle.png";
        attendDiv.appendChild(triangle);

        let startTime = "8:50:00";
        let arrivalTime = attendance_1.time;
        let splitTime = attendance_1.time.split(':');
        let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

        triangle.addEventListener('mouseover',function (){
          balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"8時50分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
          let balloonSize = caluculationForBalloon(attendDiv);
          document.getElementById('balloon').style.left=balloonSize[0]+"px";
          document.getElementById('balloon').style.top=balloonSize[1]+"px";
          document.getElementById('balloon').style.display="block";
        });
        attendDiv.addEventListener('mouseleave',function (e){
          document.getElementById('balloon').style.display="none";
        });
      }
    }
    if (attendance_2){
      const attendDiv = document.createElement('div');
      const searchChild = previousMonthDate.children[previousMonthDate.children.length-3];
      attendDiv.classList.add('item');
      attendDiv.id = "attendance2";
      const span = document.createElement('div');
      span.innerText = "2";
      span.style.color = "yellow";
      span.style.backgroundColor = "black";
      attendDiv.style.overflow = "hidden";
      attendDiv.appendChild(span);
      searchChild.appendChild(attendDiv);

      if(attendance_2.subject === "〇"){
        let circle = document.createElement('img');
        circle.src = "../static/img/circle.png";
        attendDiv.appendChild(circle);
      }else{
        let triangle = document.createElement('img');
        triangle.src = "../static/img/triangle.png";
        attendDiv.appendChild(triangle);

        let startTime = "10:35:00";
        let arrivalTime = attendance_2.time;
        let splitTime = attendance_2.time.split(':');
        let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

        triangle.addEventListener('mouseover',function (){
          balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"10時35分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
          let balloonSize = caluculationForBalloon(attendDiv);
          document.getElementById('balloon').style.left=balloonSize[0]+"px";
          document.getElementById('balloon').style.top=balloonSize[1]+"px";
          document.getElementById('balloon').style.display="block";
        });
        attendDiv.addEventListener('mouseleave',function (e){
          document.getElementById('balloon').style.display="none";
        });
      }
    }
    if (attendance_3){
      const attendDiv = document.createElement('div');
      const searchChild = previousMonthDate.children[previousMonthDate.children.length-2];
      attendDiv.classList.add('item');
      attendDiv.id = "attendance3";
      const span = document.createElement('div');
      span.innerText = "3";
      span.style.color = "yellow";
      span.style.backgroundColor = "black";
      attendDiv.style.overflow = "hidden";
      attendDiv.appendChild(span);
      searchChild.appendChild(attendDiv);

      if(attendance_3.subject === "〇"){
        let circle = document.createElement('img');
        circle.src = "../static/img/circle.png";
        attendDiv.appendChild(circle);
      }else{
        let triangle = document.createElement('img');
        triangle.src = "../static/img/triangle.png";
        attendDiv.appendChild(triangle);

        let startTime = "13:00:00";
        let arrivalTime = attendance_3.time;
        let splitTime = attendance_3.time.split(':');
        let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

        triangle.addEventListener('mouseover',function (){
          balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"13時00分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
          let balloonSize = caluculationForBalloon(attendDiv);
          document.getElementById('balloon').style.left=balloonSize[0]+"px";
          document.getElementById('balloon').style.top=balloonSize[1]+"px";
          document.getElementById('balloon').style.display="block";
        });
        attendDiv.addEventListener('mouseleave',function (e){
          document.getElementById('balloon').style.display="none";
        });
      }

    }
    if (attendance_4){
      const attendDiv = document.createElement('div');
      const searchChild = previousMonthDate.children[previousMonthDate.children.length-1];
      attendDiv.classList.add('item');
      attendDiv.id = "attendance4";
      const span = document.createElement('div');
      span.innerText = "4";
      span.style.color = "yellow";
      span.style.backgroundColor = "black";
      attendDiv.style.overflow = "hidden";
      attendDiv.appendChild(span);
      searchChild.appendChild(attendDiv);
      if(attendance_4.subject === "〇"){
        let circle = document.createElement('img');
        circle.src = "../static/img/circle.png";
        attendDiv.appendChild(circle);
      }else{
        let triangle = document.createElement('img');
        triangle.src = "../static/img/triangle.png";
        attendDiv.appendChild(triangle);

        let startTime = "14:45:00";
        let arrivalTime = attendance_4.time;
        let splitTime = attendance_4.time.split(':');
        let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

        triangle.addEventListener('mouseover',function (){
          balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"14時45分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
          let balloonSize = caluculationForBalloon(attendDiv);
          document.getElementById('balloon').style.left=balloonSize[0]+"px";
          document.getElementById('balloon').style.top=balloonSize[1]+"px";
          document.getElementById('balloon').style.display="block";
        });
        attendDiv.addEventListener('mouseleave',function (e){
          document.getElementById('balloon').style.display="none";
        });
      }
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

    const dayWithSubj_1 = userData[0].find(e => e.date === nextMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '1');
    const dayWithSubj_2 = userData[0].find(e => e.date === nextMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '2');
    const dayWithSubj_3 = userData[0].find(e => e.date === nextMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '3');
    const dayWithSubj_4 = userData[0].find(e => e.date === nextMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '4');
    const dayWithSubj_12 = userData[0].find(e => e.date === nextMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '12');
    const dayWithSubj_34 = userData[0].find(e => e.date === nextMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '34');
    const attendance_1 = userData[1].find(e => e.date === nextMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '1');
    const attendance_2 = userData[1].find(e => e.date === nextMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '2');
    const attendance_3 = userData[1].find(e => e.date === nextMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '3');
    const attendance_4 = userData[1].find(e => e.date === nextMonthDate.id && e.period.substr(e.period.indexOf('-') + 1) === '4');
    const dayWithHoliday = userData[0].find(e => e.date === nextMonthDate.id && e.period === 'holiday');

    if (dayWithSubj_1){
      let dateParts = dayWithSubj_1.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_1 = new Date(year, month, day, 10, 30, 0); //1時限目が終わったときの時刻
      let compareDate = eternalDt > period_1;  //period_1は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_1.date+"_"+dayWithSubj_1.period;
      // subjDiv.innerText = dayWithSubj_1.subject;
      subjDiv.innerHTML = dayWithSubj_1.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_1.backgroundColor;
      let searchChild = nextMonthDate.children[1];
      searchChild.appendChild(subjDiv);
      if(!attendance_1 && compareDate){
        let attendDiv = document.createElement('div');
        let searchChild = nextMonthDate.children[nextMonthDate.children.length-4];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "1";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
    }
    if (dayWithSubj_2){
      let dateParts = dayWithSubj_2.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_2 = new Date(year, month, day, 12, 25, 0); //2時限目が終わったときの時刻
      let compareDate = eternalDt > period_2;  //period_2は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_2.date+"_"+dayWithSubj_2.period;
      // subjDiv.innerText = dayWithSubj_2.subject;
      subjDiv.innerHTML = dayWithSubj_2.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_2.backgroundColor;

      let searchChild = nextMonthDate.children[2];
      searchChild.appendChild(subjDiv);
      if(!attendance_2 && compareDate){
        let attendDiv = document.createElement('div');
        let searchChild = nextMonthDate.children[nextMonthDate.children.length-3];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "2";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
    }
    if (dayWithSubj_3){
      let dateParts = dayWithSubj_3.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_3 = new Date(year, month, day, 14, 40, 0); //3時限目が終わったときの時刻 
      let compareDate = eternalDt > period_3;  //period_3は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_3.date+"_"+dayWithSubj_3.period;
      // subjDiv.innerText = dayWithSubj_3.subject;
      subjDiv.innerHTML = dayWithSubj_3.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_3.backgroundColor;

      let searchChild = nextMonthDate.children[3];
      searchChild.appendChild(subjDiv);

      if(!attendance_3 && compareDate){
        let attendDiv = document.createElement('div');
        let searchChild = nextMonthDate.children[nextMonthDate.children.length-2];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "3";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
    }
    if (dayWithSubj_4){
      let dateParts = dayWithSubj_4.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_4 = new Date(year, month, day, 16, 25, 0); //4時限目が終わったときの時刻 
      let compareDate = eternalDt > period_4;  //period_4は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('item');
      subjDiv.id = dayWithSubj_4.date+"_"+dayWithSubj_4.period;
      // subjDiv.innerText = dayWithSubj_4.subject;
      subjDiv.innerHTML = dayWithSubj_4.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_4.backgroundColor;
      let searchChild = nextMonthDate.children[4];
      searchChild.appendChild(subjDiv);

      if(!attendance_4 && compareDate){
        let attendDiv = document.createElement('div');
        let searchChild = nextMonthDate.children[nextMonthDate.children.length-1];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "4";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
    }
    if (dayWithSubj_12){
      let dateParts = dayWithSubj_12.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_1 = new Date(year, month, day, 10, 30, 0); //1時限目が終わったときの時刻
      let period_2 = new Date(year, month, day, 12, 15, 0); //2時限目が終わったときの時刻
      let compareDate1 = eternalDt > period_1;  //period_1は今現在から見て過去
      let compareDate2 = eternalDt > period_2;  //period_2は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_12.date+"_"+dayWithSubj_12.period;
      // subjDiv.innerHTML = dayWithSubj_12.subject;
      subjDiv.innerHTML = dayWithSubj_12.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_12.backgroundColor;

      let searchChild = nextMonthDate.children[1]
      searchChild.classList.add("fatParent");
      searchChild.id = dayWithSubj_12.period;
      searchChild.nextElementSibling.remove();
      searchChild.appendChild(subjDiv);
      if(!attendance_1 && compareDate1){
        let attendDiv = document.createElement('div');
        let searchChild = nextMonthDate.children[nextMonthDate.children.length-4];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "1";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
      if(!attendance_2 && compareDate2){
        let attendDiv = document.createElement('div');
        let searchChild = nextMonthDate.children[nextMonthDate.children.length-3];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "2";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
    }
    if (dayWithSubj_34){
      let dateParts = dayWithSubj_34.date.split("/");
      let month = dateParts[0]-1; //月はindexだから1引く
      let day = dateParts[1];
      let year = dateParts[2];
      let period_3 = new Date(year, month, day, 14, 40, 0); //3時限目が終わったときの時刻
      let period_4 = new Date(year, month, day, 16, 25, 0); //4時限目が終わったときの時刻
      let compareDate3 = eternalDt > period_3;  //period_3は今現在から見て過去
      let compareDate4 = eternalDt > period_4;  //period_4は今現在から見て過去

      let subjDiv = document.createElement('div');
      subjDiv.classList.add('bigItem');
      subjDiv.id = dayWithSubj_34.date+"_"+dayWithSubj_34.period;
      // subjDiv.innerHTML = dayWithSubj_34.subject;
      subjDiv.innerHTML = dayWithSubj_34.decoration;
      subjDiv.style.backgroundColor = dayWithSubj_34.backgroundColor;

      if(nextMonthDate.children[1].id.substr(nextMonthDate.children[1].id.indexOf('-') + 1) === "1"){
        let searchChild = nextMonthDate.children[3];
        searchChild.classList.add("fatParent");
        nextMonthDate.children[3].id = dayWithSubj_34.period;
        nextMonthDate.children[4].remove();
        searchChild.appendChild(subjDiv);
      }else{
        let searchChild = nextMonthDate.children[2];
        searchChild.classList.add("fatParent");
        nextMonthDate.children[2].id = dayWithSubj_34.period;
        nextMonthDate.children[3].remove();
        searchChild.appendChild(subjDiv);
      }
      if(!attendance_3 && compareDate3){
        let attendDiv = document.createElement('div');
        let searchChild = nextMonthDate.children[nextMonthDate.children.length-2];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "3";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
      if(!attendance_4 && compareDate4){
        let attendDiv = document.createElement('div');
        let searchChild = nextMonthDate.children[nextMonthDate.children.length-1];
        let span = document.createElement('div');
        let cross = document.createElement('img');
        attendDiv.classList.add('item');
        attendDiv.id = "attendance2";
        attendDiv.style.overflow = "hidden";
        span.innerText = "4";
        span.style.color = "yellow";
        span.style.backgroundColor = "black";
        attendDiv.appendChild(span);
        searchChild.appendChild(attendDiv);
        cross.src = "../static/img/cross.png";
        attendDiv.appendChild(cross);
      }
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
      // holidayItem.innerHTML = dayWithHoliday.subject;
      holidayItem.innerHTML = dayWithHoliday.decoration;
      holidayItem.style.backgroundColor = dayWithHoliday.backgroundColor;
      holidayLocation.appendChild(holidayItem);
    }
    if (attendance_1){
      const attendDiv = document.createElement('div');
      const searchChild = nextMonthDate.children[nextMonthDate.children.length-4];
      attendDiv.classList.add('item');
      attendDiv.id = "attendance1";
      const span = document.createElement('div');
      span.innerText = "1";
      span.style.color = "yellow";
      span.style.backgroundColor = "black";
      attendDiv.style.overflow = "hidden";
      attendDiv.appendChild(span);
      searchChild.appendChild(attendDiv);

      if(attendance_1.subject === "〇"){
        let circle = document.createElement('img');
        circle.src = "../static/img/circle.png";
        attendDiv.appendChild(circle);
      }else{
        let triangle = document.createElement('img');
        triangle.src = "../static/img/triangle.png";
        attendDiv.appendChild(triangle);

        let startTime = "8:50:00";
        let arrivalTime = attendance_1.time;
        let splitTime = attendance_1.time.split(':');
        let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

        triangle.addEventListener('mouseover',function (){
          balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"8時50分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
          let balloonSize = caluculationForBalloon(attendDiv);
          document.getElementById('balloon').style.left=balloonSize[0]+"px";
          document.getElementById('balloon').style.top=balloonSize[1]+"px";
          document.getElementById('balloon').style.display="block";
        });
        attendDiv.addEventListener('mouseleave',function (e){
          document.getElementById('balloon').style.display="none";
        });
      }
    }
    if (attendance_2){
      const attendDiv = document.createElement('div');
      const searchChild = nextMonthDate.children[nextMonthDate.children.length-3];
      attendDiv.classList.add('item');
      attendDiv.id = "attendance2";
      const span = document.createElement('div');
      span.innerText = "2";
      span.style.color = "yellow";
      span.style.backgroundColor = "black";
      attendDiv.style.overflow = "hidden";
      attendDiv.appendChild(span);
      searchChild.appendChild(attendDiv);

      if(attendance_2.subject === "〇"){
        let circle = document.createElement('img');
        circle.src = "../static/img/circle.png";
        attendDiv.appendChild(circle);
      }else{
        let triangle = document.createElement('img');
        triangle.src = "../static/img/triangle.png";
        attendDiv.appendChild(triangle);

        let startTime = "10:35:00";
        let arrivalTime = attendance_2.time;
        let splitTime = attendance_2.time.split(':');
        let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

        triangle.addEventListener('mouseover',function (){
          balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"10時35分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
          let balloonSize = caluculationForBalloon(attendDiv);
          document.getElementById('balloon').style.left=balloonSize[0]+"px";
          document.getElementById('balloon').style.top=balloonSize[1]+"px";
          document.getElementById('balloon').style.display="block";
        });
        attendDiv.addEventListener('mouseleave',function (e){
          document.getElementById('balloon').style.display="none";
        });
      }
    }
    if (attendance_3){
      const attendDiv = document.createElement('div');
      const searchChild = nextMonthDate.children[userData[0].children.length-2];
      attendDiv.classList.add('item');
      attendDiv.id = "attendance3";
      const span = document.createElement('div');
      span.innerText = "3";
      span.style.color = "yellow";
      span.style.backgroundColor = "black";
      attendDiv.style.overflow = "hidden";
      attendDiv.appendChild(span);
      searchChild.appendChild(attendDiv);

      if(attendance_3.subject === "〇"){
        let circle = document.createElement('img');
        circle.src = "../static/img/circle.png";
        attendDiv.appendChild(circle);
      }else{
        let triangle = document.createElement('img');
        triangle.src = "../static/img/triangle.png";
        attendDiv.appendChild(triangle);

        let startTime = "13:00:00";
        let arrivalTime = attendance_3.time;
        let splitTime = attendance_3.time.split(':');
        let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

        triangle.addEventListener('mouseover',function (){
          balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"13時00分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
          let balloonSize = caluculationForBalloon(attendDiv);
          document.getElementById('balloon').style.left=balloonSize[0]+"px";
          document.getElementById('balloon').style.top=balloonSize[1]+"px";
          document.getElementById('balloon').style.display="block";
        });
        attendDiv.addEventListener('mouseleave',function (e){
          document.getElementById('balloon').style.display="none";
        });
      }

    }
    if (attendance_4){
      const attendDiv = document.createElement('div');
      const searchChild = nextMonthDate.children[nextMonthDate.children.length-1];
      attendDiv.classList.add('item');
      attendDiv.id = "attendance4";
      const span = document.createElement('div');
      span.innerText = "4";
      span.style.color = "yellow";
      span.style.backgroundColor = "black";
      attendDiv.style.overflow = "hidden";
      attendDiv.appendChild(span);
      searchChild.appendChild(attendDiv);
      if(attendance_4.subject === "〇"){
        let circle = document.createElement('img');
        circle.src = "../static/img/circle.png";
        attendDiv.appendChild(circle);
      }else{
        let triangle = document.createElement('img');
        triangle.src = "../static/img/triangle.png";
        attendDiv.appendChild(triangle);

        let startTime = "14:45:00";
        let arrivalTime = attendance_4.time;
        let splitTime = attendance_4.time.split(':');
        let splitdiffTime = calculationForLateArrivals(startTime,arrivalTime);

        triangle.addEventListener('mouseover',function (){
          balloon.innerText = "出席時刻: " + splitTime[0]+"時"+splitTime[1]+"分"+splitTime[2]+"秒"+"\n\n"+"14時45分00秒より"+"\n"+splitdiffTime[0]+"時間"+splitdiffTime[1]+"分"+splitdiffTime[2]+"秒"+"\n"+"遅れて出席しました。";
          let balloonSize = caluculationForBalloon(attendDiv);
          document.getElementById('balloon').style.left=balloonSize[0]+"px";
          document.getElementById('balloon').style.top=balloonSize[1]+"px";
          document.getElementById('balloon').style.display="block";
        });
        attendDiv.addEventListener('mouseleave',function (e){
          document.getElementById('balloon').style.display="none";
        });
      }
    }
  }

}
getFromServer();
initButtons();
load();