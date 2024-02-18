---
title: Plugin
after: miscellaneous
---

# Plugin Commands

## oxide.plugins

**Usage:** `oxide.plugins`  
**Aliases:** `o.plugins`, `plugins`  

Lists all plugins including ones that failed to load. Shows the plugin name, version, author, total hooktime and filename. If a plugin failed to load, the reason will be shown.

### Example `oxide.plugins`

```
Listing 2 plugins:
  01 "My awesome plugin" (1.0.0) by Oxide (0.04s) - MyAwesomePlugin.cs
  02 "My second plugin" (1.5.3) by Oxide (0.55s) - MySecondPlugin.cs
```

## oxide.load

**Usage:** `oxide.load *|<pluginname>+`  
**Aliases:** `o.load`, `plugin.load`

Loads a plugin with the specified name.

### Example `oxide.load MyAwesomePlugin`

```
MyAwesomePlugin was compiled successfully in 100ms
Loaded plugin My Awesome Plugin v1.0.0 by Oxide
```

## oxide.reload

**Usage:** `oxide.reload *|<pluginname>+`  
**Aliases:** `o.reload`, `plugin.reload`

Reloads a plugin with the specified name.

### Example `oxide.reload MyAwesomePlugin`

```
MyAwesomePlugin was compiled successfully in 100ms
Unloaded plugin My Awesome Plugin v1.0.0 by Oxide
Loaded plugin My Awesome Plugin v1.0.0 by Oxide
```

## oxide.unload

**Usage:** `oxide.unload *|<pluginname>+`  
**Aliases:** `o.unload`, `plugin.unload`

Unloads a plugin with the specified name.

### Example `oxide.unload MyAwesomePlugin`

```
Unloaded plugin My Awesome Plugin v1.0.0 by Oxide
```