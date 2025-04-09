import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import notesPage from "../assets/icons/notes-page-icon.svg";
import relationshipIcon from "../assets/icons/people-relationship-icon.svg";

type Props = {
  closeNav: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRelationship: React.Dispatch<
    React.SetStateAction<{
      [key: string]: unknown;
      profileTitle: string;
      id: string;
      profileContent: string[];
    } | null>
  >; // Function to set the selected relationship
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

const SideNav: React.FC<Props> = ({
  closeNav, // Close the SideNav
  setSelectedRelationship,
  setErrorMessage,
}) => {
  const [search, setSearch] = useState<string>(""); // Search Input
  const [displayList, setDisplayList] = useState<
    {
      profileTitle: string;
      id: string;
      [key: string]: string | number | boolean | string[];
    }[]
  >([]); // List of profiles to display in SideNav
  const [selectedId, setSelectedId] = useState<string | null>(null); // Store ID of selected profile
  const navModal = useRef<HTMLDivElement>(null); // Nav Black Part

  const searchProfiles = async (query: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/search?query=${encodeURIComponent(
          query,
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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
      setErrorMessage(
        error instanceof Error
          ? `Failed to search profiles: ${error.message}`
          : "An error occurred while searching profiles",
      );
      console.error(error);
    }
  };

  const getSelectedRelationship = async (profileId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/${profileId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(
          errorMessage.error || "Unexpected error while retrieving profile",
        );
      }

      const responseData = await response.json();
      console.log(responseData.message);

      const { profileContent, ...restProfile } = responseData.profile;
      const splitContent = profileContent.split("\n");
      setSelectedRelationship({
        ...restProfile,
        profileContent: splitContent,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? `Failed to retrieve profile: ${error.message}`
          : "An error occurred while retrieving profiles",
      );
      console.error(error);
    }
  };

  // Use Effect to load profiles on component mount
  useEffect(() => {
    searchProfiles("");
  }, []);

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
            <Link to="/notes">
              <button className="p-1.5 rounded-lg cursor-pointer hover:bg-neutral-600">
                <img
                  className="w-[25px] h-[25px] invert brightness-0"
                  src={notesPage}
                  alt="Notes Page Icon"
                />
              </button>
            </Link>
            <Link to="/relationships">
              <button className="p-1.5 rounded-lg cursor-pointer bg-neutral-500">
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
              searchProfiles(event.target.value);
            }}
            placeholder={"Search Profile"}
          />

          {/* Display List */}
          <div className="grow flex flex-col gap-1 overflow-auto mx-3.5">
            {displayList.map((item, index) => (
              <button
                key={index}
                className={`text-left px-4 py-2 rounded-xl truncate shrink-0 text-neutral-50 ${
                  selectedId === item.id
                    ? "bg-neutral-500"
                    : "hover:bg-neutral-600"
                }`}
                onClick={() => {
                  setSelectedId(item.id);
                  getSelectedRelationship(item.id);
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
      </div>
    </>
  );
};

export default SideNav;
