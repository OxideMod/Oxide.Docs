---
title: Permissions
after: attributes
---

# Permissions

Oxide offers a substantial API to control user access with permissions<sup><a href="/glossary#permissions">[6]</a></sup> and groups<sup><a href="/glossary#groups">[9]</a></sup>
Basic usage

For a primer on how to use permissions<sup><a href="/glossary#permissions">[6]</a></sup> as a server owner, please consult the Using the Oxide permissions<sup><a href="/glossary#permissions">[6]</a></sup> system tutorial.

Most plugins<sup><a href="/glossary#plugins">[1]</a></sup> can benefit from some permissions<sup><a href="/glossary#permissions">[6]</a></sup>. Below is a basic example of how to register a permission<sup><a href="/glossary#permissions">[6]</a></sup> and check if a player has that permission<sup><a href="/glossary#permissions">[6]</a></sup> assigned to them.

```csharp
using Oxide.Core.Libraries.Covalence;
namespace Oxide.Plugins;
[Info("Epic Stuff", "Unknown Author", "0.1.0")]
[Description("Makes epic stuff happen")]
class EpicStuff : CovalencePlugin
{
    private void Init()
    {
        permission.RegisterPermission("epicstuff.use", this);
    }

    private void OnUserConnected(IPlayer player)
    {
        if (player.HasPermission("epicstuff.use"))
        {
            // Player has permission, do special stuff for them
        }
    }
}
```

# API

## Groups

Get all groups<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
string[] groups = permission.GetGroups();
```

Check if group<sup><a href="/glossary#groups">[9]</a></sup> exists

```csharp
bool GroupExists = permission.GroupExists("GroupName");
```

Create a group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
bool GroupCreated = permission.CreateGroup("GroupName", "Group Title", 0);
```

Remove a group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
bool GroupRemoved = permission.RemoveGroup("GroupName");
```

Check if group<sup><a href="/glossary#groups">[9]</a></sup> has a permission<sup><a href="/glossary#permissions">[6]</a></sup>

```csharp
bool GroupHasPermission = permission.GroupHasPermission("GroupName", "epicstuff.use");
```

Grant permission<sup><a href="/glossary#permissions">[6]</a></sup> to a group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
permission.GrantGroupPermission("GroupName", "epicstuff.use", this);
```

Revoke permission<sup><a href="/glossary#permissions">[6]</a></sup> from a group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
permission.RevokeGroupPermission("GroupName", "epicstuff.use");
```

Get the rank for a group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
int GroupRank = permission.GetGroupRank("GroupName");
```

Get the title for a group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
string GroupTitle = permission.GetGroupTitle("GroupName");
```

Get parent group<sup><a href="/glossary#groups">[9]</a></sup> for a group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
string GroupParent = permission.GetGroupParent("GroupName");
```

Get permissions<sup><a href="/glossary#permissions">[6]</a></sup> for a group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
string[] permissions = permission.GetGroupPermissions("GroupName", false);
```

Migrate group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
permission.MigrateGroup("OldGroupName", "NewGroupName");
```

## Users

Get permissions<sup><a href="/glossary#permissions">[6]</a></sup> granted to player

```csharp
string[] UserPermissions = permission.GetUserPermissions("playerID");
```

Check if player has a permission<sup><a href="/glossary#permissions">[6]</a></sup>

```csharp
bool UserHasPermission = permission.UserHasPermission("playerID", "epicstuff.use");
```

Add player to a group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
permission.AddUserGroup("playerID", "GroupName");
```

Remove player from a group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
permission.RemoveUserGroup("playerID", "GroupName");
```

Check if player is in a group<sup><a href="/glossary#groups">[9]</a></sup>

```csharp
bool UserHasGroup = permission.UserHasGroup("playerID", "GroupName");
```

Grant permission<sup><a href="/glossary#permissions">[6]</a></sup> to a player

```csharp
permission.GrantUserPermission("playerID", "epicstuff.use", this);
```

Revoke permission<sup><a href="/glossary#permissions">[6]</a></sup> from a player

```csharp
permission.RevokeUserPermission("playerID", "epicstuff.use");
```

## Server

Get all registered permissions<sup><a href="/glossary#permissions">[6]</a></sup>

```csharp
string[] permissions = permission.GetPermissions();
```

Check if a permission<sup><a href="/glossary#permissions">[6]</a></sup> exists

```csharp
bool PermissionExists = permission.PermissionExists("epicstuff.use", this);
```

Register a permission<sup><a href="/glossary#permissions">[6]</a></sup>

```csharp
permission.RegisterPermission("epicstuff.use", this);
```
