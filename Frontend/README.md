# React + Vite Project

A modern React application built with Vite for fast development and optimized builds. This project includes Hot Module Replacement (HMR), ESLint configuration, and a minimal setup to get you started with React development.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Development](#development)
- [Building for Production](#building-for-production)
- [ESLint Configuration](#eslint-configuration)
- [React Compiler](#react-compiler)
- [Expanding the ESLint Configuration](#expanding-the-eslint-configuration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- ⚡️ **Vite** - Next generation frontend tooling for blazing fast development
- ⚛️ **React 19** - Latest version of React with new features
- 🔥 **Hot Module Replacement (HMR)** - Instant updates during development
- 📏 **ESLint** - Code linting with React-specific rules
- 🎯 **Modern JavaScript** - ES2020+ support with module system
- 🚀 **Fast Refresh** - Preserve component state during edits
- 📁 **Organized Structure** - Clean and scalable project organization

## 🛠 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 18.0.0 or higher)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for version control

You can verify your installations by running:

```bash
node --version
npm --version
```

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   Or if you prefer yarn:
   ```bash
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The application will open at `http://localhost:5173`

## 📜 Available Scripts

In the project directory, you can run:

### `npm run dev`
- Starts the development server
- Opens your browser at `http://localhost:5173`
- Enables hot reloading for instant updates

### `npm run build`
- Builds the app for production to the `dist` folder
- Optimizes the build for best performance
- Bundles React in production mode

### `npm run lint`
- Runs ESLint to check for code quality issues
- Helps maintain consistent code style
- Identifies potential bugs and anti-patterns

### `npm run preview`
- Serves the production build locally
- Useful for testing the production build before deployment
- Runs on `http://localhost:4173`

## 📁 Project Structure

```
react/
├── public/
│   └── vite.svg                 # Vite logo
├── src/
│   ├── assets/
│   │   └── react.svg           # React logo
│   ├── App.jsx                 # Main App component
│   ├── index.css               # Global styles
│   └── main.jsx                # Application entry point
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── package.json                # Project dependencies and scripts
├── README.md                   # Project documentation
└── vite.config.js              # Vite configuration
```

## 🛠 Technologies Used

### Core Dependencies
- **React 19.1.1** - JavaScript library for building user interfaces
- **React DOM 19.1.1** - React package for working with the DOM

### Development Dependencies
- **Vite 7.1.7** - Build tool and development server
- **@vitejs/plugin-react 5.0.4** - Official Vite plugin for React support
- **ESLint 9.36.0** - JavaScript linter for code quality
- **eslint-plugin-react-hooks 5.2.0** - ESLint rules for React Hooks
- **eslint-plugin-react-refresh 0.4.22** - ESLint plugin for React Refresh

## 🔧 Development

### Setting up your development environment:

1. **Code Editor:** Use VS Code with recommended extensions:
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint

2. **Browser DevTools:** Install React Developer Tools:
   - [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
   - [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

3. **Hot Reloading:** 
   - Save any file to see changes instantly
   - Component state is preserved during most edits
   - CSS changes apply immediately

### Available Vite Plugins

Currently, two official plugins are available:

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)** - Uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)** - Uses [SWC](https://swc.rs/) for Fast Refresh

This project uses the standard `@vitejs/plugin-react` for optimal compatibility.

## 🏗 Building for Production

1. **Create a production build:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist` folder** to your hosting platform:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3
   - Any static hosting service

## 📏 ESLint Configuration

The project includes a comprehensive ESLint setup with:

- **@eslint/js** - Core ESLint rules
- **React Hooks rules** - Enforces rules of hooks
- **React Refresh rules** - Optimizes fast refresh
- **Browser globals** - Provides browser environment variables
- **Modern JavaScript** - ES2020+ support

### Current ESLint Rules:
- Unused variables error (with exceptions for constants)
- React Hooks best practices
- React Refresh compatibility
- Modern JavaScript syntax support

## ⚛️ React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## 🔧 Expanding the ESLint Configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

### Adding More ESLint Rules:

1. **Install additional plugins:**
   ```bash
   npm install --save-dev eslint-plugin-jsx-a11y eslint-plugin-import
   ```

2. **Update `eslint.config.js`** to include new rules

3. **Configure VS Code** to show ESLint errors inline

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🚀 Getting Started Checklist

- [ ] Node.js 18+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Browser opened at `http://localhost:5173`
- [ ] React DevTools installed in browser
- [ ] Code editor configured with recommended extensions

Happy coding! 🎉
