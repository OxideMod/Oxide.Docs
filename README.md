Oxide.Docs
This repository contains the source files for the Oxide documentation. The documentation is built using VitePress.

Contributing
Requirements
Node.js (v20 or higher)
Dependencies
To get started, you will need to install the dependencies. You can do this by running the following command:

npm install
Development
To start the development server, run the following command:

npm run docs:dev
Production
To preview the production build of the documentation, run the following command:

npm run docs:build
This can be previewed by running the following command:

npm run docs:preview
Code Style
The project uses EditorConfig, Prettier, and pre-commit hooks<sup><a href="/glossary#hooks">[7]</a></sup> to ensure consistent code style across the codebase.

When you commit changes, pre-commit hooks<sup><a href="/glossary#hooks">[7]</a></sup> will automatically format your code according to our style guidelines.

To manually format files:

# Format all supported files

npm run format

# Check code style

npm run lint

# Also check code style

npm run check
