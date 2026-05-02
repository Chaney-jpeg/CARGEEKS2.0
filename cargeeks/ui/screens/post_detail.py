import tkinter as tk
from tkinter import ttk


class PostDetailScreen(tk.Frame):
    def __init__(self, master: ttk.Notebook, on_select_post) -> None:
        super().__init__(master, bg="#f9f6f2", padx=16, pady=16)
        self.on_select_post = on_select_post
        self.post_ids_by_label: dict[str, int] = {}

        top = tk.Frame(self, bg="#f9f6f2")
        top.pack(fill="x")

        tk.Label(top, text="Post detail", font=("Segoe UI", 20, "bold"), bg="#f9f6f2").pack(side="left")
        self.post_selector = ttk.Combobox(top, state="readonly", width=74)
        self.post_selector.pack(side="left", padx=8)
        self.post_selector.bind("<<ComboboxSelected>>", self._handle_selection)

        content = tk.Frame(self, bg="#f9f6f2")
        content.pack(fill="both", expand=True, pady=(10, 0))

        left = tk.LabelFrame(content, text="Article", bg="#ffffff", padx=8, pady=8)
        left.pack(side="left", fill="both", expand=True, padx=(0, 8))

        self.title_var = tk.StringVar(value="")
        self.meta_var = tk.StringVar(value="")
        self.specs_var = tk.StringVar(value="")

        tk.Label(left, textvariable=self.title_var, bg="#ffffff", font=("Segoe UI", 14, "bold"), wraplength=720, justify="left").pack(anchor="w")
        tk.Label(left, textvariable=self.meta_var, bg="#ffffff", fg="#777777", font=("Segoe UI", 10)).pack(anchor="w", pady=(4, 4))
        tk.Label(left, textvariable=self.specs_var, bg="#ffffff", fg="#444444", font=("Segoe UI", 10)).pack(anchor="w", pady=(0, 6))

        self.body_text = tk.Text(left, wrap="word", font=("Segoe UI", 10), height=16)
        self.body_text.pack(fill="both", expand=True)
        self.body_text.configure(state="disabled")

        right = tk.LabelFrame(content, text="Comments", bg="#ffffff", padx=8, pady=8)
        right.pack(side="left", fill="both", expand=True, padx=(8, 0))
        self.comments = tk.Listbox(right, height=16)
        self.comments.pack(fill="both", expand=True)

    def set_posts(self, posts) -> None:
        labels = [f"{row['title']} ({row['category']})" for row in posts]
        self.post_ids_by_label = {label: row["id"] for label, row in zip(labels, posts)}
        self.post_selector["values"] = labels
        if labels:
            self.post_selector.current(0)
            self.on_select_post(self.post_ids_by_label[labels[0]])

    def render(self, payload: dict) -> None:
        post = payload["post"]
        self.title_var.set(post["title"])
        self.meta_var.set(f"{post['author_name']} ({post['handle']}) | {post['category']} | {post['likes']} likes")
        self.specs_var.set(
            f"Power: {post['horsepower']} | Torque: {post['torque']} | Drivetrain: {post['drivetrain']} | Platform: {post['platform']}"
        )

        self.body_text.configure(state="normal")
        self.body_text.delete("1.0", tk.END)
        self.body_text.insert("1.0", post["body"])
        self.body_text.configure(state="disabled")

        self.comments.delete(0, tk.END)
        for row in payload["comments"]:
            self.comments.insert(tk.END, f"{row['author_name']}: {row['comment_text']}")

    def _handle_selection(self, _event) -> None:
        label = self.post_selector.get()
        if label in self.post_ids_by_label:
            self.on_select_post(self.post_ids_by_label[label])
