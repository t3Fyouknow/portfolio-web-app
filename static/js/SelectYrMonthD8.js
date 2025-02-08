// 参考　https://zenn.dev/okoe/articles/7876b897c0fccf
let dt = new Date();
let selectYear = document.querySelector('.selectYear');
let selectMonth = document.querySelector('.selectMonth');
let currentYear = new Date().getFullYear(); //今現在の年

/**
 * selectのoptionタグを生成するための関数
 * @param {Element} elem 変更したいselectの要素
 * @param {Number} val 表示される文字と値の数値
 */

function createOptionForElements(elem, val) {
  let option = document.createElement('option');
  option.text = val;
  option.value = val;
  elem.appendChild(option);
}

//年の生成
for(let i = currentYear-5; i <= currentYear+100; i++) {
  createOptionForElements(selectYear, i);
}
//月の生成
for(let i = 1; i <= 12; i++) {
  createOptionForElements(selectMonth, i);
}

function changeTheDay() {
    let Year_Month = new Date(selectYear.value, selectMonth.value);
    let totalMonths1 = dt.getFullYear() * 12 + dt.getMonth()+ 1 + nav;
    let totalMonths2 = Year_Month.getFullYear() * 12 + Year_Month.getMonth()+1;
    
    // 2つの月の差を計算
    let difference = totalMonths2 - totalMonths1 - 1; //　今現在の月と選択した年月の月の差分
    nav += difference;
    load();
}

selectYear.addEventListener('change', function() {
  changeTheDay();
});

selectMonth.addEventListener('change', function() {
  changeTheDay();
});