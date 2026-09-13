# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
While the major version is 0, compatible additions bump the patch; breaking
API or on-disk format changes bump the minor.

## [Unreleased]

## [0.1.2] - 2026-09-14

### Added

- Cursor rule that forbids installing software on the host machine.
- shadcn/ui with the nova preset, Base UI, Tailwind CSS v4, and Button and Input components.
- Official shadcn/ui logo and welcome heading on the home screen.

### Changed

- Biome CSS parsing now allows Tailwind v4 directives.
- markdownlint ignores Cursor agent skill files under `.agents`.

## [0.1.1] - 2026-09-13

### Added

- Biome for frontend linting and formatting, with React recommended rules.
- Clippy and rustfmt for the Tauri Rust crate, pinned via `rust-toolchain.toml`.
- Cursor rule that requires changelog, lint, build, and test checks before a commit.
- Cursor rule that defines publishing a release as changelog, commit, tag, and GitHub release.
- markdownlint-cli2 for Markdown and Cursor rule files.
- Cursor rule that requires a 2-day quarantine before adopting external dependency versions.

### Changed

- Recommended IDE extensions in the README are listed by ID instead of Visual Studio Marketplace links.

## [0.1.0] - 2026-09-13

### Added

- Initial Tauri 2 desktop application with a React 19 and TypeScript frontend built by Vite.
- Bun as the frontend package manager and script runner for development and production builds.
- Native opener plugin for opening URLs from the webview.
- Apache License 2.0.

[unreleased]: https://github.com/amsokol/tauri-bun-react-shadcn-ui-app/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/amsokol/tauri-bun-react-shadcn-ui-app/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/amsokol/tauri-bun-react-shadcn-ui-app/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/amsokol/tauri-bun-react-shadcn-ui-app/releases/tag/v0.1.0
