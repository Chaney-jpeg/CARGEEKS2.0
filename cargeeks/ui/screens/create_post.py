import tkinter as tk
from tkinter import messagebox
from tkinter import ttk


class CreatePostScreen(tk.Frame):
    def __init__(self, master: ttk.Notebook, on_publish) -> None:
        super().__init__(master, bg="#f9f6f2", padx=16, pady=16)
        self.on_publish = on_publish
        self.user_id_by_label: dict[str, int] = {}

        tk.Label(self, text="Create post", font=("Segoe UI", 20, "bold"), bg="#f9f6f2").pack(anchor="w")
        tk.Label(self, text="Compose and publish directly to SQLite", font=("Segoe UI", 10), bg="#f9f6f2", fg="#666666").pack(anchor="w", pady=(2, 10))

        form = tk.Frame(self, bg="#f9f6f2")
        form.pack(fill="x")

        tk.Label(form, text="Author", bg="#f9f6f2").grid(row=0, column=0, sticky="w", pady=4)
        self.author = ttk.Combobox(form, state="readonly", width=56)
        self.author.grid(row=0, column=1, sticky="w", padx=8, pady=4)

        tk.Label(form, text="Title", bg="#f9f6f2").grid(row=1, column=0, sticky="w", pady=4)
        self.title = ttk.Entry(form, width=78)
        self.title.grid(row=1, column=1, sticky="w", padx=8, pady=4)

        tk.Label(form, text="Category", bg="#f9f6f2").grid(row=2, column=0, sticky="w", pady=4)
        self.category = ttk.Combobox(
            form,
            state="readonly",
            values=["Build", "Restoration", "Review", "Mods", "Track day", "News"],
            width=24,
        )
        self.category.grid(row=2, column=1, sticky="w", padx=8, pady=4)

        tk.Label(form, text="Excerpt", bg="#f9f6f2").grid(row=3, column=0, sticky="w", pady=4)
        self.excerpt = ttk.Entry(form, width=78)
        self.excerpt.grid(row=3, column=1, sticky="w", padx=8, pady=4)

        metrics = tk.Frame(self, bg="#f9f6f2")
        metrics.pack(fill="x", pady=(8, 0))

        tk.Label(metrics, text="HP", bg="#f9f6f2").grid(row=0, column=0, sticky="w")
        self.horsepower = ttk.Entry(metrics, width=18)
        self.horsepower.grid(row=0, column=1, sticky="w", padx=(8, 24))

        tk.Label(metrics, text="Torque", bg="#f9f6f2").grid(row=0, column=2, sticky="w")
        self.torque = ttk.Entry(metrics, width=18)
        self.torque.grid(row=0, column=3, sticky="w", padx=(8, 24))

        tk.Label(metrics, text="Drivetrain", bg="#f9f6f2").grid(row=0, column=4, sticky="w")
        self.drivetrain = ttk.Entry(metrics, width=18)
        self.drivetrain.grid(row=0, column=5, sticky="w", padx=(8, 24))

        tk.Label(metrics, text="Platform", bg="#f9f6f2").grid(row=0, column=6, sticky="w")
        self.platform = ttk.Entry(metrics, width=18)
        self.platform.grid(row=0, column=7, sticky="w", padx=(8, 0))

        tk.Label(self, text="Body", font=("Segoe UI", 10, "bold"), bg="#f9f6f2").pack(anchor="w", pady=(12, 4))
        self.body = tk.Text(self, wrap="word", height=13, font=("Segoe UI", 10))
        self.body.pack(fill="both", expand=True)

        ttk.Button(self, text="Publish", command=self._publish).pack(anchor="w", pady=(10, 0))

    def set_users(self, users) -> None:
        labels = [f"{row['first_name']} {row['last_name']} ({row['handle']})" for row in users]
        self.user_id_by_label = {label: row["id"] for label, row in zip(labels, users)}
        self.author["values"] = labels
        if labels:
            default_label = next((label for label in labels if "@alexk_builds" in label), labels[0])
            self.author.set(default_label)
        self.category.set("Build")

    def _publish(self) -> None:
        author_label = self.author.get()
        user_id = self.user_id_by_label.get(author_label)
        title = self.title.get().strip()
        category = self.category.get().strip()
        excerpt = self.excerpt.get().strip()
        body = self.body.get("1.0", tk.END).strip()

        if not user_id or not title or not category or not excerpt or not body:
            messagebox.showerror("Missing fields", "Author, title, category, excerpt, and body are required.")
            return

        payload = {
            "user_id": user_id,
            "title": title,
            "category": category,
            "excerpt": excerpt,
            "body": body,
            "horsepower": self.horsepower.get().strip() or "N/A",
            "torque": self.torque.get().strip() or "N/A",
            "drivetrain": self.drivetrain.get().strip() or "N/A",
            "platform": self.platform.get().strip() or "General",
        }
        self.on_publish(payload)

        self.title.delete(0, tk.END)
        self.excerpt.delete(0, tk.END)
        self.horsepower.delete(0, tk.END)
        self.torque.delete(0, tk.END)
        self.drivetrain.delete(0, tk.END)
        self.platform.delete(0, tk.END)
        self.body.delete("1.0", tk.END)
        messagebox.showinfo("Published", "Post saved and available across screens.")
