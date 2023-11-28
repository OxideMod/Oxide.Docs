---
title: Timers
after: Permissions
---

# Timers

## `Once`

The `Once` method will run the `callback` once after the `interval` has passed in seconds.

::: details Github Location 
[`Once`](https://github.com/OxideMod/Oxide.CSharp/blob/develop/src/PluginTimers.cs#L74)
:::

::: details Source Code
```csharp
public Timer Once(float seconds, Action callback)
{
    return new Timer(timer.Once(seconds, callback, plugin));
}
```
:::

## `In`

The `In` method will run the `callback` once after the `interval` has passed in seconds.

::: details Github Location 
[`In`](https://github.com/OxideMod/Oxide.CSharp/blob/develop/src/PluginTimers.cs#L84)
:::

::: details Source Code
```csharp
public Timer In(float seconds, Action callback)
{
    return new Timer(timer.Once(seconds, callback, plugin));
}
```
:::

## `Every`

The `Every` method will continuously run the `callback` every `interval` milliseconds

::: details Github Location 
[`Every`](https://github.com/OxideMod/Oxide.CSharp/blob/develop/src/PluginTimers.cs#L94)
:::

::: details Source Code
```csharp
public Timer Every(float interval, Action callback)
{
    return new Timer(timer.Repeat(interval, -1, callback, plugin));
}
```
:::

## `Repeat`

The `Repeat` method will run the `callback` every `interval` milliseconds for a set number of `repeats`

::: details Github Location 
[`Repeat`](https://github.com/OxideMod/Oxide.CSharp/blob/develop/src/PluginTimers.cs#L105)
:::

::: details Source Code
```csharp
public Timer Repeat(float interval, int repeats, Action callback)
{
    return new Timer(timer.Repeat(interval, repeats, callback, plugin));
}
```
:::