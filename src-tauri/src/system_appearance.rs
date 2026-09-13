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
