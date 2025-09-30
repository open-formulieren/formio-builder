# Changes

## 0.45.0 (2025-09-30)

Quality of life improvements.

- [`OF#5191`][OF#5191] Display error message in the preview if the map configuration is invalid
  rather than falling back to the error boundary.

  - Added additional descriptions/help texts for configuration options.
  - Improved validation behaviour.
  - Added error boundary around the generic component preview to prevent the entire modal from
    crashing.

- Replaced parts of the CI-pipeline with reusable actions.
- Added check for missing translations in CI.

[OF#5191]: https://github.com/open-formulieren/open-forms/issues/5191

## 0.44.1 (2025-09-24)

Bugfix release.

- Added missing Dutch translations.

## 0.44.0 (2025-09-12)

Feature release.

- [`OF#5575`][OF#5575] Added support for adding (WMS) tile layers to the map component.

[OF#5575]: https://github.com/open-formulieren/open-forms/issues/5575

## 0.43.0 (2025-08-25)

- [`OF#5439`][OF#5439] Removed deprecation warning for textfield location derivation.

[OF#5439]: https://github.com/open-formulieren/open-forms/issues/5439

## 0.42.0 (2025-07-23)

Feature release.

- [`#226`][#226] Added Children component for the new Family members prefill plugin.

[#226]: https://github.com/open-formulieren/formio-builder/issues/226

- Updated types version to 0.44.0

## 0.41.1 (2025-07-10)

Added missing Dutch translations.

## 0.41.0 (2025-05-26)

Feature release.

- [`#225`][#225] Added Partners component for the new Family members prefill plugin.

[#225]: https://github.com/open-formulieren/formio-builder/issues/225

## 0.40.0 (2025-04-02)

Small improvements release.

- [`OF#5207`][OF#5207] Converted Dutch code to English for consistency.

[OF#5207]: https://github.com/open-formulieren/open-forms/issues/5207

## 0.39.0 (2025-03-28)

Small improvements release.

- Upgraded to latest storybook version.
- [`OF#5207`][OF#5207] Added missing validation for reference lists configuration in radio, select
  and selectboxes components.

[OF#5207]: https://github.com/open-formulieren/open-forms/issues/5207

## 0.38.0 (2025-03-14)

Bugfix release

- [`OF#5105`][OF#5105] Fixed required fields asterisks being shown on top of open select menus.
- [`OF#5107`][OF#5107] Added support for displaying reference lists values in component previews.
- Fixed the type safety (and checking) of story and test files.

[OF#5105]: https://github.com/open-formulieren/open-forms/issues/5105
[OF#5107]: https://github.com/open-formulieren/open-forms/issues/5107

## 0.37.0 (2025-02-06)

Feature release

- [`OF#5016`][OF#5016] Add `referentielijsten` as a `dataSrc` for select/selectboxes/radio
  components
- [`OF#5025`][OF#5025] Use generally configured filetypes by default

[OF#5016]: https://github.com/open-formulieren/open-forms/issues/5016
[OF#5025]: https://github.com/open-formulieren/open-forms/issues/5025

## 0.36.0 (2025-01-24)

Feature release

- [`OF#5006`][OF#5006] Updated stories for manual AddressNL city/street name fallback in case
  autofill isn't available.

[OF#5006]: https://github.com/open-formulieren/open-forms/issues/5006

## 0.35.0 (2025-01-15)

Feature and bugfix release

- [`OF#2177`][OF#2177] Added multiple drawing shapes to the map component:
  - Users can now place markers, polygons and polylines on maps
  - Moved map configuration to separate 'Map settings' tab

[OF#2177]: https://github.com/open-formulieren/open-forms/issues/2177

## 0.34.0 (2024-12-13)

Feature and bugfix release

- [`OF#4319`][OF#4319] Updated title's tooltip in Upload File Component to be more specific.
- [`OF#2173`][OF#2173] Added background configuration to the map component.

[OF#4319]: https://github.com/open-formulieren/open-forms/issues/4319
[OF#2173]: https://github.com/open-formulieren/open-forms/issues/4880

## 0.33.0 (2024-11-25)

💥 Breaking changes release

- [`OF#3283`][OF#3283] Dropped support for the password component.
- [`OF#4606`][OF#4606] Updated the expected data/props following changes in the backend serializers.

[OF#3283]: https://github.com/open-formulieren/open-forms/issues/3283
[OF#4606]: https://github.com/open-formulieren/open-forms/issues/4606

## 0.32.0 (2024-11-12)

Feature and bugfix release

- [`OF#4320`][OF#4320] Update cosign language used.
- [`OF#4813`][OF#4813] Enabled prefill on number components.
- [`OF#4772`][OF#4772] Enforce select values to be interpreted as strings in Formio.

[OF#4320]: https://github.com/open-formulieren/open-forms/issues/4320
[OF#4813]: https://github.com/open-formulieren/open-forms/issues/4813
[OF#4772]: https://github.com/open-formulieren/open-forms/issues/4772

## 0.31.0 (2024-10-16)

Feature release

- [`OP#24`][OP#24] Reverted having to select a product in the `productPrice` component.
- [`OF#4546`][OF#4546] Added support for soft-required validation:
  - File upload components can now be soft-required
  - Added a new custom component type to dislay soft-required validation errors
- Upgraded to latest Storybook version.
- Added explicit sorting to story folders.

[OP#24]: https://github.com/maykinmedia/open-producten/issues/24
[OF#4546]: https://github.com/open-formulieren/open-forms/issues/4546

## 0.30.0 (2024-10-10)

- [`OF#4636`][OF#4636] Updated translation tab table widths and fixed view breaking overflow.
- [`OF#4637`][OF#4637] Fixed optional translations acting as required.

[OF#4636]: https://github.com/open-formulieren/open-forms/issues/4636
[OF#4637]: https://github.com/open-formulieren/open-forms/issues/4637

## 0.29.0 (2024-09-24)

- [`OP#24`][OP#24] Added experimental Product prices component.

[OP#24]: https://github.com/maykinmedia/open-producten/issues/24

## 0.28.0 (2024-08-20)

**New features**

- [`OF#4420`][OF#4420] Added validation options for AddressNL postcode and city sub-components.
- [`OF#4542`][OF#4542] Added "require verification" validation option to email component.

- Added a modal component implementation, preparing for future features.

[OF#4420]: https://github.com/open-formulieren/open-forms/issues/4420
[OF#4542]: https://github.com/open-formulieren/open-forms/issues/4542

**Cleanups**

- Updated to NodeJS 20.
- Use the full lodash package instead of split packages (the latter is advised against).
- Refactored how we deal with unknown components.
- Refactored the "mode toggles" into its own component.
- Fixed typescript integration in Jest tests.

## 0.27.0 (2024-08-02)

- Exported `getReactSelectStyles` helper for react-select usage outside of formio-builder.

## 0.26.0 (2024-07-26)

- [`OF#4556`][OF#4556] Updated language/literals to match language used in the backend.
- Upgraded to Storybook 8.2

[OF#4556]: https://github.com/open-formulieren/open-forms/issues/4556

## 0.25.0 (2024-07-18)

- [`OF#4267`][OF#4267] Updated file upload registration tab for changes in backend API.

[OF#4267]: https://github.com/open-formulieren/open-forms/issues/4267

## 0.24.0 (2024-07-09)

Updated our monaco-json-editor dependency to 0.2.0.

## 0.23.2 (2024-07-09)

- [`OF#4405`][OF#4405] Updated selectboxes validation configuration placeholders.

[OF#4405]: https://github.com/open-formulieren/open-forms/issues/4405

## 0.23.1 (2024-07-03)

Added missing Dutch translations.

## 0.23.0 (2024-07-03)

- [`OF#4423`][OF#4423] Added layout dropdown (single/double column) for addressNL field.
- Deprecate textfield location derivation

[OF#4423]: https://github.com/open-formulieren/open-forms/issues/4423

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
