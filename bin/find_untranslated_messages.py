#!/usr/bin/env python
import json
from pathlib import Path

LOCALES_TO_CHECK = ["nl"]

MESSAGES_DIR = Path(".") / "i18n" / "messages"


def main():
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

          print(
              f"ID '{unique_id}' appears untranslated, defaultMessage: {trans_object['originalDefault']}"
          )


if __name__ == "__main__":
    main()
