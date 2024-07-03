# Changes

## 0.23.0 (2024-07-03)

- [`OF#4423`][OF#4423] Added layout dropdown (single/double column) for addressNL field. [OF#4423]:
  https://github.com/open-formulieren/open-forms/issues/4423

- Deprecate textfield location derivation

## 0.22.0 (2024-06-18)

[`OF#4051`][OF#4051] Added a new JSON Editor.

[OF#4051]: https://github.com/open-formulieren/open-forms/issues/4051

## 0.21.1 (2024-05-13)

Added missing Dutch translations.

## 0.21.0 (2024-05-13)

Removed translations support for `defaultValue`.

Handling singular/array values at the same time is too complex for a feature that is unused, so we
decided to drop translation support after it became clear it causes crashes (see
[`OF#4362`][OF#4362]).

[OF##4362]: https://github.com/open-formulieren/open-forms/issues/#4362

## 0.20.0 (2024-05-12)

Added support for city/street name deriviation in AddressNL component.

## 0.19.1 (2024-04-26)

Added missing translations.

## 0.19.0 (2024-04-26)

Feature release

💥 Breaking change

The custom CSS is now split into its own bundle rather than being injected into the document
automatically. Make sure to load/import `@open-formulieren/formio-builder/css/index.css`.

- Added SCSS pipeline for custom styling instead of `@emotion/css`

- [`OF#3964`][OF#3964] Use proper boolean values for checkbox trigger components in simple
  conditionals.
- [`OF#4064`][OF#4064] Radio component (default) values can now be cleared.
- [`OF#4158`][OF#4158] Added additional `invalid_date` and `invalid_datetime` error message keys to
  date and datetime component edit forms.
- Updated dependencies with security patches.

[OF#3964]: https://github.com/open-formulieren/open-forms/issues/3964
[OF#4064]: https://github.com/open-formulieren/open-forms/issues/4064
[OF#4158]: https://github.com/open-formulieren/open-forms/issues/4158

## 0.18.4 (2024-04-17)

Bugfix release

- [`OF#4186`][OF#4186] Fix conditional logic value being cleared

[OF#4186]: https://github.com/open-formulieren/open-forms/issues/4186

## 0.18.3 (2024-04-15)

Fixed a regression in #4155

## 0.18.2 (2024-04-15)

Bugfix release

- Upgraded Storybook to v8
- [`OF#3964`][OF#3964] Fixed the datatype of the `eq` reference value depending on the reference
  component used for comparison.
- Added missing error message codes for selectboxes
- [`OF#4155`][OF#4155] Fixed some validation errors in the date component not showing an indicator
  on the validation tab.

[OF#3964]: https://github.com/open-formulieren/open-forms/issues/3964
[OF#4155]: https://github.com/open-formulieren/open-forms/issues/4155

## 0.18.1 (2024-04-05)

Bugfix release

- [`OF#4084`][OF#4084] Fix default value of multiple `select` component

[OF#4084]: https://github.com/open-formulieren/open-forms/issues/4084

## 0.18.0 (2024-03-20)

Feature release

- [`OF#3823`][OF#3823] Added links in the builder UI to the manual about template expressions.
- [`OF#3943`][OF#3943] Fixed not being able to specify 0 decimal places in number components.
- [`OF#3978`][OF#3978] Fixed not being able to specify custom `minDate` and `maxDate` validation
  error messages.
- [`SDK#483`][SDK#483] Radio/selectboxes components now support an additional description per
  option.

[OF#3823]: https://github.com/open-formulieren/open-forms/issues/3823
[OF#3943]: https://github.com/open-formulieren/open-forms/issues/3943
[OF#3978]: https://github.com/open-formulieren/open-forms/issues/3978
[SDK#483]: https://github.com/open-formulieren/open-forms-sdk/issues/483

## 0.17.0 (2024-02-28)

Fixed some bugs and added improvements

- [`OF#3920`][OF#3920] Fixed content style and simple logic dropdowns not being clearable
- [`OF#3922`][OF#3922] Fixed bad default/empty values for prefill properties
- [`OF#3928`][OF#3928] Added JSON view/edit toggles to content component edit form

[OF#3920]: https://github.com/open-formulieren/open-forms/issues/3920
[OF#3922]: https://github.com/open-formulieren/open-forms/issues/3922
[OF#3928]: https://github.com/open-formulieren/open-forms/issues/3928

## 0.16.1 (2024-02-12)

Bugfix release

- [`OF#3858`][OF#3858] Fixed toggling file upload 'multiple' breaking the preview.

[OF#3858]: https://github.com/open-formulieren/open-forms/issues/3858

## 0.14.3 (2024-02-12)

Bugfix release

- [`OF#3858`][OF#3858] Fixed toggling file upload 'multiple' breaking the preview.

[OF#3858]: https://github.com/open-formulieren/open-forms/issues/3858

## 0.16.0 (2024-02-08)

- [`OF#3727`][OF#3727] Add min/max count for selectboxes

[OF#3727]: https://github.com/open-formulieren/open-forms/issues/3727

- Update types version to 0.21.0

## 0.15.1 (2024-02-01)

Removed remaining AuthPlugin

- [`OF#3680`][OF#3680] Remove forgotten AuthPlugin component

[OF#3680]: https://github.com/open-formulieren/open-forms/issues/3680

## 0.15.0 (2024-01-31)

Improvement release

- [`OF#3680`][OF#3680] Removed `authPlugin` property from Cosign V2 component as it can be derived
  from the form itself.

[OF#3680]: https://github.com/open-formulieren/open-forms/issues/3680

## 0.14.2 (2024-01-31)

Bugfix release

- [`OF#3774`][OF#3774] Fixed dark mode support for select/dropdowns.

[OF#3774]: https://github.com/open-formulieren/open-forms/issues/3774

## 0.14.1 (2024-01-24)

Bugfix release

- [`OF#3616`][OF#3616] Fixed validation bug for `minTime`/`maxTime`

[OF#3616]: https://github.com/open-formulieren/open-forms/issues/3616

## 0.14.0 (2024-01-23)

Improvement release

- [`OF#3755`][OF#3755] Added options to `date` component to not wipe invalid values in the renderer.
- [`OF#3755`][OF#3755] Added options to `datetime` component to not wipe invalid values in the
  renderer.

[OF#3755]: https://github.com/open-formulieren/open-forms/issues/3755

## 0.13.3 (2024-01-18)

Bugfix release

- [`OF#3774`][OF#3774] Fix dark mode compatibility

[OF#3774]: https://github.com/open-formulieren/open-forms/issues/3774

## 0.13.2 (2024-01-11)

Bugfix release

- [`OF#3761`][#3761] Fixed a bug where component default values were mutated. This affected
  fieldset, editgrid and columns, possibly others.

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
- [`#105`][#105] Fixed the number & currency component `null` default value causing validation
  errors.
- [`#35`][#35] Replaced tooltip implementation with better alternative
- [`#32`][#32] Cleaned up validation error introspection tools, applying DRY and improving DX.

[#105]: https://github.com/open-formulieren/formio-builder/issues/105
[#35]: https://github.com/open-formulieren/formio-builder/issues/35
[#32]: https://github.com/open-formulieren/formio-builder/issues/32

## 0.12.0 (2023-12-28)

The builder is now feature-complete in terms of edit forms.

- Implemented password component type edit form
- Removed dead/obsolete translations code
- Cleaned up signature of edit form validation hook
