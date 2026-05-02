import tkinter as tk
from tkinter import ttk

from ..services import CarGeeksService
from .screens.create_post import CreatePostScreen
from .screens.for_you import ForYouScreen
from .screens.landing import LandingScreen
from .screens.post_detail import PostDetailScreen
from .screens.profile import ProfileScreen
from .theme import apply_theme


class AppWindow:
    def __init__(self, root: tk.Tk, service: CarGeeksService) -> None:
        self.root = root
        self.service = service

        self.root.title("CarGeeks 2.0")
        self.root.geometry("1320x860")
        self.root.minsize(1120, 760)

        apply_theme(root)

        self.users = self.service.users.list_users()
        self.current_post_id: int | None = None
        self.current_profile_id: int | None = None
        self.current_for_you_interest = "Build"
        self.primary_user_id = self._resolve_primary_user_id()

        self._build_layout()
        self.refresh_all()

    def _resolve_primary_user_id(self) -> int:
        alex = next((row for row in self.users if row["handle"] == "@alexk_builds"), None)
        if alex:
            return alex["id"]
        return self.users[0]["id"]

    def _build_layout(self) -> None:
        header = tk.Frame(self.root, bg="#111111", padx=16, pady=12)
        header.pack(fill="x")

        tk.Label(
            header,
            text="CarGeeks",
            font=("Segoe UI", 18, "bold"),
            fg="#f6f2ec",
            bg="#111111",
        ).pack(side="left")

        tk.Label(
            header,
            text="System recreated from preview model (desktop)",
            font=("Segoe UI", 10),
            fg="#b0b0b0",
            bg="#111111",
        ).pack(side="right")

        content = tk.Frame(self.root, bg="#f2eee8")
        content.pack(fill="both", expand=True)

        self.notebook = ttk.Notebook(content)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=10)

        self.landing = LandingScreen(self.notebook)
        self.notebook.add(self.landing, text="Landing")

        self.post_detail = PostDetailScreen(self.notebook, on_select_post=self.load_post_detail)
        self.notebook.add(self.post_detail, text="Post detail")

        self.profile = ProfileScreen(self.notebook, on_select_user=self.load_profile)
        self.notebook.add(self.profile, text="Profile")

        self.create_post = CreatePostScreen(self.notebook, on_publish=self.publish_post)
        self.notebook.add(self.create_post, text="Create post")

        self.for_you = ForYouScreen(self.notebook, on_interest_change=self.load_for_you)
        self.notebook.add(self.for_you, text="For you")

    def refresh_all(self) -> None:
        self.users = self.service.users.list_users()

        self.landing.render(self.service.dashboard_payload())

        recent_posts = self.service.posts.list_recent(limit=50)
        self.post_detail.set_posts(recent_posts)
        if recent_posts and self.current_post_id is None:
            self.current_post_id = recent_posts[0]["id"]

        self.profile.set_users(self.users)
        if self.current_profile_id is None:
            self.current_profile_id = self.primary_user_id
        self.load_profile(self.current_profile_id)

        self.create_post.set_users(self.users)

        self.for_you.set_default_interest(self.current_for_you_interest)
        self.load_for_you(self.current_for_you_interest)

        if self.current_post_id is not None:
            self.load_post_detail(self.current_post_id)

    def load_post_detail(self, post_id: int) -> None:
        self.current_post_id = post_id
        payload = self.service.post_detail_payload(post_id)
        if payload["post"]:
            self.post_detail.render(payload)

    def load_profile(self, user_id: int) -> None:
        self.current_profile_id = user_id
        payload = self.service.profile_payload(user_id)
        if payload["user"]:
            self.profile.render(payload)

    def load_for_you(self, interest: str) -> None:
        self.current_for_you_interest = interest
        payload = self.service.for_you_payload(self.primary_user_id, interest)
        self.for_you.render(payload)

    def publish_post(self, payload: dict) -> None:
        self.service.posts.create(**payload)
        self.refresh_all()
