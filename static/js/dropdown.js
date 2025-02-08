/*Dropdown Menu*/
$('.dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});
$('.dropdown .dropdown-menu li').click(function () {
    $(this).parents('.dropdown').find('span').text($(this).text());
    $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});
/*End Dropdown Menu*/

let input;
let crossMark= document.getElementById("バツ");
$('.dropdown-menu li').click(function () {
  input = document.getElementById($(this).parents('.dropdown').find('input').val()),
  msg = '<span class="msg">を追加する ';
$('.msg').html(msg + '</span>');
box1.style.position = 'static';
box2.style.position = 'static';
holiday.style.position = 'static';
// document.getElementById('contextmenu').style.zIndex ='13';


if(input.id === "add1"){
    subjTitleInput.style.width = "50px";
    subjTitleInput.style.height = "60px";
    box1.style.position = 'relative';
    box1.style.zIndex = '11';
}else if(input.id === "add2"){
    subjTitleInput.style.width = "100px";
    subjTitleInput.style.height = "60px";
    box2.style.position = 'relative';
    box2.style.zIndex = '11';
}else if(input.id === "addHoli"){
    subjTitleInput.style.width = "156px";
    subjTitleInput.style.height = "111px";
    holiday.style.position = 'relative';
    holiday.style.zIndex = '11';
}
subjTitleInput.style.display = 'block';
});