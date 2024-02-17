---
title: Server Setup
after: getting-started
---

# Setting up a modded server

Setting up a Rust server can be a rewarding experience, giving you control over the game's environment, rules, and player community. This guide aims to walk you through the process of setting up your own Rust server, from choosing a host to starting the server and adjusting your server configurations. We will use GameServerKings, a reputable and user-friendly game hosting service, as our primary example. However, the principles here can be applied to various hosting services. If you're setting up a local or self-hosted server, we've got you covered as well.

## 1. Choosing a Host

Choosing a host for your Rust server is an important decision. Here are some factors to consider:

1. **Location**: Select a host with servers close to where most of your players are located to reduce latency.
2. **Hardware**: Ensure the host can provide enough resources (CPU, RAM, storage, bandwidth) for your expected player count and server type (e.g., modded, vanilla).
3. **Support**: Look for a host with reliable customer service and technical support.
4. **Pricing**: Compare prices among different hosts. Keep in mind that very cheap hosts might not offer the best performance or support.
5. **Reputation**: Read reviews and ask other server owners for their experiences with different hosts.

One host that satisfies these requirements is [GAMESERVERKINGS](https://www.gameserverkings.com/). They offer a variety of server hosting options, including Rust, with a range of affordable plans.

::: tip
![GAMESERVERKINGS](https://cdn.gameserverkings.com/assets/logo-white-2c37ff4c00514fd6ee48fe3846b851f066993dcc8f94ce0da543cef5dfd91902.svg)
Check out [GAMESERVERKINGS](https://www.gameserverkings.com/) for reliable, high-performance Rust server hosting.
:::

Remember, the right host can make a significant difference in the quality of gameplay on your server. Choose wisely!

## Setting Up Hardware

Once you've chosen a host, you need to determine the right hardware configuration for your server. The two main factors to consider are CPU and RAM.

1. **CPU**: The Central Processing Unit (CPU) handles all of the computations your server needs to run the game. Rust can be quite CPU-intensive, especially on larger servers, so a powerful CPU is recommended.

2. **RAM**: Random Access Memory (RAM) is used to store data that the server needs to access quickly. The more players and plugins you have on your server, the more RAM you'll need. A server with 50 players, for instance, should have at least 8GB of RAM.

Your host may have recommendations or calculators to help you decide on the right hardware for your needs. When in doubt, it's better to start with more resources than you think you'll need, as you can usually scale back if necessary.

Remember, your server's performance can greatly impact player satisfaction, so it's worth investing in good hardware!

## 2. Installing Rust

The installation process can differ significantly depending on whether you're hosting your server yourself or using a hosting service. If you're using a hosting service, the process is often automated, and you don't need to worry about the installation. However, if you're hosting the server yourself, you'll need to download and install the game server files manually.

### Downloading and Installing via SteamCMD

SteamCMD is a command-line tool provided by Valve that allows you to manage game servers. Here are the steps to install Rust using SteamCMD:

1. **Download SteamCMD**. You can download SteamCMD for free from [the official Steam website](https://developer.valvesoftware.com/wiki/SteamCMD).

2. **Unzip the SteamCMD files**. After downloading, extract the files to a directory on your server.

3. **Run SteamCMD**. Navigate to the directory where you extracted SteamCMD and run it.

4. **Log in**. After running SteamCMD, you need to log in to a Steam account. You can use an anonymous login for Rust.

5. **Install Rust**. Once you're logged in, you can download and install Rust.

Here is an example of a batch script that automatically updates the Rust server:

```batch
@echo off
start "" steamcmd.exe +login anonymous +force_install_dir "C:\rust_server" +app_update 258550 validate +quit
```

Replace `C:\rust_server` with the path to the directory where you want to install the Rust server.

The `+app_update 258550 validate` command checks for any updates to the Rust server files and downloads them if necessary.

Running this script will keep your Rust server up to date. You might consider scheduling it to run automatically at regular intervals.

## 3. Configuring Your Server

Once you have Rust installed on your server, the next step is to configure the server. Server configuration involves setting up various parameters to customize your server's gameplay experience. 

### Server.cfg

Rust servers use a configuration file called `server.cfg` to manage server settings. This file is typically located in the server install directory under the `cfg` folder. If the file does not exist, you can create it.

Here are some common settings that you might want to configure:

- **server.hostname** - The name of your server as it will appear in the server list.
- **server.description** - A short description of your server, shown in the server info panel in-game.
- **server.headerimage** - A direct URL to an image that will be displayed in the server info panel.
- **server.url** - A URL to your server's website or a related page.

Here's an example of what a `server.cfg` file might look like:

```txt
server.hostname "My Awesome Rust Server"
server.description "Welcome to my awesome Rust server! Enjoy your stay."
server.headerimage "http://example.com/myheaderimage.jpg"
server.url "http://example.com"
```

These are just a few of the many settings that can be customized in the `server.cfg` file. For a complete list of available server configurations, you can refer to the [official FacePunch documentation](https://wiki.facepunch.com/rust/Configuring-Rust).


## 4. Starting the Server

After setting up and configuring your server, it's time to get it running. Depending on your server operating system, the process may vary.

### 4.1 Windows

On Windows, a common way to manage this process is by using a batch script, which can automate server startup with your desired settings and configurations. Below is an example of a basic batch script for a Rust server:

```batch
@echo off
:start
RustDedicated.exe -batchmode +server.port 28015 +server.level "Procedural Map" +server.seed 1234 +server.worldsize 4000 +server.maxplayers 100 +server.hostname "Your Server Name" +server.description "Description Here" +server.url "http://yourwebsite.com" +server.headerimage "http://yourwebsite.com/serverimage.jpg" +server.identity "youridentity" +rcon.port 28016 +rcon.password "yourrconpassword" -logfile "output.txt"
goto start
```

### 4.2 Linux

On Linux, you can use a shell script for starting the server. Here's an example:

```bash
#!/bin/bash
./RustDedicated -batchmode +server.port 28015 +server.level "Procedural Map" +server.seed 1234 +server.worldsize 4000 +server.maxplayers 100 +server.hostname "Your Server Name" +server.description "Description Here" +server.url "http://yourwebsite.com" +server.headerimage "http://yourwebsite.com/serverimage.jpg" +server.identity "youridentity" +rcon.port 28016 +rcon.password "yourrconpassword" -logfile "output.txt"
```

The options in these scripts include:

- `+server.port 28015`: Sets the server port.
- `+server.level "Procedural Map"`: Sets the map type.
- `+server.seed 1234`: Sets the map seed.
- `+server.worldsize 4000`: Sets the map size.
- `+server.maxplayers 100`: Sets the maximum number of players.
- `+server.hostname "Your Server Name"`: Sets the server name.
- `+server.description "Description Here"`: Sets the server description.
- `+server.url "http://yourwebsite.com"`: Sets the server website.
- `+server.headerimage "http://yourwebsite.com/serverimage.jpg"`: Sets the server image.
- `+server.identity "youridentity"`: Sets the server identity.
- `+rcon.port 28016 +rcon.password "yourrconpassword"`: Sets the RCON port and password.
- `-logfile "output.txt"`: Defines the output file for server logs.

To start your server, simply save this script into a .bat (Windows) or .sh (Linux) file in your Rust server directory, and then run this file. The server will then start with your specified settings. Adjust the values as needed for your server. For more detailed options and settings, you can refer to the official Facepunch documentation.

::: info
Always remember to replace the placeholder values with your own server details.
:::

After the server is started, you should see the console outputting log messages, which indicates the server is running.

---

Congratulations, you have now set up your own Rust server! Remember, server management is an ongoing process. Regular maintenance, updates, and adjustments may be necessary to ensure the best possible gaming experience for your players. With this guide, you should have a strong foundation to keep your server running smoothly. Should you encounter any issues, remember to refer back to this guide and the resources provided. Use the buttons below for guides on installing Oxide and plugins