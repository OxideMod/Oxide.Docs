---
title: Extensions
after: configure-plugins
---

# Extensions

## Introduction

Extensions are class libraries (.dll files) that extend the functionality of Oxide, allowing your Rust server to integrate with other software or offer additional features. Common extensions used in Rust servers include [RustEdit](https://www.rustedit.io/) for custom map making and [Discord](https://discord.com/) for enabling chat synchronization between a Rust server and a Discord channel.

## Prerequisites

Before you can install extensions, make sure you have:

- **A working Rust server set up and running**. If you need help with this, please check out our [Server Setup](todo_server_setup_linky) Guide.
- **Oxide installed on your server**. If you need help with this, please check out our [Install Oxide](todo_install_oxide_linky) Guide.

## Installing Extensions

To install an extension:

1. Download the extension file, which will be a `.dll` file.
2. **Stop your Rust server!** Unlike plugins, extensions are not loaded at runtime and require a server restart to take effect.
3. Navigate to your server's Application extensions directory: `/<your_server_directory>/RustDedicated_Data/Managed/`.
4. Upload the `.dll` file into the `Managed` directory.
5. Start your Rust server. The server will now load the extension on startup.

Note: Always ensure your server is stopped before installing or updating an extension. Failure to do so can lead to issues with the extension not working correctly.

## Updating Extensions

Updating extensions follow the same steps as installing new ones. Always make sure to stop your server before replacing the `.dll` file with the updated version.

###

Extensions add a whole new level of functionality to your Rust server, allowing for customization and integration that go beyond the capabilities of standard plugins. For more guidance on managing your Rust server, check out our other guides on installing plugins, configuring plugins, and more.