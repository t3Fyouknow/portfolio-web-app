from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('timetable.sqlite')
    conn.row_factory = sqlite3.Row
    return conn

# データベースの初期化
def init_db():
    conn = get_db_connection()
    conn.execute(''' 
        CREATE TABLE IF NOT EXISTS timetable (
            num VARCHAR(3),
            date DATE,
            period VARCHAR(5),  
            subject VARCHAR(30),
            decoration VARCHAR(500),
            backgroundColor VARCHAR(20),
            PRIMARY KEY (num, date, period)
        )
    ''')
    conn.commit()
    conn.close()

def get_schedule_data(user_id, month, year):
    conn = sqlite3.connect('timetable.sqlite')
    schedule_cur = conn.cursor()
    attendance_cur = conn.cursor()

    if user_id[0] == '1':
        # schedule_cur.execute("SELECT date, period, backgroundColor, decoration FROM timetable WHERE date LIKE ? AND num = 'one'", (f'{month}/%/{year}',))
        schedule_cur.execute("SELECT date, period, backgroundColor, decoration FROM timetable WHERE num = 'one'")
    else:
        # schedule_cur.execute("SELECT date, period, backgroundColor, decoration FROM timetable WHERE date LIKE ? AND num = 'two'", (f'{month}/%/{year}',))
        schedule_cur.execute("SELECT date, period, backgroundColor, decoration FROM timetable WHERE num = 'two'")
    A = schedule_cur.fetchall()
    
    attendance_cur.execute("SELECT date, period, attendance_status, time FROM attendance WHERE student_id = ?", (f'{user_id}',))
    B = attendance_cur.fetchall()

    conn.close()
    return A, B

def format_data(rows1, rows2):
    result = [[], []]
    for row in rows1:
        result[0].append({
        "date": row[0],
        "period": row[1],
        "backgroundColor": row[2],
        "decoration": row[3]
    }) 
    for row in rows2:
        result[1].append({
        "date": row[0],
        "period": row[1],
        "subject": row[2],
        "time": row[3]
    })
    return result

@app.route("/")
def sample_form01():
    return render_template("calendar.html")

@app.route("/student")
def sample_form02():
    return render_template("calendarStudent.html")

# 先生用アプリから送信された月日情報を用いてレコードを削除
@app.route('/delete', methods=['POST'])
def delete_schedule():
    data = request.data.decode('utf-8')
    print(f"Received data: {data}")
    month, year = data.split('|')
    conn = get_db_connection()
    conn.execute('''
        DELETE FROM timetable WHERE date LIKE ? 
    ''', (f'{month}/%/{year}',))
    conn.commit()
    conn.close()
    return f"Data for {month}/{year} has been deleted."

# 先生用アプリからのリクエストに対する処理
@app.route('/schedule', methods=['POST'])
def add_schedule():
    data = request.data.decode('utf-8')
    print(f"Received data: {data}")

    parts = data.split('|')
    num = parts[0]
    date = parts[1]
    period = parts[2]
    subject = parts[3]
    decoration = parts[4]
    backgroundColor = parts[5]

    conn = get_db_connection()
    conn.execute('''
        INSERT OR REPLACE INTO timetable (num, date, period, subject, decoration, backgroundColor)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (num, date, period, subject, decoration, backgroundColor))
    conn.commit()
    conn.close()
    return "Data received and saved"

# 生徒用アプリからのリクエストに対する処理
@app.route('/getSchedule', methods=['POST'])
def get_schedule():
    data = request.data.decode('utf-8')

    print(f"Received user data: {data}")

    parts = data.split('|')
    user_id = parts[0]
    month = parts[1]
    year = parts[2]
    A, B = get_schedule_data(user_id, month, year)
    formatted_data = format_data(A, B)
    return formatted_data

if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(debug=True)
