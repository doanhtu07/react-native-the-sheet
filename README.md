# react-native-the-sheet

[![Reanimated v4 version](https://img.shields.io/github/package-json/v/doanhtu07/react-native-the-sheet/main?filename=packages/react-native-the-sheet/package.json&label=Reanimated%20v4&style=flat-square)](https://github.com/doanhtu07/react-native-the-sheet) [![Reanimated v3 version](https://img.shields.io/github/package-json/v/doanhtu07/react-native-the-sheet/v1?filename=packages/react-native-the-sheet/package.json&label=Reanimated%20v3&style=flat-square)](https://github.com/doanhtu07/react-native-the-sheet/tree/v1) [![license](https://img.shields.io/npm/l/@gorhom/bottom-sheet?style=flat-square)]()

## Overview

React Native bottom sheets are harder than they should be

Most libraries break when you:

- Open multiple sheets
- Use dynamic height + scroll views
- Handle keyboard + gestures together

The Sheet is built to fix these problems from the ground up

The library relies on a few core dependencies:

- React Native Reanimated
- React Native Gesture Handler
- React Native Safe Area Context

<table>
  <tr>
    <td width="50%">
      <video src="https://github.com/user-attachments/assets/9201cc74-8e23-427d-a076-36c0bb299a3c" controls width="100%"></video>
    </td>
    <td width="50%">
      <video src="https://github.com/user-attachments/assets/9b6ae67f-4171-44db-a620-56f90c5cd632" controls width="100%"></video>
    </td>
  </tr>
</table>

## Features

- 📐 True dynamic sizing by default - snap points are opt-in, with full ScrollView support
- 🪜 Built-in multi-sheet stacking - explicit, first-class support for sheet hierarchies
- 📏 Full layout control - predictable scroll behavior and no layout surprises
- 🧵 Composable primitives - no monolithic API
- 🎯 Designed for real-world edge cases - keyboard, gestures, nested scroll, no quirks

## NPM packages

- Embedded Stack Navigator: https://www.npmjs.com/package/react-native-embedded-stack-navigator/v/1.0.9
- Universe Portal: https://www.npmjs.com/package/react-native-universe-portal/v/1.0.9
- The Sheet: https://www.npmjs.com/package/react-native-the-sheet/v/1.0.9

## Mental model

Before moving on, I highly recommend checking out the mental model of the library, which will make it easier to understand the rationale behind the API and how to use it effectively

[Read more](./docs/getting-started/mental-model.md)

## Quick start kit

To get you started quickly, I've created a quick start kit that includes:

- Installation instructions
- Sample code snippet

You can always refer to [Example Expo App](./apps/example-expo) for more complete examples and test cases

[Read more](./docs/getting-started/quick-start-kit.md)

## Architecture

Read more about the architecture of the library, how the providers and components are structured, and the concepts behind them

[Read more](./docs/core/architecture.md)

## APIs

For more details on the props, check out the API docs

[Read more](./docs/apis/index.md)

## Compatibility

Reanimated has really strict rules for versioning, so our library follows the major versions of Reanimated to avoid confusion

[Read more](./docs/getting-started/compatibility.md)

## Roadmaps

I don't plan to support Web for a couple of reasons:

1. Bottom sheets on web are usually not the right UX choice
2. Web leans towards popups/modals which can be implemented much simpler with CSS and libraries like https://motion.dev

---

- [Chapter 1: The Village](./roadmaps/01-the-village.md)
- [Chapter 2: The Road](./roadmaps/02-the-road.md)

## Inspiration

Thank you to all the open source projects that inspired this project:

- https://github.com/gorhom/react-native-bottom-sheet

## Contributing

- Check out notes on contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Resources

- [Create React Native Module](./docs/resources/create-react-native-module.md)
- [React Native Module Codegen](./docs/resources/react-native-module-codegen.md)
- [Expo Android Notes](./docs/resources/expo-android-notes.md)
- [Publish NPM Package](./docs/resources/publish-npm-package.md)
