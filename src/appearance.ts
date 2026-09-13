import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";

type SystemAppearance = {
  accent: string;
  dark: boolean;
};

function isTauriRuntime() {
  return "__TAURI_INTERNALS__" in globalThis;
}

function applyDocumentTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

function relativeLuminance(hex: string): number {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
}

function applySystemAccent(hex: string) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return;
  }

  const foreground = relativeLuminance(hex) > 0.55 ? "#000000" : "#ffffff";
  const root = document.documentElement.style;
  root.setProperty("--primary", hex);
  root.setProperty("--primary-foreground", foreground);
  root.setProperty("--ring", hex);
  root.setProperty("--sidebar-primary", hex);
  root.setProperty("--sidebar-primary-foreground", foreground);
}

async function syncWindowTheme(isDark: boolean) {
  if (!isTauriRuntime()) {
    return;
  }
  await getCurrentWindow().setTheme(isDark ? "dark" : "light");
}

function applyAppearance(appearance: SystemAppearance) {
  applyDocumentTheme(appearance.dark);
  applySystemAccent(appearance.accent);
  void syncWindowTheme(appearance.dark);
}

export async function initAppearance() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  applyDocumentTheme(media.matches);

  if (!isTauriRuntime()) {
    media.addEventListener("change", (event) => {
      applyDocumentTheme(event.matches);
    });
    return;
  }

  try {
    applyAppearance(await invoke<SystemAppearance>("system_appearance"));
    await listen<SystemAppearance>("system-appearance-changed", (event) => {
      applyAppearance(event.payload);
    });
  } catch {
    applyDocumentTheme(media.matches);
    await syncWindowTheme(media.matches);
  }
}
