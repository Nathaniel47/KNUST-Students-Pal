from fastapi import FastAPI, UploadFile, File, HTTPException
from s3_utils import upload_file_to_s3

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welcome to KNUST Students' Pal API"}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    API Endpoint to upload a file to AWS S3.
    """
    file_url = upload_file_to_s3(file.file, file.filename)

    if file_url:
        return {"message": "File uploaded successfully", "url": file_url}
    else:
        raise HTTPException(status_code=500, detail="File upload failed")
