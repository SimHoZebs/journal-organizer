use std::fs;
use std::io::Read;
use std::path::Path;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn list_files_in_directory(path_str: String) {
    let path = Path::new(&path_str);
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            eprintln!("Error reading directory: {}", e);
            return;
        }
    };
    let char = 'k';
    let test = char.to_digit(10);

    let foo = if let Some(digit) = char.to_digit(10) {
        digit
    } else {
        0
    };

    let mut files = Vec::new();
    for entry in entries {
        match entry {
            Ok(dir_entry) => {
                let file_name = dir_entry.file_name();
                let file_name_str = file_name.to_string_lossy().to_string();
                if dir_entry.path().is_dir() {
                    files.push(file_name_str);
                }
            }
            Err(e) => {
                eprintln!("Error reading entry: {}", e);
            }
        }
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, list_files_in_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
