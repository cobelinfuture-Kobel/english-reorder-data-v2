import random


class QuestEngine:
    ADAPTIVE_STATUS_WEIGHTS = {
        "weak": 3,
        "developing": 2,
        "strong": 1,
    }

    def __init__(self, sentence_bank, learning_engine, quest_size=10):
        self.sentence_bank = sentence_bank
        self.learning_engine = learning_engine
        self.quest_size = quest_size
        self.bank = {item["sentence_id"]: item for item in sentence_bank}

    def build_quest(self, user_id, level=None, scenario=None):
        seen_ids = set(self.learning_engine.get_seen_sentence_ids(user_id))
        filtered_items = self._filter_items(level=level, scenario=scenario)
        bank_ids = [item["sentence_id"] for item in filtered_items]
        random.shuffle(bank_ids)
        due_id_set = set(self.learning_engine.get_due_sentence_ids(user_id))
        due_ids = [sentence_id for sentence_id in bank_ids if sentence_id in due_id_set]

        quest = []
        quest.extend(self._build_items(due_ids, source="due"))

        if len(quest) < self.quest_size:
            new_ids = [sentence_id for sentence_id in bank_ids if sentence_id not in seen_ids]
            quest.extend(
                self._build_items(
                    new_ids,
                    source="new",
                    excluded_ids=self._quest_sentence_ids(quest),
                )
            )

        if len(quest) < self.quest_size:
            fallback_ids = [sentence_id for sentence_id in bank_ids if sentence_id in seen_ids]
            quest.extend(
                self._build_items(
                    fallback_ids,
                    source="fallback",
                    excluded_ids=self._quest_sentence_ids(quest),
                )
            )

        return quest[: self.quest_size]

    def build_adaptive_quest(self, user_id, level=None, scenario=None, total=10):
        filtered_items = self._filter_items(level=level, scenario=scenario)
        if not filtered_items:
            return []

        skill_report = self.learning_engine.get_skill_report(user_id)
        selected_ids = []
        remaining_items = list(filtered_items)

        while remaining_items and len(selected_ids) < total:
            weights = [self._sentence_weight(item, skill_report) for item in remaining_items]
            chosen_item = random.choices(remaining_items, weights=weights, k=1)[0]
            selected_ids.append(chosen_item["sentence_id"])
            remaining_items = [
                item for item in remaining_items
                if item["sentence_id"] != chosen_item["sentence_id"]
            ]

        adaptive_items = [
            self._build_item(sentence_id, source="adaptive")
            for sentence_id in selected_ids
        ]

        if len(adaptive_items) < total:
            fallback_items = self.build_quest(user_id, level=level, scenario=scenario)
            existing_ids = self._quest_sentence_ids(adaptive_items)
            for item in fallback_items:
                if item["sentence_id"] in existing_ids:
                    continue
                adaptive_items.append(item)
                existing_ids.add(item["sentence_id"])
                if len(adaptive_items) >= total:
                    break

        return adaptive_items[:total]

    def _build_items(self, candidate_ids, source, allowed_ids=None, excluded_ids=None):
        allowed_ids = allowed_ids or set(candidate_ids)
        excluded_ids = excluded_ids or set()

        result = []
        for sentence_id in candidate_ids:
            if sentence_id not in allowed_ids:
                continue
            if sentence_id in excluded_ids:
                continue
            result.append(self._build_item(sentence_id, source=source))
            if len(result) + len(excluded_ids) >= self.quest_size:
                break
        return result

    def _quest_sentence_ids(self, quest_items):
        return {item["sentence_id"] for item in quest_items}

    def _build_item(self, sentence_id, source):
        return {
            "sentence_id": sentence_id,
            "task_type": "original",
            "source": source,
            "grammar_focus": self.bank.get(sentence_id, {}).get("grammar_focus", []),
        }

    def _filter_items(self, level=None, scenario=None):
        return [
            item for item in self.sentence_bank
            if (level is None or item.get("level") == level)
            and (scenario is None or item.get("scenario") == scenario)
        ]

    def _sentence_weight(self, sentence_item, skill_report):
        grammar_focus = sentence_item.get("grammar_focus", [])
        if not grammar_focus:
            return 2

        weights = []
        for grammar_key in grammar_focus:
            status = skill_report.get(grammar_key, {}).get("status")
            weights.append(self.ADAPTIVE_STATUS_WEIGHTS.get(status, 2))
        return sum(weights) / len(weights)
