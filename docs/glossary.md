---
title: Glossary
description: A list of terms and definitions used in the Vue 3 documentation.
---

# Glossary

## Internal Hooks
Internal hooks are hooks that are used by Oxide itself, internal hooks are **not** called in plugins.
Most internal hooks will have a public counterpart that is called in plugins.
All internal hooks call to the RustHooks file which can be found [here](https://github.com/OxideMod/Oxide.Rust/blob/develop/src/RustHooks.cs).
Internal hooks always start with the `I` prefix eg. `IOnServerShutdown`.