---
title: My First Plugin
after: development-environment
---

# Writing your first plugin

Creating your first plugin can be an exciting introduction to modding in Rust with Oxide. In this guide, we'll walk you through the process of creating your first plugin.

## Prerequisites

Before you start, ensure you have the following:

1. A configured development environment. If you haven't set up your development environment yet, please follow our guide [here](development-environment).
2. The latest .NET SDK from [Microsoft .NET Downloads](https://dotnet.microsoft.com/en-us/download/dotnet/9.0). This modern SDK includes support for all previous versions. When creating your project, make sure to select .NET Framework 4.8 as your target framework or set it manually in your .csproj file.

## Understanding Plugins and Extensions

In the Oxide modding framework, plugins<sup><a href="/glossary#plugins">[3]</a></sup> and extensions<sup><a href="/glossary#extensions">[2]</a></sup> serve different roles:

- **Plugins<sup><a href="/glossary#plugins">[3]</a></sup>** are .cs files that are compiled at runtime by the Oxide framework. These are typically game-specific and provide unique gameplay features or modifications.

- **Extensions<sup><a href="/glossary#extensions">[2]</a></sup>** are .dll files that provide additional functionalities to the Oxide framework. They're built using class libraries and can be utilized by plugins<sup><a href="/glossary#plugins">[3]</a></sup>.

In this guide, we will be focusing on creating a Plugin.

## Choosing Between CovalencePlugin and RustPlugin

When developing a plugin for Rust with Oxide, you have the option to inherit from two base classes: `CovalencePlugin` and `RustPlugin`.

::: info

- `CovalencePlugin` is a base class provided by the Oxide framework that offers game-agnostic functionality. This means if you plan on making a plugin that could work with multiple games supported by Oxide, you would choose `CovalencePlugin`.

- `RustPlugin`, on the other hand, is Rust-specific. This means it offers functionalities and access to APIs specific to the game Rust. If you're making a plugin exclusively for Rust, `RustPlugin` is generally the better choice.
  :::

## Plugin Creation Steps

### Step 1: Creating a Plugin File

In your preferred IDE (Visual Studio, Visual Studio Code, JetBrains Rider), create a new C# file. This file will serve as your main plugin class. Let's name it `MyFirstPlugin`.

### Step 2: Implementing Plugin Logic

Now that we've set up our plugin file, it's time to start implementing its functionality. In this guide, we'll create a simple chat command that players can use in the game.

At the start of your `MyFirstPlugin.cs` file, add references to the following libraries:

```csharp
using Oxide.Core;
using UnityEngine;
```

- `Oxide.Core` contains fundamental functionalities of the Oxide modding framework.
- `UnityEngine` is a library provided by Unity, the game engine Rust is built on.

Next, we'll define our namespace and create a class MyFirstPlugin that inherits from RustPlugin<sup><a href="/glossary#rustplugin">[5]</a></sup>. Every Oxide plugin should have metadata defined. This metadata includes the `plugin name`, `author`, and `version`. This is done using attributes at the start of your plugin class.

```csharp
namespace Oxide.Plugins;

[Info("MyFirstPlugin", "Author Name", "1.0.0")]
public class MyFirstPlugin : RustPlugin
{
    // Plugin logic goes here
}
```

Now let's add a basic ChatCommand called `hello` that sends a message to the player that called the command:

```csharp
namespace Oxide.Plugins;

[Info("MyFirstPlugin", "Author Name", "1.0.0")]
public class MyFirstPlugin : RustPlugin
{
    [ChatCommand("hello")]
    private void HelloCommand(BasePlayer player, string command, string[] args)
    {
        PrintToChat(player, "Hello, welcome to the world of Rust modding!");
    }
}
```

Here we have registered a Chat Command called `hello` that takes three parameters:

- `player` The BasePlayer that has called the command
- `command` The command being called
- `args` An array of optional additional arguments that following the command.

In this example, the `hello` command calls `PrintToChat` and sends a greeting message using to the player who used it.

### Step 3: Deploying Your Plugin

Once you've created your plugin file, it's time to test it. Simply save your changes and upload the `.cs` file to your server. The Oxide modding framework will automatically compile and load your plugin. Any compilation errors will be printed to the server console. Remember, every time you make changes to your plugin, you need to save and reupload your plugin to your server to see the changes in effect.

Join your server and use the `/hello` command in chat. If everything is working properly, you'll see the greeting message in chat!

### Step 4: Implementing Permissions

Let's enhance our plugin by implementing permissions<sup><a href="/glossary#permissions">[11]</a></sup>. We'll require players to have a specific permission (`myfirstplugin.hello`) to use the `/hello` chat command.

```csharp
namespace Oxide.Plugins;

[Info("MyFirstPlugin", "Author Name", "1.0.0")]
public class MyFirstPlugin : RustPlugin
{
    void Init()
    {
        permission.RegisterPermission("myfirstplugin.hello", this);
    }

    [ChatCommand("hello")]
    private void HelloCommand(BasePlayer player, string command, string[] args)
    {
        if(!permission.UserHasPermission(player.UserIDString, "myfirstplugin.hello"))
        {
            PrintToChat(player, "You don't have permission to use this command!");
            return;
        }
        PrintToChat(player, "Hello, welcome to the world of Rust modding!");
    }
}

```

Here we have added a condition that checks if the user has the `myfirstplugin.hello` permission. If the calling player does not have the required permission they will receive a different message from our greeting.

After making these changes, save and reupload your plugin to your server. You should now be able to grant permissions<sup><a href="/glossary#permissions">[11]</a></sup> using the command `grant <user or group> <permission>`. Try using the `/hello` command in chat as a user with and without the `myfirstplugin.hello` permission. You'll see the different responses!

### Step 5: Using Hooks

Oxide provides a system of hooks<sup><a href="/glossary#hooks">[7]</a></sup> that your plugins<sup><a href="/glossary#plugins">[3]</a></sup> can use to interact with the game. Hooks<sup><a href="/glossary#hooks">[7]</a></sup> are methods that get called when specific events happen in the game, such as a player connecting, a player being hurt, an entity being spawned, etc.

In this section, we'll use the OnPlayerConnected hook to print a message to the server console when a player connects.

Here's how to implement this:

```csharp
namespace Oxide.Plugins;

[Info("MyFirstPlugin", "Author Name", "1.0.0")]
public class MyFirstPlugin : RustPlugin
{
    // Existing code...

    void OnPlayerConnected(BasePlayer player)
    {
        Puts($"{player.displayName} connected to the server.");
    }
}
```

After saving and reuploading your plugin to your server, every time a player sends a chat message, a message will be printed to the server console indicating who sent the message and what the message was.

### Step 6: Implementing Configuration

Oxide supports loading plugin configurations from a file. This is useful for settings that you want to be adjustable without modifying the code.

First, add a reference to the `Newtonsoft.Json` namespace at the start of your `MyFirstPlugin.cs` file:

```csharp
using Newtonsoft.Json;
```

Next, make sure to define your configuration class with the appropriate configuration settings, after doing so you'll need to define a field which will be the reference to your configuration class.

```csharp
using Newtonsoft.Json;

namespace Oxide.Plugins;

[Info("MyFirstPlugin", "Author Name", "1.0.0")]
public class MyFirstPlugin : RustPlugin
{
    private Configuration _configuration;

    private class Configuration
    {
        public string ReplyMessage;
    }

    // Existing code...
}
```

After defining your configuration class and the reference pointing to the configuration class, you'll need to define the following methods:

- `GetDefaultConfig`

  - _For creating a new plugin configuration with default configuration values._

- `LoadConfig`

  - _Will load an existing plugin configuration file, if a configuration file isnt found, one will be made by calling the **LoadDefaultConfig** method_

- `LoadDefaultConfig`

  - _For avoiding duplicate code, and calls the **GetDefaultConfig** method_

- `SaveConfig`
  - _Writes the plugin configuration to a JSON<sup><a href="/glossary#json">[8]</a></sup> File in **oxide/config** directory_

```csharp
    // Existing Code...

    private Configuration GetDefaultConfig()
    {
        return new Configuration
        {
            ReplyMessage = "Hello"
        };
    }

    protected override void LoadConfig()
    {
        base.LoadConfig();

        try
        {
            _configuration = Config.ReadObject<Configuration>();

            if (_configuration == null)
                LoadDefaultConfig();
        }
        catch
        {
            PrintError("Configuration file is corrupt! Check your config file at https://jsonlint.com/");
            LoadDefaultConfig();
            return;
        }

        SaveConfig();
    }

    protected override void LoadDefaultConfig() => _configuration = GetDefaultConfig();
    protected override void SaveConfig() => Config.WriteObject(_configuration);

    // Existing code...
```

Finally, modify your `HelloCommand` method to access the `ReplyMessage` field in the reference to our plugin configuration class `_configuration`.

```csharp
//Existing code..
    [ChatCommand("hello")]
    private void HelloCommand(BasePlayer player, string command, string[] args)
    {
        if(!permission.UserHasPermission(player.UserIDString, "myfirstplugin.hello"))
        {
            PrintToChat(player, "You don't have permission to use this command!");
            return;
        }
        PrintToChat(player, _configuration.ReplyMessage);
    }
```

This configuration will be saved in the `oxide/config` directory as a config file with the name of your plugin (e.g., `MyFirstPlugin.json`). Server administrators can edit this file to change the reply message without having to modify your plugin code.

### Step 7: Using Data Files

In Oxide, data files<sup><a href="/glossary#data-files">[10]</a></sup> are used to store information that persists between server restarts. Let's add functionality to store the last time a player used the `/hello` command.

```csharp
// Existing code...

private Dictionary<string, DateTime> _lastCommandUsage = new Dictionary<string, DateTime>();
private const string DataFileName = "MyFirstPlugin_LastUsage";

void Init()
{
    permission.RegisterPermission("myfirstplugin.hello", this);
    LoadData();
}

void OnServerSave() => SaveData();
void Unload() => SaveData();

private void LoadData()
{
    _lastCommandUsage = Interface.Oxide.DataFileSystem.ReadObject<Dictionary<string, DateTime>>(DataFileName)
                        ?? new Dictionary<string, DateTime>();
}

private void SaveData()
{
    if (_lastCommandUsage != null)
        Interface.Oxide.DataFileSystem.WriteObject(DataFileName, _lastCommandUsage);
}

[ChatCommand("hello")]
private void HelloCommand(BasePlayer player, string command, string[] args)
{
    if(!permission.UserHasPermission(player.UserIDString, "myfirstplugin.hello"))
    {
        PrintToChat(player, "You don't have permission to use this command!");
        return;
    }

    string userId = player.UserIDString;
    string message = _configuration.ReplyMessage;

    if (_lastCommandUsage.ContainsKey(userId))
    {
        TimeSpan timeSinceLastUse = DateTime.Now - _lastCommandUsage[userId];
        message += $" You last used this command {timeSinceLastUse.TotalMinutes:0.0} minutes ago.";
    }

    _lastCommandUsage[userId] = DateTime.Now;
    SaveData();

    PrintToChat(player, message);
}
```

This code:

1. Creates a dictionary to store the last time each player used the command
2. Loads this data from a data file when the plugin initializes
3. Saves the data when the server saves or when the plugin unloads
4. Updates the dictionary and tells the player when they last used the command

The data file will be saved as a JSON<sup><a href="/glossary#json">[8]</a></sup> file in the `oxide/data` directory.

### Step 8: Working with Groups

Oxide has a built-in groups<sup><a href="/glossary#groups">[12]</a></sup> system that works with permissions<sup><a href="/glossary#permissions">[11]</a></sup>. Let's enhance our plugin to give a different message based on the player's group.

```csharp
[ChatCommand("hello")]
private void HelloCommand(BasePlayer player, string command, string[] args)
{
    if(!permission.UserHasPermission(player.UserIDString, "myfirstplugin.hello"))
    {
        PrintToChat(player, "You don't have permission to use this command!");
        return;
    }

    string userId = player.UserIDString;
    string message = _configuration.ReplyMessage;

    // Check if player is in the admin group
    if (permission.UserHasGroup(userId, "admin"))
    {
        message = "Greetings, admin! " + message;
    }

    if (_lastCommandUsage.ContainsKey(userId))
    {
        TimeSpan timeSinceLastUse = DateTime.Now - _lastCommandUsage[userId];
        message += $" You last used this command {timeSinceLastUse.TotalMinutes:0.0} minutes ago.";
    }

    _lastCommandUsage[userId] = DateTime.Now;
    SaveData();

    PrintToChat(player, message);
}
```

This checks if the player is in the "admin" group and gives them a special greeting if they are.

### Step 9: Using Covalence for Cross-Game Compatibility

If you want your plugin to work across multiple games, you can use the Covalence<sup><a href="/glossary#covalence">[1]</a></sup> system. Let's convert our plugin to use Covalence<sup><a href="/glossary#covalence">[1]</a></sup>:

```csharp
using Oxide.Core;
using Oxide.Core.Plugins;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Oxide.Plugins
{
    [Info("MyFirstPlugin", "Author Name", "1.0.0")]
    public class MyFirstPlugin : CovalencePlugin
    {
        private Configuration _configuration;
        private Dictionary<string, DateTime> _lastCommandUsage = new Dictionary<string, DateTime>();
        private const string DataFileName = "MyFirstPlugin_LastUsage";

        private class Configuration
        {
            public string ReplyMessage = "Hello";
        }

        protected override void LoadConfig()
        {
            base.LoadConfig();
            try
            {
                _configuration = Config.ReadObject<Configuration>();
                if (_configuration == null) LoadDefaultConfig();
            }
            catch
            {
                PrintError("Configuration file is corrupt! Check your config file at https://jsonlint.com/");
                LoadDefaultConfig();
            }
            SaveConfig();
        }

        protected override void LoadDefaultConfig() => _configuration = new Configuration();
        protected override void SaveConfig() => Config.WriteObject(_configuration);

        private void LoadData()
        {
            _lastCommandUsage = Interface.Oxide.DataFileSystem.ReadObject<Dictionary<string, DateTime>>(DataFileName)
                            ?? new Dictionary<string, DateTime>();
        }

        private void SaveData()
        {
            if (_lastCommandUsage != null)
                Interface.Oxide.DataFileSystem.WriteObject(DataFileName, _lastCommandUsage);
        }

        void Init()
        {
            permission.RegisterPermission("myfirstplugin.hello", this);
            LoadData();
        }

        void OnServerSave() => SaveData();
        void Unload() => SaveData();

        [Command("hello")]
        private void HelloCommand(IPlayer player, string command, string[] args)
        {
            if (!player.HasPermission("myfirstplugin.hello"))
            {
                player.Reply("You don't have permission to use this command!");
                return;
            }

            string userId = player.Id;
            string message = _configuration.ReplyMessage;

            // Check if player is in the admin group
            if (player.IsAdmin)
            {
                message = "Greetings, admin! " + message;
            }

            if (_lastCommandUsage.ContainsKey(userId))
            {
                TimeSpan timeSinceLastUse = DateTime.Now - _lastCommandUsage[userId];
                message += $" You last used this command {timeSinceLastUse.TotalMinutes:0.0} minutes ago.";
            }

            _lastCommandUsage[userId] = DateTime.Now;
            SaveData();

            player.Reply(message);
        }
    }
}
```

By using the Covalence<sup><a href="/glossary#covalence">[1]</a></sup> API, this plugin can now work across different games supported by Oxide, not just Rust. Notice the changes:

1. Inheriting from `CovalencePlugin` instead of `RustPlugin`
2. Using `[Command]` instead of `[ChatCommand]`
3. Using `IPlayer` instead of `BasePlayer`
4. Using `player.Reply()` instead of `PrintToChat()`
5. Using `player.HasPermission()` instead of `permission.UserHasPermission()`

## Conclusion

Congratulations! You've created your first Oxide plugin. In this guide, you've learned:

1. How to set up a basic plugin structure
2. How to implement chat commands
3. How to work with permissions<sup><a href="/glossary#permissions">[11]</a></sup>
4. How to use hooks<sup><a href="/glossary#hooks">[7]</a></sup> to respond to game events
5. How to implement configuration files for your plugin
6. How to use data files<sup><a href="/glossary#data-files">[10]</a></sup> to store persistent information
7. How to work with groups<sup><a href="/glossary#groups">[12]</a></sup>
8. How to use Covalence<sup><a href="/glossary#covalence">[1]</a></sup> for cross-game compatibility

This is just the beginning! As you become more familiar with Oxide development, you'll be able to create increasingly complex and powerful plugins<sup><a href="/glossary#plugins">[3]</a></sup> to enhance your gaming experience.
