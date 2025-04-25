import MDEditor, { type PreviewType } from "@uiw/react-md-editor";
import DeleteNoteIcon from "../assets/icons/delete-note-icon.svg";
import SaveNoteIcon from "../assets/icons/save-note-icon.svg";
import searchNote from "../utils/searchNote.ts";
import {
  createNote,
  deleteNote,
  type Note as NoteType,
  type NoteListItem,
  updateNote,
} from "../utils/notes.ts";

interface Props {
  sideNavOpen: boolean;
  setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNote: NoteType;
  setSelectedNote: React.Dispatch<React.SetStateAction<NoteType>>;
  setDisplayList: React.Dispatch<React.SetStateAction<NoteListItem[]>>;
  previewMode: PreviewType;
  setPreviewMode: React.Dispatch<React.SetStateAction<PreviewType>>;
  createNewNote: () => void;
}

const Note = (props: Props) => {
  const refreshNavBar = async () => {
    const result = await searchNote("");
    console.log("searchNote result", result);
    props.setDisplayList(result || []);
  };

  const handleSave = async () => {
    try {
      const note =
        props.selectedNote.id === ""
          ? await createNote({
              title: props.selectedNote.title,
              content: props.selectedNote.content,
            })
          : await updateNote(props.selectedNote);

      props.setSelectedNote((prev) => ({ ...prev, ...note }));
      props.setPreviewMode("preview");
      await refreshNavBar();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the note.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(props.selectedNote.id);
      props.createNewNote();
      await refreshNavBar();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the note.");
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full w-full">
      <input
        type="text"
        placeholder="Enter Title Here..."
        className="text-4xl font-semibold text-zinc-100"
        value={props.selectedNote.title || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          props.setSelectedNote((prev) =>
            prev ? { ...prev, title: e.target.value } : prev,
          );
        }}
      />

      <MDEditor
        value={props.selectedNote.content || ""}
        height="80%"
        minHeight={300}
        preview={props.previewMode}
        onClick={() => {
          props.setPreviewMode("edit");
        }}
        onChange={(value) => {
          props.setSelectedNote((prev) =>
            prev ? { ...prev, content: value || "" } : prev,
          );
        }}
        style={{
          backgroundColor: "oklch(26.9% 0 0)",
          color: "white",
          borderRadius: "8px",
        }}
        previewOptions={{
          style: {
            backgroundColor: "oklch(26.9% 0 0)",
            color: "white",
          },
        }}
      />
      <div className="relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            className={`p-1 rounded-lg cursor-pointer ${
              !props.selectedNote.content || !props.selectedNote.title
                ? "opacity-30 cursor-not-allowed bg-neutral-700 text-zinc-400"
                : "hover:bg-zinc-500"
            }`}
            onClick={handleSave}
            disabled={
              props.selectedNote?.title === "" ||
              props.selectedNote?.content === ""
            }
          >
            <img
              src={SaveNoteIcon}
              alt="Save Icon"
              className="w-[40px] h-[35px] invert brightness-0"
            />
          </button>

          <button
            type="button"
            className={`p-1 rounded-lg cursor-pointer ${
              !props.selectedNote.content || !props.selectedNote.title
                ? "opacity-30 cursor-not-allowed bg-zinc-700 text-zinc-400"
                : "hover:bg-neutral-500"
            }`}
            onClick={handleDelete}
            disabled={
              props.selectedNote?.title === "" ||
              props.selectedNote?.content === ""
            }
          >
            <img
              src={DeleteNoteIcon}
              alt="Delete Icon"
              className="w-[35px] h-[35px] invert brightness-0"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Note;
