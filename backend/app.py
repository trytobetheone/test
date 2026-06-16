from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import os
from rembg import remove
import uuid
import aiofiles

app = FastAPI(title="Background Remover API")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    """배경 제거 API"""
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="이미지 파일만 업로드 가능합니다")

        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents))

        if input_image.mode == "RGBA":
            input_image = input_image.convert("RGB")

        output_image = remove(input_image)

        output_id = str(uuid.uuid4())
        output_path = os.path.join(UPLOAD_DIR, f"{output_id}.png")

        output_image.save(output_path, "PNG")

        return {
            "success": True,
            "file_id": output_id,
            "message": "배경이 성공적으로 제거되었습니다"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"처리 중 오류 발생: {str(e)}")


@app.get("/download/{file_id}")
async def download_image(file_id: str):
    """처리된 이미지 다운로드"""
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.png")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다")

    return FileResponse(
        file_path,
        media_type="image/png",
        filename=f"no-background-{file_id}.png"
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
