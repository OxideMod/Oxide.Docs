---
title: Best Practices
after: plugin-guidelines
---

# Best Practices

## 1. Regular Updates

Keeping your Rust plugins updated is crucial for many reasons. Regular updates not only fix bugs but also add new features, improve performance and compatibility, and enhance security.

### 1.1 Fixing Bugs

The primary reason for updates is to fix bugs. Bugs are inevitable in any software project, and Rust plugins are no exception. Regularly updating your plugin will ensure any identified bugs are fixed and won't affect the plugin's functionality or the gameplay of users.

### 1.2 Adding New Features

User needs and expectations evolve over time. The same applies to the game Rust itself. As Rust is regularly updated with new gameplay features, your plugin should also be updated to incorporate these new features.

### 1.3 Compatibility

With every new update of Rust and the Oxide mod, your plugin must be checked for compatibility. You may need to make updates to ensure your plugin works smoothly with the latest versions.

### 1.4 Security

If your plugin involves user data or has any security-sensitive features, regular updates are needed to ensure its security. This includes patching any vulnerabilities that may have been discovered and enhancing existing security features.

### 1.5 Communication

Whenever you update your plugin, it's essential to communicate these changes to your users. This can be done through a version history document, a change log, or update notes on the plugin's download page.

Regularly updating your plugin shows your commitment to its maintenance and user satisfaction. It's a best practice that will keep your plugin relevant and valuable to its user base.

## 2. Source Control

Source control, also known as version control, is a system that records changes to a file or set of files over time so that you can recall specific versions later. For a Rust plugin developer, it is essential for tracking changes, maintaining version history, and collaborating with others.

### 2.1 Git

Git is the most widely used modern version control system in the world today. It's a distributed version control system that allows teams to work on the same project without needing to share a common network.

Here are some common git commands that you will use frequently:

- `git init`: Initializes a new Git repository.
- `git add`: Adds a file to the staging area.
- `git commit`: Commits the staged snapshot.
- `git status`: Lists which files are staged, unstaged, and untracked.
- `git pull`: Fetches the remote copy of the current branch and merges it.

### 2.2 GitHub

GitHub is a Git repository hosting service that provides a Web-based graphical interface. It also provides access control and several collaboration features, such as wikis and basic task management tools for every project.

Rust plugin developers can use GitHub to host their projects, track issues, and collaborate with other developers.

### 2.3 .gitignore

A .gitignore file is a must-have for any Git repository. It specifies intentionally untracked files that Git should ignore. For a Rust plugin project, this usually includes compiled binaries, log files, and local configuration files.

Example of a basic .gitignore for a Rust plugin project:

```txt
# Ignore .dll and .pdb files
*.dll
*.pdb

# Ignore obj directory
obj/
```

Remember, a well-managed source control process can make the difference between a well-maintained plugin and a messy one. It's your safety net for experimenting with new features and rolling back changes if something doesn't work.

## 3. Community Interaction

Engaging with your user community is an integral part of plugin development. It can lead to improved plugins, increased user satisfaction, and a stronger sense of community.

### 3.1 Gathering Feedback

User feedback is invaluable for identifying bugs, gauging user satisfaction, and getting ideas for new features. Encourage users to provide feedback through comment sections, forums, surveys, or direct contact. Respond to feedback promptly and constructively.

### 3.2 Providing Support

Users may encounter difficulties while using your plugin. Establish clear channels through which users can seek help, such as a dedicated support forum, a FAQ section, or a contact email.

### 3.3 Involving Users in Development

Consider involving your user community in the development process. This could be through beta testing, suggestion forums, or even collaborative development for open-source plugins.

### 3.4 Building a Community

Foster a sense of community among your users. This could involve organizing events, providing a platform for discussion, or even just maintaining a friendly and welcoming tone in all your communications.

Engaging with your user community is not just good manners - it's a strategy that can lead to better plugins and happier users. By listening to and involving your users, you can ensure your plugin meets their needs and continues to improve over time.

## 4. Testing

Thorough testing is essential in any development process and creating plugins for Rust is no exception. A good testing strategy will help you catch and fix bugs, improve the performance of your plugin, and ensure that your plugin behaves as expected.

### 4.1 Unit Testing

Unit testing involves testing individual components of your plugin in isolation. By focusing on one piece at a time, you can catch and fix issues without the added complexity of the full system.

```csharp
// Example of a basic unit test in C#
[TestClass]
public class MyPluginTests
{
    [TestMethod]
    public void TestCommandBehavior()
    {
        // Arrange
        var plugin = new MyPlugin();
        var player = new FakePlayer();

        // Act
        plugin.MyCommand(player, null, null);

        // Assert
        Assert.AreEqual("Expected response", player.LastMessage);
    }
}
```

The example above shows a unit test for a hypothetical `MyCommand` in `MyPlugin`. We create instances of `MyPlugin` and `FakePlayer`, run the command, and then check the player's `LastMessage` property to make sure the command did what we expected.

### 4.2 Load Testing

Load testing involves testing your plugin under heavy or maximum workload to evaluate its performance and stability under such conditions. This kind of testing is especially important for multiplayer game plugins like Rust, where the server might need to handle many players simultaneously.

For load testing, you might simulate many players performing actions that use your plugin. Depending on your plugin's functionality, consider testing with a realistic number of players and actions that those players might perform.

Please note that testing tools and strategies may depend on your development environment and available tools. For .NET-based projects, NUnit or XUnit can be used for unit testing, and tools like Apache JMeter can be used for load testing.

## 5. Code Review

Code review is a practice where another person reviews your code to check for potential mistakes, bugs, and areas for improvement. It's a valuable practice for any development process, including Rust plugin development.

### 5.1 Peer Review

Peer review involves having your code reviewed by a colleague or another developer. The reviewer can provide feedback on the code's readability, logic, and potential issues that you might have missed.

In a professional or team environment, this is often facilitated by a version control system like Git with a feature known as pull requests. Pull requests allow developers to propose changes to a codebase that can be reviewed before they are integrated.

Consider this hypothetical scenario:

```csharp
// Code in a Pull Request

public class MyPlugin : RustPlugin
{
    [ChatCommand("heal")]
    private void HealCommand(BasePlayer player)
    {
        player.health = 100;  // Setting health directly
    }
}
```

A peer might review this code and suggest a more appropriate method, like so:

```csharp
// Reviewed code

public class MyPlugin : RustPlugin
{
    [ChatCommand("heal")]
    private void HealCommand(BasePlayer player)
    {
        player.Heal(100);  // Using Heal method
    }
}
```

In this example, a peer reviewer suggested to use the Heal method instead of setting the health directly. This ensures that any associated behavior (like playing a healing sound effect) is triggered correctly.

### 5.2 Self-Review

While having a peer review your code is often ideal, it's not always feasible—especially for hobby or solo developers. However, you can still perform a self-review. This process involves stepping away from your code after you write it, then coming back to it later (after a break, or even the next day) to review it with fresh eyes. You'll often spot areas that could be improved that you didn't see while you were in the midst of writing it.

For example, you might notice that a method you wrote could be split into smaller, more manageable methods. Or you might spot a magic number that could be replaced with a named constant to make the code more readable.

## 6. Design Patterns

Design patterns are established solutions to common programming problems. They're not code snippets that can be directly copied and pasted, but rather general strategies or templates that can be adapted to specific situations. Here are some that are useful in plugin development:

### 6.1 Singleton Pattern

In Rust plugin development, the Singleton pattern can be utilized to provide a single point of access to a class or resource. This is typically used when you need exactly one instance of a class to coordinate actions in the game system.

An example in the context of Rust plugins might be a configuration manager or a data manager.

### 6.2 Observer Pattern

The Observer pattern is a software design pattern in which an object, named the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods.

In the context of a Rust plugin, Oxide's hook system can be seen as a form of the Observer pattern. Your plugin "observes" the game server and reacts when certain events (hooks) occur.

```csharp
// An example of the Observer pattern with an Oxide hook
public class MyPlugin : RustPlugin
{
    void OnPlayerConnected(BasePlayer player)
    {
        Puts($"{player.displayName} has connected");
    }
}
```

In this example, your plugin "observes" the server for the `OnPlayerConnected` event, and when a player connects, it prints a message to the console.

### 6.3 Strategy Pattern

The Strategy pattern is a design pattern that enables an algorithm's behavior to be selected at runtime.

For example, let's say you're writing a plugin that includes various types of player rewards. You could use the Strategy pattern to switch between different reward algorithms (e.g., random reward, performance-based reward, time-based reward) at runtime.

Design patterns can dramatically improve the structure and efficiency of your code, but it's important to note that they are tools, not goals. Use them where appropriate, but don't force them into places where they don't fit.

## 7. Security

Developing secure plugins is crucial to protect both the server where they are deployed and the players using them. Here are a few best practices to consider:

### 7.1 Protect Sensitive Information

Ensure that your plugin doesn't expose sensitive information. This could be information about the server, other plugins, or the players. Never log sensitive information to the console or save it in an insecure manner.

### 7.2 Validate Input

Always validate input from users and other plugins. This can prevent potential exploits that could harm the server or disrupt gameplay.

### 7.3 Update Dependencies

Keep your dependencies up to date. Outdated libraries can have known security vulnerabilities that can be exploited.

### 7.4 Penetration Testing

Consider conducting penetration testing on your plugin. This involves simulating attacks to identify vulnerabilities in your plugin.

Security should be a priority throughout the plugin development process. A secure plugin is a reliable one, and your users will thank you for taking the time to ensure their data and gameplay are safe.

## 8. Documentation

Effective and clear documentation is a key aspect of developing high-quality plugins. Here's why:

8.1 User Understanding
Good documentation helps users understand what your plugin does and how to use it. It provides instructions on how to install the plugin, what each command does, and how to configure it to suit their needs.

8.2 Code Understanding
Documentation isn't just for users, but for developers too. Code comments and documentation help anyone reading the code understand what each part does, making it easier to maintain and extend.

8.3 Troubleshooting
Well-documented code simplifies troubleshooting. If users encounter an issue, they can refer to the documentation for guidance on how to solve it.

8.4 Community Contributions
Clear documentation makes it easier for others in the community to contribute to your plugin. They can understand your code faster and make valuable additions.

In short, never underestimate the power of good documentation. It benefits everyone, from the end-users to fellow developers, and even yourself when you return to your code after a long time.

---

In conclusion, best practices are not just guidelines that improve the quality of your plugin, they are a commitment to excellence. As a plugin developer for Rust, adhering to these best practices will make your code more efficient, effective, and accessible.

Whether it's through thorough testing, open and proactive code reviews, using proven design patterns, effective use of source control, regular updates, active community interaction, strong security practices, or clear and detailed documentation, you are ensuring that your contribution to the Rust community is robust and worthwhile.

These practices will not only help you become a better developer, but they will also elevate the quality of your work and set a high standard for the rest of the community. With time and practice, these guidelines will become second nature.

Remember, every great plugin starts with a single line of code. Keep learning, keep improving, and keep building!
