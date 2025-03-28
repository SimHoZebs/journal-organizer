import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import notesPage from "../assets/icons/notes-page-icon.svg";
import relationshipIcon from "../assets/icons/people-relationship-icon.svg";
import contactIcon from "../assets/icons/contact-icon.svg";
import logoutIcon from "../assets/icons/logout-icon.svg";
import addNoteIcon from "../assets/icons/add-new-note-icon.svg";

type Props = {
  //defines the expected props
  page: string; //Identifies the current page ("Notes" or "Summary")
  closeNav: React.Dispatch<React.SetStateAction<boolean>>;
  getSelectedItem: (id: number) => void; // A function to handle selecting an item from the list.
};

const SideNav: React.FC<Props> = ({
  page, // Page Name (Notes or Relationships)
  closeNav, // Close the SideNav
  getSelectedItem, // Get the selectedItem to display
}) => {
  const [search, setSearch] = useState<string>(""); // Search Input
  const [displayList, setDisplayList] = useState<
    { name: string; id: number; [key: string]: string | number | boolean }[]
  >([]); // List of Notes/Relationships to display in SideNav
  const [selectedId, setSelectedId] = useState<number | null>(null); // Store ID of Notes/Relationships
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false); // User Dropdown State
  const userDropdown = useRef<HTMLDivElement>(null); // User Dropdown Ref
  const navModal = useRef<HTMLDivElement>(null); // Nav Black Part

  // Use Effect to put mock data into displayList
  useEffect(() => {
    setDisplayList([
      {
        name: "Cookies",
        id: 1,
        summary: "This is a summary of person 1",
      },
      {
        name: "Richard Leindecker",
        id: 2,
        summary: "This is a summary of person 2",
      },
      {
        name: "Person 3 has a long name. Like extremely long name",
        id: 3,
        summary: "This is a summary of person 3",
      },
      {
        name: "TheChosenOne",
        id: 4,
        summary: "This is a summary of person 4",
      },
      {
        name: "TheChosenOne",
        id: 5,
        summary: "This is a summary of person 4",
      },
      {
        name: "TheChosenOne",
        id: 6,
        summary: "This is a summary of person 4",
      },
      {
        name: "TheChosenOne",
        id: 7,
        summary: "This is a summary of person 4",
      },
      {
        name: "TheChosenOne",
        id: 8,
        summary: "This is a summary of person 4",
      },
      {
        name: "TheChosenOne",
        id: 9,
        summary: "This is a summary of person 4",
      },
      {
        name: "TheChosenOne",
        id: 10,
        summary: "This is a summary of person 4",
      },
      {
        name: "TheChosenOne",
        id: 11,
        summary: "This is a summary of person 4",
      },
      {
        name: "TheChosenOne",
        id: 12,
        summary: "This is a summary of person 4",
      },
    ]);
  }, []);

  // Use Effect to close User Dropdown if clicked outside of the dropdown
  useEffect(() => {
    const removeUserDropdown = (event: MouseEvent): void => {
      // Check if clicked outside of the dropdown
      if (!userDropdown.current?.contains(event.target as Node)) {
        if (event.target !== navModal.current) {
          event.stopPropagation(); // Prevent the open dropdown button event from running
        }
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener("click", removeUserDropdown, true);
    }

    // Cleanup the event listener
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
          {/* Close Navbar Butotn */}
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

          {/* Page Navigation */}
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
          {/* Search Bar */}
          <input
            className="px-2.5 py-1 rounded-lg border-[0.5px] mx-5"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder={"Search " + page}
          />

          {/* Display List */}
          <div className="grow flex flex-col gap-1 overflow-auto mx-3.5">
            {displayList.map((item, index) => (
              <button
                key={index}
                className={`text-left px-4 py-2 rounded-xl truncate shrink-0 ${
                  selectedId === item.id ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setSelectedId(item.id);
                  getSelectedItem(item.id);
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
          {/* User Dropdown */}
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
                  <span className="whitespace-nowrap">User Profileeee</span>
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

          {/* User Profile Button */}
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
