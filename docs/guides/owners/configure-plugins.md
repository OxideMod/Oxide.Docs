---
title: Configuring Plugins
after: 'install-plugins'
---

# Configuring Plugins

Configuring plugins is an essential part of setting up your Rust server to function exactly the way you want it to. This process involves adjusting the settings of your installed plugins by editing their associated configuration files. These files are usually in the JSON format, which we'll go over in this guide.

:::warning ⚠️Important Note
Always make backups of your configuration files before making changes. Configuration files contain important settings, and it's easy to make a mistake. Having a backup allows you to restore the original settings if something goes wrong.
:::

## 1. Prerequisites

Before we begin, ensure that you have the following:

- **A working Rust server set up and running**. If you need help with this, please check out our [Server Setup](todo_server_setup_linky) Guide.
- **Oxide installed on your server**. If you need help with this, please check out our [Install Oxide](todo_install_oxide_linky) Guide.
- **At least one plugin installed on your server**. If you need help with this, please check out our [Install Plugins](todo_install_plugins_linky) Guide.

## 2. Understanding Configuration Files

Configuration files, often referred to as config files, are created in the `/oxide/config` directory each time a plugin is loaded into the server. These files store the settings of the plugins in a structured format, usually JSON.

The JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. Here's an example:

```json
{
  "Setting1": true,
  "Setting2": 5,
  "Setting3": "example text"
}
```

Each setting is a key-value pair. The key (like "Setting1") is the name of the setting, and the value (like true) is the value of the setting.

You can change the values of these settings to modify how the plugin behaves. For example, changing "Setting1" from true to false might disable a certain feature of the plugin.

## 3. Locating and Accessing Configuration Files

To start with, we need to locate the configuration files for our installed plugins. These files will allow us to customize our plugins' functionality.

### 3.1 Where are the Configuration Files?

Typically, the primary configuration files for your plugins will be stored in the `/oxide/config` directory within your Rust server's main directory. However, some plugins may also store additional configuration or data files in the `/oxide/data` directory.

For localization purposes, some plugins will utilize a `/oxide/lang` file. The details regarding these 'lang' files and their role in localization are covered in the Localization section of this guide.

### 3.2 Where is My Rust Server's Main Directory?

If you've followed our guide to setting up a Rust server using SteamCMD, your Rust server's main directory will be the one named "rust_server".

So, if you're looking for the config files, their full path from your Rust server's root directory would be: `rust_server/oxide/config`.

### 3.3 How Do I Access These Files?

Depending on your setup, there are several methods to access these files:

- **Local Machine**: If you're hosting the server on your own computer, you can simply use the File Explorer (Windows) or Finder (macOS) to navigate to the Rust server directory and access the files.
- **Hosting Provider**: If you're using a hosting provider, they will likely provide a web-based file manager which you can use to access these files.
- **Command-line Tools**: If you're comfortable with command-line tools, you can use an FTP client or a remote SSH session to navigate to your server directory.

Now, you have located and accessed your configuration files, let's move on to Editing these files.

## 4. 4. Editing Configuration Files

Now that we've located our configuration files, the next step is to learn how to make modifications to these files to tweak our plugins.

### 4.1 Accessing the Configuration Files

As previously mentioned, depending on your server setup, you may access these files either directly through your computer's file explorer, a web-based file manager provided by your hosting service, or command-line tools like FTP clients or SSH.

### 4.2 Opening Configuration Files

These configuration files are typically in the JSON format, which is a widely used data-interchange format. You can open and edit JSON files with any text editor. [Visual Studio Code](https://code.visualstudio.com/) is a free and popular choice, but any text editor will suffice.

Remember to make a backup of your configuration files before making any changes!

### 4.3 Editing the Configuration Files

When you open a JSON file, you will typically see a series of key-value pairs. Each key represents a particular setting, and the corresponding value is what that setting is currently configured to.

For example, if you have a plugin that controls the day-night cycle, your JSON file might look something like this:

```json
{
    "dayLength": 30,
    "nightLength": 10
}
```

To adjust the settings, you simply need to change the values. Once you have made your changes, save the file and ensure it remains in the JSON format.

### 4.4 Saving and Applying Changes

Once you've saved your changes, you can apply them to your server. As mentioned in the previous section, the Oxide Mod allows changes to be applied without needing to restart your server entirely.

Instead, you can use the `oxide.reload` command to reload a specific plugin, applying any changes made to its configuration file. This can be done via the server's console.

For example, to reload a plugin named "DayNightCycle", you would use:

```bash
oxide.reload DayNightCycle
```

This will reload the plugin, applying your new configuration settings.

:::warning
Be aware that some plugins save their current configuration to disk when they are unloaded, which may overwrite your changes if the plugin is reloaded. In such cases, you may need to unload the plugin, make your changes, and then load the plugin again. More details on this can be found in the Troubleshooting section.
:::

## 5. Troubleshooting Plugin Configuration

Even when you follow the proper steps to modify your plugin configuration, there are times when things might not work as expected. Here are some common issues that you might encounter and their solutions.

**Invalid JSON**

JSON files are quite sensitive to format. Even a small mistake like a missing comma, bracket, or an extra quote can invalidate the entire file, causing your changes not to be recognized. Always validate your JSON file after making changes. Online JSON validators like JSONLint can help you with this.

**Plugin saves configuration on unload**

Some plugins save their current configuration to disk when they are unloaded. This means that if you edit a configuration file while the plugin is loaded and then use oxide.reload to apply the changes, the plugin might overwrite your changes when it unloads. In such cases, you need to unload the plugin, edit the configuration, and then load the plugin again.

To do this, use the following commands:
```bash
oxide.unload PluginName
```
Now that the plugin is unloaded, make your changes to the config file(s). Once you are finished, load the plugin:
```bash
oxide.load PluginName
```

Remember, whenever you're editing your server's configuration, always backup your files and carefully validate any changes. With careful management, you'll be able to customize your Rust server to your exact specifications!