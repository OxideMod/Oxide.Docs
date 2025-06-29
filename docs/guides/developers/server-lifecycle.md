---
title: Server lifecycle
after: target-frameworks
--- 
 
# Server lifecycle
The lifecycle of a game server application

## Server application
### Initialization

The first initialization state generally occurs very early during the start-up process of a game server. uMod does the following...

1. Create a temporary in-memory PipeLogger to store any log messages made during initialization.
1. Loads Oxide configuration files.
1. Load libraries and start standalone applications (e.g. Oxide.Database, Oxide.Compiler).
1. Load the game extension.
1. Initialize logging. 
1. Load user and group data.
1. Load extensions and plugins.

### Shutdown

When a server receives a shutdown signal, the following steps occur...

1. Group/Permission data is saved
1. Plugins are unloaded
1. Extensions are unloaded
1. Core libraries are unloaded
1. Standalone applications are shutdown
1. Logging is stopped

### Restart

The Oxide core provides no built-in functionality to handle automatic server restarts, however the launcher script templates include automatic restart functionality.

### Frame

A frame is a snapshot in time. The speed of frames roughly translates to how well a server is performing. A low frame-rate is bad and is associated with lag and stuttering, whereas a high frame-rate means a server is performing well. Typically the frame-rate is measured as frames-per-second or FPS. Improving frame-rate usually requires...

1. Optimizing plugins and designing the software with optimization in mind
1. Adding better hardware

Conversely, poor frame-rate may be associated with any combination of the following...

1. Poorly designed plugins
1. Lack of hardware capacity
1. Operating too many plugins relative to hardware capacity

## Client application

A client application is any application which communicates with a game server (or other game client) from a remote application or machine, usually over a network.
### Networking

Modern multiplayer games often use UDP as the transport layer for client-server communication, but TCP is also common. Please note that the transport layer used by a game may affect the speed and reliability of any given connection. As a general rule, the differences between UDP and TCP are generally understood to be...

1. UDP  
&emsp;- Unreliable  
&emsp;- Fast  
1. TCP  
&emsp;- Reliable  
&emsp;- Slow  

The many mysteries of any given game's networking stack are generally hidden from view. Each game may use wildly different networking libraries and protocols.

Quite often game developers implement multiplayer functionality and distribute a separate dedicated server application to the community. Server administrators then self-host or hire GSPs (game service providers) to host dedicated servers on their behalf. This is typically beneficial to game developers because a dedicated server can prevent cheating and increase the longevity of their game by allowing server-side customizations.

Dedicated servers typically announce to players that a server is available using an official server list. Game developers can choose to what extent servers with any given modifications are allowed. uMod does not support servers that do not appear on the official server list.

uMod does not support player client modification, except when the game networking stack requires using a game client as a server (e.g. P2P).
### Handshake

The following hooks allow plugins to intercept or listen to connection events.
```csharp
bool CanPlayerLogin(string playerName, string playerId, string playerIp)
void OnPlayerApproved(string playerName, string playerId, string playerIp)
void OnPlayerConnected(IPlayer player);
```

### Connection authorization

Authorize client connections at the very beginning of the handshake, before IPlayer initialization occurs.

```csharp
bool CanPlayerLogin(string playerName, string playerId, string playerIp)
{
    return false;
}
```

Monitor and/or drop an IPlayer after they are fully initialized.

```csharp
void OnPlayerConnected(IPlayer player)
{
    if (player.Name == "Calytic")
    {
        player.Kick();
    }
}
```

### Disconnect monitoring
```csharp
bool OnPlayerDisconnected(IPlayer player);
void OnPlayerKicked(IPlayer player, string reason);
```


