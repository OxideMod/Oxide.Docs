---
title: Dependencies
after: submission-name
---

# Dependencies are defined and properly utilized

1. Any and all dependencies must be added so that they are defined on plugin's page.
2. Plugins that require another plugin (explicitly) to function should utilize `// Requires: PluginName` at the top of the plugin.
3. Any dependency checks and output should be done in `OnServerInitialized()` hook **or later**, not `Init()`. Reference to plugin is set when dependent plugin has loaded.

## Explanation

This guideline requires that the other plugins this plugin uses, whether they are required for the plugin to function or if they are just to add features or provide compatibility, should be added under the appropriate severity.

- `Optional` - Not required for the plugin to function or compile, but either expands functionality or provides compatibility.
- `Required` - Required integration with another plugin, for example, Raidable Bases requiring Copy Paste for placing buildings.
- `Hard` - Required for the plugin to compile.

### Condition 1

Dependencies should be added under the dependencies tab on the website.

### Condition 2

If the other plugin is required for the plugin to function properly or will fail to compile without it, it should be declared in a `//Requires` statement at the top of the plugin

### Condition 3

Any reference or usage of dependencies should either check that the other plugin is loaded before use, or use it after all plugins are sure to be loaded (assuming none fail to compile).

You can check this guideline by finding for fields with the `PluginReference` attribute or plugins in a `//Requires` statement at the top of the plugin, then checking to make sure they are added to the dependencies on the website.
