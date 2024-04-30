---
title: Timers
after: permissions
---

<script setup>
    import GithubLink from '../../../components/GithubLink.vue'
</script>

<GithubLink 
    link="https://github.com/OxideMod/Oxide.CSharp/blob/develop/src/PluginTimers.cs" 
    topPosition="10px" 
    leftPosition="220px" 
/>

# Timers Library

## `Once`

The `Once` method will run the `callback` once after the `interval` has passed in seconds.

::: details Github Location 
[`Once`](https://github.com/OxideMod/Oxide.CSharp/blob/develop/src/PluginTimers.cs#L74)
:::

## `In`

The `In` method will run the `callback` once after the `interval` has passed in seconds.

::: details Github Location 
[`In`](https://github.com/OxideMod/Oxide.CSharp/blob/develop/src/PluginTimers.cs#L84)
:::

## `Every`

The `Every` method will continuously run the `callback` every `interval` milliseconds

::: details Github Location 
[`Every`](https://github.com/OxideMod/Oxide.CSharp/blob/develop/src/PluginTimers.cs#L94)
:::

## `Repeat`

The `Repeat` method will run the `callback` every `interval` milliseconds for a set number of `repeats`

::: details Github Location 
[`Repeat`](https://github.com/OxideMod/Oxide.CSharp/blob/develop/src/PluginTimers.cs#L105)
:::