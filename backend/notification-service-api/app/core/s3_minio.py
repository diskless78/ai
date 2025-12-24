from datetime import timedelta
from minio import Minio, S3Error
from app.configs import config

if config.ENV != "DEV":
    secure_s3 = True
else:
    secure_s3 = False

s3_client = Minio(
    config.MINIO_HOST,
    access_key=config.MINIO_ACCESS_KEY,
    secret_key=config.MINIO_SECRET_KEY,
    region=config.MINIO_REGION,
    secure=secure_s3,
)


def get_url(bucket, image_name, expires_hour: int = 1) -> str | None:
    try:
        if image_name:
            url = s3_client.presigned_get_object(
                bucket, image_name, expires=timedelta(hours=expires_hour)
            )
            return url
        else:
            return ""
    except Exception as e:
        return None


def upload_image(bucket, filename, face_img) -> bool | None:
    # if not s3_client.bucket_exists(bucket):
    #     s3_client.make_bucket(bucket)
    try:
        s3_client.put_object(
            bucket,
            filename,
            face_img,
            length=face_img.getbuffer().nbytes,
        )

        return True
    except S3Error as e:
        print(e)
        return False
