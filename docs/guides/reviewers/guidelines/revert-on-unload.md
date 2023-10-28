---
title: Revert on unload
after: permission-system
---

# Reverts modifications on unload

1. Plugins that alter the state of the game world should revert those changes on unload when possible and if not intrusive to players.

## Explanation

This guideline requires that if the plugin makes changes to the game world or anything within it, the plugin should aim to revert as many of those changes to how they were before the plugin was loaded.

Some examples of these changes might be:
- Changing the time of day, ocean height, weather etc.
- Changing player health or metabolism values.
- Spawning temporary entities.
- Changes to entity properties, like loot tables.
- Changes to scriptable objects.

These are just a few examples, you should be on the look out for more.

You should check the `Unload()` method in the plugin to check that they have followed this guideline. If the `Unload()` method does not exist or you do not see code that reverts the changes, then you can mark this guideline as failed.
