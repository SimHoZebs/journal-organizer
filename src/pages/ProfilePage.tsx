import { useState } from "react";
import SideNav from "../components/SideNav.tsx";
import { H3 } from "../comp/Heading";

type ProfileItem = {
  id: string;
  profileTitle: string;
  profileContent: string[];
  [key: string]: unknown;
};

const ProfilePage = () => {
  const [profilesList, setProfilesList] = useState<ProfileItem[]>([]);
  const [selectedRelationship, setSelectedRelationship] =
    useState<ProfileItem | null>(null);

  // Handle selecting a profile
  const handleSelectProfile = async (item: ProfileItem) => {
    try {
      // Find the selected profile in the list or fetch it from API
      const profile = profilesList.find((profile) => profile.id === item.id);

      if (profile) {
        setSelectedRelationship(profile);
      } else {
        // If not found in the list, fetch it from the API
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/${item.id}`,
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

  return (
    <div className="flex h-dvh overflow-hidden relative">
      <SideNav<ProfileItem>
        title="Relationships"
        placeholder="Search Profile"
        items={profilesList}
        setItems={setProfilesList}
        onItemSelect={handleSelectProfile}
        getDisplayName={(item) => item.profileTitle}
      />

      {selectedRelationship ? (
        <div
          className={
            "px-10 md:py-12 flex flex-col gap-5 max-w-4xl mx-auto w-full"
          }
        >
          <H3 className="text-4xl font-semibold text-neutral-50">
            {selectedRelationship.profileTitle}
          </H3>
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
          <H3 className="font-semibold text-2xl text-neutral-50">
            No Profile is Selected
          </H3>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
