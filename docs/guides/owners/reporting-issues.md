---
title: Reporting Issues
after: contributing
---

# Reporting Issues

To get timely assistance with your issues, please carefully follow this guide. Well-written bug reports help developers identify and fix problems quickly.

## Before Reporting an Issue

Before submitting a bug report, take these preliminary steps:

1. **Reproduce the bug**
   - Figure out the steps to reproduce the bug consistently
   - If you can reproduce occasionally but not after following specific steps, you must provide as much additional information as possible
   - If you can't reproduce the problem, there is probably no use in reporting it, unless you have unique information about its occurrence

2. **Update your software**
   - Make sure Oxide, your plugins, and other extensions are up to date
   - Your bug may already be fixed in a newer version

3. **Check if others have the same issue**
   - If the bug only happens in your existing setup, try to figure out what settings, extensions, or files are needed to reproduce the bug
   - If the bug seems egregious (obviously affecting many users), there is probably something unusual happening, perhaps related to a recent game update

4. **Search existing resources**
   - Search the forums or documentation to see if the issue is already known
   - Check if there are existing solutions or workarounds

## Writing a Good Bug Report

### Clear Summary

How would you describe the bug using approximately 10 words or less? This is the first part of your bug report the developer will see.

A good summary should quickly and uniquely identify a bug report. It should explain the problem, not your suggested solution.

**Good:** "Running this command causes the following error message: (with message)"  
**Bad:** "It don't work"

**Good:** "A player was kicked after doing the following action: (with description)"  
**Bad:** "Your plugin kicked my players"

### Precise Steps to Reproduce

How can a developer reproduce the bug on their own system? Steps to reproduce are the most important part of any bug report. If a developer is able to reproduce the bug, it will very likely be fixed.

**Good:** "I can reproduce by doing exactly the following: (explanation)"  
**Bad:** "Your plugin is broken"

**Good:** "1. Started my server & login. 2. Run the following command /help. 3. Help Text does not appear. (with configuration)"  
**Bad:** "Help doesn't do nothing"

### Expected vs. Actual Results

After your steps, precisely describe the observed (actual) result and the expected result. Clearly separate facts (observations) from speculations.

**Good:** "Expected result: The item moved into my inventory. Actual result: The item dropped to the ground"  
**Bad:** "Items not working"

## What to Include in a Bug Report

Include these details to help developers understand and fix the issue:

1. **Reproducibility**
   - Indicate whether you can reproduce the bug at will, occasionally, or not at all

2. **Environment Details**
   - Game Version (run `version` or comparable command)
   - Oxide Version (run `oxide.version`)
   - Plugin Version (found inside of the plugin file, log file, or with `oxide.show`)
   - Plugin Configuration JSON file (found in oxide/config or umod/config directory)

3. **Logs**
   - Include relevant portions of log files from the `oxide/logs` directory
   - Error messages are especially important

4. **Screenshots or Videos**
   - If applicable, visual evidence can be extremely helpful

## Where to Report Issues

- **Plugin Issues**: Submit issues related to specific plugins directly to the plugin author through the support thread for that individual plugin
- **Oxide Issues**: Report issues with Oxide itself on the appropriate forum for the game you are running
- **General Questions**: Ask in the community forums or Discord server

## After Reporting

After submitting a report:
- Be patient - developers are often volunteers with limited time
- Stay engaged - be available to answer follow-up questions
- Test any proposed solutions and provide feedback on whether they solved the issue

## Example Bug Report

Here's an example of a well-formatted bug report:

```
Title: Players lose inventory when using /home command near water

Reproducibility: 100% reproducible using the steps below

Steps to Reproduce:
1. Install Teleport plugin v2.3.4
2. Configure home teleport delay to 5 seconds
3. Have a player stand near water (within 2 blocks)
4. Have the player use the /home command
5. During the 5 second teleport delay, have the player move slightly
6. Player teleports but inventory is lost

Expected Result: Player teleports with inventory intact
Actual Result: Player teleports but inventory items are dropped at the original location or disappear entirely

Environment:
- Game Version: v2022.5.1
- Oxide Version: 2.0.5741
- Teleport Plugin Version: 2.3.4
- Config file attached in comments

Additional Notes:
This only happens near water, not near lava or other liquids. Log shows no errors during the process.
```

By following these guidelines, you'll help developers understand and fix issues more efficiently, resulting in a better experience for everyone. 