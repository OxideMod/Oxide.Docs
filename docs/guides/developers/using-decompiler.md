---
title: Using Decompiler
after: publicizer
---

# Using Decompiler

## Why use a Decompiler

The Oxide hooks are a part of the information needed to program plugins. You also need to have some knowledge of the Rust game API, and there is no documentation for that. Also there are some changes every wipe. The next best thing is to inspect a decompiled version of the game DLL files. The main Rust class can be found in the Assembly-CSharp.dll file.

## Decompiler software

Many software exist to help decompile C# code. here a are a few examples

**[DNSpy](https://dnspy.org/)**  
**[ILSpy](https://github.com/icsharpcode/ILSpy/releases)**  
**[dotPeek](https://www.jetbrains.com/decompiler/)**  
**JustDecompile** discontinued  

## Modules to load

These are the most common DLL files to load in the decompiler. For game Rust, files are located in the `.\server\RustDedicated_Data\Managed\` folder. The files beginning with Oxide are part of the Oxide development platform. Files starting with Oxide.Ext. are extension modules.  

`Assembly-CSharp.dll` (main dll files)  
`Oxide.Core.dll`  
`Oxide.Rust.dll`  
`Oxide.Common.dll`  
`Oxide.CSharp.dll`  
`Oxide.MySql.dll`  
`Oxide.References.dll`  
`Oxide.Unity.dll`  
`UnityEngine.dll` 

## How to use decompilers

Use Google to find a good tutorial or go on Youtube to learn about your prefered decompile tool.



