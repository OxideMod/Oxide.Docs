---
title: Localization
after: permissions
---

# Localization

Localization in the context of a Rust server powered by the Oxide plugin system refers to the process of customizing and translating various aspects of the server's interface and user interactions to match the languages and cultural preferences of your server's players.

## What is Localization?

Localization is the process of adapting a product, in this case, your Rust server, to a specific locale or market. It involves translating text and adjusting other elements to accommodate different languages, units of measure, date formats, and more. In the context of Oxide, localization mainly involves translating plugin messages and interfaces to better accommodate players from various geographical regions.

## Why is Localization Important for My Rust Server?

If your Rust server caters to a diverse audience, you'll want to ensure that all your players, regardless of their language, have the same high-quality gaming experience. Localization is vital for this. It makes your server more inclusive and user-friendly for players of different nationalities or who speak different languages.

Moreover, localization can increase the engagement level of your players. Players are likely to spend more time on a server that 'speaks their language,' contributing to a more vibrant and active server community.

## What are Language Files?

Language files are the backbone of the localization process in Oxide. They are text files that contain translations of various plugin texts and messages into different languages. Each plugin that supports localization will have its own set of language files, and each language supported by the plugin will have its own file. These files are usually in JSON format and can be easily edited to customize or add new translations.

## Where are Language Files Located in the Oxide Plugin System?

Language files for Oxide plugins are typically located within your server's installation directory in the `oxide/lang` folder. Each language has its own subdirectory in the `lang` folder, which contains the language files for different plugins supporting that language.

Here is a sample directory structure showing where you might find a language file for a plugin called SamplePlugin:

```txt
└── server
    └── rustserver
        └── oxide
            └── lang
                └── en
                    ├── SamplePlugin.json
                    └── AnotherPlugin.json
                └── es
                    ├── SamplePlugin.json
                    └── AnotherPlugin.json
```

In this example, the `en` folder (for English language) contains the language files for `SamplePlugin` and `AnotherPlugin`.

## How Can I Modify a Language File?

Modifying a language file is straightforward and involves editing the respective JSON file using a text editor or an Integrated Development Environment (IDE) of your choice.

When you open the JSON file, you'll see a structure similar to the following:

```json
{
  "Hello": "Hello",
  "WelcomeMessage": "Welcome to our Rust server!"
}
```

In this case, if you wanted to change the welcome message, you could simply replace the text after `WelcomeMessage`:

```json
{
  "Hello": "Hello",
  "WelcomeMessage": "Welcome to our custom Rust server! Enjoy your stay."
}
```

Remember to save your changes before closing the file. The modified text will now be displayed when the corresponding event occurs in the game.

Different plugins may use different keys for their messages. Some plugins may also use placeholders (e.g., `{0}`, `{1}`, etc.) within their messages that are replaced with dynamic content when the message is displayed in the game. For instance, in a welcome message like below:

```json
{
  "WelcomeMessage": "Welcome to {0}! Enjoy your stay."
}
```

The `{0}` would be replaced with a parameter used in the plugin such as the server's name.

In addition, some Oxide plugins may allow for the use of Rust's text tags like `<color>` and `<size>` within the language files. These tags can be used to change the color and size of the text.

Here's an example of using Rust's text tags:

```json
{
  "WelcomeMessage": "<color=red>Welcome to our server!</color>"
}
```

In the above example, the welcome message will appear in red. Feel free to experiment with these tags to customize your server messages further!

## How Do I Create a Language File for a New Language?

If you need to support a new language that isn't already included in the default language files, you can create a new language file.

1. First, navigate to the `oxide/lang` directory in your server's installation directory.

2. If it does not already exist, create a new directory within the `lang` directory that is named using the standard language code for your desired language (e.g., `de` for German, `fr` for French).

3. Copy an existing language file from another language directory (e.g., en) into the new language directory you created.

4. Open the copied language file in a text editor of your choice and begin translating the values in the file to the new language.

5. Once completed, save your changes. The Oxide plugin system will now be able to use the new language file.

:::info NOTE
Make sure you maintain the JSON format in the file when you're editing it. Each entry should be surrounded by double quotes and separated by a comma.
:::

## Troubleshooting Localization Problems

If you're having trouble with localization on your server, here are a few things to check:

1. **Check the language file format**: Ensure the JSON format is correct in your language files. Invalid format can cause issues with the plugin's ability to read the file. Use a JSON validator to confirm that the JSON is properly structured.

2. **Check the language directory**: The language directory should match the standard language code for the language you're using (e.g., `en` for English, `de` for German). If the directory is incorrectly named, the plugin may not be able to locate the language file.

3. **Check the translations**: Ensure that all the keys in the language file have corresponding values and that those values are correctly translated. Missing or incorrect translations could result in unlocalized text appearing in the game.

Remember, when in doubt, you can always consult the community for help. The Oxide community is full of knowledgeable individuals who can help troubleshoot any issues you're encountering with localization.
