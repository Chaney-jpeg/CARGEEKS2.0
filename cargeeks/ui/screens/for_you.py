import tkinter as tk
from tkinter import ttk


class ForYouScreen(tk.Frame):
    def __init__(self, master: ttk.Notebook, on_interest_change) -> None:
        super().__init__(master, bg="#f9f6f2", padx=16, pady=16)
        self.on_interest_change = on_interest_change

        top = tk.Frame(self, bg="#f9f6f2")
        top.pack(fill="x")

        tk.Label(top, text="For you", font=("Segoe UI", 20, "bold"), bg="#f9f6f2").pack(side="left")
        self.interest = ttk.Combobox(
            top,
            state="readonly",
            values=["Build", "Restoration", "Review", "Mods", "Track", "EV", "Porsche", "Audi"],
            width=18,
        )
        self.interest.pack(side="left", padx=8)
        self.interest.bind("<<ComboboxSelected>>", self._handle_interest)

        body = tk.Frame(self, bg="#f9f6f2")
        body.pack(fill="both", expand=True, pady=(10, 0))

        left = tk.LabelFrame(body, text="Recommended feed", bg="#ffffff", padx=8, pady=8)
        left.pack(side="left", fill="both", expand=True, padx=(0, 8))
        self.recommended = tk.Listbox(left, height=14)
        self.recommended.pack(fill="both", expand=True)

        center = tk.LabelFrame(body, text="People Alex follows", bg="#ffffff", padx=8, pady=8)
        center.pack(side="left", fill="both", expand=True, padx=8)
        self.following = tk.Listbox(center, height=14)
        self.following.pack(fill="both", expand=True)

        right = tk.LabelFrame(body, text="Suggested for you", bg="#ffffff", padx=8, pady=8)
        right.pack(side="left", fill="both", expand=True, padx=(8, 0))
        self.suggested = tk.Listbox(right, height=14)
        self.suggested.pack(fill="both", expand=True)

    def set_default_interest(self, interest: str) -> None:
        self.interest.set(interest)

    def render(self, payload: dict) -> None:
        self.recommended.delete(0, tk.END)
        recommended = payload["recommended"]
        if not recommended:
            self.recommended.insert(tk.END, "No matches found for this interest.")
        for row in recommended:
            self.recommended.insert(
                tk.END,
                f"[{row['category']}] {row['title']} - {row['author_name']} ({row['likes']} likes)",
            )

        self.following.delete(0, tk.END)
        for row in payload["following"]:
            self.following.insert(
                tk.END,
                f"{row['first_name']} {row['last_name']} ({row['handle']})",
            )

        self.suggested.delete(0, tk.END)
        for row in payload["suggested"]:
            self.suggested.insert(
                tk.END,
                f"{row['first_name']} {row['last_name']} - {row['interest_note']}",
            )

    def _handle_interest(self, _event) -> None:
        self.on_interest_change(self.interest.get())
