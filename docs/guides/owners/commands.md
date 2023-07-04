---
title: Commands
after: install-oxide
---

# Commands

Commands are a fundamental aspect of managing a Rust server. They allow you to manipulate the server, users, gameplay, and even the Oxide system itself in various ways. This document aims to provide you with an overview of how to use commands in your Rust server and some common commands that will help you manage your server effectively.

## Prerequisites
Before proceeding with this guide, ensure that you have Moderator or administrator permissions on your Rust server. If you are not already an admin or moderator on your server, you can grant yourself these permissions. Here are the steps to do this:

1. First, you need your Steam64ID. You can get this by going to a site like [SteamID.io](https://steamid.io/), entering your steam profile URL, and copying the steamID64.
2. Navigate to the `users.cfg` file. This will be in the same location as your server’s `server.cfg` file, which is in the `/server/my_server_identity/cfg/` directory (replace `my_server_identity` with your server's identity).
3. Open `users.cfg` with a text editor, and add a new line in the following format: `ownerid "YourSteamID64" "Your Name" "Optional Reason"`. Replace `YourSteamID64` with your actual Steam64ID, `Your Name` with your actual username, and `Optional Reason` with the reason you’re adding this person as an admin (this can be anything and is not displayed in-game).
4. Save and close the file. Next time you start your server, you’ll be an admin!

Alternatively, you can use the `ownerid` command in the server's console followed by the user’s Steam64ID, name, and optional reason.

For more details, you can refer to this [Rust Admin Setup Guide](https://www.rustafied.com/how-to-make-yourself-an-admin-in-rust/).


## Accessing the Console

In Rust, there are two main types of consoles that you can access - the in-game F1 console and the server console.

1. **In-game F1 Console**: This console can be accessed in-game by pressing the `F1` key. Once open, you can type commands and press `Enter` to execute them.

2. **Server Console**: If you are running the server on your own machine or have access to the server console via your game hosting provider, you can type commands directly into this console. 

Note: Depending on your server setup, you might be accessing the server console via RCON (remote console). This allows you to send console commands from a separate device or application, such as RustAdmin or rcon.io.

## Common Server Commands

While this guide is primarily focused on Oxide and plugin commands, it's essential to be familiar with some basic server commands that you'll use often as an admin:

- `say "message"`: Broadcasts a message to all players in the server.
- `kick "name"`: Kicks a player from the server.
- `ban "name" "reason"`: Bans a player from the server, providing a reason.
- `server.save`: Manually saves the server.

:::tip NOTE
To execute these commands, you must have admin or moderator permissions on the server.
:::

# Oxide Commands

Oxide commands are specific to the Oxide plugin system. They allow you to control various aspects of Oxide and the plugins you have installed. Oxide commands are executed in the same way as server commands - either through the in-game F1 console or the server console.

Here is a list of common Oxide commands that you will find useful in managing your server and its plugins:

- `oxide.version`: This command shows the version of Oxide being used on the server.
- `oxide.reload PluginName`: This command will unload and then load the specified plugin. This is useful when you have updated a plugin's configuration and need the changes to take effect.
- `oxide.load PluginName`: This command will load the specified plugin if it's not already loaded.
- `oxide.unload PluginName`: This command will unload the specified plugin.

In addition to plugin management, Oxide provides an additional permissions system for managing permissions on your server:

- `oxide.group add "Group Name"`: This command creates a new group with the specified name.
- `oxide.usergroup add "Username" "Group Name"`: This command adds the specified user to the specified group.

:::tip NOTE
More information on Oxide Permissions can be found in the "Permissions" page.
:::

Each plugin can come with its own set of commands. For instance, if you have a plugin called "MyPlugin", it might have a command called "myplugin.mycommand". To allow a user to run this command, you would need to give them the necessary permission using the Oxide permissions system:

`oxide.grant user Username myplugin.mycommand`: This command gives the specified user permission to run the command **myplugin.mycommand**.
Ensure you're familiar with your plugins' commands as they will help you configure and manage the plugin.
