---
title: Class and file name
after: deprecated-functionality
---

# Main class and filename are valid match

1. The main plugin class must follow C# naming conventions
2. The main plugin class and file name must match.

## Explanation

### Condition 1

The main plugin class (the class inheriting `RustPlugin` or `CovalencePlugin`) must follow C# naming conventions. This means the class must use pascal case ("PascalCase").

### Condition 2


This guideline requires that the main plugin class and the file name should match identically. This is necessary, otherwise the plugin will fail to compile.

Example: "Teleport" and "Teleport.cs"
