---
title: Permissions
after: commands
---

# Introduction to Permissions

In Oxide, permissions<sup><a href="/glossary#permissions">[10]</a></sup> play a crucial role in server management, allowing server administrators to fine-tune who can do what on their server. Permissions<sup><a href="/glossary#permissions">[10]</a></sup> allows server owners to give players unique abilities and benefits on their servers.

Administering permissions<sup><a href="/glossary#permissions">[10]</a></sup> is easy; simply enter the desired command and you're done! If your server does not have a console, you can use any compatible RCON tool or remote console to send the commands to the server. Most Oxide-supported games also support the permission commands in the chat.

Permissions<sup><a href="/glossary#permissions">[10]</a></sup> in Oxide are managed on a per-user and per-group basis. This means you can assign permissions<sup><a href="/glossary#permissions">[10]</a></sup> to a specific user or a group of users. Groups<sup><a href="/glossary#groups">[11]</a></sup> are beneficial when you want to assign the same set of permissions<sup><a href="/glossary#permissions">[10]</a></sup> to many users, such as admins, mods, or VIPs.

## Understanding Permissions

Each permission in Oxide is represented by a string, often in a format like "pluginname.permission". For instance, a permission like "epicstuff.use" would be associated with the "epicstuff" plugin.

When a command is executed, Oxide checks if the user has the corresponding permission. If they do, the command is executed; if they don't, the command is rejected, and usually, a message like "You don't have permission to use this command" is shown.

By default, the groups<sup><a href="/glossary#groups">[11]</a></sup> that are created by Oxide are: admin and default. These can be changed by editing those under the oxide.config.json<sup><a href="/glossary#json">[7]</a></sup> file. The admin group will automatically be assigned to players that are recognized as admin (via ownerid) by the server. The "default" group will automatically be assigned to ALL players that connect to the server.

There are three ways to assign permissions<sup><a href="/glossary#permissions">[10]</a></sup> in Oxide:

1. **User Permissions**: These are permissions<sup><a href="/glossary#permissions">[10]</a></sup> given to a specific user. For instance, you might give a particular user the ability to kick other players, even if they're not part of any special group.

2. **Group Permissions**: These are permissions<sup><a href="/glossary#permissions">[10]</a></sup> given to a group of users. Any user who is part of this group inherits all the group's permissions<sup><a href="/glossary#permissions">[10]</a></sup>. For example, you might create an "admin" group and give it permissions<sup><a href="/glossary#permissions">[10]</a></sup> to kick and ban players.

3. **Permission Inheritance**: Groups<sup><a href="/glossary#groups">[11]</a></sup> can inherit permissions<sup><a href="/glossary#permissions">[10]</a></sup> from other groups<sup><a href="/glossary#groups">[11]</a></sup> through parent relationships. This is useful when you have a hierarchical structure. A group will inherit all permissions<sup><a href="/glossary#permissions">[10]</a></sup> from its parent group.

Understanding how these permission types interact is key to effectively managing your server's permissions<sup><a href="/glossary#permissions">[10]</a></sup>.

## Creating and Managing Groups

Groups<sup><a href="/glossary#groups">[11]</a></sup> in Oxide are sets of users that share the same permissions<sup><a href="/glossary#permissions">[10]</a></sup>. This makes managing permissions<sup><a href="/glossary#permissions">[10]</a></sup> for multiple users more manageable. Here's how you can create and manage groups<sup><a href="/glossary#groups">[11]</a></sup> in Oxide:

- To list all groups<sup><a href="/glossary#groups">[11]</a></sup>: `oxide.show groups`
- To see the members and permissions<sup><a href="/glossary#permissions">[10]</a></sup> of a specific group: `oxide.show group [groupname]`
  - Example: `oxide.show group admin`
- To create a group: `oxide.group add [groupname]`
  - Example: `oxide.group add vip`
- To create a group with title and rank: `oxide.group add [groupname] [title] [rank]`
  - Example: `oxide.group add vip "VIP" 0`
- To remove an existing group: `oxide.group remove [groupname]`
  - Example: `oxide.group remove vip`
- To add a user to a group: `oxide.usergroup add [username] [groupname]`
  - Example: `oxide.usergroup add Wulf admin`
- To remove a user from a group: `oxide.usergroup remove [username] [groupname]`
  - Example: `oxide.usergroup remove Wulf admin`
- To set the title of a group: `oxide.group set [groupname] [title]`
  - Example: `oxide.group set vip "[VIP Member]"`
- To set the title and rank of a group: `oxide.group set [groupname] [title] [rank]`
  - Example: `oxide.group set vip "[VIP Member]" 1`
- To set the parent group of another group: `oxide.group parent [groupname] [parentgroupname]`
  - Example: `oxide.group parent admin default`

:::info
**Note on Group Inheritance:** Oxide supports parent-child relationships between groups<sup><a href="/glossary#groups">[11]</a></sup>. When you set a parent group, the child group inherits all permissions<sup><a href="/glossary#permissions">[10]</a></sup> from the parent group. This is a powerful way to create hierarchical permission structures without duplicating permissions<sup><a href="/glossary#permissions">[10]</a></sup>.

The system includes automatic circular reference detection to prevent infinite loops (e.g., group A having group B as parent, and group B having group A as parent). If circular references are detected, they will be removed automatically and a warning will be logged.

All group and permission names are handled case-insensitively, so "Admin" and "admin" are treated as the same group.
:::

## Assigning Permissions to Users and Groups

In Oxide, permissions<sup><a href="/glossary#permissions">[10]</a></sup> allow you to control which commands and functions a user or group can use. This includes Oxide commands, game server commands, and commands provided by installed plugins.

- To check a user's permissions<sup><a href="/glossary#permissions">[10]</a></sup>: `oxide.show user [username]`
  - Example: `oxide.show user Wulf`
- To check a group's permissions<sup><a href="/glossary#permissions">[10]</a></sup>: `oxide.show group [groupname]`
  - Example: `oxide.show group admin`
- To show which user or group has a specific permission: `oxide.show perm [permission]`
  - Example: `oxide.show perm epicstuff.use`
- To show all registered permissions<sup><a href="/glossary#permissions">[10]</a></sup>: `oxide.show perms`
- To assign a permission:
  - To a user: `oxide.grant user [username] [permission]`
    - Example: `oxide.grant user Wulf epicstuff.use`
  - To a group: `oxide.grant group [groupname] [permission]`
    - Example: `oxide.grant group admin epicstuff.use`
- To revoke a permission:
  - From a user: `oxide.revoke user [username] [permission]`
    - Example: `oxide.revoke user Wulf epicstuff.use`
  - From a group: `oxide.revoke group [groupname] [permission]`
    - Example: `oxide.revoke group admin epicstuff.use`

### Using Wildcards

You can use the wildcard (\*) to grant multiple permissions<sup><a href="/glossary#permissions">[10]</a></sup> at one time:

- To give a group all permissions<sup><a href="/glossary#permissions">[10]</a></sup>: `oxide.grant group [groupname] *`
  - Example: `oxide.grant group admin *`
- To give a user all permissions<sup><a href="/glossary#permissions">[10]</a></sup> for a specific plugin or system: `oxide.grant user [username] [prefix].*`
  - Example: `oxide.grant user Wulf oxide.*`

## Useful Permissions Plugins

While the base Oxide permissions<sup><a href="/glossary#permissions">[10]</a></sup> system is comprehensive, managing permissions<sup><a href="/glossary#permissions">[10]</a></sup> through commands may not always be the most convenient way, especially for larger servers. A plugin that can provide a graphical interface for managing permissions<sup><a href="/glossary#permissions">[10]</a></sup> could prove helpful in this regard:

:::tip
**Permissions Manager**: This plugin provides a graphical interface for managing Oxide permissions<sup><a href="/glossary#permissions">[10]</a></sup>. It makes it easier to add, remove, and view permissions<sup><a href="/glossary#permissions">[10]</a></sup>. This can greatly simplify permissions<sup><a href="/glossary#permissions">[10]</a></sup> management, especially on servers with many players and groups<sup><a href="/glossary#groups">[11]</a></sup>.
:::

## Troubleshooting Permissions

If you encounter problems while managing permissions<sup><a href="/glossary#permissions">[10]</a></sup>, here are some general steps you can follow:

- **Check console output**: Oxide will often output useful information to the server console. This can include errors with permissions<sup><a href="/glossary#permissions">[10]</a></sup> and groups<sup><a href="/glossary#groups">[11]</a></sup>.
- **Check the user's permissions**: Use the command `oxide.show user [username]` to view all the permissions<sup><a href="/glossary#permissions">[10]</a></sup> that a user has. This can help identify if they are missing a necessary permission or have one that they should not.
- **Verify parent group relationships**: If you're using group inheritance, make sure that the parent-child relationships are set up correctly and don't contain any circular references.
- **Review data storage**: Oxide stores permissions<sup><a href="/glossary#permissions">[10]</a></sup> data using ProtoBuf serialization in the `oxide.users` and `oxide.groups` files. If you suspect data corruption, you might need to manually edit or delete these files (after making backups).

## Advanced Features

### User Data Validation

Oxide includes a validation system for user IDs to ensure that invalid or obsolete entries don't accumulate in the permissions<sup><a href="/glossary#permissions">[10]</a></sup> database. Server administrators can customize validation rules through extensions<sup><a href="/glossary#extensions">[2]</a></sup>, and the system will automatically clean up invalid entries.

### Export and Import

You can export your permissions<sup><a href="/glossary#permissions">[10]</a></sup> to JSON<sup><a href="/glossary#json">[7]</a></sup> format using the `oxide.export` command, which creates separate files for groups<sup><a href="/glossary#groups">[11]</a></sup> and users. This is useful for backup purposes or transferring permission settings between servers.

### Command Shortcuts

The same commands are also available with the "o." prefix (ex. "o.grant").

## Conclusion

Understanding and effectively managing Oxide permissions<sup><a href="/glossary#permissions">[10]</a></sup> is crucial for the smooth operation of your game server. With the knowledge you've gained from this guide, you should be equipped to handle any permissions<sup><a href="/glossary#permissions">[10]</a></sup> setup your server needs.

Permissions<sup><a href="/glossary#permissions">[10]</a></sup> give you a fantastic way to manage staff without worrying about them abusing powers from the game's admin functionality (such as flight, noclip, super speed, etc.) so they can still enjoy the game but also help monitor your server at the same time.

Remember to stay in the loop with new plugins, as they may introduce new permissions<sup><a href="/glossary#permissions">[10]</a></sup>. Staying on top of this will help ensure your users have the best possible experience on your server.
