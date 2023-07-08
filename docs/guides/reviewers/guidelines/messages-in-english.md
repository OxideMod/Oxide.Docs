---
title: Messages in English
after: language-api
---

# Messages are using English (if applicable)

1. Messages sent to players should be written in English by default.

## Explanation

This guideline requires that plugins that send messages to players that use the language API must have, by default, English messages.

This guideline can be quickly checked by finding the `RegisterMessages()` override method in the plugin and making sure that there are English messages for each key.

Other languages can be provided but are not required.
