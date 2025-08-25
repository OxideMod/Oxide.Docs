---
title: Extensions
after: configure-plugins
---

# Extensions

## Introduction

Extensions<sup><a href="/glossary#extensions">[2]</a></sup> are class libraries (.dll files) that extend the functionality of Oxide, allowing your Rust server to integrate with other software or offer additional features. Extensions<sup><a href="/glossary#extensions">[2]</a></sup> are more powerful than plugins as they have deeper integration with the game and can provide fundamental services that plugins rely on. Common extensions<sup><a href="/glossary#extensions">[2]</a></sup> used in Rust servers include [RustEdit](https://www.rustedit.io/) for custom map making and [Discord](https://discord.com/) for enabling chat synchronization between a Rust server and a Discord channel.

## Extension Types

Oxide extensions<sup><a href="/glossary#extensions">[2]</a></sup> fall into several categories:

1. **Core Extensions**: These are fundamental extensions<sup><a href="/glossary#extensions">[2]</a></sup> built into Oxide that provide essential functionality. Core extensions<sup><a href="/glossary#extensions">[2]</a></sup> can't be unloaded and are maintained by the Oxide team.

2. **Game Extensions**: These are extensions<sup><a href="/glossary#extensions">[2]</a></sup> specific to a particular game (like Rust, Hurtworld, etc.). They provide game-specific APIs that plugins can use.

3. **Third-Party Extensions**: These are created by the community to add specific functionality like Discord integration or analytics.

## Extension Features

Modern Oxide extensions<sup><a href="/glossary#extensions">[2]</a></sup> include several advanced features:

- **Reload Support**: Some extensions<sup><a href="/glossary#extensions">[2]</a></sup> support hot-reloading, which means they can be updated without restarting the server. This is indicated by the `SupportsReloading` property.

- **Branch Information**: Extensions<sup><a href="/glossary#extensions">[2]</a></sup> include metadata about which branch they belong to (e.g., "master", "develop"), helping to identify their development stage.

- **Plugin Support**: Extensions<sup><a href="/glossary#extensions">[2]</a></sup> often provide libraries, references, and APIs that plugins can use. They can define:

  - Default references for plugins
  - Whitelisted assemblies (allowed .NET libraries)
  - Whitelisted namespaces (allowed code namespaces)
  - Preprocessor directives for conditional compilation

- **Plugin Watchers**: Extensions<sup><a href="/glossary#extensions">[2]</a></sup> can implement plugin watchers that automatically detect and load/reload plugins when they're added or modified.

## Prerequisites

Before you can install extensions<sup><a href="/glossary#extensions">[2]</a></sup>, make sure you have:

- **A working Rust server set up and running**. If you need help with this, please check out our [Server Setup](todo_server_setup_linky) Guide.
- **Oxide installed on your server**. If you need help with this, please check out our [Install Oxide](todo_install_oxide_linky) Guide.

## Installing Extensions

To install an extension:

1. Download the extension file, which will be a `.dll` file.
2. **Stop your Rust server!** Unlike plugins, most extensions<sup><a href="/glossary#extensions">[2]</a></sup> are not loaded at runtime and require a server restart to take effect (unless they specifically support reloading).
3. Navigate to your server's Application extensions<sup><a href="/glossary#extensions">[2]</a></sup> directory: `/<your_server_directory>/RustDedicated_Data/Managed/`.
4. Upload the `.dll` file into the `Managed` directory.
5. Start your Rust server. The server will now load the extension on startup.

Note: Always ensure your server is stopped before installing or updating an extension unless the documentation specifically states it supports hot-reloading. Failure to do so can lead to issues with the extension not working correctly or even server crashes.

## Extension Lifecycle

Extensions<sup><a href="/glossary#extensions">[2]</a></sup> follow a specific lifecycle:

1. **Loading**: When the server starts, Oxide loads all extensions<sup><a href="/glossary#extensions">[2]</a></sup> in the Managed directory.
2. **Initialization**: Each extension's `Load()` method is called to initialize it.
3. **Post-Load**: After all extensions<sup><a href="/glossary#extensions">[2]</a></sup> are loaded, the `OnModLoad()` method is called to allow extensions<sup><a href="/glossary#extensions">[2]</a></sup> to interact with each other.
4. **Runtime**: Extensions<sup><a href="/glossary#extensions">[2]</a></sup> provide their functionality while the server runs.
5. **Shutdown**: When the server is stopping, the `OnShutdown()` method is called to allow proper cleanup.
6. **Unloading**: If supported, extensions<sup><a href="/glossary#extensions">[2]</a></sup> can be unloaded via the `Unload()` method.

## Updating Extensions

Updating extensions<sup><a href="/glossary#extensions">[2]</a></sup> follow the same steps as installing new ones. Always make sure to stop your server before replacing the `.dll` file with the updated version, unless the extension documentation explicitly states it supports hot-reloading.

## Troubleshooting Extensions

If you encounter issues with an extension:

1. **Check server logs**: Extension loading errors will be logged in the server console.
2. **Version compatibility**: Ensure the extension is compatible with your version of Oxide and the game.
3. **Dependencies**: Some extensions<sup><a href="/glossary#extensions">[2]</a></sup> depend on other extensions<sup><a href="/glossary#extensions">[2]</a></sup> or libraries, make sure all required components are installed.
4. **Permissions**: Verify the extension file has appropriate read/execute permissions<sup><a href="/glossary#permissions">[10]</a></sup>.
5. **Conflicts**: Extensions<sup><a href="/glossary#extensions">[2]</a></sup> may conflict with each other. Try disabling other extensions<sup><a href="/glossary#extensions">[2]</a></sup> to isolate the issue.

## Common Extension Commands

While most extensions<sup><a href="/glossary#extensions">[2]</a></sup> don't provide direct commands, some include helpful utilities:

- `oxide.ext` - Lists all loaded extensions<sup><a href="/glossary#extensions">[2]</a></sup> with version information
- `oxide.reload.extension <n>` - Reloads an extension that supports hot-reloading
- `oxide.unload.extension <n>` - Unloads an extension (if it supports unloading)

## Conclusion

Extensions<sup><a href="/glossary#extensions">[2]</a></sup> add a whole new level of functionality to your Rust server, allowing for customization and integration that go beyond the capabilities of standard plugins. They provide the foundation that plugins build upon, expanding what's possible with your Oxide-powered server. For more guidance on managing your Rust server, check out our other guides on installing plugins, configuring plugins, and more.
