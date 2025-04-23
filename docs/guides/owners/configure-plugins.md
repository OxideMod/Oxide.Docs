---
title: Configuring Plugins
after: install-plugins
---

# Configuring Plugins

Most plugins will generate a JSON configuration file once loaded. With these files, you can adjust how plugins behave to customize your server experience. This guide will help you understand how to locate, edit, and apply configuration changes.

:::warning ⚠️Important Note
Always make backups of your configuration files before making changes. It's easy to make mistakes when editing JSON files, and having a backup allows you to restore the original settings if something goes wrong.
:::

## 1. Understanding Configuration Files

Configuration files are saved as JSON (JavaScript Object Notation), a lightweight data-interchange format that is both human-readable and machine-parsable. Here's an example of what a simple configuration file might look like:

```json
{
  "EnableFeature": true,
  "MessageDelay": 5,
  "WelcomeMessage": "Welcome to our server!"
}
```

Each setting is a key-value pair:
- The key (like "EnableFeature") is the name of the setting
- The value (like `true`) is the setting's value, which can be:
  - Boolean values (`true` or `false`)
  - Numbers (like `5`)
  - Text strings (like `"Welcome to our server!"`)
  - Arrays (lists of values)
  - Objects (nested settings)

## 2. Locating Configuration Files

### Config Directory
Configuration files are found in the `config` folder which is located by default in `oxide/config` (unless the server host has moved it).

### File Name
A plugin configuration file will have the same name as the plugin itself. For example, a plugin that is installed as `MyPlugin.cs` (if it's configurable) will be accompanied by a JSON file named `MyPlugin.json`.

:::tip
Do not rename the configuration file or change the file extension.
:::

If a plugin is installed but no configuration file appears, there are two possibilities:
1. The plugin isn't configurable
2. The plugin might be broken - check the log files under the `oxide/logs` directory for errors

## 3. Editing Configuration Files

### Accessing the Files
Depending on your server setup, you can access these files through:
- File explorer (for local servers)
- Web-based file manager (provided by hosting services)
- FTP client or SSH (for remote servers)

### Editing Process
1. Open the configuration file with any text editor (Notepad, Visual Studio Code, etc.)
2. Make your desired changes to the values
3. Ensure the file remains valid JSON
4. Save the file

### Validating JSON
All plugin configuration files must be valid JSON. Use a validator such as [jsonlint.com](https://jsonlint.com) to ensure the configuration is valid JSON if you're unsure about your edits.

Common JSON errors include:
- Missing or extra commas
- Unclosed quotes or brackets
- Using single quotes instead of double quotes
- Adding trailing commas

## 4. Applying Configuration Changes

After making changes to a plugin configuration file, you need to reload the plugin for the changes to take effect:

```
oxide.reload MyPlugin
```

Replace `MyPlugin` with the name of the plugin you modified. This command tells Oxide to reload the plugin, which will cause it to read the updated configuration file.

## 5. Troubleshooting Plugin Configuration

Even when following proper procedures, you might encounter issues:

### Invalid JSON
If your configuration file contains syntax errors, the plugin might fail to load or use default values. Always validate your JSON after making changes.

### Plugin Saves Configuration on Unload
Some plugins save their current configuration to disk when they are unloaded. If you edit a configuration while the plugin is loaded and then use `oxide.reload`, the plugin might overwrite your changes. In such cases:

1. Unload the plugin:
   ```
   oxide.unload PluginName
   ```
2. Edit the configuration file
3. Load the plugin again:
   ```
   oxide.load PluginName
   ```

### Plugin Data Files
In addition to configuration files, plugins may create data files in the `oxide/data` directory. These store information the plugin needs to persist across server restarts. Generally, you shouldn't modify these files unless you know exactly what you're doing.

## Conclusion

Understanding how to properly configure plugins allows you to tailor your server to your exact specifications. With the knowledge from this guide, you should be able to effectively customize your plugins' behavior.

Remember to always:
1. Make backups before editing
2. Ensure your JSON is valid
3. Reload plugins after making changes
4. Check logs if you encounter issues