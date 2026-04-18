# React Native Module Codegen

A brief overview of how React Native codegen handles stuff

- I asked AI for this, so it's worth looking into the official docs of codegen

## 1. The JavaScript Layer (getEnforcing)

This is the "Request."

- Where: Your TypeScript Spec file.

- The Code: TurboModuleRegistry.getEnforcing<Spec>('GalaxyGate')

- Fragility: If this string doesn't match the name registered in the Native layer, JS will look for a key that doesn't exist.

## 2. The Native Layer (Registration)

This is the "Provider."

- iOS: Inside your .mm (Objective-C++) file, you have a macro:
  return "GalaxyGate"; (or RCT_EXPORT_MODULE(GalaxyGate)).

- Android: Inside your GalaxyGateModule.java, you return the name:
  public String getName() { return "GalaxyGate"; }

- Fragility: This is what "announces" the module to the app on boot-up. If this is UniversePortal but JS asks for GalaxyGate, the app will find nothing.

## 3. The Discovery Layer (Autolinking)

This is the "Bridge Builder" we discussed.

- The File: GalaxyGate.podspec

- The package.json: "name": "galaxy-gate"

- The codegenConfig: "name": "GalaxyGateSpec"

- Fragility: If you rename the .podspec file but don't update the s.name inside the file, CocoaPods will get confused and might not link the source files correctly.

## Naming

- Two specific names:
  - GalaxyGateSpec (The "Blueprint"): Name for generated C++ and Java code
  - GalaxyGate (The "ID"): Runtime string for handshakes between JS and Native

| Layer                    | Name Pattern            | Example File/String         |
| :----------------------- | :---------------------- | :-------------------------- |
| **Your Source File**     | `Native<Name>.ts`       | `NativeGalaxyGate.ts`       |
| **Codegen Output (C++)** | `Native<Name>Spec.h`    | `NativeGalaxyGateSpec.h`    |
| **Java Interface**       | `Native<Name>Spec.java` | `NativeGalaxyGateSpec.java` |
| **The Handshake ID**     | `<Name>`                | `GalaxyGate`                |
