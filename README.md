# Oxide.Docs

This repository contains the source files for the Oxide documentation. The documentation is built using [VitePress](https://vitepress.dev/).

## Contributing

### Requirements

- [Node.js](https://nodejs.org/) (v20 or higher)

### Dependencies

To get started, you will need to install the dependencies. You can do this by running the following command:

```bash
npm install
```

### Development

To start the development server, run the following command:

```bash
npm run docs:dev
```

### Production

To preview the production build of the documentation, run the following command:

```bash
npm run docs:build
```

This can be previewed by running the following command:

```bash
npm run docs:preview
```

### Glossary Management

The documentation uses a glossary system that automatically adds references to defined terms throughout the content. Two utility scripts are available for managing glossary references:

#### Adding Glossary References

To automatically add glossary references to all Markdown files:

```bash
# Add glossary references
node util/glossary-linker.js

# Or use the npm script
npm run glossary-links
```

This script scans all Markdown files (except for excluded files like the home page) and adds superscript references to terms defined in `docs/glossary.md`. It intelligently avoids adding references in code blocks, headings, and HTML tags.

#### Removing Glossary References

If you need to remove all glossary references (for troubleshooting or before making significant changes):

```bash
# Remove all glossary references
node util/fix-broken-glossary-links.js
```

You can also target specific files:

```bash
# Remove glossary references from a specific file
node util/fix-broken-glossary-links.js docs/path/to/file.md
```

#### Format with Glossary

To add glossary references and then run Prettier formatting:

```bash
npm run format-with-glossary
```

### Code Style

The project uses EditorConfig, Prettier, and pre-commit hooks<sup><a href="/glossary#hooks">[7]</a></sup> to ensure consistent code style across the codebase.

When you commit changes, pre-commit hooks<sup><a href="/glossary#hooks">[7]</a></sup> will automatically format your code according to our style guidelines.

To manually format files:

```bash
# Format all supported files
npm run format

# Check code style
npm run lint

# Also check code style
npm run check
```
