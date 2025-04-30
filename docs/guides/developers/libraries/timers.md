---
title: Timers
after: Permissions
---

# Timers

## Understanding Timers

Timers are implemented through the Oxide framework, offering plugin developers the ability to effectively schedule and manage various tasks within their plugins.

## Using a `Once` Timer

```csharp
namespace Oxide.Plugins;

[Info("MyFirstPlugin", "Author Name", "1.0.0")]
public class MyFirstPlugin : RustPlugin
{
    void Init() {
        // Create a timer, and run the callback in 300 seconds
        timer.Once(300, () => {
            Puts("Timer was ran.");
        });
    }
}
```

## Using a `In` Timer

```csharp
namespace Oxide.Plugins;

[Info("MyFirstPlugin", "Author Name", "1.0.0")]
public class MyFirstPlugin : RustPlugin
{
    void Init() {
        // Create a timer, and run the callback in 300 seconds
        timer.In(300, () => {
            Puts("Timer was ran.");
        });
    }
}
```

## Using a `Every` Timer

```csharp
namespace Oxide.Plugins;

[Info("MyFirstPlugin", "Author Name", "1.0.0")]
public class MyFirstPlugin : RustPlugin
{
    Timer _timer;

    void Init() {
        // Create a timer, and store it in _timer when the plugin is initialized
        _timer = timer.Every(300, () => {
            // Timer will run the callback every 300 seconds
            Puts("Timer was ran.");
        });
    }
}
```

## Using a `Repeat` Timer

```csharp
namespace Oxide.Plugins;

[Info("MyFirstPlugin", "Author Name", "1.0.0")]
public class MyFirstPlugin : RustPlugin
{
    Timer _timer;

    void Init() {
        // Create a timer, and store it in _timer when the plugin is initialized
        _timer = timer.Repeat(300, 10, () => {
            // Timer will run the callback every 300 seconds for a total of 10 times
            Puts("Timer was ran.");
        });
    }
}
```
