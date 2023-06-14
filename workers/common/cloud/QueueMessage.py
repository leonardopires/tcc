from dataclasses import dataclass
from typing import TypeVar, Generic

T = TypeVar("T")
TMessage = TypeVar("TMessage")


@dataclass
class QueueMessage(Generic[T, TMessage]):

    body: T
    native_message: TMessage

