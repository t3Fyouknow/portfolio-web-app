//ナビ関連
let navigationOpenFlag = false;
let navButtonFlag = true;
let focusFlag = false;

//ハンバーガーメニュー
$(function(){

  $(document).on('click','.el_humburger',function(){
    if(navButtonFlag){
      spNavInOut.switch();
      //一時的にボタンを押せなくする
      setTimeout(function(){
        navButtonFlag = true;
      },200);
      navButtonFlag = false;
    }
  });
  $(document).on('click touchend', function(event) {
    if (!$(event.target).closest('.navi,.el_humburger').length && $('body').hasClass('js_humburgerOpen') && focusFlag) {
      focusFlag = false;
      //scrollBlocker(false);
      spNavInOut.switch();
    }
  });
});

//spナビ開く処理
function spNavIn(){
  $('body').removeClass('js_humburgerClose');
  $('body').addClass('js_humburgerOpen');
  setTimeout(function(){
    focusFlag = true;
  },200);
  setTimeout(function(){
    navigationOpenFlag = true;
  },200);
}

//spナビ閉じる処理
function spNavOut(){
  $('body').removeClass('js_humburgerOpen');
  $('body').addClass('js_humburgerClose');
  setTimeout(function(){
    $(".uq_spNavi").removeClass("js_appear");
    focusFlag = false;
  },200);
  navigationOpenFlag = false;
  //scrollBlocker(false);
}

//spナビ開閉処理
let spNavInOut = {
  switch:function(){
    if($('body.spNavFreez').length){
      return false;
    }
    if($('body').hasClass('js_humburgerOpen')){
      spNavOut();
    } else {
      spNavIn();
    }
  }
};