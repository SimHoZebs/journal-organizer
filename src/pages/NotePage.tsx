import { type PreviewType } from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import SideNav from "../components/SideNav.tsx";

//icons
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import closeErrorDialog from "../assets/icons/Xmark.svg";
import notesPage from "../assets/icons/notes-page-icon.svg";
import relationshipIcon from "../assets/icons/people-relationship-icon.svg";
import searchNote from "../utils/searchNote.ts";
import NoteComponent from "../components/Note.tsx";
import { Note } from "../utils/notes.ts";

const NotePage = () => {
  const [displayList, setDisplayList] = useState<Note[]>([]);
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(true);
  const [previewMode, setPreviewMode] = useState<PreviewType>("preview");
  const [selectedNote, setSelectedNote] = useState<Note>({
    title: "",
    content: "",
    id: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  // Handle search functionality
  const handleSearch = async (query: string) => {
    try {
      const results = await searchNote(query);
      setDisplayList(results || []);
    } catch (error) {
      console.error("Error searching notes:", error);
      setErrorMessage("Failed to search notes");
    }
  };

  // Navigation links for SideNav
  const navLinks = [
    {
      to: "/notes",
      icon: notesPage,
      altText: "Notes Page Icon",
      isActive: true,
    },
    {
      to: "/relationships",
      icon: relationshipIcon,
      altText: "People Relationships Icon",
      isActive: false,
    },
  ];

  //return the components created
  return (
    <div className="flex h-dvh overflow-hidden relative">
      {sideNavOpen && (
        <SideNav<Note>
          title="Notes"
          placeholder="Search Note"
          items={displayList}
          setItems={setDisplayList}
          onSearch={handleSearch}
          createNewItem={createNewNote}
          onItemSelect={getSelectedNote}
          closeNav={setSideNavOpen}
          setErrorMessage={setErrorMessage}
          navLinks={navLinks}
          addButtonIcon={addNoteIcon}
          getDisplayName={(item) => item.title}
        />
      )}

      {errorMessage && (
        <div className="z-50 absolute bottom-4 right-4 bg-amber-700 px-5 py-2 rounded-lg flex items-center justify-between gap-4">
          <span className="text-neutral-50">{errorMessage}</span>
          <button
            type="button"
            className="hover:bg-amber-500 rounded-md cursor-pointer p-1"
            onClick={() => setErrorMessage("")}
          >
            <img
              src={closeErrorDialog}
              alt="Close Error Dialog Icon"
              className="w-5 h-5 invert brightness-0"
            />
          </button>
        </div>
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

        {selectedNote ? (
          <NoteComponent
            previewMode={previewMode}
            createNote={createNewNote}
            sideNavOpen={sideNavOpen}
            setSelectedNote={setSelectedNote}
            setPreviewMode={setPreviewMode}
            setDisplayList={setDisplayList}
          />
        ) : (
          <div className="h-full p-8 flex flex-col justify-center items-center gap-5 text-center" />
        )}
      </div>
    </div>
  );
};

export default NotePage;
