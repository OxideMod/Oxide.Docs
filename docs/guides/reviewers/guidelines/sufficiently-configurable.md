---
title: Sufficently configurable
after: dependencies
---

# Sufficiently configurable

1. Essential parameters should not be hard-coded. If a plugin has parameters which are likely to change between server installations or rely on game variables that might change unexpectedly (e.g. asset paths) then the developer should implement a configuration file.

## Explanation

This guideline requires plugins<sup><a href="/glossary#plugins">[3]</a></sup> to provide users of the plugin the ability to configure the plugin to their liking. This is important because these plugins<sup><a href="/glossary#plugins">[3]</a></sup> are likely to be used on all types of servers (e.g. PvE, PvP, roleplay, etc.) and it would be useful if these plugins<sup><a href="/glossary#plugins">[3]</a></sup> are able to satisfy as many of these groups<sup><a href="/glossary#groups">[12]</a></sup> of people as possible.

A simple way to know if it should be configurable is to put yourself in the shoes of a user and think, "would I want to be able to change this?". However, it is important not just to think of a single use case. You should also take into account other playstyles and different types of servers.
