from typing import Iterable

from .db import Database


class UserRepository:
    def __init__(self, database: Database) -> None:
        self.database = database

    def list_users(self):
        with self.database.connect() as conn:
            return conn.execute(
                """
                SELECT id, first_name, last_name, handle, bio, interest_note
                FROM users
                ORDER BY first_name ASC
                """
            ).fetchall()

    def count_users(self) -> int:
        with self.database.connect() as conn:
            return conn.execute("SELECT COUNT(*) FROM users;").fetchone()[0]

    def get_by_id(self, user_id: int):
        with self.database.connect() as conn:
            return conn.execute(
                """
                SELECT id, first_name, last_name, handle, bio, interest_note
                FROM users
                WHERE id = ?
                """,
                (user_id,),
            ).fetchone()


class PostRepository:
    def __init__(self, database: Database) -> None:
        self.database = database

    def list_featured(self):
        with self.database.connect() as conn:
            return conn.execute(
                """
                SELECT p.id, p.title, p.category, p.excerpt, p.likes,
                       u.first_name || ' ' || u.last_name AS author_name
                FROM posts p
                JOIN users u ON u.id = p.user_id
                WHERE p.is_featured = 1
                ORDER BY p.likes DESC
                """
            ).fetchall()

    def list_recent(self, limit: int = 12):
        with self.database.connect() as conn:
            return conn.execute(
                """
                SELECT p.id, p.title, p.category, p.excerpt, p.likes,
                       u.first_name || ' ' || u.last_name AS author_name
                FROM posts p
                JOIN users u ON u.id = p.user_id
                ORDER BY p.created_at DESC, p.likes DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()

    def get_post_detail(self, post_id: int):
        with self.database.connect() as conn:
            return conn.execute(
                """
                SELECT p.id, p.title, p.category, p.excerpt, p.body, p.likes,
                       p.horsepower, p.torque, p.drivetrain, p.platform,
                       u.first_name || ' ' || u.last_name AS author_name,
                       u.handle
                FROM posts p
                JOIN users u ON u.id = p.user_id
                WHERE p.id = ?
                """,
                (post_id,),
            ).fetchone()

    def list_comments(self, post_id: int):
        with self.database.connect() as conn:
            return conn.execute(
                """
                SELECT u.first_name || ' ' || u.last_name AS author_name,
                       c.comment_text
                FROM comments c
                JOIN users u ON u.id = c.user_id
                WHERE c.post_id = ?
                ORDER BY c.created_at DESC
                """,
                (post_id,),
            ).fetchall()

    def list_for_interest(self, interests: list[str], limit: int = 8):
        if not interests:
            interests = ["Build"]

        patterns = [f"%{interest}%" for interest in interests]
        clauses = " OR ".join(["p.category LIKE ? OR p.title LIKE ? OR p.platform LIKE ?" for _ in patterns])
        params = []
        for pattern in patterns:
            params.extend([pattern, pattern, pattern])
        params.append(limit)

        with self.database.connect() as conn:
            query = f"""
                SELECT p.id, p.title, p.category, p.likes,
                       u.first_name || ' ' || u.last_name AS author_name,
                       u.handle
                FROM posts p
                JOIN users u ON u.id = p.user_id
                WHERE {clauses}
                ORDER BY p.likes DESC
                LIMIT ?
                """
            return conn.execute(query, params).fetchall()

    def create(
        self,
        user_id: int,
        title: str,
        category: str,
        excerpt: str,
        body: str,
        horsepower: str,
        torque: str,
        drivetrain: str,
        platform: str,
    ) -> None:
        slug = (
            title.lower()
            .strip()
            .replace(" ", "-")
            .replace("--", "-")
            .replace("'", "")
            .replace('"', "")
        )
        with self.database.connect() as conn:
            conn.execute(
                """
                INSERT INTO posts (
                    user_id, slug, title, category, excerpt, body,
                    horsepower, torque, drivetrain, platform, likes, is_featured
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
                """,
                (
                    user_id,
                    f"{slug}-{user_id}",
                    title,
                    category,
                    excerpt,
                    body,
                    horsepower,
                    torque,
                    drivetrain,
                    platform,
                ),
            )
            conn.commit()


class ProfileRepository:
    def __init__(self, database: Database) -> None:
        self.database = database

    def stats(self, user_id: int) -> dict[str, int]:
        with self.database.connect() as conn:
            posts = conn.execute("SELECT COUNT(*) FROM posts WHERE user_id = ?", (user_id,)).fetchone()[0]
            followers = conn.execute(
                "SELECT COUNT(*) FROM follows WHERE followed_user_id = ?",
                (user_id,),
            ).fetchone()[0]
            following = conn.execute(
                "SELECT COUNT(*) FROM follows WHERE follower_user_id = ?",
                (user_id,),
            ).fetchone()[0]
        return {"posts": posts, "followers": followers, "following": following}

    def garage(self, user_id: int):
        with self.database.connect() as conn:
            return conn.execute(
                """
                SELECT car_year, car_model, status
                FROM garage_cars
                WHERE user_id = ?
                ORDER BY car_year ASC
                """,
                (user_id,),
            ).fetchall()

    def recent_activity(self, user_id: int, limit: int = 5):
        with self.database.connect() as conn:
            return conn.execute(
                """
                SELECT category, title, likes
                FROM posts
                WHERE user_id = ?
                ORDER BY created_at DESC
                LIMIT ?
                """,
                (user_id, limit),
            ).fetchall()


class SocialRepository:
    def __init__(self, database: Database) -> None:
        self.database = database

    def following(self, user_id: int):
        with self.database.connect() as conn:
            return conn.execute(
                """
                SELECT u.first_name, u.last_name, u.handle, u.interest_note
                FROM follows f
                JOIN users u ON u.id = f.followed_user_id
                WHERE f.follower_user_id = ?
                ORDER BY u.first_name ASC
                """,
                (user_id,),
            ).fetchall()

    def suggested(self, user_id: int, limit: int = 5):
        with self.database.connect() as conn:
            return conn.execute(
                """
                SELECT first_name, last_name, handle, interest_note
                FROM users
                WHERE id != ?
                  AND id NOT IN (
                    SELECT followed_user_id FROM follows WHERE follower_user_id = ?
                  )
                ORDER BY first_name ASC
                LIMIT ?
                """,
                (user_id, user_id, limit),
            ).fetchall()
