---
title: Permissions
after: index
---

# Permissions

## `AddUserGroup`

The `AddUserGroup` method will assign `playerId` the specified `groupName`

::: details Github Location 
[`AddUserGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L683)
:::


::: details Source Code
```csharp
public void AddUserGroup(string playerId, string groupName)
{
    if (!this.GroupExists(groupName))
    {
        return;
    }
    if (!this.GetUserData(playerId).Groups.Add(groupName))
    {
        return;
    }
    Interface.Call("OnUserGroupAdded", new object[] { playerId, groupName });
}
```
:::

## `CreateGroup`

The `CreateGroup` method will create a group with the specified `groupName` and assign it the `GroupData` class which holds `groupTitle` and `groupRank`

::: details Github Location 
[`CreateGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1085)
:::


::: details Source Code
```csharp
public bool CreateGroup(string groupName, string groupTitle, int groupRank)
{
    if (this.GroupExists(groupName) || string.IsNullOrEmpty(groupName))
    {
        return false;
    }
    GroupData groupDatum = new GroupData()
    {
        Title = groupTitle,
        Rank = groupRank
    };
    this.groupsData.Add(groupName, groupDatum);
    Interface.CallHook("OnGroupCreated", groupName, groupTitle, groupRank);
    return true;
}
```
:::

## `Export`

The `Export` method will save `GroupData` and `UserData` to `oxide/data`

**GroupData** contains `rank`, `title` and `perms`

**UserData** contains `groups`, `nickname` and `perms`

::: details Github Location 
[`Export`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L263)
:::

::: details Source Code
```csharp
public void Export(string prefix = "auth")
{
    if (this.IsLoaded)
    {
        Interface.Oxide.DataFileSystem.WriteObject<Dictionary<string, GroupData>>(string.Concat(prefix, ".groups"), this.groupsData, false);
        Interface.Oxide.DataFileSystem.WriteObject<Dictionary<string, UserData>>(string.Concat(prefix, ".users"), this.usersData, false);
    }
}
```
:::

## `GetGroupData`

The `GetGroupData` method returns the `GroupData` of `groupName`

::: details Github Location 
[`GetGroupData`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L770)
:::

::: details Source Code
```csharp
public GroupData GetGroupData(string groupName)
{
    GroupData groupDatum;
    if (!this.groupsData.TryGetValue(groupName, out groupDatum))
    {
        return null;
    }
    return groupDatum;
}
```
:::

## `GetGroupParent`

The `GetGroupParent` method will return the `Parent Group` of `groupName`

::: details Github Location 
[`GetGroupParent`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1213)
:::

::: details Source Code
```csharp
public string GetGroupParent(string groupName)
{
    GroupData groupDatum;
    if (!this.GroupExists(groupName))
    {
        return string.Empty;
    }
    if (!this.groupsData.TryGetValue(groupName, out groupDatum))
    {
        return string.Empty;
    }
    return groupDatum.ParentGroup;
}
```
:::

## `GetGroupPermissions`

The `GetGroupPermissions` method will return the `permissions` assigned to `groupName`

::: details Github Location 
[`GetGroupPermissions`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L595)
:::

::: details Source Code
```csharp
public string[] GetGroupPermissions(string groupName, bool parents = false)
{
    GroupData groupDatum;
    if (!this.GroupExists(groupName))
    {
        return new string[0];
    }
    if (!this.groupsData.TryGetValue(groupName, out groupDatum))
    {
        return new string[0];
    }
        HashSet<string> strs = new HashSet<string>(groupDatum.Perms);
    if (parents)
    {
        strs.UnionWith(this.GetGroupPermissions(groupDatum.ParentGroup, false));
    }
    return strs.ToArray<string>();
}
```
:::

## `GetGroupRank`

The `GetGroupRank` method will return the rank of `groupName`

::: details Github Location 
[`GetGroupRank`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L832)
:::

::: details Source Code
```csharp
public int GetGroupRank(string groupName)
{
    GroupData groupDatum;
    if (!this.GroupExists(groupName))
    {
        return 0;
    }
    if (!this.groupsData.TryGetValue(groupName, out groupDatum))
    {
        return 0;
    }
    return groupDatum.Rank;
}

```
:::

## `GetGroups`

The `GetGroups` method will return every created group

::: details Github Location 
[`GetGroups`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L786)
:::

::: details Source Code
```csharp
public string[] GetGroups()
{
    return this.groupsData.Keys.ToArray<string>();
}
```
:::

## `GetGroupTitle`

The `GetGroupTitle` method will return the title of `groupName`

::: details Github Location 
[`GetGroupTitle`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L809)
:::

::: details Source Code
```csharp
public string GetGroupTitle(string groupName)
{
    GroupData groupDatum;
    if (!this.GroupExists(groupName))
    {
        return string.Empty;
    }
    if (!this.groupsData.TryGetValue(groupName, out groupDatum))
    {
        return string.Empty;
    }
    return groupDatum.Title;
}
```
:::

## `GetPermissionGroups`

The `GetPermissionGroups` method will return every group which is assigned `permission`

::: details Github Location 
[`GetPermissionGroups`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L656)
:::

::: details Source Code
```csharp
public string[] GetPermissionGroups(string permission)
{
    if (string.IsNullOrEmpty(permission))
    {
        return new string[0];
    }
    HashSet<string> strs = new HashSet<string>();
    foreach (KeyValuePair<string, GroupData> groupsDatum in this.groupsData)
    {
        if (!groupsDatum.Value.Perms.Contains<string>(permission, StringComparer.OrdinalIgnoreCase))
        {
            continue;
        }
        strs.Add(groupsDatum.Key);
    }
    return strs.ToArray<string>();
}
```
:::

## `GetPermissions`

The `GetPermissions` method will return every registered permission

::: details Github Location 
[`GetPermissions`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L622)
:::

::: details Source Code
```csharp
public string[] GetPermissions()
{
    return (new HashSet<string>(this.registeredPermissions.Values.SelectMany<HashSet<string>, string>((HashSet<string> v) => v))).ToArray<string>();
}

```
:::

## `GetPermissionUsers`

The `GetPermissionUsers` method will return every user who has been assigned `permission`

::: details Github Location 
[`GetPermissionUsers`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L630)
:::


::: details Source Code
```csharp
public string[] GetPermissionUsers(string permission)
{
    if (string.IsNullOrEmpty(permission))
    {
        return new string[0];
    }
    HashSet<string> strs = new HashSet<string>();
    foreach (KeyValuePair<string, UserData> usersDatum in this.usersData)
    {
        if (!usersDatum.Value.Perms.Contains<string>(permission, StringComparer.OrdinalIgnoreCase))
        {
            continue;
        }
        strs.Add(string.Concat(usersDatum.Key, "(", usersDatum.Value.LastSeenNickname, ")"));
    }
    return strs.ToArray<string>();
}
```
:::

## `GetUserData`

The `GetUserData` method will return the UserData of `playerId`

::: details Github Location 
[`GetUserData`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L459)
:::

::: details Source Code
```csharp
public UserData GetUserData(string playerId)
{
    UserData userDatum;
    if (!this.usersData.TryGetValue(playerId, out userDatum))
    {
        Dictionary<string, UserData> strs = this.usersData;
        UserData userDatum1 = new UserData();
        userDatum = userDatum1;
        strs.Add(playerId, userDatum1);
    }
    return userDatum;
}
```
:::

## `GetUserGroups`

The `GetUserGroups` method will return every group `playerId` is assigned to.

::: details Github Location 
[`GetUserGroups`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L567)
:::

::: details Source Code
```csharp
public string[] GetUserGroups(string playerId)
{
    return this.GetUserData(playerId).Groups.ToArray<string>();
}
```
:::

## `GetUserPermissions`

The `GetUserPermissions` method will return the permissions assigned to `playerId`

::: details Github Location 
[`GetUserPermissions`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L575)
:::

::: details Source Code
```csharp
public string[] GetUserPermissions(string playerId)
{
    UserData userData = this.GetUserData(playerId);
    HashSet<string> strs = new HashSet<string>(userData.Perms, StringComparer.OrdinalIgnoreCase);
    foreach (string group in userData.Groups)
    {
        strs.UnionWith(this.GetGroupPermissions(group, false));
    }
    return strs.ToArray<string>();
}
```
:::

## `GetUsersInGroup`

The `GetUsersInGroup` method will return every user assigned to `groupName`

::: details Github Location 
[`GetUsersInGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L794)
:::

::: details Source Code
```csharp
public string[] GetUsersInGroup(string groupName)
{
    if (!this.GroupExists(groupName))
    {
        return new string[0];
    }
    return (from u in this.usersData where u.Value.Groups.Contains<string>(groupName, StringComparer.OrdinalIgnoreCase) select string.Concat(u.Key, " (", u.Value.LastSeenNickname, ")")).ToArray<string>();
}
```
:::

## `GrantGroupPermission`

The `GrantGroupPermission` method will assign `permission` to the specified `groupName`

::: details Github Location 
[`GrantGroupPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L969)
:::

::: details Source Code
```csharp
public void GrantGroupPermission(string groupName, string permission, Plugin owner)
{
    HashSet<string> strs;
    GroupData groupDatum;
    if (!this.PermissionExists(permission, owner) || !this.GroupExists(groupName))
    {
        return;
    }
    if (!this.groupsData.TryGetValue(groupName, out groupDatum))
    {
        return;
    }
    if (!permission.EndsWith("*"))
    {
        if (!groupDatum.Perms.Add(permission))
        {
            return;
        }
        Interface.Call("OnGroupPermissionGranted", new object[] { groupName, permission });
        return;
    }
    if (owner == null)
    {
        strs = new HashSet<string>(this.registeredPermissions.Values.SelectMany<HashSet<string>, string>((HashSet<string> v) => v));
    }
    else if (!this.registeredPermissions.TryGetValue(owner, out strs))
    {
        return;
    }
    if (permission.Equals("*"))
    {
        strs.Aggregate<string, bool>(false, (bool c, string s) => c | groupDatum.Perms.Add(s));
        return;
    }
    (from p in strs where p.StartsWith(permission.TrimEnd(new char[] { '*' }), StringComparison.OrdinalIgnoreCase) select p).Aggregate<string, bool>(false, (bool c, string s) => c | groupDatum.Perms.Add(s));
}
```
:::

## `GrantUserPermission`

The `GrantUserPermission` method will assign the specified `permission` to the specified `playerId`

::: details Github Location 
[`GrantUserPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L860)
:::

::: details Source Code
```csharp
public void GrantUserPermission(string playerId, string permission, Plugin owner)
{
    HashSet<string> strs;
    if (!this.PermissionExists(permission, owner))
    {
        return;
    }
    UserData userData = this.GetUserData(playerId);
    if (!permission.EndsWith("*"))
    {
        if (!userData.Perms.Add(permission))
        {
            return;
        }
        Interface.Call("OnUserPermissionGranted", new object[] { playerId, permission });
        return;
    }
    if (owner == null)
    {
        strs = new HashSet<string>(this.registeredPermissions.Values.SelectMany<HashSet<string>, string>((HashSet<string> v) => v));
    }
    else if (!this.registeredPermissions.TryGetValue(owner, out strs))
    {
        return;
    }
    if (permission.Equals("*"))
    {
        strs.Aggregate<string, bool>(false, (bool c, string s) => c | userData.Perms.Add(s));
        return;
    }
    (from p in strs where p.StartsWith(permission.TrimEnd(new char[] { '*' }), StringComparison.OrdinalIgnoreCase) select p).Aggregate<string, bool>(false, (bool c, string s) => c | userData.Perms.Add(s));
}
```
:::

## `GroupExists`

The `GroupExists` method will return `true` if the specified `groupName` exists

::: details Github Location 
[`GroupExists`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L760)
:::

::: details Source Code
```csharp
public bool GroupExists(string groupName)
{
    if (string.IsNullOrEmpty(groupName))
    {
        return false;
    }
    if (groupName.Equals("*"))
    {
        return true;
    }
    return this.groupsData.ContainsKey(groupName);
}
```
:::

## `GroupHasPermission`

The `GroupHasPermission` method will return `true` if the specified `groupName` has been assigned `permission`

::: details Github Location 
[`GroupHasPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L512)
:::

::: details Source Code
```csharp
public bool GroupHasPermission(string groupName, string permission)
{
    GroupData groupDatum;
    if (!this.GroupExists(groupName) || string.IsNullOrEmpty(permission))
    {
        return false;
    }
    if (!this.groupsData.TryGetValue(groupName, out groupDatum))
    {
        return false;
    }
    if (groupDatum.Perms.Contains<string>(permission, StringComparer.OrdinalIgnoreCase))
    {
        return true;
    }
    return this.GroupHasPermission(groupDatum.ParentGroup, permission);
}
```
:::

## `GroupsHavePermission`

The `GroupsHavePermission` method will return `true` if any of the specified `groupNames` have been assigned the specified `permission`

::: details Github Location 
[`GroupsHavePermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L503)
:::

::: details Source Code
```csharp
public bool GroupsHavePermission(HashSet<string> groupNames, string permission)
{
    return groupNames.Any<string>((string g) => this.GroupHasPermission(g, permission));
}
```
:::

## `MigrateGroup`

The `MigrateGroup` method will copy everything from `oldGroupName` and transfer it to `newGroupName`

::: details Github Location 
[`MigrateGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L320)
:::

::: details Source Code
```csharp
public void MigrateGroup(string oldGroupName, string newGroupName)
{
    if (this.IsLoaded && this.GroupExists(oldGroupName))
    {
        string fileDataPath = ProtoStorage.GetFileDataPath("oxide.groups.data");
        File.Copy(fileDataPath, string.Concat(fileDataPath, ".old"), true);
        string[] groupPermissions = this.GetGroupPermissions(oldGroupName, false);
        for (int i = 0; i < (int)groupPermissions.Length; i++)
        {
            this.GrantGroupPermission(newGroupName, groupPermissions[i], null);
        }
        if (this.GetUsersInGroup(oldGroupName).Length == 0)
        {
            this.RemoveGroup(oldGroupName);
        }
    }
}
```
:::

## `PermissionExists`

The `PermissionExists` method will return `true` if `permission` has been registered

::: details Github Location 
[`PermissionExists`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L383)
:::

::: details Source Code
```csharp
public bool PermissionExists(string permission, Plugin owner = null)
{
    HashSet<string> strs;
    if (string.IsNullOrEmpty(permission))
    {
        return false;
    }
    if (owner != null)
    {
        if (!this.registeredPermissions.TryGetValue(owner, out strs))
        {
            return false;
        }
        if (strs.Count > 0)
        {
            if (permission.Equals("*"))
            {
                return true;
            }
            if (permission.EndsWith("*"))
            {
                return strs.Any<string>((string p) => p.StartsWith(permission.TrimEnd(new char[] { '*' }), StringComparison.OrdinalIgnoreCase));
            }
        }
        return strs.Contains<string>(permission, StringComparer.OrdinalIgnoreCase);
    }
    if (this.registeredPermissions.Count > 0)
    {
        if (permission.Equals("*"))
        {
            return true;
        }
        if (permission.EndsWith("*"))
        {
            return this.registeredPermissions.Values.SelectMany<HashSet<string>, string>((HashSet<string> v) => v).Any<string>((string p) => p.StartsWith(permission.TrimEnd(new char[] { '*' }), StringComparison.OrdinalIgnoreCase));
        }
    }
    return this.registeredPermissions.Values.Any<HashSet<string>>((HashSet<string> v) => v.Contains<string>(permission, StringComparer.OrdinalIgnoreCase));
}
```
:::

## `RegisterPermission`

The `RegisterPermission` method will register `permission` for use in plugins/assignability to players *and/or* groups

::: details Github Location 
[`RegisterPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L347)
:::


::: details Source Code
```csharp
public void RegisterPermission(string permission, Plugin owner)
{
    HashSet<string> strs;
    if (string.IsNullOrEmpty(permission))
    {
        return;
    }
    if (this.PermissionExists(permission, null))
    {
        Interface.Oxide.LogWarning("Duplicate permission registered '{0}' (by plugin '{1}')", new object[] { permission, owner.Title });
        return;
    }
    if (!this.registeredPermissions.TryGetValue(owner, out strs))
    {
        strs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        this.registeredPermissions.Add(owner, strs);
        owner.OnRemovedFromManager.Add(new Action<Plugin, PluginManager>(this.owner_OnRemovedFromManager));
    }
    strs.Add(permission);
    Interface.CallHook("OnPermissionRegistered", permission, owner);
    if (!permission.StartsWith(string.Concat(owner.Name, "."), StringComparison.OrdinalIgnoreCase) && !owner.IsCorePlugin)
    {
        Interface.Oxide.LogWarning("Missing plugin name prefix '{0}' for permission '{1}' (by plugin '{2}')", new object[] { owner.Name.ToLower(), permission, owner.Title });
    }
}
```
:::

## `RemoveGroup`

The `RemoveGroup` method will remove the `groupName` from the `groupsData`

::: details Github Location 
[`RemoveGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1109)
:::

::: details Source Code
```csharp
public bool RemoveGroup(string groupName)
{
    Func<GroupData, bool> func = null;
    if (!this.GroupExists(groupName))
    {
        return false;
    }
    bool flag = this.groupsData.Remove(groupName);
    if (flag)
    {
        Dictionary < !0, !1 >.ValueCollection values = this.groupsData.Values;
        Func<GroupData, bool> func1 = func;
        if (func1 == null)
        {
            Func<GroupData, bool> parentGroup = (GroupData g) => g.ParentGroup == groupName;
            Func<GroupData, bool> func2 = parentGroup;
            func = parentGroup;
            func1 = func2;
        }
        foreach (GroupData empty in values.Where<GroupData>(func1))
        {
            empty.ParentGroup = string.Empty;
        }
    }
    if (this.usersData.Values.Aggregate<UserData, bool>(false, (bool current, UserData userData) => current | userData.Groups.Remove(groupName)))
    {
        this.SaveUsers();
    }
    if (flag)
    {
        Interface.CallHook("OnGroupDeleted", groupName);
    }
    return true;
}
```
:::

## `RemoveUserGroup`

The `RemoveUserGroup` method will remove the `groupName` assigned to `playerId`

::: details Github Location 
[`RemoveUserGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L708)
:::


::: details Source Code
```csharp
public void RemoveUserGroup(string playerId, string groupName)
{
    if (!this.GroupExists(groupName))
    {
        return;
    }
    UserData userData = this.GetUserData(playerId);
    if (groupName.Equals("*"))
    {
        if (userData.Groups.Count <= 0)
        {
            return;
        }
        userData.Groups.Clear();
        return;
    }
    if (!userData.Groups.Remove(groupName))
    {
        return;
    }
    Interface.Call("OnUserGroupRemoved", new object[] { playerId, groupName });
}
```
:::

## `RevokeGroupPermission`

The `RevokeGroupPermission` method will revoke the `permission` assigned to `groupName`

::: details Github Location 
[`RevokeGroupPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1030)
:::

::: details Source Code
```csharp
public void RevokeGroupPermission(string groupName, string permission)
{
    GroupData groupDatum;
    if (!this.GroupExists(groupName) || string.IsNullOrEmpty(permission))
    {
        return;
    }
    if (!this.groupsData.TryGetValue(groupName, out groupDatum))
    {
        return;
    }
    if (!permission.EndsWith("*"))
    {
        if (!groupDatum.Perms.Remove(permission))
        {
            return;
        }
        Interface.Call("OnGroupPermissionRevoked", new object[] { groupName, permission });
        return;
    }
    if (permission.Equals("*"))
    {
        if (groupDatum.Perms.Count <= 0)
        {
            return;
        }
        groupDatum.Perms.Clear();
        return;
    }
    groupDatum.Perms.RemoveWhere((string p) => p.StartsWith(permission.TrimEnd(new char[] { '*' }), StringComparison.OrdinalIgnoreCase));
}
```
:::

## `SetGroupParent`

The `SetGroupParent` method will set the `groupParent` of `groupName` as `parentGroupName`

::: details Github Location 
[`SetGroupParent`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1228)
:::

::: details Source Code
```csharp
public bool SetGroupParent(string groupName, string parentGroupName)
{
    GroupData groupDatum;
    if (!this.GroupExists(groupName))
    {
        return false;
    }
    if (!this.groupsData.TryGetValue(groupName, out groupDatum))
    {
        return false;
    }
    if (string.IsNullOrEmpty(parentGroupName))
    {
        groupDatum.ParentGroup = null;
        return true;
    }
    if (!this.GroupExists(parentGroupName) || groupName.Equals(parentGroupName))
    {
        return false;
    }
    if (!string.IsNullOrEmpty(groupDatum.ParentGroup) && groupDatum.ParentGroup.Equals(parentGroupName))
    {
        return true;
    }
    if (this.HasCircularParent(groupName, parentGroupName))
    {
        return false;
    }
    groupDatum.ParentGroup = parentGroupName;
    Interface.CallHook("OnGroupParentSet", groupName, parentGroupName);
    return true;
}
```
:::

## `SetGroupRank`

The `SetGroupRank` method will set the `groupRank` of `groupName`

::: details Github Location 
[`SetGroupRank`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1182)
:::

::: details Source Code
```csharp
public bool SetGroupRank(string groupName, int groupRank)
{
    GroupData groupDatum;
    if (!this.GroupExists(groupName))
    {
        return false;
    }
    if (!this.groupsData.TryGetValue(groupName, out groupDatum))
    {
        return false;
    }
    if (groupDatum.Rank == groupRank)
    {
        return true;
    }
    groupDatum.Rank = groupRank;
    Interface.CallHook("OnGroupRankSet", groupName, groupRank);
    return true;
}
```
:::

## `SetGroupTitle`

The `SetGroupTitle` method will set the `groupTitle` of `groupName`

::: details Github Location 
[`SetGroupTitle`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L1150)
:::

::: details Source Code
```csharp
public bool SetGroupTitle(string groupName, string groupTitle)
{
    GroupData groupDatum;
    if (!this.GroupExists(groupName))
    {
        return false;
    }
    if (!this.groupsData.TryGetValue(groupName, out groupDatum))
    {
        return false;
    }
    if (groupDatum.Title == groupTitle)
    {
        return true;
    }
    groupDatum.Title = groupTitle;
    Interface.CallHook("OnGroupTitleSet", groupName, groupTitle);
    return true;
}
```
:::

## `UpdateNickname`

The `UpdateNickname` method will update the `nickname` of `playerId` with `playerName`

::: details Github Location 
[`UpdateNickname`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L476)
:::

::: details Source Code
```csharp
public void UpdateNickname(string playerId, string playerName)
{
    if (this.UserExists(playerId))
    {
        UserData userData = this.GetUserData(playerId);
        string lastSeenNickname = userData.LastSeenNickname;
        string str = playerName.Sanitize();
        userData.LastSeenNickname = playerName.Sanitize();
        Interface.CallHook("OnUserNameUpdated", playerId, lastSeenNickname, str);
    }
}
```
:::

## `UserExists`

The `UserExists` method will return `true` if `playerId` has any `UserData`

::: details Github Location 
[`UserExists`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L452)
:::

::: details Source Code
```csharp
public bool UserExists(string playerId)
{
    return this.usersData.ContainsKey(playerId);
}
```
:::

## `UserHasAnyGroup`

The `UserHasAnyGroup` method will return `true` if `playerId` has been assigned one or more group(s)

::: details Github Location 
[`UserHasAnyGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L494)
:::

::: details Source Code
```csharp
public bool UserHasAnyGroup(string playerId)
{
    if (!this.UserExists(playerId))
    {
        return false;
    }
    return this.GetUserData(playerId).Groups.Count > 0;
}
```
:::

## `UserHasGroup`

The `UserHasGroup` method will return `true` if `groupName` has been assigned to `playerId`

::: details Github Location 
[`UserHasGroup`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L744)
:::

::: details Source Code
```csharp
public bool UserHasGroup(string playerId, string groupName)
{
    if (!this.GroupExists(groupName))
    {
        return false;
    }
    return this.GetUserData(playerId).Groups.Contains<string>(groupName, StringComparer.OrdinalIgnoreCase);
}
```
:::

## `UserHasPermission`

The `UserHasPermission` method will return `true` if `permission` has been assigned to `playerId`

::: details Github Location 
[`UserHasPermission`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/Permission.cs#L535)
:::

::: details Source Code
```csharp
public bool UserHasPermission(string playerId, string permission)
{
    if (string.IsNullOrEmpty(permission))
    {
        return false;
    }
    if (playerId.Equals("server_console"))
    {
        return true;
    }
        UserData userData = this.GetUserData(playerId);
    if (userData.Perms.Contains<string>(permission, StringComparer.OrdinalIgnoreCase))
    {
        return true;
    }
    return this.GroupsHavePermission(userData.Groups, permission);
}
```
:::