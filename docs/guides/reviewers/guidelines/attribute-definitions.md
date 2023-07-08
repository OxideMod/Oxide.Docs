---
title: Attribute definitions
after: index
---

# Attribute definitions exist and are valid

1. Main plugin class must contain an `[Info("title", "author", "x.x.x")]` attribute which specifies the plugin's formatted title (i.e. with spaces), author's username, and current version.

2. Main plugin class must contain the `[Description("text")]` attribute which provides a brief description (more than a couple words) of the plugin, without re-stating that it is a plugin.

## Explanation

This guideline requires that the main plugin class (the class that inherits from `RustPlugin`/`CovalencePlugin`) to have an `Info` And `Description` attribute.

The purpose of the `Info` attribute is to provide Oxide with a minimum amount of information about the plugin.

The purpose of the `Description` attribute is to provide a short description about the plugin so that a user or developer can easily get a general understanding of what the purpose of the plugin is and what functionality it might have.

### Condition 1

The title field of the `Info` attribute needs to be in title case (capital letter at the start of words) and words must be separated by spaces, unless this matches the submission name[^1].

The author field of the `Info` attribute needs to match the name of the account submitting the plugin. It should not contain any self-advertising and not just be a discord tag[^2].

The version field of the `Info` attribute must use semantic versioning (`Major.Minor.Patch`). Other than this, the user is free to set the version number to whatever they like at the time of submission.


### Condition 2

The description should aim to be concise, not too short that important information is omitted, but not so long that it is too wordy.

Generally, a good way to judge whether a description is good or not is if you can understand what the plugin is about and what features it might have before even looking at the code.

Some examples of descriptions[^3]:

```diff

+ "Prevents F1 item giving notices from showing in the chat" (GOOD)
    Reason: Brief but contains all information required to understand what the plugin does.
    
+ "Teleports players to a safe location when they violate antihack InsideTerrain." (GOOD)
    Reason: Contains all information needed to understand what the plugin does and when/why it does this.

+ "Allows players to send private messages to each other." (GOOD)
    Reason: Brief but contains all information required to understand what the plugin does. Other features can be inferred or found in the documentation.

+ "Splits up resources in furnaces automatically and shows useful furnace information" (GOOD)
    Reason: Explains core features in not too many words.

- "VPN Checker" (BAD)
    Reason: Too short, not descriptive enough.
    Alternative: Kick, Ban or run a custom command on players that connect using a VPN.

- "Plugin to delete F15e jets" (BAD)
    Reason: Too short, re-states that it is a plugin, not descriptive enough.
    Alternative: Delete all F15 jets through a single chat command.

- "This plugin allows creation of weapon that does a critical hit on scientists. Those with permissions can spawn the weapon, to sell in a shop or put in a customize vending machine." (BAD)
    Reason: Too long, re-states that it is a plugin.
    Alternative: Adds a weapon that does increased damage on scientists.
```

[^1]: This only applies if it makes sense to not format the name with spaces. Generally it should just be suggested to alter the submission name.

[^2]: Contact information can be included in comments at the top of the plugin file. However, this should not be any personal information or anything that could be used to identify the user. (e.g. phone numbers, personal emails, personal social media accounts etc.)

[^3]: This description does omit the extra information that the weapon can be spawned in, sold in a shop or placed in a custom vending machine, however this is information that can be inferred and it is generally understood that features like this are gated using permissions.
