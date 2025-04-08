import MDEditor, { type PreviewType } from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import SideNav from "../components/SideNavNote";

//icons
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import DeleteNoteIcon from "../assets/icons/delete-note-icon.svg";
import SaveNoteIcon from "../assets/icons/save-note-icon.svg";
import searchNote from "../utils/searchNote";

const Notes = () => {
  const [displayList, setDisplayList] = useState<
    { id: string; title: string }[]
  >([]);
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(true);
  const [previewMode, setPreviewMode] = useState<PreviewType>("preview");
  const [selectedNote, setSelectedNote] = useState<{
    title: string;
    content: string;
    id: string;
  }>({
    title: "",
    content: "",
    id: "",
  });

  //function to retrieve the selected note
  const getSelectedNote = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/note/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }
      const data = await response.json();
      console.log(data.message);
      console.log(data.note);

      setSelectedNote(data.note);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching the notes.");
    }
  };

  const refreshNavBar = async () => {
    const result = await searchNote("");
    console.log("searchNote result", result);
    setDisplayList(result || []);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const result = await searchNote("");
      console.log("searchNote result", result);
      setDisplayList(result || []);
    };
    
    //display a new note when the page loads
    createNewNote();
    fetchNotes();
    if (selectedNote.content === "") {
      setPreviewMode("edit");
    }
  }, [selectedNote.content]);

  const createNewNote = () => {
    setSelectedNote({
      title: "Untitled Note",
      content: "",
      id: "",
    });
  };

  //HANDLE SAVE----------------------------------------------------------------
  const createNote = async () => {
    try {
      console.log("Creating note...");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/note/create-note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: selectedNote.title,
            content: selectedNote.content,
          }),
        },
      );
      console.log("second base");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }

      const data = await response.json();

      console.log(data.message);
      console.log(data.note);

      return data.note;
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the note.");
    }
  };

  //HANDLE UPDATE--------------------------------------------------------------------------
  const updateNote = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/note/update-note/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: selectedNote.title,
            content: selectedNote.content,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }
      const data = await response.json();
      console.log(data.message);
      console.log(data.note);

      return data.note;
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred while saving the note. Error: ${error}`);
    }
  };

  //HANDLE DELETE---------------------------------------------------------------------------
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/note/delete-note/${selectedNote.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the note.");
    }
  };

  //return the components created
  return (
    <div className="flex h-dvh overflow-hidden relative">
      {sideNavOpen && (
        <SideNav
          displayList={displayList}
          createNewNote={createNewNote}
          getSelectedNote={getSelectedNote}
          page="Notes"
          closeNav={setSideNavOpen}
          setDisplayList={setDisplayList}
        />
      )}

      <div
        className={`flex flex-col w-full h-full sm:overflow-y-auto bg-neutral-700 ${
          sideNavOpen && "overflow-y-hidden"
        }`}
      >
        <div
          className={`px-2.5 py-2.5 flex items-center border-b bg-neutral-800 border-neutral-300 ${
            sideNavOpen && "sm:hidden"
          }`}
        >
          <button
            type="button"
            className="p-1 rounded-lg hover:bg-neutral-600 cursor-pointer"
            onClick={() => setSideNavOpen(true)}
          >
            <img
              className="w-[25px] h-[25px] rotate-180 invert brightness-0"
              src={closeSideNav}
              alt="Open Navbar Icon"
            />
          </button>
          <span className="grow text-center ml-[-33px] font-semibold text-lg text-neutral-50">
            Notes
          </span>
        </div>

        {selectedNote
          ? (
            <div
              className={`px-8 ${
                sideNavOpen
                  ? "sm:px-10 sm:py-8"
                  : "sm:px-14 sm:py-12"} md:px-14 py-8 md:py-12 flex flex-col gap-5 max-w-4xl mx-auto h-full w-full`}
            >
              <input
                type="text"
                placeholder="Enter Title Here..."
                className="text-4xl font-semibold font-montserrat text-neutral-50"
                value={selectedNote.title || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSelectedNote((prev) =>
                    prev ? { ...prev, title: e.target.value } : prev
                  );
                }}
              />

              <MDEditor
                value={selectedNote.content || ""}
                height="80%"
                minHeight={300}
                preview={previewMode}
                onClick={() => {
                  setPreviewMode("edit");
                }}
                onChange={(value) => {
                  setSelectedNote((prev) =>
                    prev ? { ...prev, content: value || "" } : prev
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
                      !selectedNote.content || !selectedNote.title
                        ? "opacity-30 cursor-not-allowed bg-neutral-700 text-neutral-400"
                        : "hover:bg-neutral-500"
                    }`}
                    onClick={async () => {
                      const note = selectedNote.id === ""
                        ? await createNote()
                        : await updateNote();

                      setSelectedNote((prev) =>
                        prev
                          ? {
                            ...prev,
                            ...note,
                          }
                          : prev
                      );
                      setPreviewMode("preview");
                      await refreshNavBar();
                    }}
                    disabled={
                      selectedNote?.title === "" || selectedNote?.content === ""
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
                      !selectedNote.content || !selectedNote.title
                        ? "opacity-30 cursor-not-allowed bg-neutral-700 text-neutral-400"
                        : "hover:bg-neutral-500"
                    }`}
                    onClick={async () => {
                      await handleDelete();
                      createNewNote();
                      await refreshNavBar();
                    }}
                    disabled={
                      selectedNote?.title === "" || selectedNote?.content === ""
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
          )
          : (
            <div className="h-full p-8 flex flex-col justify-center items-center gap-5 text-center" />
          )}
      </div>
    </div>
  );
};

export default Notes;
