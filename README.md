# Formio builder for Open Forms

This library implements the builder to build
[Form.io 4.13.x](https://github.com/formio/formio.js/tree/4.13.x/) forms supporting the
[Open Forms](https://github.com/open-formulieren/open-forms) extensions.

[![Run CI build and tests](https://github.com/open-formulieren/formio-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/open-formulieren/formio-builder/actions/workflows/ci.yml)

:construction: This library is currently under heavy development :construction:

The [Storybook](https://open-formulieren.github.io/formio-builder/) documentation is available
online.

The shared types library documentation is available
[online](https://open-formulieren.github.io/types/).

## What is the purpose of this library?

It aims to improve the developer experience for the Open Formulieren development team, both by
making the builder form definition more declarative/direct and obvious, and by using techniques
absolving the need to reason about when to re-render state in the DOM.

Open Forms adds a number of extensions directly in the builder, parts of which are derived from
earlier inputs and require synchronization of certain state. Historically, this has proven to cause
a large number of bugs, annoyances and extremely complex code where we were essentially fighting
Form.io itself.

This library is NOT intended to be a competing library of Form.io's own form builder:

- it does not implement all the Form.io features, only the ones actively used and exposed in Open
  Forms
- it does not implement the Javascript API of Form.io's form builder, instead it provides the hooks
  needed by the Open Forms backend project

## Contributing

Contributions that do not provide a direct benefit to the Open Forms project will unfortunately be
rejected, as we do not have the ambition nor resources to maintain these.

For (code) contributions that do fit the goals of this library, please follow these guidelines:

- Create an issue with a description of the problem or required feature
- Reference the issue ID in commit messages and pull requests
- Functionality should be documented in Storybook
- Functionality should have interaction tests in Storybook to describe and protect the expected
  behaviour

## Getting started

1. Clone the repository and then ensure you use the correct node version:

```bash
nvm use
```

2. Start Storybook in dev mode for component development:

```bash
npm run compilemessages
npm start
```

3. Make code changes, check in Storybook, add tests... etc.

4. Run the tests (Storybook needs to be running still!)

```bash
npm test
```

5. Check that the (Typescript) build compiles cleanly:

```bash
npm run build:esm
```

### Managing translations

Any user-facing literals should be
[defined](https://formatjs.io/docs/getting-started/message-declaration/) as being translatable in
the code.

To extract these messages, there are utility scripts, intended to be run from the root of the
repository.

- `./bin/makemessages.sh` - responsible for extracting translations from the code
- `./bin/find_untranslated_messages.py` - useful to check if you missed any translations

Translations are shipped as assets in the NPM package, in the `i18n` folder. Downstream projects can
[include](https://formatjs.io/docs/guides/distribute-libraries#declaring-with-a-convention) them
from there.

**Compilation**

You can compile the messages using:

```bash
npm run compilemessages
```

This is required for Storybook, as the message catalog is loaded dynamically depending on the active
locale.

## Roadmap

### Builder form

The builder form is the form + preview shown in the edit component modal.

- [x] Set up global structure on how to define the builder form for a particular Form.io component
      type
- [x] Implement generic, bootstrap-based Form.io components to compose forms
- [x] Orchestrate form state with Formik + zod for validation
- [x] Wire up react-intl for localization
- [x] Define and publish Open Forms-specific component type schema's (shared library)
- [x] Figure out how to do react-intl message catalog extraction/management for supported languages
- [ ] Implement the builder forms for the supported component types
  - [x] `textfield`
  - [ ] `textarea`
  - [ ] `checkbox`
  - [ ] `selectboxes`
  - [ ] `select`
  - [ ] `radio`
  - [ ] `number`
  - [ ] `currency`
  - [x] `email`
  - [ ] `date`
  - [ ] `datetime`
  - [ ] `time`
  - [ ] `phoneNumber`
  - [ ] `postcode`
  - [ ] `file`
  - [ ] `iban`
  - [ ] `licenseplate`
  - [ ] `bsn`
  - [ ] `npFamilyMembers`
  - [ ] `signature`
  - [ ] `coSign`
  - [ ] `map`
  - [ ] `editgrid`
  - [ ] `content`
  - [ ] `fieldset`
  - [ ] `columns`

### Builder

- [ ] Sidebar/component type picker, grouped into categories
- [ ] Dropzone to drop a picked component
- [ ] Dropzone for container components to support child/nested components

## Notes to address at some point

- Formio used tooltip.js, which used to be popper.js (?), which points to tippy.js. That seems to
  point to Floating UI, however there is a https://github.com/atomiks/tippyjs-react.

- Figure out component-specific documentation/instructions
