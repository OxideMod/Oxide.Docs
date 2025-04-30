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

The info below is about DnSpy. other decompiler have very similar functionnality

### Select files to decompile

Locate the .\RustDedicated_Data\Managed\ folder in your server installation. Make sure that Oxide is installed if you want to view the modified files.
In DnSpy, Open the files Assembly-CSharp.dll, from the managed folder. You can also add other files like the Oxide Dlls,

### Search

The search and browsing are probably the most usefull function of the decompiler.
When searching for a hook name, the `search for` field needs to be `Number/String`, to do a literal search in the files.
If you can't find a hook name that you know exist, double check that the Oxide .dll files are loaded, they contain some of the hooks.

When searching for function, variable, class, etc. select `All of the above` in the search field, or one of the more restrictive searches.

### Used by / uses

When inspecting and analyzing the game API, going deeper in the code is easy, you just click on a data type or method and the software will bring you to that piece of code.
To find where a method is used, you need to use the analyze function (right-click Analyze). In the analyzer window will show info like `Overriden by, Used by, Uses`

### viewing IL code

C# language is compiled to a Microsoft intermediate language `(MSIL)`  
In rare occasions, it's interesting to view MSIL code. Select a line of code, right click on it and select `Edit IL instruction` in the menu.

Note: a usefull web tool to view how C# code translate to MSIL code [sharplab.io](https://sharplab.io/)

Also, there are many good tutorials on YouTube for your favorite decompiler
