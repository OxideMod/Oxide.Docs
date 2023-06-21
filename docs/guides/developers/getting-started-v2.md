---
title: Getting Started V2
after: getting-started
---

# Getting started with plugin development

Welcome to the exciting world of Rust modding using the Oxide framework! If you're a fan of the game Rust, and you love to code, you're in for a treat. This guide is the first step on your journey towards creating unique and immersive mods that can add new layers of fun and complexity to the game.

## Introduction to Rust and Oxide Modding

Rust is a popular multiplayer survival game where players contend with challenges such as hunger, thirst, and exposure, not to mention other players! With the Oxide modding framework, you can build upon this base game, introducing new features, tweaking gameplay elements, and fundamentally transforming the Rust experience.

## Prerequisites

Before you begin modding with Oxide, there are a few prerequisites that you need to have:

- **A basic understanding of programming in C#**: Oxide uses C# for scripting. If you're not yet familiar with C#, there are many online resources where you can learn, like [Microsoft's C# Guide](https://docs.microsoft.com/en-us/dotnet/csharp/).
- **Familiarity with Unity game development**: Rust is built using the Unity game engine, so understanding how Unity works will be a great advantage. You can find resources on Unity's official [Learning page](https://learn.unity.com/).
- **The latest version of Rust installed locally**: You'll need this to test your mods. Instructions for installing the Staging Branch of Rust can be found on the [Facepunch Forum](https://forum.facepunch.com/t/what-is-rust-staging-branch-and-why-should-i-use-it/228224).

## Setting Up Your Development Environment

To start developing your own Oxide plugins for Rust, you'll need a few tools:

- **An Integrated Development Environment (IDE)**: Tools like [Visual Studio](https://visualstudio.microsoft.com/), [Visual Studio Code](https://code.visualstudio.com/), or [JetBrains Rider](https://www.jetbrains.com/rider/) can help streamline your development process.
- **Oxide for Rust**: You can download it from the [GitHub repository](https://github.com/OxideMod/Oxide.Rust).

## Key Concepts

Before you dive in, there are a few key concepts to understand:

- **Plugins**: These are the scripts you'll be writing, which add new functionality to the game or modify existing features.
- **Hooks**: These are functions that get called by the game or by Oxide. By using hooks in your plugins, you can define what happens when certain game events occur.
- **Data storage**: Oxide provides several ways to store data, such as player scores or configuration settings. Understanding the different data storage options and knowing when to use each is essential to creating efficient and effective mods.
- **Testing and Debugging**: A significant part of mod development is testing your creations and fixing any bugs that arise. Familiarizing yourself with the debugging tools available in your chosen IDE will save you a lot of time and headache.

With these basic concepts under your belt, you're ready to embark on your journey as a Rust mod developer!

In the next sections, we'll delve into the specifics of setting up your development environment, crafting your first plugin, and following best practices. Don't worry, we'll guide you through it every step of the way.
