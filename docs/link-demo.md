---
title: Term Linking Demo
description: A demonstration of automatic term linking in OxideMod docs
---

# Term Linking Demo

This page demonstrates the automatic term linking feature that connects terminology throughout the documentation to definitions in the glossary.

## Example Text

Oxide is a powerful modding platform for game servers. It provides a framework for developing plugins that can modify server behavior.

Plugins are written in C# and can use hooks to respond to game events. When developing plugins, you can choose to use either RustPlugin for Rust-specific functionality or CovalencePlugin for cross-game compatibility.

Covalence is a cross-game compatibility layer that allows plugins to work across multiple games supported by Oxide.

## Working with Data

JSON is used extensively in Oxide for storing configuration and data. Plugins often generate config files that server administrators can modify to customize behavior.

Data files are used by plugins to store persistent information between server restarts.

## Security

Permissions in Oxide allow server owners to control what players can and cannot do. Permissions can be assigned to individual players or to groups.

Groups allow server administrators to manage permissions for multiple players at once.

## Multiple Occurrences

Here's a paragraph with multiple occurrences of the same terms. Oxide plugins use hooks to respond to events. Oxide provides many hooks for different game events. Using hooks properly is essential for creating effective plugins.

## Special Cases

1. Terms in code blocks should not be linked: `Oxide`, `plugins`, `hooks`
2. Terms in links should not be double-linked: [Visit Oxide website](https://oxidemod.com)
3. Terms within other terms: internal hooks should link properly
4. Terms that appear in headings should not be linked 