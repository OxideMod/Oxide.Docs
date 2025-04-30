---
title: Glossary
description: A list of terms and definitions used in the OxideMod documentation.
---

# Glossary

This page contains definitions for terminology used throughout the OxideMod documentation. Terms across the documentation are automatically linked to their definitions here.

[[toc]]

## Core Concepts

### Oxide

Oxide is a modding platform that extends game servers with plugin support. It provides a framework for developers to create plugins that modify game behavior without changing the game's source code.

### Covalence

Covalence is a cross-game compatibility layer in Oxide that provides unified APIs for common functions across different games. It allows plugin developers to write code that works across multiple games without game-specific implementations. Covalence handles differences in command systems, permissions, and player management across supported games.

### Extensions

Extensions are generally large projects which add functionality to Oxide or make substantial changes to a server. Unlike plugins, extensions typically modify core functionality or add significant features to the Oxide framework itself.

### Plugins

Plugins are self-contained bits of code written in C# which modify game server behavior. Plugins hook into game events, add commands, and can make a wide range of changes to how a game server functions.

## Plugin Development

### CovalencePlugin

A base class for plugins that are designed to work across multiple games. CovalencePlugin uses the Covalence compatibility layer to provide game-agnostic functionality.

### RustPlugin

A base class for plugins specific to the Rust game. RustPlugin provides access to Rust-specific hooks and functionality that may not be available through the Covalence layer.

### Internal Hooks

Internal hooks are hooks that are used by Oxide itself, internal hooks are **not** called in plugins.
Most internal hooks will have a public counterpart that is called in plugins.
All internal hooks call to the RustHooks file which can be found [here](https://github.com/OxideMod/Oxide.Rust/blob/develop/src/RustHooks.cs).
Internal hooks always start with the `I` prefix eg. `IOnServerShutdown`.

### Hooks

Hooks are events that plugins can subscribe to in order to execute code when specific game events occur. For example, a plugin might hook into the `OnPlayerConnected` event to perform actions when a player joins the server.

## Data & Configuration

### JSON

JavaScript Object Notation (JSON) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. In Oxide, JSON is used for plugin configurations, data files, and other structured data storage.

### Config Files

Configuration files (config files) are JSON files that store plugin settings. These files are typically located in the `oxide/config` directory and allow server administrators to customize plugin behavior without editing code.

### Data Files

Data files are JSON files that plugins use to store persistent data between server restarts. They are typically located in the `oxide/data` directory.

## Security & Management

### Permissions

Permissions in Oxide are a system that allows server owners to grant specific abilities and commands to players or groups. Permissions are defined by plugins and controlled using Oxide's permission commands.

### Groups

Groups in Oxide are collections of players that share the same permissions. The default groups are "admin" and "default", but server owners can create additional groups as needed.
