from dataclasses import dataclass


@dataclass(frozen=True)
class User:
    id: int
    first_name: str
    last_name: str
    handle: str
    bio: str
    interest_note: str


@dataclass(frozen=True)
class Post:
    id: int
    title: str
    category: str
    excerpt: str
    body: str
    likes: int
    horsepower: str
    torque: str
    drivetrain: str
    platform: str
    author_name: str
    handle: str


@dataclass(frozen=True)
class GarageCar:
    year: int
    model: str
    status: str
