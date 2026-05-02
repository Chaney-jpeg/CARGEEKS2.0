import tkinter as tk
from tkinter import ttk


def apply_theme(root: tk.Tk) -> None:
    style = ttk.Style(root)
    style.theme_use("clam")

    style.configure("TNotebook", background="#f2eee8", borderwidth=0)
    style.configure("TNotebook.Tab", padding=(12, 8), font=("Segoe UI", 10, "bold"))

    style.configure("Treeview", rowheight=24, font=("Segoe UI", 10))
    style.configure("Treeview.Heading", font=("Segoe UI", 10, "bold"))
