# 🎯 Background Remover (사진 누끼 제거)

AI를 사용한 자동 배경 제거 웹 애플리케이션입니다.

## 📋 기술 스택

- **Frontend**: React 18 + Vite + Axios
- **Backend**: FastAPI + Python
- **AI Model**: REMBG (U²-Net 기반 배경 제거)
- **배포**: Docker 지원

## 🚀 빠른 시작

### 요구사항
- Python 3.9+
- Node.js 16+

### 백엔드 설정

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

백엔드는 `http://localhost:8000`에서 실행됩니다.

### 프론트엔드 설정

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

## 📖 API 엔드포인트

### 헬스 체크
```
GET /health
```

### 배경 제거
```
POST /remove-bg
Content-Type: multipart/form-data

Body: file (이미지 파일)

Response:
{
  "success": true,
  "file_id": "uuid-string",
  "message": "배경이 성공적으로 제거되었습니다"
}
```

### 이미지 다운로드
```
GET /download/{file_id}
```

## 🎨 기능

- ✅ 드래그 앤 드롭 이미지 업로드
- ✅ 자동 배경 제거 (REMBG AI 모델)
- ✅ 실시간 미리보기
- ✅ PNG 형식 다운로드 (투명 배경 유지)
- ✅ 반응형 디자인
- ✅ 오류 처리

## 🛠️ 프로젝트 구조

```
test/
├── backend/
│   ├── app.py           # FastAPI 메인 애플리케이션
│   ├── requirements.txt  # Python 의존성
│   └── uploads/         # 처리된 이미지 저장소
├── frontend/
│   ├── src/
│   │   ├── main.jsx     # React 진입점
│   │   ├── App.jsx      # 메인 컴포넌트
│   │   └── App.css      # 스타일
│   ├── index.html       # HTML 템플릿
│   ├── package.json     # Node 의존성
│   └── vite.config.js   # Vite 설정
└── README.md
```

## 📦 Docker 사용

```bash
# 백엔드
cd backend
docker build -t bg-remover-backend .
docker run -p 8000:8000 bg-remover-backend

# 프론트엔드
cd frontend
docker build -t bg-remover-frontend .
docker run -p 5173:5173 bg-remover-frontend
```

## 📝 라이선스

MIT License

## 👨‍💻 개발자

Claude Code - AI Assistant by Anthropic
