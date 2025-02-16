# portfolio-web-app
時間割と出席を管理するシステム。時間割を作成する教員用アプリと、時間割と出席を確認する生徒用アプリがあり、PythonサーバーとSQLiteデータベースで動作します。

# プロジェクトのディレクトリ構造
portfolio/
│
├── query.sql                    # attendanceテーブルに出欠情報を格納するクエリ（ユーザーの出席を登録するときに使用）
├── server.py                    # サーバー（Flaskアプリケーション）
├── timetable.sqlite             # データベース (timetableとattendanceの２つテーブルを保持)
│
├── templates/
│   ├── calendar.html            # 先生用Webページ
│   └── calendarStudent.html     # 生徒用Webページ
│ 
└── static/
    ├── js/
    │     │　　先生用jsファイル
    │     │　　↓↓↓
    │     ├── calendar.js            # カレンダー作成、時間割作成、サーバーへのデータ送信処理
    │     ├── hamburger.js           # 右上にあるハンバーガーメニューの処理
    │     ├── dropdown.js            # 教科を編集するモーダルを開いたときに表示されるドロップダウンメニューの処理
    │     ├── format.js              # 教科の作成、編集をするときの処理
    │     ├── SelectYrMonthD8.js     # ハンバーガーメニュー内にある年月日を選択できるドロップダウンメニュー処理
    │     │
    │     │　　生徒用jsファイル
    │     │　　↓↓↓
    │     ├── login.js               # ログイン画面処理
    │     ├── calendarStudent.js     # 生徒用カレンダー作成処理
    │     ├── hamburgerStudent.js    # 右上にあるハンバーガーメニューの処理
    │     └── SelectYrMonthD8.js     # ハンバーガーメニュー内にある年月日を選択できるドロップダウンメニュー処理
    │
    ├── css/  # CSSファイル
    │
    └── img/  # 画像ファイル


# 使用方法
1.server.pyを実行
2.先生用Webページ（http://127.0.0.1:5000/）または 生徒用Webページ（http://127.0.0.1:5000/student）にアクセス
