---
title: My First Plugin
after: development-environment
---

# Writing your first plugin

Creating your first plugin can be an exciting introduction to modding in Rust with Oxide. In this guide, we'll walk you through the process of creating your first plugin.

## Prerequisites

Before you start, ensure you have the following:

1. A configured development environment. If you haven't set up your development environment yet, please follow our guide [here](development-environment).
3. The .NET Framework 4.8 SDK (Developer Bundle) from [Microsoft .NET](https://dotnet.microsoft.com/en-us/download/dotnet-framework/net48). Make sure when creating your project to choose .NET Framework 4.8 or set the version manually in your .csproj file.

## Understanding Plugins and Extensions

In the Oxide modding framework, plugins and extensions serve different roles:

- **Plugins** are .cs files that are compiled at runtime by the Oxide framework. These are typically game-specific and provide unique gameplay features or modifications.

- **Extensions** are .dll files that provide additional functionalities to the Oxide framework. They're built using class libraries and can be utilized by plugins.

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

Next, we'll define our namespace and create a class MyFirstPlugin that inherits from RustPlugin. Every Oxide plugin should have metadata defined. This metadata includes the `plugin name`, `author`, and `version`. This is done using attributes at the start of your plugin class.

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
Let's enhance our plugin by implementing permissions. We'll require players to have a specific permission (`myfirstplugin.hello`) to use the `/hello` chat command.

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

After making these changes, save and reupload your plugin to your server. You should now be able to grant permissions using the command `grant <user or group> <permission>`. Try using the `/hello` command in chat as a user with and without the `myfirstplugin.hello` permission. You'll see the different responses!

### Step 5: Using Hooks
Oxide provides a system of hooks that your plugins can use to interact with the game. Hooks are methods that get called when specific events happen in the game, such as a player connecting, a player being hurt, an entity being spawned, etc.

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

- ```GetDefaultConfig```
  - *For creating a new plugin configuration with default configuration values.*

- ```LoadConfig```
  - *Will load an existing plugin configuration file, if a configuration file isnt found, one will be made by calling the **LoadDefaultConfig** method*

- ```LoadDefaultConfig```
  - *For avoiding duplicate code, and calls the **GetDefaultConfig** method*

- ```SaveConfig```
  - *Writes the plugin configuration to a Json File in **oxide/config** directory*

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
        PrintToChat(player, helloMessage);
    }
//Existing code..
```
Now, when your plugin is loaded, it will check for a configuration file. If it doesn't exist, a new one will be created using `LoadDefaultConfig` which creates a new instance of Configuration with the field `ReplyMessage` having it's value as "**hello**". If it does exist, the `ReplyMessage` value will be loaded from the file. You can change the `ReplyMessage` value in the configuration file to change the message of the `/hello` chat command without modifying the code.

After making these changes, save and reupload your plugin to your server. Try changing the `ReplyMessage` value in the configuration file and use the `/hello` command in chat. You'll see the updated message!

### Summary
Congratulations, you've created your first Oxide plugin for Rust! You've learned how to create a chat command, implement permissions, use hooks, and implement plugin configuration. This is just the beginning - the Oxide modding framework offers many more functionalities to explore.

To continue improving your plugin, consider adding more commands, implementing more hooks, and making more use of the configuration file. Always test your changes by deploying the updated plugin to your server and verifying its behavior. 