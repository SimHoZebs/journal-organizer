import { useState } from "react";
import closeErrorDialog from "../assets/icons/Xmark.svg";
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import ghostIcon from "../assets/icons/ghost-icon.svg";
import notesPage from "../assets/icons/notes-page-icon.svg";
import relationshipIcon from "../assets/icons/people-relationship-icon.svg";
import SideNav from "../components/SideNav.tsx";

type ProfileItem = {
  id: string;
  profileTitle: string;
  profileContent: string[];
  [key: string]: unknown;
};

const ProfilePage = () => {
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(true);
  const [profilesList, setProfilesList] = useState<ProfileItem[]>([]);
  const [selectedRelationship, setSelectedRelationship] = useState<
    ProfileItem | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Handle selecting a profile
  const handleSelectProfile = async (id: string) => {
    try {
      // Find the selected profile in the list or fetch it from API
      const profile = profilesList.find((profile) => profile.id === id);

      if (profile) {
        setSelectedRelationship(profile);
      } else {
        // If not found in the list, fetch it from the API
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setSelectedRelationship(data.profile);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while fetching the profile.");
    }
  };

  // Handle search functionality
  const handleSearch = async (query: string) => {
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
        },
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(
          errorMessage.error ||
            "Unexpected error while searching for profiles",
        );
      }

      const responseData = await response.json();
      console.log(responseData.message);
      setProfilesList(responseData.profiles);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? `Failed to search profiles: ${error.message}`
          : "An error occurred while searching profiles",
      );
      console.error(error);
    }
  };

  // Navigation links for SideNav
  const navLinks = [
    {
      to: "/notes",
      icon: notesPage,
      altText: "Notes Page Icon",
      isActive: false,
    },
    {
      to: "/relationships",
      icon: relationshipIcon,
      altText: "People Relationships Icon",
      isActive: true,
    },
  ];

  return (
    <div className="flex h-dvh overflow-hidden relative">
      {sideNavOpen && (
        <SideNav<ProfileItem>
          title="Relationships"
          placeholder="Search Profile"
          items={profilesList}
          setItems={setProfilesList}
          onSearch={handleSearch}
          onItemSelect={handleSelectProfile}
          closeNav={setSideNavOpen}
          setErrorMessage={setErrorMessage}
          navLinks={navLinks}
          getDisplayName={(item) => item.profileTitle}
        />
      )}

      {errorMessage && (
        <div className="z-50 absolute bottom-4 right-4 bg-amber-700 px-5 py-2 rounded-lg flex items-center justify-between gap-4">
          <span className="text-neutral-50">{errorMessage}</span>
          <button
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
        className={`flex flex-col h-full grow sm:overflow-y-auto bg-neutral-700  ${
          sideNavOpen ? "overflow-y-hidden" : "overflow-y-auto"
        }`}
      >
        <div
          className={`px-2.5 py-2.5 flex items-center border-b bg-neutral-800 border-neutral-300 ${
            sideNavOpen && "sm:hidden"
          }`}
        >
          <button
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
            Relationship
          </span>
        </div>

        {selectedRelationship
          ? (
            <div
              className={`px-10 ${
                sideNavOpen ? "sm:px-10" : "sm:px-14"
              } md:px-14 py-8 ${
                sideNavOpen ? "sm:py-8" : "sm:py-12"
              } md:py-12 flex flex-col gap-5 max-w-4xl mx-auto w-full`}
            >
              <h3 className="text-4xl font-semibold font-montserrat text-neutral-50">
                {selectedRelationship.profileTitle}
              </h3>
              <div className="flex flex-col gap-1.5">
                {selectedRelationship.profileContent.map((line, index) => (
                  <span
                    key={index}
                    className="text-[18px]/[1.6] text-neutral-50"
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          )
          : (
            <div className="h-full p-8 flex flex-col justify-center items-center gap-5 text-center">
              <img
                className="w[75px] h-[75px] invert brightness-0"
                src={ghostIcon}
                alt="Ghost Icon"
              />
              <h3 className="font-semibold font-montserrat text-2xl text-neutral-50">
                No Profile is Selected
              </h3>
            </div>
          )}
      </div>
    </div>
  );
};

export default ProfilePage;
