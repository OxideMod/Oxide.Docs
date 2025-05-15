---
title: Installing Oxide
after: setup-server
---

# Installing Oxide

## 1. Prerequisites

Before you begin with the installation of the Oxide modding framework, ensure that you meet the following prerequisites:

1. `Rust Server`: You need to have a fully set up Rust server. If you haven't set up one, refer to the previous section ["Setting up a Rust Server"](./setup-server).

2. `Server Access`: You must have access to your server's file system. This is typically done through a FTP (File Transfer Protocol) client such as FileZilla or through a hosting provider's control panel.

3. `Server Shutdown`: Ensure that your server is not currently running. Installing Oxide while the server is running can cause issues. Make sure to safely shut it down before proceeding.

Once you meet all these prerequisites, you're ready to proceed to the next step: Downloading Oxide.

## 2. Downloading Oxide

To install Oxide on your Rust server, you first need to download the latest version of Oxide. Here are the steps:

1. Visit the [Oxide GitHub repository releases](https://github.com/OxideMod/Oxide.Rust/releases) page.

2. You will see a list of releases for the Oxide plugin. Each release has a version number and a release date. It's recommended that you download the latest stable release. You can identify this release by looking for the latest version that is not labeled as "Pre-release".

3. Once you've identified the latest stable release, find the "Assets" section under the release notes. Click on it to expand the section.

4. In the expanded "Assets" section, you'll see a `Oxide.Rust.zip` file for Windows servers and a `Oxide.Rust-linux.zip` for Linux servers. Choose the file that corresponds to your server's operating system. This is the file you need to download. Click on it to start the download.

5. Once downloaded, locate the `.zip` file in your downloads folder and extract the contents.
   ::: info NOTE
   You should extract the contents to a temporary directory, not directly to your Rust server directory. We'll cover uploading the files to your Rust server in the next section below.
   :::

Now that we've downloaded and properly extracted Oxide, we can move on to the next section: Uploading Oxide to Your Server.

## 3. Uploading Oxide to Your Server

Once you've downloaded and extracted the Oxide files, the next step is to upload them to your server. Here are the general steps you need to follow:

::: danger STOP
**Stop your server** - This is critical, as uploading files to your Rust server while it's running could potentially corrupt your server data. Ensure your server is completely shut down before proceeding.
:::

1. **Access your server files**: Use your preferred method of accessing your server's files. This might be an FTP client, a remote desktop application, a server control panel's file manager, or another method provided by your hosting service.

2. **Navigate to the correct directory**: On your server, navigate to the main Rust server directory (this will be `rust_server` if you've followed the steamcmd instructions without changing the name). Inside this directory, there is another directory named `RustDedicated_Data`. This is where the Oxide files need to be uploaded.

3. **Upload the Oxide files**: On your local machine, navigate to the location where you've extracted the Oxide files. Transfer all the extracted Oxide files into the RustDedicated_Data directory on your server. If prompted, choose to overwrite any existing files.

4. **Start your server**: After the files have been uploaded successfully, start your server using the same start up script as before.

After performing these steps, Oxide should be installed on your server. The server will automatically load Oxide whenever it starts, and you should see Oxide-related messages in your server console to confirm successful loading.

## 4. Verifying the Installation

After you have uploaded the Oxide files to your Rust server and restarted it, you should verify that Oxide was installed correctly. Here are the steps to do that:

1. **Check the server console**: After restarting your server, check the server console. During the server startup process, you should see messages related to Oxide. This is an indication that the server is loading Oxide.

2. **Join your server**: Another way to verify Oxide installation is by joining your Rust server as a player. Once you're in the game, press `F1` to open the console.

3. **Use the Oxide version command**: In the console, type the command `oxide.version` and press enter. If Oxide is installed correctly, it will display the installed version of Oxide.

If you see Oxide messages in your server console and the `oxide.version` command returns a version number, then Oxide is installed correctly! If you don't see these indications, you may need to troubleshoot the installation.

Continue to the next page for information on installing plugins!

## 5. troubleshooting

1. One common mistake is to update the server back to vanilla after installing Oxide. Make sure that the server start script does not execute `steamcmd.exe ...` 

2. For every server update by Facepunch, there is an Oxide update. Don't mismatch version of Oxide and version of servers. You can track Facepunch server updates on [steamdb.info](https://steamdb.info/app/258550/depots/)

3. When updating, `steamcmd.exe` command should include the `-beta public` switch. Don't use `release` branch because it is not alway in sync with the `public` branch.

4- use the -logFile "Server.log" parameter on `RustDedicated`. It will provide info about what is going wrong. 

