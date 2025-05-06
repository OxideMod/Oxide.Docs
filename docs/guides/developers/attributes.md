---
title: Attributes
after: webrequests
---

# Attributes

## Commands

Custom commands are easily implemented with minimal boilerplate for both in-game chat interfaces and conventional command-line interfaces.

## Chat commands

Chat commands are in-game commands entered via the game client's chat, prefixed by a forward slash (/).

when using covalence

```csharp
[Command("test")]
private void TestCommand(IPlayer player, string command, string[] args)
{
    player.Reply("Test successful!");
}
```

when using Rustplugin

```csharp
[ChatCommand("test")]
void cmdTest (BasePlayer player, string command, string [] args)
{
	Puts("Test successful!");
}
```

## Console commands

Console commands may be executed from the server console and in-game interfaces F1 (where applicable).

when using covalence

```csharp
[Command("test")]
private void TestCommand(IPlayer player, string command, string[] args)
{
    player.Reply("Test successful!");
}
```

when using Rustplugin

```csharp
[ConsoleCommand("test")]
private void cmdTest((ConsoleSystem.Arg arg))
{
    Puts("Test successful!");
}
```

## Command permissions

Easily restrict command usage to players who have a permission<sup><a href="/glossary#permissions">[6]</a></sup> assigned to them.

```csharp
[Command("test"), Permission("epicstuff.use")]
private void TestCommand(IPlayer player, string command, string[] args)
{
    player.Reply("Test successful!");
}
```

## Info

Information about the plugin<sup><a href="/glossary#plugins">[1]</a></sup>. plugin<sup><a href="/glossary#plugins">[1]</a></sup> name (with spaces between words), Developper or maintainer name, and a 3 digit version number.

```csharp
[Info("Plugin name", "Developper/Maintainer", "1.0.0")]
```

## Description

A short description of what the plugin<sup><a href="/glossary#plugins">[1]</a></sup> does

```csharp
[Description("A short description of the plugin")]
```

## PluginReference

Reference to other plugin<sup><a href="/glossary#plugins">[1]</a></sup>, when this plugin<sup><a href="/glossary#plugins">[1]</a></sup> need to use functions from other plugins<sup><a href="/glossary#plugins">[1]</a></sup>.

```csharp
[PluginReference] private Plugin Vanish, Backpacks;
```

Note: when a plugin<sup><a href="/glossary#plugins">[1]</a></sup> is required by this plugin<sup><a href="/glossary#plugins">[1]</a></sup>, this line should appear at the top.

```csharp
//Requires: Backpacks
```

If required plugin<sup><a href="/glossary#plugins">[1]</a></sup> is absent from plugin folder, this plugin<sup><a href="/glossary#plugins">[1]</a></sup> will not start

## OnlinePlayers

Auto manage an Hashtable of online players.

see Bank and Trade plugin<sup><a href="/glossary#plugins">[1]</a></sup> for usage example

```csharp
class OnlinePlayer
{
	public BasePlayer Player;
	public OnlinePlayer (BasePlayer player)
	{
	}
}

[OnlinePlayers]
Hash<BasePlayer, OnlinePlayer> onlinePlayers = new Hash<BasePlayer, OnlinePlayer> ();
```

## HookMethod

Indicates that the specified method should be a handler for a hook<sup><a href="/glossary#hooks">[2]</a></sup>

```csharp
[HookMethod("OnPlayerConnected")]
private void base_OnPlayerConnected(BasePlayer player) => AddOnlinePlayer(player);
```

## AutoPatch

Used with HarmonyPatch to automatically install the patch when plugin<sup><a href="/glossary#plugins">[1]</a></sup> start, and uninstall it, when plugin<sup><a href="/glossary#plugins">[1]</a></sup> terminate

```csharp
[AutoPatch]
[HarmonyPatch(typeof(Planner), "DoPlace")]
static class DoPlace_Process
{
	[HarmonyPrefix]
	private static bool Prefix()
	{
		UnityEngine.Debug.Log($"[Harmony] Planner DoPlace ");
		return true;
	}
}
```

Note: see harmony documentation for info about harmony patches

## Reference

Add the ablility to reference additionnal DLL files to be used by the plugin<sup><a href="/glossary#plugins">[1]</a></sup>

```csharp
//Reference: System.Drawing
```
