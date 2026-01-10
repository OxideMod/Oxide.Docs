---
title: Term Linking Demo
description: A demonstration of automatic term linking in OxideMod docs
---

# Term Linking Demo

This page demonstrates the automatic term linking feature that connects terminology throughout the documentation to definitions in the glossary.

## Example Text

Oxide is a powerful modding platform for game servers. It provides a framework for developing plugins that can modify server behavior.

Plugins are written in C# and can use <a href="/glossary#hooks" class="glossary-term">hooks</a> to respond to game events. When developing plugins, you can choose to use either <a href="/glossary#rustplugin" class="glossary-term">RustPlugin</a> for Rust-specific functionality or <a href="/glossary#covalenceplugin" class="glossary-term">CovalencePlugin</a> for cross-game compatibility.

<a href="/glossary#covalence" class="glossary-term">Covalence</a> is a cross-game compatibility layer that allows plugins to work across multiple games supported by Oxide.

## Working with Data

<a href="/glossary#json" class="glossary-term">JSON</a> is used extensively in Oxide for storing configuration and data. Plugins often generate <a href="/glossary#config-files" class="glossary-term">config files</a> that server administrators can modify to customize behavior.

<a href="/glossary#data-files" class="glossary-term">Data files</a> are used by plugins to store persistent information between server restarts.

## Security

<a href="/glossary#permissions" class="glossary-term">Permissions</a> in Oxide allow server owners to control what players can and cannot do. <a href="/glossary#permissions" class="glossary-term"><span class="glossary-term__word">Permissions</span></a> can be assigned to individual players or to <a href="/glossary#groups" class="glossary-term">groups</a>.

Groups allow server administrators to manage permissions for multiple players at once.

## Multiple Occurrences

Here's a paragraph with multiple occurrences of the same terms. Oxide plugins use <a href="/glossary#hooks" class="glossary-term"><span class="glossary-term__word"><a href="/glossary#hooks" class="glossary-term">hooks</a></span></a> to respond to events. Oxide provides many <a href="/glossary#hooks" class="glossary-term">hooks</a> for different game events. Using hooks properly is essential for creating effective plugins.

## Special Cases

1. Terms in code blocks should not be linked: `Oxide`, `plugins`, `hooks`
2. Terms in links should not be double-linked: [Visit Oxide website](https://oxidemod.com)
3. Terms within other terms: <a href="/glossary#internal-hooks" class="glossary-term">internal hooks</a> should link properly
4. Terms that appear in headings should not be linked
