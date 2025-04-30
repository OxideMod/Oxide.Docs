---
title: Development Environment
after: getting-started
---

# Setting up your development Environment

Building mods for Rust using the Oxide framework requires a robust development environment. This section guides you through setting up your development environment and introduces the tools you'll be using frequently.

## Integrated Development Environment (IDE)

An Integrated Development Environment, or IDE, is a software application that provides comprehensive facilities to programmers for software development. An IDE typically consists of a code editor, build automation tools, and a debugger. Here are some popular IDEs you can use for developing Oxide plugins:

- **[Visual Studio](https://visualstudio.microsoft.com/)**: A powerful IDE by Microsoft. It offers excellent features for C# development, including IntelliSense (code completion), debugging tools, code navigation, and more. In Visual Studio, you can manage your dependencies through the NuGet Package Manager.
- **[Visual Studio Code](https://code.visualstudio.com/)**: A lightweight but powerful source code editor by Microsoft. It comes with built-in support for C#, JavaScript, TypeScript, and Node.js. You can also add other languages, themes, and tools via extensions. Dependency management in Visual Studio Code can be handled using the .NET Core CLI.
- **[JetBrains Rider](https://www.jetbrains.com/rider/)**: A cross-platform .NET IDE by JetBrains. It provides many tools for .NET development, such as a decompiler, templates for Unity tests, seamless Unity integration, and more. In JetBrains Rider, dependencies can be managed via the NuGet tab.

Choose the IDE that suits your preferences and needs.

## Oxide for Rust

To develop plugins for Rust, you need to install Oxide for Rust. You can download it from the [GitHub repository](https://github.com/OxideMod/Oxide.Rust).

To install Oxide for Rust:

1. Download Oxide for Rust from the repository.
2. Follow the instructions in the repository's README to install Oxide for Rust.
3. After you've installed Oxide, you need to add its libraries and assemblies to your project in your IDE. This allows you to use Oxide's features in your plugins. The process for this will vary depending on your IDE, but it generally involves adding a reference to the Oxide libraries in your project's settings.

## Adding Libraries and Assemblies

In plugin development, dependencies are additional pieces of code your plugin relies on to function correctly. In our case, these would be the Oxide and Rust libraries and assemblies. Referencing these dependencies in your project allows you to access their functionalities and classes in your code.

Commonly used libraries include:

- `Oxide.Core.dll`
- `Oxide.Rust.dll`
- `Assembly-CSharp.dll` (Rust library)
- `UnityEngine.dll` (Unity library)

These libraries can usually be found in your Oxide and Rust installation directories, respectively. If you installed the Oxide extension for Rust, for example, the `Oxide.Rust.dll` library would be located in the `oxide` directory in your Rust installation directory.

Here's how you can add these dependencies to your project in the different IDEs:

### Visual Studio

1. Right-click on your project in the Solution Explorer and select "Add Reference".
2. Navigate to the "Browse" tab, and click the "Browse" button.
3. Locate the Oxide libraries (usually in the form of `.dll` files) in your Oxide installation directory and select them. For Rust, you would add the `Assembly-CSharp.dll` and `UnityEngine.dll` files from your Rust installation directory.
4. For the extensions, follow the same process. Locate the extension libraries in your extension installation directories and select them.

Alternatively, you can manually edit the `.csproj` file and add the path to your libraries in the form of: `<Reference Include="path_to_your_dll_file" />`.

### Visual Studio Code

Visual Studio Code does not support GUI based reference addition. However, it uses `.csproj` files for managing project references. You can manually add references to the Oxide and Rust libraries by editing the `.csproj` file.

1. To add a reference, you need to add a `Reference` tag in the `ItemGroup` section that looks like this: `<Reference Include="path_to_your_dll_file" />`.
2. Replace `path_to_your_dll_file` with the path to the `.dll` file of the library you want to add. Do this for all the Oxide and Rust libraries, and the extension libraries.

### JetBrains Rider

1. Right-click on your project in the Solution Explorer and select "Add Reference".
2. Click on the "+" button and select "From disk".
3. Locate the Oxide libraries in your Oxide installation directory and select them. For Rust, you would add the `Assembly-CSharp.dll` and `UnityEngine.dll` files from your Rust installation directory.
4. For the extensions, follow the same process. Locate the extension libraries in your extension installation directories and select them.

Alternatively, you can manually edit the `.csproj` file and add the path to your libraries in the form of: `<Reference Include="path_to_your_dll_file" />`.

Ensure you've selected the correct libraries and assemblies. When adding extension libraries, refer to the extension documentation for the specific libraries to include.

Remember to add references for both Oxide and Rust libraries, as well as any other extension libraries you are using. This allows you to utilize their features in your plugin development.

## Oxide Extensions

Extensions are community-created tools that provide additional functionalities to the Oxide framework. Some commonly used ones include:

- **RustEdit**: This extension allows for more complex custom map creation.
- **Discord extension**: This extension allows your plugin to interact with Discord servers.

These extensions can be installed separately and used in conjunction with the Oxide framework. To use them in your plugins, you need to add their libraries to your project in the same way you added the Oxide libraries. Refer to the individual extension documentation for installation and usage instructions.

## Unity and Rust

As Rust is built using the Unity game engine, you might need to refer to the Unity documentation and use Unity tools during development. You can explore the [Unity documentation](https://docs.unity3d.com/Manual/index.html) and the [Unity learning resources](https://learn.unity.com/) to better understand how Rust and Unity interact.

## Key Tools and Concepts

During your development journey, you will be using several tools and techniques. Here are a few key ones:

- **Debugging**: Debugging is an essential part of software development. Learn how to use debugging tools in your IDE effectively to identify and fix issues in your plugins.
- **Source Control**: Using source control, such as Git, is crucial for managing your code, especially when collaborating with other developers. Learn how to use Git or another version control system to manage your plugin's code.
- **Unit Testing**: Unit tests help you ensure that your code behaves as expected. They are crucial for maintaining the quality of your code as you make changes over time.
- **Clean Code and Documentation**: Writing clean, easy-to-read code is important for maintainability. Likewise, writing meaningful comments and maintaining good documentation is key for understanding the function and flow of your code.
- **Code Reviews**: Code reviews are a great way to catch bugs and improve code quality. If you are part of a team, make sure to incorporate code reviews in your development process.

Once you've set up your development environment, you're ready to start creating your first plugin!
