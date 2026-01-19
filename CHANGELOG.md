# Changelog

All notable changes to Ink Highlighter will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-19

### Added
- **Profile Management**: Save and load sets of highlight groups as named profiles
- **Quick Profile Menu**: Dropdown in header for instant profile switching
- **Default Profiles**: 5 pre-built professional profiles (Web Dev, Networking, Sales, Accounting, PM)
- **Summary Dashboard**: Real-time match counter with colored badges
- **Contact Detection**: Separate groups for Emails, Phone Numbers, and Websites
- **Context Menu Integration**: Right-click to add selected text to groups
- **Color Picker**: Curated pastel palette with custom color support
- **Shadow DOM Architecture**: Non-invasive UI that works on CSP-strict sites
- **Import/Export**: JSON backup and restore functionality

### Features
- Multi-group keyword and regex highlighting
- Real-time updates without page refresh
- Inline group editing and management
- Smart color assignment for new groups
- Persistent sidebar state across sessions
- Wildcard pattern support (`teach*`)
- Overlap resolution with smart prioritization
- Works on dynamic content (infinite scroll, SPAs)

### Technical
- React 19 with TypeScript 5.9
- Vite 7 build system with custom dual-mode compilation
- MutationObserver for dynamic content detection
- TreeWalker API for efficient DOM traversal
- Comprehensive unit test coverage (13 tests)

[1.0.0]: https://github.com/SomeGuy02312/Ink/releases/tag/v1.0.0
