import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import addNoteIcon from "../assets/icons/add-new-note-icon.svg";
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import notesPage from "../assets/icons/notes-page-icon.svg";
import relationshipIcon from "../assets/icons/people-relationship-icon.svg";
import searchNote from "../utils/searchNote";

type BaseItem = {
  id: string;
  [key: string]: unknown;
};

type NoteItem = BaseItem & {
  title: string;
};

type ProfileItem = BaseItem & {
  profileTitle: string;
  profileContent?: string;
};

type SideNavProps = {
  type: "notes" | "relationships";
  closeNav: React.Dispatch<React.SetStateAction<boolean>>;
  createNewItem?: () => void; // Optional function for creating new notes
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>;
  onItemSelect: (id: string) => void; // Generic function for selecting an item
  externalDisplayList?: NoteItem[] | ProfileItem[]; // Optional external list to display
  setExternalDisplayList?: React.Dispatch<React.SetStateAction<NoteItem[] | ProfileItem[]>>;
};

const SideNav: React.FC<SideNavProps> = ({
  type,
  closeNav,
  createNewItem,
  onItemSelect,
  setErrorMessage,
  externalDisplayList,
  setExternalDisplayList,
}) => {
  const [search, setSearch] = useState<string>(""); // Search Input
  const [displayList, setDisplayList] = useState<(NoteItem | ProfileItem)[]>(
    externalDisplayList || []
  ); // List of items to display
  const [selectedId, setSelectedId] = useState<string | null>(null); // Store ID of selected item
  const navModal = useRef<HTMLDivElement>(null); // Nav Black Part

  // Handle search based on type
  const handleSearch = async (query: string) => {
    if (type === "notes" && setExternalDisplayList) {
      // For notes, use the searchNote utility
      try {
        const results = await searchNote(query);
        setExternalDisplayList(results || []);
      } catch (error) {
        console.error("Error searching notes:", error);
        if (setErrorMessage) {
          setErrorMessage("Failed to search notes");
        }
      }
    } else if (type === "relationships") {
      // For relationships, use the API endpoint
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/search?query=${
            encodeURIComponent(query)
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(
            errorMessage.error || "Unexpected error while searching for profiles"
          );
        }

        const responseData = await response.json();
        console.log(responseData.message);
        setDisplayList(responseData.profiles);
      } catch (error) {
        if (setErrorMessage) {
          setErrorMessage(
            error instanceof Error
              ? `Failed to search profiles: ${error.message}`
              : "An error occurred while searching profiles"
          );
        }
        console.error(error);
      }
    }
  };

  // Load initial data
  useEffect(() => {
    if (externalDisplayList) {
      setDisplayList(externalDisplayList);
    } else {
      handleSearch("");
    }
  }, [externalDisplayList, type]);

  // Item selection handling
  const handleItemSelect = (id: string) => {
    setSelectedId(id);
    onItemSelect(id);
    if (window.innerWidth < 640) {
      closeNav(false);
    }
  };

  // Get display name for an item based on type
  const getItemDisplayName = (item: NoteItem | ProfileItem): string => {
    if (type === "notes" && "title" in item) {
      return item.title;
    } else if (type === "relationships" && "profileTitle" in item) {
      return item.profileTitle;
    }
    return "Untitled";
  };

  return (
    <>
      <div
        ref={navModal}
        className="z-10 absolute top-0 left-0 w-dvw opacity-75 h-dvh sm:hidden bg-black"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeNav(false);
          }
        }}
      />
      <div className="shrink-0 border-r border-neutral-50 z-20 absolute top-0 left-0 w-[300px] h-dvh overflow-hidden flex flex-col bg-neutral-800 sm:static">
        {/* Top Nav */}
        <div className="flex items-center justify-between py-2 pl-2 pr-2.5 border-b border-neutral-50">
          {/* Close Navbar Button */}
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

          {/* Page Navigation */}
          <div className="flex items-center justify-between gap-3">
            {type === "notes" && createNewItem && (
              <button
                type="button"
                className="p-1.5 rounded-lg cursor-pointer hover:bg-neutral-600"
                onClick={createNewItem}
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
                className={`p-1.5 rounded-lg cursor-pointer ${
                  type === "notes" ? "bg-neutral-500" : "hover:bg-neutral-600"
                }`}
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
                className={`p-1.5 rounded-lg cursor-pointer ${
                  type === "relationships" ? "bg-neutral-500" : "hover:bg-neutral-600"
                }`}
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
          {/* Search Bar */}
          <input
            className="px-2.5 py-1 rounded-lg border-[0.5px] border-neutral-50 mx-5 text-neutral-50"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              handleSearch(event.target.value);
            }}
            placeholder={type === "notes" ? "Search Note" : "Search Profile"}
          />

          {/* Display List */}
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
                onClick={() => handleItemSelect(item.id)}
              >
                {getItemDisplayName(item)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;