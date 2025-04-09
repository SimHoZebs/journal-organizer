import React, { useRef, useState } from "react";
import { Link } from "react-router";
import addNoteIcon from "../assets/icons/add-new-note-icon.svg";
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import notesPage from "../assets/icons/notes-page-icon.svg";
import relationshipIcon from "../assets/icons/people-relationship-icon.svg";
import searchNote from "../utils/searchNote"; // Function to search note entries

type Props = {
  page: string; // Identifies the current page ("Notes" or "profile")
  closeNav: React.Dispatch<React.SetStateAction<boolean>>;
  createNewNote: () => void; // A function to create a new note.
  getSelectedNote: (id: string) => void; // A function to handle selecting an item from the list.
  displayList: { id: string; title: string }[]; // List of notes to display in the side navigation.
  setDisplayList: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        title: string;
      }[]
    >
  >;
};

const SideNav = ({
  page,
  closeNav,
  getSelectedNote,
  createNewNote,
  displayList,
  setDisplayList,
}: Props) => {
  const [search, setSearch] = useState<string>(""); // Search Input
  const [selectedId, setSelectedId] = useState<string | null>(null); // Store ID of selected note
  const navModal = useRef<HTMLDivElement>(null); // Nav Black Part

  return (
    <>
      <div
        ref={navModal}
        className="z-10 absolute top-0 left-0 w-dvw opacity-75 h-dvh sm:hidden bg-black"
        onKeyDown={(event) => {
          if (event.target === event.currentTarget) {
            closeNav(false);
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeNav(false);
          }
        }}
      />
      <div className="shrink-0 border-r border-neutral-50 z-20 absolute top-0 left-0 w-[300px] h-dvh overflow-hidden flex flex-col bg-neutral-800 sm:static">
        {/* Top Nav */}
        <div className="flex items-center justify-between py-2 pl-2 pr-2.5 border-b border-neutral-50">
          <button
            type="button"
            className="p-1 rounded-lg hover:bg-neutral-600 cursor-pointer"
            onClick={() => closeNav(false)}
          >
            <img
              className="w-[25px] h-[25px] invert brightness-0"
              src={closeSideNav}
              alt="Close Side Nav Icon"
            />
          </button>

          <div className="flex items-center justify-between gap-3">
            {page === "Notes" && (
              <button
                type="button"
                className={`p-1.5 rounded-lg cursor-pointer hover:bg-neutral-600  ${"hover:bg-gray-200"}`}
                onClick={() => createNewNote()}
              >
                <img
                  className="w-[25px] h-[25px]"
                  src={addNoteIcon}
                  alt="Add New Note Icon"
                />
              </button>
            )}
            <Link to="/notes">
              <button
                type="button"
                className="p-1.5 rounded-lg cursor-pointer bg-neutral-500"
              >
                <img
                  className="w-[25px] h-[25px] invert brightness-0"
                  src={notesPage}
                  alt="Notes Page Icon"
                />
              </button>
            </Link>
            <Link to="/relationships">
              <button
                type="button"
                className="p-1.5 rounded-lg cursor-pointer hover:bg-neutral-600"
              >
                <img
                  className="w-[25px] h-[25px] invert brightness-0"
                  src={relationshipIcon}
                  alt="People Relationships Icon"
                />
              </button>
            </Link>
          </div>
        </div>

        {/* Search and Display List */}
        <div className="grow flex flex-col pt-4 pb-3.5 gap-3.5 overflow-hidden">
          <input
            className="px-2.5 py-1 rounded-lg border-[0.5px] border-neutral-50 mx-5 text-neutral-50"
            value={search}
            onChange={async (event) => {
              setSearch(event.target.value);
              const searchResults = await searchNote(event.target.value);
              setDisplayList(searchResults || []);
            }}
            placeholder={"Search Note"}
          />

          <div className="grow flex flex-col gap-1 overflow-auto mx-3.5">
            {displayList.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`text-left px-4 py-2 rounded-xl truncate shrink-0 text-neutral-50 ${
                  selectedId === item.id
                    ? "bg-neutral-500"
                    : "hover:bg-neutral-600"
                }`}
                onClick={async () => {
                  getSelectedNote(item.id);
                  setSelectedId(item.id);
                  if (window.innerWidth < 640) {
                    closeNav(false);
                  }
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;
