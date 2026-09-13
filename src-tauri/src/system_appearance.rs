#![cfg_attr(windows, allow(unsafe_code))]

use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemAppearance {
    pub accent: String,
    pub dark: bool,
}

fn color_to_hex(r: u8, g: u8, b: u8) -> String {
    format!("#{r:02x}{g:02x}{b:02x}")
}

fn is_dark_background(r: u8, g: u8, b: u8) -> bool {
    (0.2126 * f32::from(r) + 0.7152 * f32::from(g) + 0.0722 * f32::from(b)) / 255.0 < 0.5
}

#[tauri::command]
pub fn system_appearance() -> Result<SystemAppearance, String> {
    #[cfg(windows)]
    {
        read_windows_appearance()
    }
    #[cfg(not(windows))]
    {
        Err("system appearance is only available on Windows".into())
    }
}

#[cfg(windows)]
pub fn watch(app: &tauri::AppHandle) {
    if let Err(error) = try_watch(app) {
        eprintln!("failed to watch Windows appearance: {error}");
    }
}

#[cfg(windows)]
pub fn apply_window_theme(window: &tauri::WebviewWindow) {
    let appearance = match read_windows_appearance() {
        Ok(appearance) => appearance,
        Err(error) => {
            eprintln!("failed to read Windows appearance: {error}");
            return;
        }
    };
    let theme = if appearance.dark {
        tauri::Theme::Dark
    } else {
        tauri::Theme::Light
    };
    if let Err(error) = window.set_theme(Some(theme)) {
        eprintln!("failed to set window theme: {error}");
    }
    let color = if appearance.dark {
        tauri::webview::Color(0, 0, 0, 0)
    } else {
        tauri::webview::Color(255, 255, 255, 0)
    };
    if let Err(error) = window.set_background_color(Some(color)) {
        eprintln!("failed to set window background: {error}");
    }
    if let Err(error) = prepare_native_window(window, appearance.dark) {
        eprintln!("failed to prepare native window theme: {error}");
    }
}

#[cfg(windows)]
fn prepare_native_window(window: &tauri::WebviewWindow, dark: bool) -> Result<(), String> {
    use std::mem::size_of;
    use windows::Win32::Foundation::HWND;
    use windows::Win32::Graphics::Dwm::{DWMWA_USE_IMMERSIVE_DARK_MODE, DwmSetWindowAttribute};
    use windows::Win32::Graphics::Gdi::{GetStockObject, NULL_BRUSH};
    use windows::Win32::UI::WindowsAndMessaging::{GCLP_HBRBACKGROUND, SetClassLongPtrW};

    let hwnd = HWND(window.hwnd().map_err(|error| error.to_string())?.0 as *mut _);
    let dark_mode = i32::from(dark);
    unsafe {
        // SAFETY: `hwnd` is the live Tauri window; DWM reads a BOOL-sized buffer.
        DwmSetWindowAttribute(
            hwnd,
            DWMWA_USE_IMMERSIVE_DARK_MODE,
            std::ptr::from_ref(&dark_mode).cast(),
            u32::try_from(size_of::<i32>()).expect("BOOL size fits u32"),
        )
    }
    .map_err(|error| error.to_string())?;

    let brush = unsafe { GetStockObject(NULL_BRUSH) };
    unsafe {
        // SAFETY: `hwnd` is valid; a null background brush stops DefWindowProc from
        // filling the client area with the default white class brush.
        SetClassLongPtrW(hwnd, GCLP_HBRBACKGROUND, brush.0 as isize);
    }
    Ok(())
}

#[cfg(windows)]
fn read_windows_appearance() -> Result<SystemAppearance, String> {
    use windows::UI::ViewManagement::{UIColorType, UISettings};

    let settings = UISettings::new().map_err(|error| error.to_string())?;
    let accent = settings
        .GetColorValue(UIColorType::Accent)
        .map_err(|error| error.to_string())?;
    let background = settings
        .GetColorValue(UIColorType::Background)
        .map_err(|error| error.to_string())?;
    Ok(SystemAppearance {
        accent: color_to_hex(accent.R, accent.G, accent.B),
        dark: is_dark_background(background.R, background.G, background.B),
    })
}

#[cfg(windows)]
fn try_watch(app: &tauri::AppHandle) -> Result<(), String> {
    use tauri::{Emitter, Manager};
    use windows::Foundation::TypedEventHandler;
    use windows::UI::ViewManagement::UISettings;

    let settings = UISettings::new().map_err(|error| error.to_string())?;
    let app_handle = app.clone();
    settings
        .ColorValuesChanged(&TypedEventHandler::new(move |_, _| {
            if let Ok(appearance) = read_windows_appearance() {
                let _ = app_handle.emit("system-appearance-changed", appearance);
            }
            Ok(())
        }))
        .map_err(|error| error.to_string())?;
    app.manage(SystemAppearanceWatch {
        _settings: settings,
    });
    Ok(())
}

#[cfg(windows)]
struct SystemAppearanceWatch {
    _settings: windows::UI::ViewManagement::UISettings,
}

#[cfg(test)]
mod tests {
    use super::{color_to_hex, is_dark_background};

    #[test]
    fn formats_accent_hex() {
        assert_eq!(color_to_hex(0, 120, 212), "#0078d4");
    }

    #[test]
    fn treats_white_background_as_light() {
        assert!(!is_dark_background(255, 255, 255));
    }

    #[test]
    fn treats_black_background_as_dark() {
        assert!(is_dark_background(0, 0, 0));
    }
}
