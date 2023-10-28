---
title: My First Plugin
after: development-enviroment
---

# Writing your first plugin

Creating your first plugin can be an exciting introduction to modding in Rust with Oxide. In this guide, we'll walk you through the process of creating your first plugin.

## Prerequisites

Before you start, ensure you have the following:

1. A configured development environment. If you haven't set up your development environment yet, please follow our guide [here](link-to-your-development-environment-guide).
2. Oxide and Rust libraries added to your project as described in the [Development Environment section](link-to-your-adding-libraries-guide).

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

Now, let's start writing your plugin logic. For your first plugin, let's create a simple command that players can use in the game.

In your `MyFirstPlugin` class, inherit from the `RustPlugin` base class and implement the `Init` method. This method is called when your plugin is initialized.

Here's an example of a simple `hello` command using `RustPlugin`:

```csharp
public class MyFirstPlugin : RustPlugin
{
    void Init()
    {
        // Register the 'hello' command
        cmd.AddChatCommand("hello", this, HelloCommand);
    }

    // The 'hello' command implementation
    void HelloCommand(BasePlayer player, string command, string[] args)
    {
        // Send a greeting message to the player
        PrintToChat(player, "Hello, welcome to the world of Rust modding!");
    }
}
```

In the above code, you've created a hello command. When players use this command in the game, they'll receive a greeting message.

### Step 3: Deploying Your Plugin
To deploy your plugin, place the .cs file in the oxide/plugins directory of your Rust server. The Oxide framework will automatically compile and load your plugin when the server is running. Now, players can use your hello command in the game!

::: tip
Congratulations, you've created your first plugin!
:::

Next Steps
Now that you have created your first plugin, you can explore more complex functionalities. You can refer to our other guides for more advanced topics.

TODO: Add links to other guides