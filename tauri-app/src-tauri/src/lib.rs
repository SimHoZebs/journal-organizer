use std::fs;
use std::io::{self, Write};
use std::path::Path;

// Function to create a markdown file
#[tauri::command]
fn create_markdown_file(path: &str, content: &str) -> Result<(), String> {
    let mut file = fs::File::create(path).map_err(|e| e.to_string())?;
    file.write_all(content.as_bytes())
        .map_err(|e| e.to_string())?;
    Ok(())
}

// Function to read a markdown file
#[tauri::command]
fn read_markdown_file(path: &str) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

// Function to update a markdown file
#[tauri::command]
fn update_markdown_file(path: &str, content: &str) -> Result<(), String> {
    let mut file = fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(path)
        .map_err(|e| e.to_string())?;
    file.write_all(content.as_bytes())
        .map_err(|e| e.to_string())?;
    Ok(())
}

// Function to delete a markdown file
#[tauri::command]
fn delete_markdown_file(path: &str) -> Result<(), String> {
    fs::remove_file(path).map_err(|e| e.to_string())
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn list_files_in_directory(path_str: String) -> Result<Vec<String>, String> {
    let path = Path::new(&path_str);
    let entries = fs::read_dir(path).map_err(|e| e.to_string())?;
    let mut files = Vec::new();
    for entry in entries {
        match entry {
            Ok(dir_entry) => {
                let file_name = dir_entry.file_name();
                let file_name_str = file_name.to_string_lossy().to_string();
                files.push(file_name_str);
            }
            Err(e) => {
                return Err(format!("Error reading entry: {}", e));
            }
        }
    }
    Ok(files)
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            list_files_in_directory,
            create_markdown_file,
            read_markdown_file,
            update_markdown_file,
            delete_markdown_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
