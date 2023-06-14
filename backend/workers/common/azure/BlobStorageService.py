import os.path

from azure.storage.blob.aio import BlobServiceClient

from backend.workers.common.cloud.CloudStorageService import CloudStorageService
from backend.workers.common.model.FileInfo import FileInfo


class BlobStorageService(CloudStorageService):
    def __init__(self, connection_string: str, container_name: str):
        super().__init__(container_name)
        self.connection_string = connection_string
        self.client = BlobServiceClient.from_connection_string(connection_string)
        self.container_name = container_name

    async def get_file(self, file: FileInfo) -> FileInfo:
        blob_client = self.client.get_blob_client(container=self.container_name, blob=file.RemotePath)

        print(f"Downloading from storage: {file.RemotePath} into {file.LocalPath}")
        dirname = os.path.dirname(file.LocalPath)
        if not os.path.exists(dirname):
            os.mkdir(dirname)

        with open(file.LocalPath, "wb") as output_file:
            blob = await blob_client.download_blob()
            contents = await blob.readall()
            output_file.write(contents)

        print(f"Download complete. Your file is at {file.LocalPath}.")

        return file

    async def put_file(self, file: FileInfo) -> FileInfo:
        blob_client = self.client.get_blob_client(container=self.container_name, blob=file.RemotePath)

        print(f"Uploading file to storage: {file.LocalPath} into {file.RemotePath}")

        with open(file.LocalPath, "rb") as data:
            await blob_client.upload_blob(data, blob_type="BlockBlob")

        print(f"Upload complete. Your file is at {file.RemotePath}.")

        return file
