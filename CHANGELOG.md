# Changes

## 0.13.0 (2024-01-03)

Quality of life release

- `CKEditor` is now stubbed out in jest tests - the CSS cannot be parsed by jest-dom.
- [#105] Fixed the number & currency component `null` default value causing validation errors.
- [#35] Replaced tooltip implementation with better alternative
- [#32] Cleaned up validation error introspection tools, applying DRY and improving DX.

## 0.12.0 (2023-12-28)

The builder is now feature-complete in terms of edit forms.

- Implemented password component type edit form
- Removed dead/obsolete translations code
- Cleaned up signature of edit form validation hook
