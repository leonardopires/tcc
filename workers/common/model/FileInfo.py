from marshmallow_dataclass import dataclass


@dataclass
class FileInfo:
    RemotePath: str
    LocalPath: str
