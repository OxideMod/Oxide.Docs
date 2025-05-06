---
title: Term Linking Demo
description: A demonstration of automatic term linking in OxideMod docs
---

# Term Linking Demo

This page demonstrates the automatic term linking feature that connects terminology throughout the documentation to definitions in the glossary.

## Example Text

Oxide is a powerful modding platform for game servers. It provides a framework for developing plugins<sup><a href="/glossary#plugins">[1]</a></sup> that can modify server behavior.

Plugins<sup><a href="/glossary#plugins">[1]</a></sup> are written in C# and can use hooks<sup><a href="/glossary#hooks">[2]</a></sup> to respond to game events. When developing plugins<sup><a href="/glossary#plugins">[1]</a></sup>, you can choose to use either RustPlugin<sup><a href="/glossary#rustplugin">[7]</a></sup> for Rust-specific functionality or CovalencePlugin<sup><a href="/glossary#covalenceplugin">[6]</a></sup> for cross-game compatibility.

Covalence<sup><a href="/glossary#covalence">[8]</a></sup> is a cross-game compatibility layer that allows plugins<sup><a href="/glossary#plugins">[1]</a></sup> to work across multiple games supported by Oxide.

## Working with Data

JSON<sup><a href="/glossary#json">[3]</a></sup> is used extensively in Oxide for storing configuration and data. Plugins<sup><a href="/glossary#plugins">[1]</a></sup> often generate config files<sup><a href="/glossary#config-files">[5]</a></sup> that server administrators can modify to customize behavior.

Data files<sup><a href="/glossary#data-files">[4]</a></sup> are used by plugins<sup><a href="/glossary#plugins">[1]</a></sup> to store persistent information between server restarts.

## Security

Permissions<sup><a href="/glossary#permissions">[6]</a></sup> in Oxide allow server owners to control what players can and cannot do. Permissions<sup><a href="/glossary#permissions">[6]</a></sup> can be assigned to individual players or to groups<sup><a href="/glossary#groups">[9]</a></sup>.

Groups<sup><a href="/glossary#groups">[9]</a></sup> allow server administrators to manage permissions<sup><a href="/glossary#permissions">[6]</a></sup> for multiple players at once.

## Multiple Occurrences

Here's a paragraph with multiple occurrences of the same terms. Oxide plugins<sup><a href="/glossary#plugins">[1]</a></sup> use hooks<sup><a href="/glossary#hooks">[2]</a></sup> to respond to events. Oxide provides many hooks<sup><a href="/glossary#hooks">[2]</a></sup> for different game events. Using hooks<sup><a href="/glossary#hooks">[2]</a></sup> properly is essential for creating effective plugins<sup><a href="/glossary#plugins">[1]</a></sup>.

## Special Cases

1. Terms in code blocks should not be linked: `Oxide`, `plugins`, `hooks`
2. Terms in links should not be double-linked: [Visit Oxide website](https://oxidemod.com)
3. Terms within other terms: internal hooks<sup><a href="/glossary#internal-hooks">[10]</a></sup> should link properly
4. Terms that appear in headings should not be linked
