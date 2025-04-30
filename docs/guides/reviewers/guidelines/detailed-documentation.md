---
title: Detailed documentation
after: attribute-definitions
---

# Detailed documentation

1. Documentation must be filled out in detail.
2. Must provide a base explanation plugin features.
3. Must explain any available permissions.
4. Must explain any available chat and console commands.

## Explanation

This guideline requires that the documentation is filled out to an acceptable standard and formatted in a way that is easily readable and not misleading.

The documentation **must** include:

- A small description about the plugin's functionality and features.
- All Oxide permissions used by the plugin and ideally a brief description about what each of these permissions do, under a `## Permissions` heading.
- All available Oxide chat and console commands (not including console commands used for UI) and what these do.
- If the plugin is configurable, should include a description about what each config option does and ideally a default config under a `## Configuration` heading.
- If the plugin contains the Oxide localisation API, it should include a default lang file under a `## Localization` heading.
- If the plugin has any dedicated developer API methods, each API method should be documented. The method signature, return type and what they do should be explained.

The documentation **can't** include

- Any personal information (e.g. phone numbers, personal email, personal social media accounts etc.)
- Any advertising
  - Game servers (e.g. "Made for x server", "Join x server" etc.)
  - Sponsorships or endorsements (e.g. "Sponsored by x server host")
  - Personal advertising (e.g. links to other marketplace sites)

The documentation **can** include

- Link to voluntary donations for the plugin author.
- Links to support (e.g. Discord tag, GitHub repository)
- Links to external services, though only if they are used by the plugin or necessary for it to function.
- Credit to helpers, or previous maintainers.

This guideline is up to the judgement of the reviewer, until we have a standard for documentation formatting, developers are allowed to format their documentation however they see fit, provided it follows the above requirements.
