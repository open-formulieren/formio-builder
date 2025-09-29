#!/usr/bin/env python
import json
from pathlib import Path

LOCALES_TO_CHECK = ["nl"]

MESSAGES_DIR = Path(".") / "i18n" / "messages"


def main():
    any_missing = False
    for locale in LOCALES_TO_CHECK:
        print(f"Checking locale: {locale}")
        with (MESSAGES_DIR / f"{locale}.json").open() as message_catalog:
            translations = json.load(message_catalog)

        for unique_id, trans_object in translations.items():
            # skip translated messages
            if trans_object["defaultMessage"] != trans_object["originalDefault"]:
                continue
            if trans_object.get("isTranslated", False):
                continue

            any_missing = True
            print(
                f"ID '{unique_id}' appears untranslated, defaultMessage: "
                f"{trans_object['originalDefault']}"
            )

    exit(1 if any_missing else 0)


if __name__ == "__main__":
    main()
