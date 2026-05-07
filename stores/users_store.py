import json
from datetime import datetime
from pathlib import Path


class UsersStore:
    def __init__(self, path, now_fn=None):
        self.path = Path(path)
        self.now_fn = now_fn or datetime.now
        self._ensure_file()

    def login(self, username):
        normalized_username = (username or "").strip()
        if not normalized_username:
            raise ValueError("Username is required")

        users = self._load()
        now_iso = self.now_fn().isoformat()

        for user in users:
            if user["username"] == normalized_username:
                user["last_login"] = now_iso
                self._save(users)
                return user

        user = {
            "id": self._next_id(users),
            "username": normalized_username,
            "last_login": now_iso,
            "role": "student",
            "created_at": now_iso,
        }
        users.append(user)
        self._save(users)
        return user

    def get_user(self, user_id):
        users = self._load()
        for user in users:
            if user["id"] == user_id:
                return user
        return None

    def user_exists(self, user_id):
        return self.get_user(user_id) is not None

    def _ensure_file(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if not self.path.exists():
            self.path.write_text("[]", encoding="utf-8")

    def _load(self):
        self._ensure_file()
        with self.path.open("r", encoding="utf-8") as f:
            return json.load(f)

    def _save(self, users):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.open("w", encoding="utf-8") as f:
            json.dump(users, f, indent=4, ensure_ascii=False)

    def _next_id(self, users):
        max_number = 0
        for user in users:
            user_id = user.get("id", "")
            if not user_id.startswith("user_"):
                continue
            try:
                max_number = max(max_number, int(user_id.split("_")[1]))
            except (IndexError, ValueError):
                continue
        return f"user_{max_number + 1:03d}"
