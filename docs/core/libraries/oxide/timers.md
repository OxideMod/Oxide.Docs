---
title: Timers
after: Permissions
---

# Timers

## `Once`

The `Once` method will run the `callback` once after the `delay` has passed in seconds.

::: details Github Location 
[`Once`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Timer.cs#L466)
:::

::: details Source Code
```csharp
public TimerInstance Once(float delay, Action callback, Plugin owner = null) {
    AddTimer(1, delay, callback, owner);
}
```
:::

## `Repeat`

The `Repeat` method will run the `callback`

::: details Github Location 
[`Repeat`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Timer.cs#L477)
:::

::: details Source Code

:::

## `NextFrame`

The `NextFrame` method will 

::: details Github Location 
[`NextFrame`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Timer.cs#L485)
:::

::: details Source Code

:::