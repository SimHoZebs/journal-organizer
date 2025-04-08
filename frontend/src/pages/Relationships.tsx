import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import closeErrorDialog from "../assets/icons/Xmark.svg";
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import ghostIcon from "../assets/icons/ghost-icon.svg";
import SideNav from "../components/SideNavProfile";

const Relationships = () => {
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(true);
  const [selectedRelationship, setSelectedRelationship] = useState<{
    profileTitle: string;
    _id: string;
    profileContent: string[];
    [key: string]: unknown;
  } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");
    if (storedUserId && storedUserName && storedToken) {
      setAuthToken(storedToken);
      setUserId(storedUserId);
      setUserName(storedUserName);
    } else {
      setErrorMessage("UserID, Username, or AuthToken not found.");
      console.error(
        "UserID, Username, or AuthToken not found in local storage.",
      );
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  }, [errorMessage]);

  return (
    <div className="flex h-dvh overflow-hidden relative">
      {sideNavOpen && userId !== null && (
        <SideNav
          closeNav={setSideNavOpen}
          userName={userName}
          userId={userId}
          authToken={authToken}
          setSelectedRelationship={setSelectedRelationship}
          setErrorMessage={setErrorMessage}
        />
      )}

      {errorMessage && (
        <div className="z-50 absolute bottom-4 right-4 bg-amber-700 px-5 py-2 rounded-lg flex items-center justify-between gap-4">
          <span className="text-neutral-50">{errorMessage}</span>
          <button
            className=" hover:bg-amber-500 rounded-md cursor-pointer p-1"
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

        {selectedRelationship ? (
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
                <span key={index} className="text-[18px]/[1.6] text-neutral-50">
                  {line}
                </span>
              ))}
            </div>
          </div>
        ) : (
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

export default Relationships;
