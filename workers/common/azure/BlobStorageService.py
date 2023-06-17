import os.path

from azure.storage.blob.aio import BlobServiceClient

from workers.common.cloud.CloudStorageService import CloudStorageService
from workers.common.model.FileInfo import FileInfo


class BlobStorageService(CloudStorageService):
    def __init__(self, connection_string: str, container_name: str):
        """
        The __init__ function is called when the class is instantiated.
        It sets up the connection to Azure Blob Storage and creates a client object that can be used to interact with it.
        The container_name parameter specifies which container in your storage account you want to use.

        :param self: Represent the instance of the class
        :param connection_string: str: Connect to the azure blob storage account
        :param container_name: str: Set the name of the container that will be used to store blobs
        :return: The blobserviceclient object
        """
        super().__init__(container_name)
        self.connection_string = connection_string
        self.client = BlobServiceClient.from_connection_string(connection_string)
        self.container_name = container_name

    async def get_file(self, file: FileInfo) -> FileInfo:
        """
        The get_file function downloads a file from the Azure Blob Storage container.

        :param self: Represent the instance of the class
        :param file: FileInfo: Specify the file to be downloaded
        :return: A fileinfo object
        """
        blob_client = self.client.get_blob_client(container=self.container_name, blob=file.RemotePath)

        print(f"Downloading from storage: {file.RemotePath} into {file.LocalPath}")
        dirname = os.path.dirname(file.LocalPath)
        if not os.path.exists(dirname):
            os.makedirs(dirname)

        try:
            with open(file.LocalPath, "wb") as output_file:
                blob = await blob_client.download_blob()
                contents = await blob.readall()
                output_file.write(contents)

        except Exception as ex:
            print(f"An error happened: {ex}")

        print(f"Download complete. Your file is at {file.LocalPath}.")

        return file

    async def put_file(self, file: FileInfo) -> FileInfo:
        """
        The put_file function uploads a file to the Azure Blob Storage container.

        :param self: Refer to the current instance of the class
        :param file: FileInfo: Pass in the file object that is being uploaded
        :return: The file object
        """
        blob_client = self.client.get_blob_client(container=self.container_name, blob=file.RemotePath)

        print(f"Uploading file to storage: {file.LocalPath} into {file.RemotePath}")

        with open(file.LocalPath, "rb") as data:
            await blob_client.upload_blob(data, blob_type="BlockBlob")

        print(f"Upload complete. Your file is at {file.RemotePath}.")

        return file
