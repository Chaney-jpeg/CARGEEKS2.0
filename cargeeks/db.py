import sqlite3
from pathlib import Path


class Database:
    def __init__(self, db_path: Path, schema_path: Path, seed_path: Path) -> None:
        self.db_path = db_path
        self.schema_path = schema_path
        self.seed_path = seed_path

    def connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def bootstrap(self) -> None:
        self.db_path.parent.mkdir(exist_ok=True)
        with self.connect() as conn:
            conn.executescript(self.schema_path.read_text(encoding="utf-8"))
            conn.executescript(self.seed_path.read_text(encoding="utf-8"))
            conn.commit()
