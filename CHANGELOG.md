# Changes

## 0.14.2 (2024-01-31)

Bugfix release

- [`#OF/3774`][#OF/3774] Fixed dark mode support for select/dropdowns.

[#OF/3774]: https://github.com/open-formulieren/open-forms/issues/3774

## 0.14.1 (2024-01-24)

Bugfix release

- [`#OF/3616`][#OF/3616] Fixed validation bug for `minTime`/`maxTime`

[#OF/3616]: https://github.com/open-formulieren/open-forms/issues/3616

## 0.14.0 (2024-01-23)

Improvement release

- [`#OF/3755`][#OF/3755] Added options to `date` component to not wipe invalid values in the
  renderer.
- [`#OF/3755`][#OF/3755] Added options to `datetime` component to not wipe invalid values in the
  renderer.

[#OF/3755]: https://github.com/open-formulieren/open-forms/issues/3755

## 0.13.3 (2024-01-18)

Bugfix release

- [`#OF/3774`][#OF/3774] Fix dark mode compatibility

[#OF/3774]: https://github.com/open-formulieren/open-forms/issues/3774

## 0.13.2 (2024-01-11)

Bugfix release

- [`#3761`][#3761] Fixed a bug where component default values were mutated. This affected fieldset,
  editgrid and columns, possibly others.

[#3761]: https://github.com/open-formulieren/open-forms/issues/3761

## 0.13.1 (2024-01-09)

Bugfixes after extensive testing in the Open Forms backend.

All issues were reported in [`#3733`](https://github.com/open-formulieren/open-forms/issues/3733).

- Fixed some `date`/`datetime` component validation errors not being displayed.
- Fixed the `fixedValue` validation mode for `date`/`datetime` components not being considered
  valid.
- Prevent scrollbar on auto-resize text area preview.
- Fixed incorrect form field labels for the `editgrid` component (button text configuration).
- Updated missing translations.
- Fixed setting the `content` component `customClass` property.
- Fixed the preview in the `textfield` component when a `validate.maxLength` is set, to be
  consistent with the SDK behaviour.

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
