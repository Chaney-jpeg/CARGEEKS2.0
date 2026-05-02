import tkinter as tk
from tkinter import ttk


class ProfileScreen(tk.Frame):
    def __init__(self, master: ttk.Notebook, on_select_user) -> None:
        super().__init__(master, bg="#f9f6f2", padx=16, pady=16)
        self.on_select_user = on_select_user
        self.user_id_by_label: dict[str, int] = {}

        top = tk.Frame(self, bg="#f9f6f2")
        top.pack(fill="x")

        tk.Label(top, text="Profile", font=("Segoe UI", 20, "bold"), bg="#f9f6f2").pack(side="left")
        self.user_selector = ttk.Combobox(top, state="readonly", width=58)
        self.user_selector.pack(side="left", padx=8)
        self.user_selector.bind("<<ComboboxSelected>>", self._handle_selection)

        self.name_var = tk.StringVar(value="")
        self.bio_var = tk.StringVar(value="")
        self.stats_var = tk.StringVar(value="")

        tk.Label(self, textvariable=self.name_var, font=("Segoe UI", 14, "bold"), bg="#f9f6f2").pack(anchor="w", pady=(10, 2))
        tk.Label(self, textvariable=self.bio_var, font=("Segoe UI", 10), bg="#f9f6f2", fg="#666666", wraplength=1040, justify="left").pack(anchor="w")
        tk.Label(self, textvariable=self.stats_var, font=("Segoe UI", 10, "bold"), bg="#f9f6f2").pack(anchor="w", pady=(4, 8))

        body = tk.Frame(self, bg="#f9f6f2")
        body.pack(fill="both", expand=True)

        left = tk.LabelFrame(body, text="Garage", bg="#ffffff", padx=8, pady=8)
        left.pack(side="left", fill="both", expand=True, padx=(0, 8))

        self.garage = ttk.Treeview(left, columns=("year", "model", "status"), show="headings", height=14)
        self.garage.heading("year", text="Year")
        self.garage.heading("model", text="Model")
        self.garage.heading("status", text="Status")
        self.garage.column("year", width=80, anchor="center")
        self.garage.column("model", width=220, anchor="w")
        self.garage.column("status", width=260, anchor="w")
        self.garage.pack(fill="both", expand=True)

        right = tk.LabelFrame(body, text="Recent activity", bg="#ffffff", padx=8, pady=8)
        right.pack(side="left", fill="both", expand=True, padx=(8, 0))

        self.activity = tk.Listbox(right, height=14)
        self.activity.pack(fill="both", expand=True)

    def set_users(self, users) -> None:
        labels = [f"{row['first_name']} {row['last_name']} ({row['handle']})" for row in users]
        self.user_id_by_label = {label: row["id"] for label, row in zip(labels, users)}
        self.user_selector["values"] = labels
        if labels:
            default_label = next((label for label in labels if "@alexk_builds" in label), labels[0])
            self.user_selector.set(default_label)
            self.on_select_user(self.user_id_by_label[default_label])

    def render(self, payload: dict) -> None:
        user = payload["user"]
        stats = payload["stats"]

        self.name_var.set(f"{user['first_name']} {user['last_name']} ({user['handle']})")
        self.bio_var.set(user["bio"])
        self.stats_var.set(
            f"Posts: {stats['posts']} | Followers: {stats['followers']} | Following: {stats['following']}"
        )

        for item in self.garage.get_children():
            self.garage.delete(item)
        for row in payload["garage"]:
            self.garage.insert("", tk.END, values=(row["car_year"], row["car_model"], row["status"]))

        self.activity.delete(0, tk.END)
        for row in payload["activity"]:
            self.activity.insert(tk.END, f"[{row['category']}] {row['title']} ({row['likes']} likes)")

    def _handle_selection(self, _event) -> None:
        label = self.user_selector.get()
        if label in self.user_id_by_label:
            self.on_select_user(self.user_id_by_label[label])
