---
title: Plugin lifecycle
after: server-lifecycle
---  

# The lifecycle of a plugin

## Introduction

Plugins are typically compiled and automatically loaded when a server is launched.

The steps outlined below describe the process of setting up and tearing down a plugin in-memory.

The first state a plugin is in during set up is Resolving, after which...

1. The plugin is compiled and the compilation is validated
1. Custom logging is set up
1. Configuration or localization files are loaded (asynchronously)

Assuming all of the above operations complete successfully, then a plugin is considered Resolved and initialization begins.
## Initialization

Init is the earliest hook in the plugin lifecycle, occuring immediately after a plugin has resolved. Init occurs before dependencies are available. Any exceptions caused by initialization hooks will prevent further initialization, rollback compiliation, and emit an error.
```csharp
void Init()
{
  // Do stuff
}
```
## Loaded

Loaded occurs after successful plugin initialization, but just before the plugin is registered to the service container. Any exceptions caused during loading hooks will prevent plugin registration, rollback compilation, and emit an error.

The loaded hook is considered the correct place to obtain asynchronously loaded configuration and localization data.
```csharp
[Config]
class DefaultConfig
{
  bool ConfigOption = true;
}

void Loaded(DefaultConfig defaultConfig)
{
   // Do stuff
}
```
## OnServerInitialized

OnServerInitialized is typically invoked near the end of the boot sequence when player connections are finally accepted.

If the server is already fully booted (e.g. a plugin is reloaded at run-time), OnServerInitialized is still invoked locally.
## Unload

When a plugin is unloaded by the plugin manager, the Unload hook is called immediately after hook routing is disabled but before the plugin context is fully detached from the service container.
## Shutdown

If the game provider supports Advanced Hooks and receives a Shutdown event, the Shutdown hook will be invoked before the Unload hook, which will also be called.
## Hotloading

Oxide uses a file watcher to listen for source code or configuration changes within the plugins and config directories. When a change is detected, the plugin is automatically reloaded.

It is possible for a plugin to override configuration monitoring using the OnConfigChanged hook.