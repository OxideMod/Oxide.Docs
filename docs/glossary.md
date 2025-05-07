---
title: Glossary
description: A list of terms and definitions used in the OxideMod documentation.
---

# Glossary

This page contains definitions for terminology used throughout the OxideMod documentation. Terms across the documentation are automatically linked to their definitions here.

[[toc]]

## Core Concepts

### Covalence

Covalence<sup><a href="/glossary#covalence">[1]</a></sup> is a cross-game compatibility layer in Oxide that provides unified APIs for common functions across different games. It allows plugin developers to write code that works across multiple games without game-specific implementations. Covalence handles differences in command systems, permissions<sup><a href="/glossary#permissions">[11]</a></sup>, and player management across supported games.

### Extensions

Extensions<sup><a href="/glossary#extensions">[2]</a></sup> are generally large projects which add functionality to Oxide or make substantial changes to a server. Unlike plugins<sup><a href="/glossary#plugins">[3]</a></sup>, extensions<sup><a href="/glossary#extensions">[2]</a></sup> typically modify core functionality or add significant features to the Oxide framework itself.

### Plugins

Plugins<sup><a href="/glossary#plugins">[3]</a></sup> are self-contained bits of code written in C# which modify game server behavior. Plugins<sup><a href="/glossary#plugins">[3]</a></sup> hook into game events, add commands, and can make a wide range of changes to how a game server functions.

## Plugin Development

### CovalencePlugin

A base class for plugins that are designed to work across multiple games. CovalencePlugin<sup><a href="/glossary#covalenceplugin">[4]</a></sup> uses the Covalence<sup><a href="/glossary#covalence">[1]</a></sup> compatibility layer to provide game-agnostic functionality.

### RustPlugin

A base class for plugins specific to the Rust game. RustPlugin provides access to Rust-specific hooks<sup><a href="/glossary#hooks">[7]</a></sup> and functionality that may not be available through the Covalence layer.

### Internal Hooks

Internal hooks<sup><a href="/glossary#internal-hooks">[6]</a></sup> are hooks<sup><a href="/glossary#hooks">[7]</a></sup> that are used by Oxide itself, internal hooks<sup><a href="/glossary#internal-hooks">[6]</a></sup> are **not** called in plugins<sup><a href="/glossary#plugins">[3]</a></sup>.
Most internal hooks<sup><a href="/glossary#internal-hooks">[6]</a></sup> will have a public counterpart that is called in plugins<sup><a href="/glossary#plugins">[3]</a></sup>.
All internal hooks<sup><a href="/glossary#internal-hooks">[6]</a></sup> call to the RustHooks file which can be found [here](https://github.com/OxideMod/Oxide.Rust/blob/develop/src/RustHooks.cs).
Internal hooks<sup><a href="/glossary#internal-hooks">[6]</a></sup> always start with the `I` prefix eg. `IOnServerShutdown`.

### Hooks

Hooks are events that plugins<sup><a href="/glossary#plugins">[3]</a></sup> can subscribe to in order to execute code when specific game events occur. For example, a plugin might hook into the `OnPlayerConnected` event to perform actions when a player joins the server.

## Data & Configuration

### JSON

JavaScript Object Notation (JSON<sup><a href="/glossary#json">[8]</a></sup>) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. In Oxide, JSON is used for plugin configurations, data files<sup><a href="/glossary#data-files">[10]</a></sup>, and other structured data storage.

### Config Files

Configuration files (config files<sup><a href="/glossary#config-files">[9]</a></sup>) are JSON<sup><a href="/glossary#json">[8]</a></sup> files that store plugin settings. These files are typically located in the `oxide/config` directory and allow server administrators to customize plugin behavior without editing code.

### Data Files

Data files<sup><a href="/glossary#data-files">[10]</a></sup> are JSON<sup><a href="/glossary#json">[8]</a></sup> files that plugins<sup><a href="/glossary#plugins">[3]</a></sup> use to store persistent data between server restarts. They are typically located in the `oxide/data` directory.

## Security & Management

### Permissions

Permissions<sup><a href="/glossary#permissions">[11]</a></sup> in Oxide are a system that allows server owners to control what players can and cannot do. Permissions<sup><a href="/glossary#permissions">[11]</a></sup> can be assigned to individual players or to groups<sup><a href="/glossary#groups">[12]</a></sup>.

### Groups

Groups<sup><a href="/glossary#groups">[12]</a></sup> in Oxide are collections of players that share the same permissions<sup><a href="/glossary#permissions">[11]</a></sup>. The default groups<sup><a href="/glossary#groups">[12]</a></sup> are "admin" and "default", but server owners can create additional groups<sup><a href="/glossary#groups">[12]</a></sup> as needed.
