import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import notesPage from "../assets/icons/notes-page-icon.svg";
import relationshipIcon from "../assets/icons/people-relationship-icon.svg";
import contactIcon from "../assets/icons/contact-icon.svg";
import logoutIcon from "../assets/icons/logout-icon.svg";
import addNoteIcon from "../assets/icons/add-new-note-icon.svg";

type Props = {
  page: string; // Identifies the current page ("Notes" or "Summary")
  closeNav: React.Dispatch<React.SetStateAction<boolean>>;
  getSelectedItem: (id: number) => void; // A function to handle selecting an item from the list.
  displayList: { id: string; name: string }[]; // Shared display list
  setDisplayList: React.Dispatch<
    React.SetStateAction<{ id: string; name: string }[]>
  >;
};

const SideNav: React.FC<Props> = ({
  page,
  closeNav,
  getSelectedItem,
  displayList,
  setDisplayList,
}) => {
  const [search, setSearch] = useState<string>(""); // Search Input
  /*const [displayList, setDisplayList] = useState<
    { name: string; id: string }[]
  >([]);*/ // List of Notes/Relationships to display in SideNav
  const [selectedId, setSelectedId] = useState<string | null>(null); // Store ID of Notes/Relationships
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false); // User Dropdown State
  const userDropdown = useRef<HTMLDivElement>(null); // User Dropdown Ref
  const navModal = useRef<HTMLDivElement>(null); // Nav Black Part

  const userID = localStorage.getItem("userId");

  const viewJournal = async (id: string) => {
    if (userID === null) {
      console.error("User ID is not available in local storage.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/journal/read-notebook/${id}`,
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

      localStorage.setItem("journalTitle", data.notebook.title);
      localStorage.setItem("journalContent", data.notebook.content);
      localStorage.setItem("notebookId", data.notebook._id);

      console.log(data.message);
      console.log(data.notebook);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching the journals.");
    }
    //getAllJournals();
  };

  const searchJournal = async (query: string) => {
    if (!userID) {
      console.error("User ID is missing.");
      return;
    }

    try {
      let response;

      if (query.trim() === "") {
        // If the search query is empty, fetch all journals
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/journal/all/${userID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      } else {
        // Otherwise, perform a search
        response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/journal/search?userId=${userID}&query=${encodeURIComponent(query)}`,
          {
            method: "GET",
          },
        );
      }

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }

      const data = await response.json();
      setDisplayList(
        data.notebooks.map((notebook: { _id: string; title: string }) => ({
          id: notebook._id,
          name: notebook.title,
        })),
      );
      console.log(data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching the journals.");
    }
  };

  useEffect(() => {
    searchJournal("");
  }, []);

  useEffect(() => {
    const removeUserDropdown = (event: MouseEvent): void => {
      if (!userDropdown.current?.contains(event.target as Node)) {
        if (event.target !== navModal.current) {
          event.stopPropagation();
        }
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener("click", removeUserDropdown, true);
    }

    return () => {
      document.removeEventListener("click", removeUserDropdown, true);
    };
  }, [userDropdownOpen]);

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
      ></div>
      <div className="shrink-0 border-r z-20 absolute top-0 left-0 w-[300px] h-dvh overflow-hidden flex flex-col bg-white sm:static">
        {/* Top Nav */}
        <div className="flex items-center justify-between py-2 pl-2 pr-2.5 border-b">
          <button
            className="p-1 rounded-lg hover:bg-gray-200 cursor-pointer"
            onClick={() => closeNav(false)}
          >
            <img
              className="w-[25px] h-[25px]"
              src={closeSideNav}
              alt="Close Side Nav Icon"
            />
          </button>

          <div className="flex items-center justify-between gap-3">
            {page === "Notes" && (
              <button
                className={`p-1.5 rounded-lg cursor-pointer ${"hover:bg-gray-200"}`}
                onClick={() => getSelectedItem(-1)}
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
                className={`p-1.5 rounded-lg cursor-pointer ${
                  page === "Notes" ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
              >
                <img
                  className="w-[25px] h-[25px]"
                  src={notesPage}
                  alt="Notes Page Icon"
                />
              </button>
            </Link>
            <Link to="/relationships">
              <button
                className={`p-1.5 rounded-lg cursor-pointer ${
                  page === "Relationships" ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
              >
                <img
                  className="w-[25px] h-[25px]"
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
            className="px-2.5 py-1 rounded-lg border-[0.5px] mx-5"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              searchJournal(event.target.value);
            }}
            placeholder={"Search Note"}
          />

          <div className="grow flex flex-col gap-1 overflow-auto mx-3.5">
            {displayList.map((item, index) => (
              <button
                key={index}
                className={`text-left px-4 py-2 rounded-xl truncate shrink-0 ${
                  selectedId === item.id ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
                onClick={async () => {
                  await viewJournal(item.id);
                  const updatedNotebookId = localStorage.getItem("notebookId");
                  setSelectedId(updatedNotebookId);
                  getSelectedItem(1);

                  if (window.innerWidth < 640) {
                    closeNav(false);
                  }
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="relative">
          {userDropdownOpen && (
            <div
              ref={userDropdown}
              className="z-10 w-[calc(100%-16px)] absolute left-1/2 -translate-x-1/2 bottom-full mb-2 rounded-xl border-[0.5px] flex flex-col bg-gray-200"
            >
              <Link to="/user-profile">
                <button className="w-full flex border-b items-center gap-2 py-2.5 px-5 hover:bg-gray-300 rounded-tl-xl rounded-tr-xl cursor-pointer">
                  <img
                    className="w-[20px] h-[20px]"
                    src={contactIcon}
                    alt="User Profile Icon"
                  />
                  <span className="whitespace-nowrap">User Profile</span>
                </button>
              </Link>
              <button className="w-full flex items-center gap-2 py-2.5 px-5 hover:bg-gray-300 rounded-bl-xl rounded-br-xl cursor-pointer">
                <img
                  className="w-[20px] h-[20x]"
                  src={logoutIcon}
                  alt="Logout Icon"
                />
                <span className="whitespace-nowrap">Logout</span>
              </button>
            </div>
          )}

          <button
            className="flex items-center border-t py-2.5 px-5 gap-3 cursor-pointer w-full"
            onClick={() => {
              setUserDropdownOpen(true);
            }}
          >
            <img
              className="w-[32px] h-[32px] p-0.5 rounded-full border-[1.5px]"
              src={contactIcon}
              alt="User Contact Icon"
            />
            <span className="text-lg truncate">
              User Name That is extremely long yep. It is long.
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideNav;
