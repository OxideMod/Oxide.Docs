---
title: Static instances
after: sufficiently-configurable
---

# Static instances/references/variables properly handled

1. If the plugin uses static instances/references/variables, make sure these are nullified on plugin unload.

## Explanation

This guideline requires that all static references are nullified when the plugin is unloaded. This is because the data in these static fields can persist plugin reloads which can cause unintended behaviour or memory leaks.

To check this guideline, look throughout the plugin for static field and properties (methods and classes don't count) and then check to see if they are set to null in the `Unload()` method in the plugin.

If there are static fields or properties and the `Unload()` method doesn't exist or you don't see `<name> = null;` in the unload method, then the plugin will have failed this guideline.

**Important:** Make sure you check through the **entire plugin** for these fields and properties in a lot of cases fields and properties are defined in other places, not just at the top.
