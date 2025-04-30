---
title: Installing Plugins
after: localization
---

# Installing Plugins

Plugins are self-contained bits of code which modify game server behavior. This guide will walk you through the process of finding, installing, and managing plugins for your Oxide server.

## 1. Prerequisites

Before you can install plugins, you need to have a running game server with Oxide installed. If you haven't completed those steps yet, please refer to the [Server Setup](setup-server) and [Install Oxide](install-oxide) pages before proceeding.

## 2. Understanding Plugin Files

Plugins are code files distributed as CSharp (C#) files and will have a `.cs` file extension. The server will automatically compile these files when they're placed in the correct directory.

:::tip
Oxide will detect changes and compile plugins automatically, meaning your server does not need to be shut down to install or update plugins.
:::

## 3. Finding Plugins

There are several sources where you can find plugins for your game server:

1. [OxideMod](https://oxidemod.org) - The official OxideMod plugin repository
2. [uMod](https://umod.org) - A popular plugin source with a wide selection of plugins
3. Various developer websites and communities

When browsing for plugins, make sure to:

- Check compatibility with your game and Oxide version
- Read reviews and comments to ensure the plugin is reliable
- Verify the plugin comes from a reputable source

## 4. Installing Plugins

After downloading your plugin (`.cs` file), the next step is to install it to your server:

### Server Requirements

To install plugins on your server, the server must have Oxide 2.0 or higher installed. You can verify this by running the `oxide.version` command in the server console or chat.

### Installation Process

1. **Download the plugin**: Download the plugin file from a reputable source.

   - Do not rename the plugin or change the file extension.

2. **Access your server files**:

   - For a local server, navigate to your server directory.
   - For a remote server, connect via FTP client. If unsure of the FTP details, contact your server host.

3. **Locate the plugins directory**:

   - Find the plugins folder which is located by default at `oxide/plugins` (or `umod/plugins` for some installations).

4. **Upload the plugin**:

   - Upload the `.cs` file to the plugins directory.
   - The plugin will be loaded automatically once placed in this directory.

5. **Check the server console**:
   - Look for a message confirming the plugin has been loaded.

## 5. Verifying the Plugin Installation

To ensure that your plugin is correctly installed and functioning:

1. **Check the console or log messages**: You should see a message like:

   ```
   [Oxide] Loading plugin "PluginName" v1.0.0
   ```

2. **In-game verification**: If the plugin has an in-game component (like commands or features), test it to make sure it's working as expected.

3. **Check the configuration files**: Many plugins generate configuration files in the `oxide/config` directory upon first load.

## 6. Updating Plugins

To update an existing plugin:

1. **Download the updated version**: Get the newest version of the plugin.

2. **Replace the existing file**: Simply upload the new `.cs` file to replace the old one in the `oxide/plugins` directory. Oxide will automatically detect the change and reload the plugin.

3. **Verify the update**: Check the server console for a message indicating the plugin was reloaded.

## 7. Troubleshooting

If you run into issues while installing plugins:

- **Check the server console**: Look for error messages that might explain why a plugin failed to load.

- **Examine the error logs**: Check `oxide/logs` for detailed error information.

- **Verify plugin compatibility**: Make sure the plugin is compatible with your game version and Oxide version.

- **Check for dependencies**: Some plugins require additional extensions or other plugins to function properly.

- **Seek help**: Consult the plugin's documentation or ask for assistance in the Oxide or uMod community forums.

## Conclusion

Now that you've learned how to install and update plugins, the next step is to configure them to suit your server's needs. See the [Configuring Plugins](configure-plugins) page for step-by-step instructions on how to customize your plugins.
