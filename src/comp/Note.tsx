import MDEditor, { type PreviewType } from "@uiw/react-md-editor";
import type { Dispatch, SetStateAction } from "react";

// Define the FileSystemNote types again for clarity within this component
// (Alternatively, import them from NotePage or a shared types file)
interface FileSystemNoteItem {
  id: string;
  name: string;
  handle: FileSystemFileHandle;
}

interface FileSystemNote {
  id: string;
  title: string;
  content: string;
  handle: FileSystemFileHandle;
}

interface Props {
  selectedNote: FileSystemNote;
  setSelectedNote: Dispatch<SetStateAction<FileSystemNote | null>>;
  setDisplayList: Dispatch<SetStateAction<FileSystemNoteItem[]>>; // Updated type
  previewMode: PreviewType;
  setPreviewMode: Dispatch<SetStateAction<PreviewType>>;
  directoryHandle: FileSystemDirectoryHandle | null; // Added directory handle
}

const Note = (props: Props) => {
  const handleSave = async () => {
    if (!props.selectedNote) return;

    try {
      // Get a writable stream
      const writable = await props.selectedNote.handle.createWritable();
      // Write the content
      await writable.write(props.selectedNote.content);
      // Close the file and write the contents to disk
      await writable.close();

      props.setPreviewMode("preview");
      // Optional: Add user feedback (e.g., toast notification)
      console.log("Note saved successfully!");

      // Update the title in the display list if it changed (though title editing isn't implemented here yet)
      // props.setDisplayList(prevList =>
      //   prevList.map(item =>
      //     item.id === props.selectedNote.id
      //       ? { ...item, name: props.selectedNote.title }
      //       : item
      //   )
      // );
    } catch (error) {
      console.error("Error saving note:", error);
      alert("An error occurred while saving the note.");
    }
  };

  const handleDelete = async () => {
    if (!props.selectedNote || !props.directoryHandle) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete "${props.selectedNote.title}"?`,
    );
    if (!confirmDelete) return;

    try {
      // Remove the file using the directory handle
      await props.directoryHandle.removeEntry(props.selectedNote.title); // Use title (filename)

      // Update the display list in the parent component
      props.setDisplayList((prevList) =>
        prevList.filter((item) => item.id !== props.selectedNote.id),
      );

      // Clear the selected note in the parent component
      props.setSelectedNote(null);

      // Optional: Add user feedback
      console.log("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("An error occurred while deleting the note.");
    }
  };

  // Title editing logic - updates the selectedNote state directly
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    // Basic validation: prevent empty title if needed, or handle renaming logic separately
    // For now, just update the state. Saving handles the file name persistence if implemented.
    props.setSelectedNote((prev) =>
      prev ? { ...prev, title: newTitle } : prev,
    );
    // Note: Renaming the file itself on title change requires more complex logic
    // using directoryHandle.move() which is not implemented here.
    // The current setup saves content to the existing file handle.
  };

  // Content editing logic - updates the selectedNote state directly
  const handleContentChange = (value: string | undefined) => {
    props.setSelectedNote((prev) =>
      prev ? { ...prev, content: value || "" } : prev,
    );
  };

  return (
    <div className="flex flex-col gap-5 h-full w-full">
      {/* Title Input - Use handleTitleChange */}
      <input
        type="text"
        placeholder="Enter Title Here..."
        className="text-4xl font-semibold text-zinc-100 bg-transparent border-b border-zinc-700 focus:outline-none focus:border-purple-500 p-2" // Added some styling
        value={props.selectedNote.title || ""}
        onChange={handleTitleChange} // Use the new handler
        // Consider adding readOnly={props.previewMode === 'preview'} if title shouldn't be editable in preview
      />

      {/* MDEditor - Use handleContentChange */}
      <MDEditor
        value={props.selectedNote.content || ""}
        height="80%"
        minHeight={300}
        preview={props.previewMode}
        onChange={handleContentChange} // Use the new handler
        // Added data-color-mode to ensure dark theme
        data-color-mode="dark"
        style={{
          // Use existing styles or adjust as needed
          backgroundColor: "oklch(26.9% 0 0)", // Example dark background
          borderRadius: "8px",
          flexGrow: 1, // Allow editor to fill space
        }}
        previewOptions={{
          style: {
            backgroundColor: "oklch(26.9% 0 0)",
            color: "white",
          },
        }}
        // Make editor read-only in preview mode
        textareaProps={{
          readOnly: props.previewMode === "preview",
          onClick: () => {
            if (props.previewMode === "preview") props.setPreviewMode("edit");
          },
        }}
      />
      {/* Buttons Container */}
      <div className="flex justify-end gap-2 mt-4">
        {/* Edit/Preview Toggle Button */}
        <button
          type="button"
          onClick={() =>
            props.setPreviewMode(
              props.previewMode === "edit" ? "preview" : "edit",
            )
          }
          className="px-3 py-1 rounded bg-zinc-600 hover:bg-zinc-500 text-white text-sm"
        >
          {props.previewMode === "edit" ? "Preview" : "Edit"}
        </button>

        {/* Save Button - Enabled only in edit mode */}
        {props.previewMode === "edit" && (
          <button
            type="button"
            className={`px-3 py-1 rounded text-sm text-white ${
              !props.selectedNote.content || !props.selectedNote.title // Basic validation
                ? "bg-neutral-700 text-zinc-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
            onClick={handleSave}
            disabled={!props.selectedNote.content || !props.selectedNote.title}
          >
            <span className="icon-[mdi--content-save] h-4 w-4 mr-1 align-middle" />
            Save
          </button>
        )}

        {/* Delete Button */}
        <button
          type="button"
          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
          onClick={handleDelete}
          // disabled={!props.selectedNote.id} // Should always have an ID if selected
        >
          <span className="icon-[mdi--delete] h-4 w-4 mr-1 align-middle" />
          Delete
        </button>
      </div>
    </div>
  );
};
export default Note;
