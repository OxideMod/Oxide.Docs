---
title: Permissions
after: index
---

<script setup>
    import GithubLink from '../../../components/GithubLink.vue'
</script>

<GithubLink 
    link="https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs" 
    topPosition="10px" 
    leftPosition="300px" 
/>

# Permissions Library

## `AddUserGroup`

The `AddUserGroup` method will assign `playerId` the specified `groupName`

::: details Github Location 
[`AddUserGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L683)
:::

## `CreateGroup`

The `CreateGroup` method will create a group with the specified `groupName` and assign it the `GroupData` class which holds `groupTitle` and `groupRank`

::: details Github Location 
[`CreateGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1085)
:::

## `Export`

The `Export` method will save `GroupData` and `UserData` to `oxide/data`

**GroupData** contains `rank`, `title` and `perms`

**UserData** contains `groups`, `nickname` and `perms`

::: details Github Location 
[`Export`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L263)
:::

## `GetGroupData`

The `GetGroupData` method returns the `GroupData` of `groupName`

::: details Github Location 
[`GetGroupData`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L770)
:::

## `GetGroupParent`

The `GetGroupParent` method will return the `Parent Group` of `groupName`

::: details Github Location 
[`GetGroupParent`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1213)
:::

## `GetGroupPermissions`

The `GetGroupPermissions` method will return the `permissions` assigned to `groupName`

::: details Github Location 
[`GetGroupPermissions`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L595)
:::

## `GetGroupRank`

The `GetGroupRank` method will return the rank of `groupName`

::: details Github Location 
[`GetGroupRank`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L832)
:::

## `GetGroups`

The `GetGroups` method will return every created group

::: details Github Location 
[`GetGroups`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L786)
:::

## `GetGroupTitle`

The `GetGroupTitle` method will return the title of `groupName`

::: details Github Location 
[`GetGroupTitle`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L809)
:::

## `GetPermissionGroups`

The `GetPermissionGroups` method will return every group which is assigned `permission`

::: details Github Location 
[`GetPermissionGroups`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L656)
:::

## `GetPermissions`

The `GetPermissions` method will return every registered permission

::: details Github Location 
[`GetPermissions`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L622)
:::

## `GetPermissionUsers`

The `GetPermissionUsers` method will return every user who has been assigned `permission`

::: details Github Location 
[`GetPermissionUsers`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L630)
:::

## `GetUserData`

The `GetUserData` method will return the UserData of `playerId`

::: details Github Location 
[`GetUserData`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L459)
:::

## `GetUserGroups`

The `GetUserGroups` method will return every group `playerId` is assigned to.

::: details Github Location 
[`GetUserGroups`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L567)
:::

## `GetUserPermissions`

The `GetUserPermissions` method will return the permissions assigned to `playerId`

::: details Github Location 
[`GetUserPermissions`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L575)
:::

## `GetUsersInGroup`

The `GetUsersInGroup` method will return every user assigned to `groupName`

::: details Github Location 
[`GetUsersInGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L794)
:::

## `GrantGroupPermission`

The `GrantGroupPermission` method will assign `permission` to the specified `groupName`

::: details Github Location 
[`GrantGroupPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L969)
:::

## `GrantUserPermission`

The `GrantUserPermission` method will assign the specified `permission` to the specified `playerId`

::: details Github Location 
[`GrantUserPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L860)
:::

## `GroupExists`

The `GroupExists` method will return `true` if the specified `groupName` exists

::: details Github Location 
[`GroupExists`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L760)
:::

## `GroupHasPermission`

The `GroupHasPermission` method will return `true` if the specified `groupName` has been assigned `permission`

::: details Github Location 
[`GroupHasPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L512)
:::

## `GroupsHavePermission`

The `GroupsHavePermission` method will return `true` if any of the specified `groupNames` have been assigned the specified `permission`

::: details Github Location 
[`GroupsHavePermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L503)
:::

## `MigrateGroup`

The `MigrateGroup` method will copy everything from `oldGroupName` and transfer it to `newGroupName`

::: details Github Location 
[`MigrateGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L320)
:::

## `PermissionExists`

The `PermissionExists` method will return `true` if `permission` has been registered

::: details Github Location 
[`PermissionExists`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L383)
:::

## `RegisterPermission`

The `RegisterPermission` method will register `permission` for use in plugins/assignability to players *and/or* groups

::: details Github Location 
[`RegisterPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L347)
:::

## `RemoveGroup`

The `RemoveGroup` method will remove the `groupName` from the `groupsData`

::: details Github Location 
[`RemoveGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1109)
:::

## `RemoveUserGroup`

The `RemoveUserGroup` method will remove the `groupName` assigned to `playerId`

::: details Github Location 
[`RemoveUserGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L708)
:::

## `RevokeGroupPermission`

The `RevokeGroupPermission` method will revoke the `permission` assigned to `groupName`

::: details Github Location 
[`RevokeGroupPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1030)
:::

## `SetGroupParent`

The `SetGroupParent` method will set the `groupParent` of `groupName` as `parentGroupName`

::: details Github Location 
[`SetGroupParent`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1228)
:::

## `SetGroupRank`

The `SetGroupRank` method will set the `groupRank` of `groupName`

::: details Github Location 
[`SetGroupRank`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1182)
:::

## `SetGroupTitle`

The `SetGroupTitle` method will set the `groupTitle` of `groupName`

::: details Github Location 
[`SetGroupTitle`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1150)
:::

## `UpdateNickname`

The `UpdateNickname` method will update the `nickname` of `playerId` with `playerName`

::: details Github Location 
[`UpdateNickname`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L476)
:::

## `UserExists`

The `UserExists` method will return `true` if `playerId` has any `UserData`

::: details Github Location 
[`UserExists`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L452)
:::

## `UserHasAnyGroup`

The `UserHasAnyGroup` method will return `true` if `playerId` has been assigned one or more group(s)

::: details Github Location 
[`UserHasAnyGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L494)
:::

## `UserHasGroup`

The `UserHasGroup` method will return `true` if `groupName` has been assigned to `playerId`

::: details Github Location 
[`UserHasGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L744)
:::

## `UserHasPermission`

The `UserHasPermission` method will return `true` if `permission` has been assigned to `playerId`

::: details Github Location 
[`UserHasPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L535)
:::