---
title: Language API usage
after: detailed-documentation
---

# Language API usage (if applicable)

1. Messages sent to players (normal or admin) must use the [Lang API](https://umod.org/documentation/api/localization) for localization/customization.

## Explanation

This guideline requires that each every message sent to any player must use the language API to localise the message. This includes all messages sent to the user under normal use of the plugin, whether sent to the player's chat or the server console.

Messages used by the developer to diagnose issues or messages that describe plugin processes (e.g. "Creating config file...", "Saving player data..." etc.) do not need to be localised. However, messages that describe user errors ("Invalid command syntax..." etc.) should still be localised.

This guideline can passed if the plugin does not implement any player (or admin) facing chat messages.

Some common methods used to send messages to players are:

- `RustPlugin.PrintToChat()`
- `BasePlayer.ChatMessage()`
- `BasePlayer.ConsoleCommand("chat.add", ...)`
- `RustPlugin.SendReply()`
- `IPlayer.Message()`

These method calls should have the message string localised using `lang.GetMessage()`[^1] with the user's user ID passed in. If the user ID is not passed into the method then the message cannot be personalised to the player and needs to be fixed.

Messages that are sent where a player instance or user ID is not able to be referenced do not need to be localised.

[^1]: Often, plugins use wrapper methods around the `lang.GetMessage()` method, make sure to check for these.
