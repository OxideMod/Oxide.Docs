---
title: Install Plugins
after: install-oxide
---

# Installing Plugins

Before getting started, it's important to note that some plugins may depend on additional extensions that are not covered in this page's documentation. More information on installing extensions can be found on the ["Install Extensions"](todo_link_to_extensions_page) page.

## 1. Prerequisites

Before you can install plugins, you need to have a running Rust server with Oxide installed. This process is covered in detail on the [Server Setup](link_to_server_setup_page) and [Install Oxide](link_to_install_oxide_page) pages. If you haven't completed those steps yet, please do so before proceeding.

## 2. Finding Plugins

There are several sources where you can find plugins for your Rust server. Here's a list of common ones, but remember, always ensure you're downloading from a reputable source:

1. [OxideMod](todo_link_to_new_oxidemod) - The official OxideMod plugin site, a long-established and trusted source of Rust plugins.
2. [uMod](https://umod.org/games/rust) - A popular plugin source, it's always worth checking here as well.
3. [Lone.Design](https://lone.design) - Lone.Design provides both free and premium plugins.
4. [ChaosCode](https://chaoscode.io/resources/categories/rust.2/) - ChaosCode is another source of both free and premium plugins.
5. [CodeFling](https://codefling.com/files/category/4-rust/) - CodeFling has a broad selection of free and premium plugins.

Once you've found a plugin you want to use, download it to your local machine. The plugin will be a `.cs` file.

## 3. Installing Plugins

After downloading your C# plugin (`.cs` file) from a reputable source, the next step is to install it to your server.

:::tip
Oxide will detect changes and compile plugins automatically, meaning your server does not need to be shut down to install or update plugins.
:::

Here's the process:

1. **Extract the plugin**: If the plugin is compressed (a `.zip`, `.rar`, or another type of archive), you'll first need to extract it. You can use a program like 7-Zip or WinRAR for this. After extraction, you should have a `.cs` file, which is the C# source code of the plugin.

2. **Upload the plugin**: Using a FTP client or the file manager provided by your hosting service, upload the `.cs` file to the `oxide/plugins` directory of your Rust server. This is the default directory where Oxide looks for plugins to load.

3. **Wait for Oxide to compile the plugin**: Once the `.cs` file is in the `oxide/plugins` directory, Oxide will automatically compile and load the plugin.

4. **Check the server console or log**: To make sure the plugin has been loaded successfully, you can check your server's console or log. You should see a message indicating that the plugin was loaded.

## 4. Verifying the Plugin Installation

To ensure that your plugin is correctly installed and functioning, you can use the following steps:

1. **Check the console or log messages**: As mentioned in the installation step, upon successful plugin installation, Oxide will log a message in the server console stating that the plugin has been loaded. You should look out for this message to confirm the plugin's installation. Here is an example of what the log entry might look like:

```batch
[Oxide]  Loading plugin "Plugin Name" v0.1.0
```

2. **In-game verification**: If the plugin has an in-game component (like a new command or feature), you can join the server and test it out to make sure it's working as expected.

3. **Check the 'oxide' folders**: After successfully loading a plugin, Oxide automatically generates a configuration file and a data file for the plugin (if the plugin uses them). These files are located in the `oxide/config` and `oxide/data` directories respectively. If these files exist, it's a good indication that the plugin was loaded successfully.

## 5. Updating Plugins

Regularly updating your plugins ensures that you get the latest features and bug fixes from the plugin developer. The process is almost identical to the installation process:

1. **Download the updated plugin**: You can usually find the latest version of a plugin on the same site where you downloaded the original plugin. Just like the installation, make sure you are downloading from a reputable source.

2. **Replace the old plugin file**: After downloading the updated version of the plugin, you need to replace the old plugin file on your server with the new one. You do not need to stop your server to do this; Oxide will automatically detect the updated file and reload the plugin.

3. **Verify the plugin update**: You can check that the plugin has updated by checking the server console for a log message indicating that the plugin was reloaded. You can also test any new features or bug fixes in the game.

## 6. Troubleshooting

If you run into issues while installing plugins, here are a few common troubleshooting steps:

- **Check the server console**: The server console will usually output errors or warnings if a plugin fails to load. This is often the quickest way to identify any issues with a plugin.

- **Check the error logs**: Oxide creates error logs in the `oxide/logs` directory. These logs can provide more detailed information about any issues with your plugins.

- **Update Oxide and the plugin**: Make sure you're using the latest version of Oxide and the plugin you're trying to install. Often, issues are resolved in later versions.

- **Check the plugin documentation**: The plugin's documentation or the plugin's page on the site you downloaded it from may contain information about known issues or specific installation instructions.

- **Ask for help**: If you can't figure out the problem, don't be afraid to ask for help. The Oxide community is very active and supportive, and you can often get help on the Oxide forums or from the plugin developer.

## Conclusion

Now that you have learned how to install and update plugins on your Rust server, the next step is to learn how to configure them to suit your server's needs. Check out the next page: **Configuring Plugins** for step-by-step instructions.