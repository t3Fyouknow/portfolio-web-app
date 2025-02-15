function login() {
    // 入力された学籍番号を取得
    let userId = document.getElementById("user_id").value;

    // 入力チェック（空白なら処理を止める）
    if (userId.trim() === "") {
        alert("学籍番号を入力してください");
        return;
    }else if(userId[0] !== "1" && userId[0] !== "2"){
        alert("学籍番号が無効です。正しい番号を入力してください。");
        return;
    }

    // 取得した値を生徒画面に表示
    document.getElementById("ps").textContent = userId;

    // 画面を切り替える
    document.getElementById("screen1").classList.remove("active");
    document.getElementById("screen2").classList.add("active");
    document.getElementById("humburger_btn").classList.add("active");
    getFromServer();
    load();
}

function logout() {
    // 画面をログイン画面に戻す
    document.getElementById("screen1").classList.add("active");
    document.getElementById("screen2").classList.remove("active");
    document.getElementById("humburger_btn").classList.remove("active");
}