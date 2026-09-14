# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
While the major version is 0, compatible additions bump the patch; breaking
API or on-disk format changes bump the minor.

## [Unreleased]

### Changed

- README describes the current WinUI-style desktop app, stack, and commands.

## [0.1.4] - 2026-09-14

### Added

- The window restores its last position and size, and stays on a visible display if a monitor was unplugged.

### Fixed

- Dark theme no longer flashes a white window before the first paint.
- Restoring from maximized uses the previous window size instead of the full display.
- Window position is stored in Local AppData, not Roaming.

## [0.1.3] - 2026-09-14

### Added

- WinUI-style custom title bar with Windows 11 caption buttons.
- The UI follows Windows light/dark theme and accent color while the app is running.
- Windows 11 Snap Layouts on the custom maximize button.
- mimalloc as the Rust global allocator, with C `malloc` override on Unix/macOS.

### Changed

- The window uses an undecorated frame with Mica instead of the Win32 title bar.
- Buttons use the default arrow cursor instead of the pointing hand.

### Fixed

- Title bar text and caption icons follow the system light and dark theme.
- Title bar text uses the correct color when the app starts in dark mode.
- Light and dark theme still follow Windows after the window theme is applied.
- Restore caption icon, title double-click to maximize, and close-button hover size.
- Close caption icon turns white on the red hover background.

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

[unreleased]: https://github.com/amsokol/tauri-bun-react-shadcn-ui-app/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/amsokol/tauri-bun-react-shadcn-ui-app/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/amsokol/tauri-bun-react-shadcn-ui-app/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/amsokol/tauri-bun-react-shadcn-ui-app/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/amsokol/tauri-bun-react-shadcn-ui-app/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/amsokol/tauri-bun-react-shadcn-ui-app/releases/tag/v0.1.0
