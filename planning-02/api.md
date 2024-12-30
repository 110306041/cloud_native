# NCCUMISOJ API 文件
請大家注意，開發時務必按照 API 文件開發，勿自行發明

## 錯誤處理

所有 API 皆有可能回應以下錯誤訊息:
- `400 Bad Request`: 輸入參數錯誤 or HTTP 方法錯誤
- `401 Unauthorized`: 驗證錯誤 or 缺少驗證
- `403 Forbidden`: 權限不足
- `404 Not Found`
- `500 Internal Server Error`: 系統錯誤

錯誤回應格式:
    ```json
    {
        "error": {
            "code": "ERROR_CODE",
            "message": "清楚易懂的錯誤訊息"
        }
    }
    ```

## API 設計

### 登入驗證

#### POST /auth/login
登入系統。

Request:
```json
{
    "email": "string",
    "password": "string"
}
```

Response: (200 OK)
```json
{
    "token": "jwt_token",
    "user": {
        "id": "integer",
        "username": "string",
        "role": "string",
        "email": "string"
    }
}
```

### 學生視角

#### GET /student/courses

取得本學生已經加入的課程，後端使用 JWT token 去轉換 user 資訊，並到資料庫尋找相關資料。

這部分前端再把本學期的課跟之前的課分開。

Response: (200 OK)
```json
{
    "courses": [
        {
            "id": "string",
            "name": "string",
            "semester": int,
            "teacher_name": "string",
            "total_assignments": int,
            "completed_assignments": int,
            "active_exams": int,
        }
    ]
}
```

#### GET /student/assignmentsAndExams/{courseID}

拿學生點擊的課程裡面所有作業跟考試

Response: (200 OK)
```json
{
    "assignments": [
        {
            "id": int,
            "name": "string",
            "due_date": "string",
            "question_count": int,
            "score": int
        }
    ],
    "exams": [
        {
            "id": "string",
            "name": "string",
            "start_date": "datetime",
            "due_date": "datetime",
            "course": {
                "id": int,
                "name": "string"
            },
            "is_active": "boolean"

        }
    ]
}
```

#### GET /student/assignments/questions/{assignmentsID}

得到該 assignment 的 question list

Response: (200 OK)
```json
{
    "questions": [
        {
            "id": "string",
            "name": "string",
            "description": "string",
            "difficulty": "string",
            "score":"string"
        }
    ]
}
```

#### GET /student/exams/questions/{examID}

得到該 exam 的 question list

Response: (200 OK)
```json
{
    "questions": [
        {
            "id": "string",
            "name": "string",
            "description": "string",
            "difficulty": "string",
            "score":"string"
        }
    ]
}
```

#### GET /student/questions/{questionID}

回傳一個問題的詳細資訊

Response: (200 OK)
```json
{
    "id": int,
    "name": "string",
    "description": "string",
    "difficulty": "string",
    "time_limit": int,
    "memory_limit": int,
    "constraints": "string",
    "sample_test_cases": [
        {
            "input": "string",
            "expected_output": "string"
        }
    ]
}
```

#### POST student/question/submission/{questionID}

Request:
```json
{
    "code": "string",
    "language": "string"
}
```

Response: (200 OK)
```json
{
    "submission_id": int,
    "status": "string",
    "test_cases": [
        {
            "case_id": 1,
            "status": "passed | failed",
            "execution_time": 100,    // ms
            "memory_used": 1024,      // KB
            "input": "test input",    
            "expected_output": "expected result",
            "actual_output": "actual result"
        }
    ],
    "total_test_cases": 10,
    "passed_test_cases": 8,
    "score": 80,
    "execution_time": 2500,  // 總執行時間 (ms)
}
```
Response: (400 Bad Request)
```json
{
    "error": {
        "code": "EXECUTION_ERROR",
        "message": "程式執行錯誤",
        "details": {
            "line": 5,
            "error_message": "Runtime Error: division by zero"
        }
    }
}
```

#### GET /student/submissioins

得到該 student 的 submission list

Response: (200 OK)
```json
{
    "submissions": [
        {
            "ID": "UUID",
			"Score": int,
			"TimeSpend": int,
			"MemoryUsage": int,
			"CreatedAt": "datetime",
			"Code": "string",
			"Language": "string",
			"UserID": "UUID",
			"QuestionID": "UUID"
        }
    ]
}
```


### 老師視角

#### GET /teacher/courses
Response: (200 OK)
```json
{
    "courses": [
        {
            "id": "string",
            "name": "string",
            "semester": int,
            "total_assignments": int,
            "completed_assignments": int,
            "active_exams": int,
        }
    ]
}
```

#### GET /teacher/assignmentsAndExams/{courseID}

拿老師點擊的課程裡面所有作業跟考試

Response: (200 OK)
```json
{
    "assignments": [
        {
            "id": int,
            "name": "string",
            "due_date": "string",
            "description": "string",
            "question_count": int,
            "course": {
                "id": int,
                "course_name": "string"
            },
        }
    ],
    "exams": [
        {
            "id": "string",
            "name": "string",
            "start_date": "datetime",
            "due_date": "datetime",
            "course": {
                "id": int,
                "name": "string"
            },
        }
    ]
}
```

#### GET /teacher/questions/{questionID}

回傳一個問題的詳細資訊

Response: (200 OK)
```json
{
    "id": int,
    "name": "string",
    "description": "string",
    "difficulty": "string",
    "time_limit": int,
    "memory_limit": int,
    "constraints": "string",
    "sample_test_cases": [
        {
            "input": "string",
            "expected_output": "string",
            
        }
    ],
    "finish_num": int,
    "AC_num": int,
}
```

#### POST teacher/courses
Request:
```json
{
    "course_name": "string",
    "semester": int,
    "student_limit": int,
}
```

Response: (201 OK)


#### POST teacher/assignments/{courseID}

老師新增 assignment 至一個課程裡

Request:
```json
{
    "assignment_name": "string",
    "due_date": "datetime",
    "description": "string",
}
```

Response: (201 OK)

#### POST teacher/exams/{courseID}

老師新增 exam 至一個課程裡

Request:
```json
{
    "exam_name": "string",
    "start_date": "datetime",
    "due_date": "datetime",
    "description": "string",
}
```

Response: (201 OK)


#### POST teacher/questions/

老師新增 questions 至一個 exams 或 assignment 裡

Request:
```json
{
    "exam_id": int,
    "assignment_id": int,
    "difficulty": "string",
    "due_date": "datetime",
    "time_limit": int,
    "memory_limit": int,
    "submission_limit": int,
    "description": "string",
    "test_cases": [
        {
            "input": "string",
            "expected_output": "string"
        }
    ]
}
```

Response: (201 OK)

#### Update teacher/questions/questionID

老師更改 questions 中的內容 (update 的 request body 的 field name 需與資料庫一致）

Request:
```json
{
    "Difficulty": "string",
    "TimeLimit": int,
    "MemoryLimit":int,
    "SubmissionLimit": int,
    "Description": "string",
    "Name":"string"
   
}
```

Response: (200 OK)

#### Update teacher/exams/examID

老師更改 exams 中的內容 (update 的 request body 的 field name 需與資料庫一致）

Request:
```json
{
    "Name": "string",
    "StartDate": "datetime",
    "DueDate": "datetime",
    "Description": "string"
}
```

Response: (200 OK)

#### Update teacher/assignments/assignmentID

老師更改 assignment 中的內容 (update 的 request body 的 field name 需與資料庫一致）

Request:
```json
{
    "Name": "string",
    "StartDate": "datetime",
    "DueDate": "datetime",
    "Description": "string"
}
```

Response: (200 OK)

#### Update teacher/courses/courseID

老師更改 course 中的內容 (update 的 request body 的 field name 需與資料庫一致）

Request:
```json
{
    "Name": "string",
    "Semester": "string",
    "StudentLimit": int
}
```

Response: (200 OK)

#### Delete teacher/questions/questionID

老師刪除 question 中的內容 


Response: (200 OK)

#### Delete teacher/exams/examID

老師刪除 exam 中的內容 


Response: (200 OK)

#### Delete teacher/assignments/assignmentID

老師刪除 assignment 中的內容 


Response: (200 OK)

#### Delete teacher/courses/courseID

老師刪除 course 中的內容 


Response: (200 OK)
