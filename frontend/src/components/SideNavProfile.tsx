import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import notesPage from "../assets/icons/notes-page-icon.svg";
import relationshipIcon from "../assets/icons/people-relationship-icon.svg";
import contactIcon from "../assets/icons/contact-icon.svg";
import logoutIcon from "../assets/icons/logout-icon.svg";

type Props = {
  closeNav: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string;
  userId: string; // User ID to fetch profiles
  setSelectedRelationship: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string | number | boolean;
      profileTitle: string;
      _id: number;
    } | null>
  >; // Function to set the selected relationship
};

const SideNav: React.FC<Props> = ({
  closeNav, // Close the SideNav
  userName,
  userId,
  setSelectedRelationship,
}) => {
  const [search, setSearch] = useState<string>(""); // Search Input
  const [displayList, setDisplayList] = useState<
    {
      profileTitle: string;
      _id: number;
      [key: string]: string | number | boolean;
    }[]
  >([]); // List of Notes/Relationships to display in SideNav
  const [selectedId, setSelectedId] = useState<number | null>(null); // Store ID of Notes/Relationships
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false); // User Dropdown State
  const userDropdown = useRef<HTMLDivElement>(null); // User Dropdown Ref
  const navModal = useRef<HTMLDivElement>(null); // Nav Black Part
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const searchProfiles = async (query: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/profile/search?userId=${userId}&query=${encodeURIComponent(query)}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(
          errorMessage.error || "Unexpected error while searching for profiles",
        );
      }

      const responseData = await response.json();
      console.log(responseData.message);
      setDisplayList(responseData.profiles);
    } catch (error) {
      console.error(error);
    }
  };

  const getSelectedRelationship = async (profileId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/${userId}/${profileId}`,
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(
          errorMessage.error || "Unexpected error while retrieving profile",
        );
      }

      const responseData = await response.json();
      console.log(responseData.message);

      setSelectedRelationship(responseData.profile);
    } catch (error) {
      console.error(error);
    }
  };

  // Use Effect to put mock data into displayList
  useEffect(() => {
    searchProfiles("");
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
            <Link to="/notes">
              <button className="p-1.5 rounded-lg cursor-pointer hover:bg-gray-200">
                <img
                  className="w-[25px] h-[25px]"
                  src={notesPage}
                  alt="Notes Page Icon"
                />
              </button>
            </Link>
            <Link to="/relationships">
              <button className="p-1.5 rounded-lg cursor-pointer bg-gray-300">
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
              searchProfiles(event.target.value);
            }}
            placeholder={"Search Profile"}
          />

          {/* Display List */}
          <div className="grow flex flex-col gap-1 overflow-auto mx-3.5">
            {displayList.map((item, index) => (
              <button
                key={index}
                className={`text-left px-4 py-2 rounded-xl truncate shrink-0 ${
                  selectedId === item._id ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setSelectedId(item._id);
                  getSelectedRelationship(item._id);
                  if (window.innerWidth < 640) {
                    closeNav(false);
                  }
                }}
              >
                {item.profileTitle}
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
              <button
                className="w-full flex items-center gap-2 py-2.5 px-5 hover:bg-gray-300 rounded-bl-xl rounded-br-xl cursor-pointer"
                onClick={handleLogout}
              >
                <img
                  className="w-[20px] h-[20px]"
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
            <span className="text-lg truncate">{userName}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideNav;
