# Ink Highlighter

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-PolyForm%20Noncommercial-orange.svg)
![Chrome](https://img.shields.io/badge/chrome-extension-green.svg)
![React](https://img.shields.io/badge/react-19.2-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.9-3178C6.svg)

**A powerful Chrome extension for recruiters and sourcers to highlight keywords, patterns, and contact information on any webpage.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Development](#-development)

</div>

---

## 🎯 Overview

**Ink Highlighter** is a Chrome extension designed for recruitment professionals who need to quickly scan profiles, resumes, and job postings for key information. With support for both keyword matching and regex patterns, plus intelligent profile management, Ink transforms any webpage into an annotated document tailored to your search criteria.

Whether you're sourcing engineers on LinkedIn, screening candidates on job boards, or reviewing resumes, Ink highlights what matters most—instantly.

## ✨ Features

### 🎨 Intelligent Highlighting
- **Multi-Group Support**: Organize terms into color-coded groups (e.g., "JavaScript Skills", "Certifications", "Contact Info")
- **Smart Matching**: Supports plain text keywords, wildcards (`teach*`), and full regex patterns
- **Real-Time Updates**: Highlights update instantly as you add/remove terms—no page refresh needed
- **Conflict Resolution**: Automatically handles overlapping matches with smart prioritization

### 📂 Profile Management
- **Quick Profiles**: 5 pre-built professional profiles ready to use:
  - Modern Web Development
  - Data Networking
  - Sales
  - Accounting & Finance
  - Product Management
- **Custom Profiles**: Save unlimited custom configurations for different roles or industries
- **Quick Switch**: Toggle between profiles via the header dropdown menu
- **Import/Export**: Back up and share your configurations as JSON

### 📊 Summary Dashboard
- **Match Counter**: Real-time count of highlights per group
- **Visual Indicators**: Color-coded badges show which groups are active
- **Collapsible Design**: Minimize to save screen space

### 🎛️ Advanced Controls
- **Context Menu Integration**: Right-click any text and add it to a group instantly
- **Inline Editing**: Rename groups, change colors, and manage terms without leaving the page
- **Visibility Toggles**: Turn groups on/off with a single click
- **Color Picker**: Choose from curated pastel colors or use a custom color

### 🔍 Contact Detection
Each profile includes regex patterns for:
- ✉️ **Email Addresses**
- 📞 **Phone Numbers** (international formats supported)
- 🌐 **Websites & URLs**

### 🧩 Shadow DOM Architecture
- **Non-Invasive**: Runs in an isolated Shadow DOM—no conflicts with host page styles
- **CSP-Compliant**: Works on strict sites like LinkedIn
- **Persistent State**: Remembers sidebar position and profile selection across sessions

## 📥 Installation

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Ink.git
   cd Ink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked**
   - Select the `dist/` folder from the project directory

## 🚀 Usage

### Getting Started

1. **Open the Sidebar**
   - Click the Ink toolbar icon, OR
   - Click the floating "Ink" button (bottom-right of any page)

2. **Choose a Profile**
   - Click the **Folder icon** in the header
   - Select a pre-built profile (e.g., "Modern Web Development")
   - Or create your own by adding groups manually

3. **Add Terms**
   - Expand a group to see its terms
   - Click **+ Add term** to add keywords
   - Use the **regex** toggle for pattern matching

4. **Save Your Configuration**
   - Click the **Folder icon** > **Save Current**
   - Name your profile (e.g., "Senior React Engineers")
   - Switch between profiles anytime

### Tips & Tricks

- **Right-Click to Add**: Select any text on the page, right-click, and choose "Add to [Group Name]"
- **Color Coding**: Use distinct colors for different types of information (skills, titles, tools, etc.)
- **Regex Power**: Match variations like `(React|Vue|Angular)` or `(Senior|Lead|Staff) Engineer`
- **Export Backups**: Regularly export your profiles via **Settings > Data > Export**

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - Modern UI framework
- **TypeScript 5.9** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **Shadow DOM** - Isolated component rendering

### Chrome APIs
- `chrome.storage.local` - Persistent data storage
- `chrome.contextMenus` - Right-click integration
- `chrome.scripting` - Dynamic content injection

### Key Libraries
- **Lucide React** - Beautiful icon set
- **Vitest** - Unit testing framework
- **JSDOM** - DOM testing environment

### Architecture Highlights
- **Custom Build Pipeline**: Dual-mode Vite build (ES modules + IIFE for content scripts)
- **MutationObserver**: Detects dynamic content changes (e.g., infinite scroll)
- **TreeWalker API**: Efficient DOM traversal for text node scanning

## 🧑‍💻 Development

### Commands

```bash
# Build for production
npm run build

# Run unit tests
npm test

# Lint code
npm run lint
```

### Project Structure

```
Ink/
├── src/
│   ├── components/        # React UI components
│   ├── content/          # Content script (highlighter engine)
│   ├── core/             # Shared utilities (matcher, storage, palette)
│   ├── background.ts     # Service worker
│   └── App.tsx           # Main React app
├── scripts/
│   └── build.js          # Custom Vite build orchestration
├── dist/                 # Build output (ignored by git)
└── manifest.json         # Chrome extension manifest
```

### Key Files

- **`src/core/matcher.ts`**: Core matching engine (text, wildcard, regex)
- **`src/content/scanner.ts`**: DOM traversal and highlight application
- **`src/core/defaultData.ts`**: Pre-built professional profiles
- **`scripts/build.js`**: Handles dual-mode Vite build for MV3 compatibility

## 🧪 Testing

```bash
npm test
```

13 unit tests cover:
- ✅ Matcher logic (text, regex, wildcards)
- ✅ Storage persistence
- ✅ Highlight application and removal
- ✅ Overlap resolution

## 📄 License

This project is licensed under the **PolyForm Noncommercial License 1.0.0**.

**TL;DR**: Free for personal, educational, and non-commercial use. Commercial use requires a separate license.

See [LICENSE.md](LICENSE.md) for full terms.

## 🤝 Contributing

Contributions are welcome! However, please note:
- This project is under a **noncommercial license**
- Any contributions must also comply with the license terms
- For commercial licensing inquiries, please contact the maintainer

## 🙏 Acknowledgments

- **Color Palette**: Inspired by Tailwind CSS pastel shades
- **Icons**: Powered by [Lucide](https://lucide.dev/)
- **Architecture**: Built with insights from Chrome Extension MV3 best practices

---

<div align="center">

**Made with ❤️ for Recruiters and Sourcers**

</div>
