---
title: Publicizer
after: best-practices
---

# Publicizer

::: warning
Publicizer will only run if you have at least one plugin loaded
:::

Oxide does runtime patching of DLLs to publicize everything in the servers `RustDedicated_Data\Managed` directory, Excluding DLLs with names starting with:

- 0Harmony
- System
- Microsoft
- mscorlib
- Unity
- Mono
- netstandard
- Oxide
- MySql.Data

## Oxide config options

::: code-group

```json{7-8} [oxide.config.json]
{
  //---
  "Plugin Compiler": {
    "Shutdown on idle": true,
    "Seconds before idle": 60,
    "Preprocessor directives": [],
    "Enable Publicizer": true,
    "Ignored Publicizer References": []
  },
  //---
}
```

:::

### Enable Publicizer

Whether the publicizer is enabled or not

Option key: `Enable Publicizer`

Default value: `true`

### Ignored Publicizer References

This option accepts an array of strings of custom DLL names to ignore

Option key: `Ignored Publicizer References`

Default value: `[]`

## Preprocessor directive

As it is possible to disable the publicizer, this allows you to check it is enabled before attempting to access usually non-public value.

Directive name: `OXIDE_PUBLICIZED`

## Environment Variable

As the publicizer utilizes runtime patching the changes it make will not exist in the DLLs which can lead to some pretty annoying IDE warnings about stuff not existing. To help with this, the environment variable allows you to specify a path to write the publicized assemblies to disk.

ENV Var name: `OXIDE_PublicizerOutput`

Example value: `D:\Servers\Rust\Patched`

Batch file example: `set OXIDE_PublicizerOutput=D:\Servers\Rust\Patched`

::: warning
The directory must already exist otherwise nothing will be written to disk!
:::
