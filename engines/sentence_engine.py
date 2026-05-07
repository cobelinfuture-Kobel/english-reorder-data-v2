import random
import uuid


class SentenceEngine:
    def __init__(self, sentence_bank):
        self.bank = {}
        self.answer_key = {}
        self._load_and_validate(sentence_bank)

    def _load_and_validate(self, data_list):
        required = ["sentence_id", "level", "scenario", "target_sentence", "chunks", "translation"]

        for item in data_list:
            missing = [f for f in required if f not in item]
            if missing:
                raise ValueError(f"{item.get('sentence_id', 'Unknown')} missing fields: {missing}")

            self.bank[item["sentence_id"]] = item

    def get_random_question_payload(self, level=None, scenario=None, task_type="original"):
        ids = [
            s_id for s_id, data in self.bank.items()
            if (level is None or data["level"] == level)
            and (scenario is None or data["scenario"] == scenario)
        ]

        if not ids:
            return None

        sentence_id = random.choice(ids)
        return self.get_question_payload(sentence_id, task_type)

    def get_question_payload(self, sentence_id, task_type="original"):
        data = self.bank.get(sentence_id)
        if not data:
            return None

        task_payload = self._get_task_payload(data, task_type)
        raw_chunks = task_payload["chunks"] if task_payload else None
        if raw_chunks is None:
            return None

        question_id = str(uuid.uuid4())

        chunk_objects = [
            {
                "chunk_id": str(uuid.uuid4()),
                "text": text
            }
            for text in raw_chunks
        ]

        correct_ids = [chunk["chunk_id"] for chunk in chunk_objects]
        self.answer_key[question_id] = {
            "sentence_id": sentence_id,
            "task_type": task_type,
            "correct_ids": correct_ids
        }

        shuffled_chunks = self._shuffle_chunks(chunk_objects)

        return {
            "question_id": question_id,
            "sentence_id": sentence_id,
            "task_type": task_type,
            "shuffled_chunks": shuffled_chunks,
            "translation": data["translation"],
            "audio_hint_text": task_payload["target"],
            "level": data.get("level"),
            "pattern_id": data.get("pattern_id"),
        }

    def _get_task_payload(self, data, task_type):
        if task_type == "original":
            return {
                "chunks": data["chunks"],
                "target": data["target_sentence"],
            }

        task = next(
            (t for t in data.get("fsi_tasks", []) if t["task_type"] == task_type),
            None
        )

        if task is None:
            return None

        return {
            "chunks": task["chunks"],
            "target": task["target"],
        }

    def _shuffle_chunks(self, chunks, max_attempts=20):
        shuffled = chunks[:]

        if len(shuffled) <= 1:
            return shuffled

        for _ in range(max_attempts):
            random.shuffle(shuffled)
            if shuffled != chunks:
                return shuffled

        return list(reversed(chunks))

    def check_answer(self, question_id, user_chunk_ids):
        record = self.answer_key.get(question_id)

        if not record:
            return {
                "is_correct": False,
                "mistake_type": "invalid_question_id"
            }

        correct_ids = record["correct_ids"]
        is_correct = user_chunk_ids == correct_ids

        return {
            "is_correct": is_correct,
            "mistake_type": None if is_correct else "word_order_error"
        }
