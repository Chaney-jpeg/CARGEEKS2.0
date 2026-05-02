from __future__ import annotations

import sqlite3
from typing import Any

from flask import Flask, jsonify, request
from flask_cors import CORS

from cargeeks.config import DB_PATH, SCHEMA_PATH, SEED_PATH
from cargeeks.db import Database
from cargeeks.repositories import PostRepository, ProfileRepository, SocialRepository, UserRepository
from cargeeks.services import CarGeeksService


def to_native(value: Any) -> Any:
    if isinstance(value, sqlite3.Row):
        return {k: to_native(value[k]) for k in value.keys()}
    if isinstance(value, list):
        return [to_native(v) for v in value]
    if isinstance(value, tuple):
        return [to_native(v) for v in value]
    if isinstance(value, dict):
        return {k: to_native(v) for k, v in value.items()}
    return value


def create_service() -> CarGeeksService:
    database = Database(
        db_path=DB_PATH,
        schema_path=SCHEMA_PATH,
        seed_path=SEED_PATH,
    )
    database.bootstrap()

    return CarGeeksService(
        users=UserRepository(database),
        posts=PostRepository(database),
        profiles=ProfileRepository(database),
        social=SocialRepository(database),
    )


service = create_service()
app = Flask(__name__)
CORS(app)


@app.get("/api/health")
def health() -> tuple[Any, int]:
    return jsonify({"status": "ok"}), 200


@app.get("/api/users")
def users() -> tuple[Any, int]:
    rows = service.users.list_users()
    return jsonify({"users": to_native(rows), "count": len(rows)}), 200


@app.get("/api/landing")
def landing() -> tuple[Any, int]:
    return jsonify(to_native(service.dashboard_payload())), 200


@app.get("/api/posts")
def posts() -> tuple[Any, int]:
    rows = service.posts.list_recent(limit=50)
    return jsonify({"posts": to_native(rows)}), 200


@app.get("/api/posts/<int:post_id>")
def post_detail(post_id: int) -> tuple[Any, int]:
    payload = service.post_detail_payload(post_id)
    if not payload["post"]:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(to_native(payload)), 200


@app.get("/api/profile/<int:user_id>")
def profile(user_id: int) -> tuple[Any, int]:
    payload = service.profile_payload(user_id)
    if not payload["user"]:
        return jsonify({"error": "User not found"}), 404
    return jsonify(to_native(payload)), 200


@app.get("/api/for-you")
def for_you() -> tuple[Any, int]:
    user_id_raw = request.args.get("userId")
    interest_raw = request.args.get("interest", "Build")

    if not user_id_raw:
        return jsonify({"error": "userId is required"}), 400

    try:
        user_id = int(user_id_raw)
    except ValueError:
        return jsonify({"error": "userId must be numeric"}), 400

    interests = [item.strip() for item in interest_raw.split(",") if item.strip()]
    payload = service.for_you_payload(user_id=user_id, interests=interests)
    return jsonify(to_native(payload)), 200


@app.post("/api/posts")
def create_post() -> tuple[Any, int]:
    data = request.get_json(silent=True) or {}

    required_fields = ["user_id", "title", "category", "excerpt", "body"]
    missing = [field for field in required_fields if not str(data.get(field, "")).strip()]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        service.posts.create(
            user_id=int(data["user_id"]),
            title=str(data["title"]).strip(),
            category=str(data["category"]).strip(),
            excerpt=str(data["excerpt"]).strip(),
            body=str(data["body"]).strip(),
            horsepower=str(data.get("horsepower", "N/A")).strip() or "N/A",
            torque=str(data.get("torque", "N/A")).strip() or "N/A",
            drivetrain=str(data.get("drivetrain", "N/A")).strip() or "N/A",
            platform=str(data.get("platform", "General")).strip() or "General",
        )
    except Exception as exc:
        return jsonify({"error": f"Failed to create post: {exc}"}), 500

    return jsonify({"status": "created"}), 201


@app.post("/api/posts/<int:post_id>/like")
def like_post(post_id: int) -> tuple[Any, int]:
    # Placeholder: in real app, update likes count
    return jsonify({"status": "liked"}), 200


@app.post("/api/posts/<int:post_id>/save")
def save_post(post_id: int) -> tuple[Any, int]:
    # Placeholder
    return jsonify({"status": "saved"}), 200


@app.post("/api/users/<int:user_id>/follow")
def follow_user(user_id: int) -> tuple[Any, int]:
    # Placeholder
    return jsonify({"status": "followed"}), 200


@app.post("/api/posts/<int:post_id>/comments")
def add_comment(post_id: int) -> tuple[Any, int]:
    data = request.get_json(silent=True) or {}
    comment = data.get("comment", "").strip()
    if not comment:
        return jsonify({"error": "Comment is required"}), 400
    # Placeholder: in real app, add to comments table
    return jsonify({"status": "commented"}), 201


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
