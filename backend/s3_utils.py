import boto3
from config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_REGION, S3_BUCKET_NAME
import mimetypes

# Initialize the S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=S3_REGION,
)

def clean_filename(filename):
    """Replaces spaces with underscores in the filename."""
    return filename.replace(" ", "_")

def upload_file_to_s3(file, filename):
    """
    Uploads a file to the configured S3 bucket.

    :param file: The file object (from FastAPI upload)
    :param filename: The filename to save in S3
    :return: S3 file URL or None if upload fails
    """
    cleaned_filename = clean_filename(filename)

    # Detect file MIME type
    content_type, _ = mimetypes.guess_type(cleaned_filename)
    extra_args = {}

    if content_type:
        extra_args["ContentType"] = content_type
        if content_type.startswith("image/"):
            extra_args["ContentDisposition"] = "inline"  # Allow images to display in browser
    else:
        extra_args["ContentType"] = "application/octet-stream"  # Default for unknown types

    try:
        # Pass ExtraArgs to S3 upload
        s3_client.upload_fileobj(file, S3_BUCKET_NAME, cleaned_filename, ExtraArgs=extra_args)
        
        file_url = f"https://{S3_BUCKET_NAME}.s3.{S3_REGION}.amazonaws.com/{cleaned_filename}"
        return file_url
    except Exception as e:
        print(f"Error uploading file to S3: {e}")
        return None
