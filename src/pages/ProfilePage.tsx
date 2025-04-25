import { useState } from "react";
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
  const [selectedRelationship, setSelectedRelationship] =
    useState<ProfileItem | null>(null);

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
    }
  };

  // Handle search functionality
  const handleSearch = async (query: string) => {
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
      setProfilesList(responseData.profiles);
    } catch (error) {
      console.error(error);
    }
  };

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
          getDisplayName={(item) => item.profileTitle}
        />
      )}

      {selectedRelationship ? (
        <div
          className={`px-10 ${
            sideNavOpen ? "sm:px-10" : "sm:px-14"
          } md:px-14 py-8 ${
            sideNavOpen ? "sm:py-8" : "sm:py-12"
          } md:py-12 flex flex-col gap-5 max-w-4xl mx-auto w-full`}
        >
          <h3 className="text-4xl font-semibold text-neutral-50">
            {selectedRelationship.profileTitle}
          </h3>
          <div className="flex flex-col gap-1.5">
            {selectedRelationship.profileContent.map((line) => (
              <span key={line} className="text-[18px]/[1.6] text-neutral-50">
                {line}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-full p-8 flex flex-col justify-center items-center gap-5 text-center">
          <h3 className="font-semibold text-2xl text-neutral-50">
            No Profile is Selected
          </h3>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
