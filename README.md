# Tauri + Bun + React + shadcn/ui

Windows desktop app built with Tauri 2, Bun, React 19, TypeScript, Vite, Tailwind CSS v4, and shadcn/ui.

The window uses an undecorated WinUI-style title bar with Mica. It follows the Windows light/dark theme and accent color, supports Snap Layouts on the maximize button, and restores its last position and size without opening off-screen.

## Stack

- Tauri 2 and Rust (edition 2024, toolchain `1.98.1`)
- Bun, Vite, React 19, and TypeScript
- shadcn/ui (nova preset), Base UI, and Tailwind CSS v4
- mimalloc as the Rust global allocator

## Develop

```sh
bun tauri dev
```

Production frontend build:

```sh
bun run build
```

Rust tests:

```sh
cargo test --manifest-path src-tauri/Cargo.toml --all-targets
```

## Lint

```sh
bun run lint
```

Auto-fix frontend issues and format Rust with:

```sh
bun run lint:fix
```

## Recommended IDE Setup

VS Code or Cursor with:

- `tauri-apps.tauri-vscode`
- `rust-lang.rust-analyzer`
- `vadimcn.vscode-lldb`
- `biomejs.biome`
- `DavidAnson.vscode-markdownlint`

## License

Apache License 2.0. See [CHANGELOG.md](CHANGELOG.md) for notable changes.
