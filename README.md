# Formio builder for Open Forms

This library implements the builder to build
[Form.io 4.13.x](https://github.com/formio/formio.js/tree/4.13.x/) forms supporting the
[Open Forms](https://github.com/open-formulieren/open-forms) extensions.

[![Run CI build and tests](https://github.com/open-formulieren/formio-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/open-formulieren/formio-builder/actions/workflows/ci.yml)

**Documentation/demo**

- [Storybook](https://open-formulieren.github.io/formio-builder/) documentation and reference.
- Shared types library documentation:
  [`@open-formulieren/types`](https://open-formulieren.github.io/types/).

## What is the purpose of this library?

Improving the developer experience for the Open Formulieren development team, by making the builder
form definition more declarative and removing levels of abstraction, while maintaining re-use of
components and common configurations.

We use third party form and validation libraries so that we can more easily reason about our form
component configuration without being constrained by Formio.js itself. Using Typescript, we can also
enforce certain behaviours at compile-time.

This library is **NOT** intended to be a competing library of Form.io's own form builder:

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
- Functionality must be documented in Storybook
- Functionality must be covered by tests - Jest (unit/integration) tests and/or Storybook
  interaction tests

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

Additional NPM scripts can be found in `package.json`.

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

## Release flow

We don't let `npm` apply the git tags when releasing a new version, instead follow this process.

1. Create a new branch `release/x.y.z`.
2. Update the `CHANGELOG.md` file.
3. Bump the version of the package as follows (use either `major | minor | patch` in the `npm version` command):

```bash
npm version --no-git-tag-version minor
git commit -am ":bookmark: Bump to version <newVersion>"
```

4. Once this branch is merged into main, create a tag and push it:

```bash
git tag "<newVersion>"
git push origin main --tags
```

If you have GPG keys set up, you can use them for the git tag operation.

The CI pipeline will then publish the new version to npmjs.

## Roadmap

See the [roadmap issue](https://github.com/open-formulieren/formio-builder/issues/104).
