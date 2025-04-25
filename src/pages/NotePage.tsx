import type { PreviewType } from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import SideNav from "../components/SideNav.tsx";

//icons
import notesPage from "../assets/icons/notes-page-icon.svg";
import relationshipIcon from "../assets/icons/people-relationship-icon.svg";
import searchNote from "../utils/searchNote.ts";
import NoteComponent from "../components/Note.tsx";
import type { Note } from "../utils/notes.ts";

const NotePage = () => {
  const [displayList, setDisplayList] = useState<Note[]>([]);
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(true);
  const [previewMode, setPreviewMode] = useState<PreviewType>("preview");
  const [selectedNote, setSelectedNote] = useState<Note>({
    title: "",
    content: "",
    id: "",
  });

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

  const getselectedNote = (id: string) => {};
  const addNoteIcon = "";

  //return the components created
  return (
    <div className="flex h-dvh bg-zinc-900">
      {sideNavOpen && (
        <SideNav<Note>
          title="Notes"
          placeholder="Search Note"
          items={displayList}
          setItems={setDisplayList}
          onSearch={handleSearch}
          createNewItem={createNewNote}
          onItemSelect={getselectedNote}
          closeNav={setSideNavOpen}
          navLinks={navLinks}
          addButtonIcon={addNoteIcon}
          getDisplayName={(item) => item.title}
        />
      )}

      <div className="flex flex-col w-full h-full p-8">
        {selectedNote ? (
          <NoteComponent
            previewMode={previewMode}
            createNote={createNewNote}
            sideNavOpen={sideNavOpen}
            setSelectedNote={setSelectedNote}
            setPreviewMode={setPreviewMode}
            selectedNote={selectedNote}
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
