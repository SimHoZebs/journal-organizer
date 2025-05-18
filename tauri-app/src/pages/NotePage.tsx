import type { PreviewType } from "@uiw/react-md-editor";
import { useState } from "react";
import SideNav from "../comp/SideNav.tsx";
import NoteComponent from "../comp/Note.tsx";
import catchError from "../utils/catchError.ts";
import { ActionBtn, SecondaryBtn } from "../comp/Button.tsx";
import { H2 } from "../comp/Heading.tsx";
import { invoke } from "@tauri-apps/api/core";

interface FileSystemNoteItem {
  id: string;
  name: string;
  handle: FileSystemFileHandle;
  lastModified?: Date;
}

interface FileSystemNote {
  id: string;
  title: string;
  content: string;
  handle: FileSystemFileHandle;
  lastModified?: Date;
}

const NotePage = () => {
  const [displayList, setDisplayList] = useState<FileSystemNoteItem[]>([]);
  const [previewMode, setPreviewMode] = useState<PreviewType>("preview");
  const [selectedNote, setSelectedNote] = useState<FileSystemNote | null>(null);
  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle | null>(null); // Store directory handle

  // Function to load notes from a selected directory
  const loadNotesFromDirectory = async () => {
    const [error, dirHandle] = await catchError(window.showDirectoryPicker());
    if (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("User aborted the directory picker.");
      } else {
        console.error("Error loading notes from directory:", error);
      }
      return;
    }
    setDirectoryHandle(dirHandle);
    const notes: FileSystemNoteItem[] = [];

    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file" && entry.name.endsWith(".md")) {
        const file = await entry.getFile();
        notes.push({
          id: file.name,
          name: file.name,
          handle: entry,
          lastModified: new Date(file.lastModified),
        });
      }
    }
    setDisplayList(notes);
    setSelectedNote(null); // Clear selected note when loading new directory
  };

  const createNewNote = async () => {
    if (!directoryHandle) {
      alert("Please select a directory first using the 'Load Notes' button.");
      return;
    }
    try {
      const fileName = prompt("Enter a name for the new note (e.g., my-note):");
      if (!fileName) return; // User cancelled

      const fileHandle = await directoryHandle.getFileHandle(`${fileName}.md`, {
        create: true,
      });
      const newNoteItem: FileSystemNoteItem = {
        id: `${fileName}.md`,
        name: `${fileName}.md`,
        handle: fileHandle,
      };
      const newNote: FileSystemNote = {
        id: newNoteItem.id,
        title: newNoteItem.name,
        content: "",
        handle: newNoteItem.handle,
      };

      setDisplayList((prevList) => [...prevList, newNoteItem]);
      setSelectedNote(newNote);
      setPreviewMode("edit"); // Go to edit mode for the new note
    } catch (error) {
      console.error("Error creating new note:", error);
      alert(`Failed to create note: ${error}`);
    }
  };

  // Handle selecting a note from the list
  const handleSelectNote = async (item: FileSystemNoteItem) => {
    try {
      const file = await item.handle.getFile();
      const content = await file.text();
      setSelectedNote({
        id: item.id, // Add id
        title: item.name,
        content: content,
        handle: item.handle, // Pass the handle
      });
      setPreviewMode("preview"); // Reset to preview mode when selecting a note
    } catch (error) {
      console.error("Error reading note file:", error);
    }
  };

  return (
    <div className="flex h-dvh bg-zinc-900">
      <SideNav<FileSystemNoteItem>
        title="Notes"
        placeholder="Notes from Folder" // Updated placeholder
        items={displayList}
        setItems={setDisplayList} // Keep for potential reordering/deletion later
        createNewItem={createNewNote}
        onItemSelect={handleSelectNote} // Use the implemented handler
        getDisplayName={(item) => item.name} // Display file name
      />

      <div className="flex flex-col w-full h-full p-8">
        {selectedNote ? (
          <NoteComponent
            previewMode={previewMode}
            setSelectedNote={setSelectedNote}
            setPreviewMode={setPreviewMode}
            selectedNote={selectedNote} // Pass the FileSystemNote object
            setDisplayList={setDisplayList} // Remove incorrect cast
            directoryHandle={directoryHandle} // Pass directory handle for saving
          />
        ) : (
          <div className="h-full p-8 flex flex-col justify-center items-center gap-5 text-center text-zinc-400">
            <H2 className="text-zinc-200">
              {directoryHandle ? "No file is open" : "No folder selected"}
            </H2>
            <p>
              {directoryHandle
                ? "Select a note from the list or create a new one."
                : "Click 'Load Notes Folder' to select a directory."}
            </p>
            {directoryHandle && ( // Only show create button if a directory is loaded
              <SecondaryBtn
                onClick={createNewNote}
                className="text-purple-400 hover:underline mt-4"
              >
                Create Note
              </SecondaryBtn>
            )}
            {!directoryHandle && (
              <ActionBtn
                onClick={loadNotesFromDirectory}
                className="mt-4 px-4 py-2 text-center text-sm"
              >
                Load Notes Folder
              </ActionBtn>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotePage;
