from typing import List

from marshmallow_dataclass import dataclass


@dataclass
class RevoicerJob:
    ContentType: str

    Split: List[str]
    Revoiced: List[str]
    Input: List[str]
    JobId: str
    OperationId: str

    Name: str | None
    FilePath: str | None
    ContentType: str | None
    Voice: str | None
