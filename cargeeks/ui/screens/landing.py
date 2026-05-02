import tkinter as tk
from tkinter import ttk


class LandingScreen(tk.Frame):
    def __init__(self, master: ttk.Notebook) -> None:
        super().__init__(master, bg="#f9f6f2", padx=16, pady=16)

        tk.Label(
            self,
            text="Landing page",
            font=("Segoe UI", 20, "bold"),
            bg="#f9f6f2",
            fg="#1a1a1a",
        ).pack(anchor="w")

        tk.Label(
            self,
            text="Hero, featured post, and discovery feed",
            font=("Segoe UI", 10),
            bg="#f9f6f2",
            fg="#666666",
        ).pack(anchor="w", pady=(2, 10))

        self.active_geeks_var = tk.StringVar(value="Active geeks: --")
        tk.Label(
            self,
            textvariable=self.active_geeks_var,
            font=("Segoe UI", 12, "bold"),
            bg="#f9f6f2",
        ).pack(anchor="w", pady=(0, 12))

        body = tk.Frame(self, bg="#f9f6f2")
        body.pack(fill="both", expand=True)

        left = tk.LabelFrame(body, text="Featured", bg="#ffffff", padx=8, pady=8)
        left.pack(side="left", fill="both", expand=True, padx=(0, 8))
        self.featured_list = tk.Listbox(left, height=12)
        self.featured_list.pack(fill="both", expand=True)

        right = tk.LabelFrame(body, text="Feed", bg="#ffffff", padx=8, pady=8)
        right.pack(side="left", fill="both", expand=True, padx=(8, 0))

        self.feed_tree = ttk.Treeview(
            right,
            columns=("title", "category", "likes", "author"),
            show="headings",
            height=14,
        )
        self.feed_tree.heading("title", text="Title")
        self.feed_tree.heading("category", text="Category")
        self.feed_tree.heading("likes", text="Likes")
        self.feed_tree.heading("author", text="Author")

        self.feed_tree.column("title", width=380, anchor="w")
        self.feed_tree.column("category", width=130, anchor="w")
        self.feed_tree.column("likes", width=80, anchor="center")
        self.feed_tree.column("author", width=180, anchor="w")
        self.feed_tree.pack(fill="both", expand=True)

    def render(self, payload: dict) -> None:
        self.active_geeks_var.set(f"Active geeks: {payload['active_geeks']}")

        self.featured_list.delete(0, tk.END)
        for row in payload["featured"]:
            self.featured_list.insert(
                tk.END,
                f"[{row['category']}] {row['title']} - {row['author_name']} ({row['likes']} likes)",
            )

        for item in self.feed_tree.get_children():
            self.feed_tree.delete(item)

        for row in payload["recent"]:
            self.feed_tree.insert(
                "",
                tk.END,
                values=(row["title"], row["category"], row["likes"], row["author_name"]),
            )
