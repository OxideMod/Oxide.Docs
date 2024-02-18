---
title: Permission
after: index
---
# Permission Commands

## oxide.grant

**Usage:** `oxide.grant <group|user> <name|id> <permission>`  
**Aliases:** `o.grant`, `perm.grant`

Grants a user the specified permission.

### Example `oxide.grant user 76561199558781314 myawesomeplugin.use`

```
Player 'OxideMod (76561199558781314)' granted permission 'myawesomeplugin.use'
``` 

## oxide.group

**Usage:** `oxide.group <add|set> <name> [title] [rank]`  
**Aliases:** `o.group`, `perm.group`

Adds or removes a permission group.

### Example `oxide.group add myfirstgroup`

```
Group 'myfirstgroup' created
```

## oxide.revoke

**Usage:** `oxide.revoke <group|user> <name|id> <permission>`  
**Aliases:** `o.revoke`, `perm.revoke`

Revokes a user's or group's permission.

### Example `oxide.revoke user 76561199558781314 myawesomeplugin.use`

```
Player 'OxideMod (76561199558781314)' revoked permission 'myawesomeplugin.use'
```

## oxide.show

**Usage:** `oxide.show <groups|perms>`  
**Aliases:** `o.show`, `perm.show`

Shows a list of all groups or permissions.

### Example `oxide.show groups`

```
Groups:
default, admin, myfirstgroup
```

## oxide.usergroup

**Usage:** `oxide.usergroup <add|remove> <username> <groupname>`  
**Aliases:** `o.usergroup`, `perm.usergroup`

Add or remove a user from a group.

### Example `oxide.usergroup add 76561199558781314 myfirstgroup`

```
Player '76561199558781314' added to group: myfirstgroup
```