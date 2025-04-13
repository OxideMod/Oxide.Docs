---
title: Permissions
after: commands
---

# Introduction to Permissions
In Oxide, permissions play a crucial role in server management, allowing server administrators to fine-tune who can do what on their server. While you can execute some commands regardless of your permissions (like Oxide's version check), many commands - particularly those introduced by plugins - require you to have specific permissions assigned.

Permissions in Oxide are managed on a per-user and per-group basis. This means you can assign permissions to a specific user or a group of users. Groups are beneficial when you want to assign the same set of permissions to many users, such as admins, mods, or VIPs. While managing permissions can be done directly through the server console, several plugins provide a more user-friendly interface for managing permissions.

## Understanding Permissions
Each permission in Oxide is represented by a string, often in a "pluginname.command" format. For instance, if you have a plugin named "ExamplePlugin," and it has a command named "excmd," the permission to execute this command might be "exampleplugin.excmd".

When a command is executed, Oxide checks if the user has the corresponding permission. If they do, the command is executed; if they don't, the command is rejected, and usually, a message like "You don't have permission to use this command" is shown.

There are three ways to assign permissions in Oxide:

1. **User Permissions**: These are permissions given to a specific user. For instance, you might give a particular user the ability to kick other players, even if they're not part of any special group.

2. **Group Permissions**: These are permissions given to a group of users. Any user who is part of this group inherits all the group's permissions. For example, you might create an "admin" group and give it permissions to kick and ban players.

3. **Permission Inheritance**: Groups can inherit permissions from other groups through parent relationships. This is useful when you have a hierarchical structure. For example, you might have a "moderator" group that can kick players, an "admin" group that can kick and ban players, and a "superadmin" group that can kick, ban, and change server settings. Instead of specifying the kick and ban permissions for each group, you can have the admin group inherit permissions from the moderator group (as its parent) and the superadmin group inherit from the admin group.

Understanding how these permission types interact is key to effectively managing your server's permissions.

The next sections will detail how to create and manage groups, assign permissions to users and groups, and some recommended plugins to simplify permissions management.

## Creating and Managing Groups
Groups in Oxide are sets of users that share the same permissions. This makes managing permissions for multiple users more manageable. Here's how you can create and manage groups in Oxide:

- To list all groups: `oxide.groups`
- To see the members and permissions of a specific group: `oxide.show group [groupname]`
    - Example: `oxide.show group admins`
- To create a group: `oxide.group add [groupname]`
    - Example: `oxide.group add admins`
- To remove an existing group: `oxide.group remove [groupname]`
    - Example: `oxide.group remove VIP`
- To add a user to a group: `oxide.usergroup add [username] [groupname]`
    - Example: `oxide.usergroup add Bob admins`
- To remove a user from a group: `oxide.usergroup remove [username] [groupname]`
    - Example: `oxide.usergroup remove Bob admins`
- To create a group with a title: `oxide.group add [groupname] [title]`
    - Example: `oxide.group add VIP "VIP Member"`
- To set the title or rank of a group: `oxide.group set [groupname] [title] [rank]`
    - Example: `oxide.group set VIP "[VIP Member]" 1`
- To set the parent group of another group: `oxide.group parent [groupname] [parentgroupname]`
    - Example: `oxide.group parent admin default`

:::info
**Note on Group Inheritance:** Oxide now supports parent-child relationships between groups. When you set a parent group, the child group inherits all permissions from the parent group. This is a powerful way to create hierarchical permission structures without duplicating permissions.

The system includes automatic circular reference detection to prevent infinite loops (e.g., group A having group B as parent, and group B having group A as parent). If circular references are detected, they will be removed automatically and a warning will be logged.

All group and permission names are handled case-insensitively, so "Admin" and "admin" are treated as the same group.
:::

## Assigning Permissions to Users and Groups
In Oxide, permissions allow you to control which commands and functions a user or group can use. This includes Oxide commands, Rust server commands, and commands provided by installed plugins. Permissions in Oxide are assigned by using the `oxide.grant` command.

- To check a user's permissions: `oxide.show user [username]`
    - Example: `oxide.show user Bob`
- To check a group's permissions: `oxide.show group [groupname]`
    - Example: `oxide.show group admins`
- To show which user or group has a permission: `oxide.show perm [permission]`
    - Example: `oxide.show perm oxide.reload`
- To show all of the registered permissions from plugins and Oxide: `oxide.show perms`
- To assign a permission:
    - To a user: `oxide.grant user [username] [permission]`
    - To a group: `oxide.grant group [groupname] [permission]`
    - Example: `oxide.grant user Bob plugin.permission`
- To revoke a permission:
    - From a user: `oxide.revoke user [username] [permission]`
    - From a group: `oxide.revoke group [groupname] [permission]`
    - Example: `oxide.revoke group admins plugin.permission`

You can use the wildcard (*) to grant multiple permissions at one time:

- To give a group all permissions: `oxide.grant group [groupname] *`
    - Example: `oxide.grant group admin *`
- To give a user all permissions for a specific plugin: `oxide.grant user [username] [plugin].*`
    - Example: `oxide.grant user Bob myplugin.*`


## Useful Permissions Plugins

While the base Oxide permissions system is comprehensive, managing permissions through commands may not always be the most convenient way, especially for larger servers. A plugin that can provide a graphical interface for managing permissions could prove helpful in this regard:

:::tip
**Permissions Manager**: This plugin provides a graphical interface for managing Oxide permissions. It makes it easier to add, remove, and view permissions. This can greatly simplify permissions management, especially on servers with many players and groups.
:::

## Troubleshooting Permissions

If you encounter problems while managing permissions, here are some general steps you can follow:

- **Check console output**: Oxide will often output useful information to the server console. This can include errors with permissions and groups.
- **Check the user's permissions**: Use the command `oxide.show user [username]` to view all the permissions that a user has. This can help identify if they are missing a necessary permission or have one that they should not.
- **Verify parent group relationships**: If you're using group inheritance, make sure that the parent-child relationships are set up correctly and don't contain any circular references.
- **Review data storage**: Oxide stores permissions data using ProtoBuf serialization in the `oxide.users` and `oxide.groups` files. If you suspect data corruption, you might need to manually edit or delete these files (after making backups).

Remember, replace `[username]` with the username of the player you are investigating.

## Advanced Features

### User Data Validation
Oxide now includes a validation system for user IDs to ensure that invalid or obsolete entries don't accumulate in the permissions database. Server administrators can customize validation rules through extensions, and the system will automatically clean up invalid entries.

### Export and Import
You can export your permissions to JSON format using the `oxide.export` command, which creates separate files for groups and users. This is useful for backup purposes or transferring permission settings between servers.

## Conclusion

Understanding and effectively managing Oxide permissions is crucial for the smooth operation of your Rust server. With the knowledge you've gained from this guide, you should be equipped to handle any permissions setup your server needs.

Remember to stay in the loop with new plugins, as they may introduce new permissions. Staying on top of this will help ensure your users have the best possible experience on your server.