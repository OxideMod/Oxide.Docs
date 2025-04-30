---
title: Data Files
after: configure-plugins
---

# Data Files

Data files are JSON files that plugins may use to store arbitrary data. They help plugins persist information between server restarts or plugin reloads. Understanding how data files work is important for server administrators who need to manage or troubleshoot their servers.

## Data Directory

Data files may be found in the `data` folder which is located by default in `oxide/data` (unless the server host has moved it).

## File Names

Data files do not follow any standard naming convention - a plugin author may specify any name when creating a data file. This means you might find various file names in the data directory, all with the `.json` extension.

It is recommended for plugin authors, when creating a large number of data files, to organize them in a subdirectory specific to their plugin. For example, a plugin named "EconomySystem" might store its data files in `oxide/data/EconomySystem/`.

## File Structure

All plugin data files are saved as JSON (JavaScript Object Notation). The structure of each data file depends entirely on what the plugin needs to store. Common types of data stored include:

- Player information and statistics
- Game world state
- Plugin-specific configuration that shouldn't be changed by users
- Logs or records of in-game events
- Temporary data caches

## Valid JSON

Like configuration files, data files must be valid JSON. If you need to edit a data file manually (which is generally not recommended unless you know exactly what you're doing), use a validator such as [jsonlint.com](https://jsonlint.com) to ensure the data file remains valid JSON.

## Differences Between Data Files and Configuration Files

It's important to understand the difference between data files and configuration files:

- **Configuration files** (`oxide/config/`): Intended to be edited by server administrators to change plugin behavior. These usually contain settings that affect how the plugin functions.

- **Data files** (`oxide/data/`): Generated and managed by plugins to store information. These should generally not be manually edited as they contain data that the plugin relies on for proper operation.

## Backing Up Data Files

When making server backups, it's crucial to include the `oxide/data/` directory. This ensures that if you need to restore your server, all the data that plugins have stored will be preserved.

Some important data files to back up include:

- Player economy data
- Player stats and progress
- Group and permission data
- Plugin-specific world or entity data

## Troubleshooting

If a plugin is experiencing issues related to its data files, here are some common troubleshooting steps:

1. **Check file permissions**: Ensure the data directory and files are writable by the server process.

2. **Verify file integrity**: If a data file has become corrupted, the plugin may fail to load it properly. In such cases, you might need to restore from a backup or, as a last resort, delete the file to let the plugin regenerate it (note that this will result in data loss).

3. **Check for JSON errors**: If a data file has been manually edited and contains syntax errors, the plugin may not be able to parse it correctly.

4. **Plugin update issues**: Sometimes when a plugin updates, its data file format may change. In rare cases, this might require converting or resetting the data file.

## Conclusion

Understanding how plugins use data files can help you better manage your server and troubleshoot issues. While you should generally avoid directly editing data files, knowing where they're stored and how they're used is valuable knowledge for any server administrator.
