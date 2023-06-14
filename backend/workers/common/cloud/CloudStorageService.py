from abc import ABCMeta, abstractmethod

from backend.workers.common.model.FileInfo import FileInfo


class CloudStorageService(metaclass=ABCMeta):

    container_name: str

    def __init__(self, container_name: str):
        self.container_name: container_name

    @abstractmethod
    async def put_file(self, file: FileInfo) -> FileInfo:
        pass

    @abstractmethod
    async def get_file(self, file: FileInfo) -> FileInfo:
        pass
