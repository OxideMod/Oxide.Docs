---
title: Installing Plugins
after: localization
---

# Installing Plugins

Plugins<sup><a href="/glossary#plugins">[1]</a></sup> are self-contained bits of code which modify game server behavior. This guide will walk you through the process of finding, installing, and managing plugins<sup><a href="/glossary#plugins">[1]</a></sup> for your Oxide server.

## 1. Prerequisites

Before you can install plugins<sup><a href="/glossary#plugins">[1]</a></sup>, you need to have a running game server with Oxide installed. If you haven't completed those steps yet, please refer to the [Server Setup](setup-server) and [Install Oxide](install-oxide) pages before proceeding.

## 2. Understanding Plugin Files

Plugins<sup><a href="/glossary#plugins">[1]</a></sup> are code files distributed as CSharp (C#) files and will have a `.cs` file extension. The server will automatically compile these files when they're placed in the correct directory.

:::tip
Oxide will detect changes and compile plugins<sup><a href="/glossary#plugins">[1]</a></sup> automatically, meaning your server does not need to be shut down to install or update plugins<sup><a href="/glossary#plugins">[1]</a></sup>.
:::

## 3. Finding Plugins

There are several sources where you can find plugins<sup><a href="/glossary#plugins">[1]</a></sup> for your game server:

1. [OxideMod](https://oxidemod.org) - The official OxideMod plugin repository
2. [uMod](https://umod.org) - A popular plugin source with a wide selection of plugins<sup><a href="/glossary#plugins">[1]</a></sup>
3. Various developer websites and communities

When browsing for plugins<sup><a href="/glossary#plugins">[1]</a></sup>, make sure to:

- Check compatibility with your game and Oxide version
- Read reviews and comments to ensure the plugin<sup><a href="/glossary#plugins">[1]</a></sup> is reliable
- Verify the plugin<sup><a href="/glossary#plugins">[1]</a></sup> comes from a reputable source

## 4. Installing Plugins

After downloading your plugin<sup><a href="/glossary#plugins">[1]</a></sup> (`.cs` file), the next step is to install it to your server:

### Server Requirements

To install plugins<sup><a href="/glossary#plugins">[1]</a></sup> on your server, the server must have Oxide 2.0 or higher installed. You can verify this by running the `oxide.version` command in the server console or chat.

### Installation Process

1. **Download the plugin<sup><a href="/glossary#plugins">[1]</a></sup>**: Download the plugin<sup><a href="/glossary#plugins">[1]</a></sup> file from a reputable source.

   - Do not rename the plugin<sup><a href="/glossary#plugins">[1]</a></sup> or change the file extension.

2. **Access your server files**:

   - For a local server, navigate to your server directory.
   - For a remote server, connect via FTP client. If unsure of the FTP details, contact your server host.

3. **Locate the plugins<sup><a href="/glossary#plugins">[1]</a></sup> directory**:

   - Find the plugins<sup><a href="/glossary#plugins">[1]</a></sup> folder which is located by default at `oxide/plugins` (or `umod/plugins` for some installations).

4. **Upload the plugin<sup><a href="/glossary#plugins">[1]</a></sup>**:

   - Upload the `.cs` file to the plugins<sup><a href="/glossary#plugins">[1]</a></sup> directory.
   - The plugin<sup><a href="/glossary#plugins">[1]</a></sup> will be loaded automatically once placed in this directory.

5. **Check the server console**:
   - Look for a message confirming the plugin<sup><a href="/glossary#plugins">[1]</a></sup> has been loaded.

## 5. Verifying the Plugin Installation

To ensure that your plugin<sup><a href="/glossary#plugins">[1]</a></sup> is correctly installed and functioning:

1. **Check the console or log messages**: You should see a message like:

   ```
   [Oxide] Loading plugin "PluginName" v1.0.0
   ```

2. **In-game verification**: If the plugin<sup><a href="/glossary#plugins">[1]</a></sup> has an in-game component (like commands or features), test it to make sure it's working as expected.

3. **Check the configuration files**: Many plugins<sup><a href="/glossary#plugins">[1]</a></sup> generate configuration files<sup><a href="/glossary#config-files">[5]</a></sup> in the `oxide/config` directory upon first load.

## 6. Updating Plugins

To update an existing plugin<sup><a href="/glossary#plugins">[1]</a></sup>:

1. **Download the updated version**: Get the newest version of the plugin<sup><a href="/glossary#plugins">[1]</a></sup>.

2. **Replace the existing file**: Simply upload the new `.cs` file to replace the old one in the `oxide/plugins` directory. Oxide will automatically detect the change and reload the plugin<sup><a href="/glossary#plugins">[1]</a></sup>.

3. **Verify the update**: Check the server console for a message indicating the plugin<sup><a href="/glossary#plugins">[1]</a></sup> was reloaded.

## 7. Troubleshooting

If you run into issues while installing plugins<sup><a href="/glossary#plugins">[1]</a></sup>:

- **Check the server console**: Look for error messages that might explain why a plugin<sup><a href="/glossary#plugins">[1]</a></sup> failed to load.

- **Examine the error logs**: Check `oxide/logs` for detailed error information.

- **Verify plugin<sup><a href="/glossary#plugins">[1]</a></sup> compatibility**: Make sure the plugin<sup><a href="/glossary#plugins">[1]</a></sup> is compatible with your game version and Oxide version.

- **Check for dependencies**: Some plugins<sup><a href="/glossary#plugins">[1]</a></sup> require additional extensions or other plugins<sup><a href="/glossary#plugins">[1]</a></sup> to function properly.

- **Seek help**: Consult the plugin's<sup><a href="/glossary#plugins">[1]</a></sup> documentation or ask for assistance in the Oxide or uMod community forums.

## Conclusion

Now that you've learned how to install and update plugins<sup><a href="/glossary#plugins">[1]</a></sup>, the next step is to configure them to suit your server's needs. See the [Configuring Plugins](configure-plugins) page for step-by-step instructions on how to customize your plugins<sup><a href="/glossary#plugins">[1]</a></sup>.
