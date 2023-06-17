from abc import ABCMeta, abstractmethod

from workers.common.model.FileInfo import FileInfo


class CloudStorageService(metaclass=ABCMeta):

    container_name: str

    def __init__(self, container_name: str):
        self.container_name: container_name

    @abstractmethod
    async def put_file(self, file: FileInfo) -> FileInfo:
        """
        The put_file function is used to upload a file to the server.

        :param self: Represent the instance of the class
        :param file: FileInfo: Specify the file to be uploaded
        :return: A fileinfo object
        """
        pass

    @abstractmethod
    async def get_file(self, file: FileInfo) -> FileInfo:
        """
        The get_file function is used to retrieve a file from the server.

        :param self: Represent the instance of the class
        :param file: FileInfo: Pass the file info to the function
        :return: A fileinfo object
        """
        pass
