import MDEditor, { type PreviewType } from "@uiw/react-md-editor";
import { useEffect, useState } from "react"; //import some hooks
import { useNavigate } from "react-router";
import SideNav from "../components/SideNavNote"; //import the SideNav component

//icons
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import DeleteNoteIcon from "../assets/icons/delete-note-icon.svg";
import SaveNoteIcon from "../assets/icons/save-note-icon.svg";
import handleLogout from "../utils/handleLogout";
import searchJournal from "../utils/searchJournal";

const Notes = () => {
  const [displayList, setDisplayList] = useState<
    { _id: string; title: string }[]
  >([]); // List of Notes/Relationships to display in SideNav
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(true); //state to control SideNav visibility
  const [previewMode, setPreviewMode] = useState<PreviewType>("preview");
  const [selectedNote, setSelectedNote] = useState<{
    //state to manipulate such selected note
    title: string;
    content: string;
    _id: string; //optional notebook ID
  }>({
    title: "",
    content: "",
    _id: "",
  });
  const navigate = useNavigate(); //useNavigate hook to navigate between pages

  const handleAuthError = (response: Response) => {
    if (response.status === 403 || response.status === 401) {
      console.error("Session expired. Please log in again");
      handleLogout();
      navigate("/login");
      return true;
    }
    return false;
  };

  useEffect(() => {
    const userID = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userID && !token) {
      console.error(
        "UserID, Username, or AuthToken not found in local storage.",
      );
      navigate("/login");
    }
  }, []);

  //function to either retrieve the selected note or create a new one (SideNav)
  const getSelectedNote = async (id: string) => {
    const userID = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

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
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        if (handleAuthError(response)) return;

        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }
      const data = await response.json();
      console.log(data.message);
      console.log(data.notebook);

      setSelectedNote(data.notebook);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching the journals.");
    }
  };

  const refreshNavBar = async () => {
    const result = await searchJournal("");
    console.log("searchJournal result", result);
    setDisplayList(result || []); //set the displayList to the result of the searchJournal function
  };

  useEffect(() => {
    //display a new note when the page loads
    createNewNote();
    refreshNavBar();
    if (selectedNote.content === "") {
      setPreviewMode("edit");
    }
  }, []);

  const createNewNote = () => {
    setSelectedNote({
      title: "Untitled Note",
      content: "",
      _id: "",
    });
  };

  //HANDLE SAVE----------------------------------------------------------------
  const createNotebook = async () => {
    const userID = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    // if (!token) {
    //   console.error("Token is not available in local storage.");
    //   return;
    // }
    if (!userID) {
      console.error("User ID is not available in local storage.");
      return;
    }

    //establish in order to use "selectedNotes"
    try {
      //start the API call
      console.log("Creating notebook...");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/journal/create-notebook`, //call "create-notebook" API
        {
          method: "POST", //use POST method
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, //use the token from localStorage
          },
          body: JSON.stringify({
            title: selectedNote.title,
            content: selectedNote.content,
            userId: userID,
          }),
        },
      );
      console.log("second base");

      if (!response.ok) {
        if (handleAuthError(response)) return;

        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }

      const data = await response.json();

      console.log(data.message);
      console.log(data.notebook);

      return data.notebook;
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the note.");
    }
  }; //END OF HANDLESAVE--------------------------------------------------------------------

  //HANDLE UPDATE--------------------------------------------------------------------------
  const updateNotebook = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/journal/update-notebook/${
          //caall "update-notebook" API
          selectedNote._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: selectedNote.title,
            content: selectedNote.content,
          }),
        },
      );

      if (!response.ok) {
        if (handleAuthError(response)) return;

        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }
      const data = await response.json();
      console.log(data.message);
      console.log(data.notebook);

      return data.notebook;
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred while saving the note. Error: ${error}`);
    }
  }; //END OF HANDLE UPDATE--------------------------------------------------------------------------

  //HANDLE DELETE---------------------------------------------------------------------------
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/journal/delete-notebook/${
          selectedNote._id
        }`, // Use the notebookId from selectedNotes to delete the specific note
        {
          method: "DELETE", // Use DELETE method
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            notebookId: selectedNote?._id,
          }),
        },
      );

      if (!response.ok) {
        if (handleAuthError(response)) return;

        const errorText = await response.text();
        throw new Error(
          `Server error ${response.status}: ${errorText || "No details"}`,
        );
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the note.");
    }
  };
  //END OF HANDLE DELETE--------------------------------------------------------------------------

  //return the components created
  return (
    <div className="flex h-dvh overflow-hidden relative">
      {sideNavOpen && ( //if the SideNav is set to open, display it
        <SideNav
          displayList={displayList} //pass the displayList to the SideNav component
          createNewNote={createNewNote}
          getSelectedNote={getSelectedNote}
          page="Notes"
          closeNav={setSideNavOpen}
          setDisplayList={setDisplayList}
        />
      )}

      <div //main content area
        className={`flex flex-col w-full h-full sm:overflow-y-auto bg-neutral-700 ${
          sideNavOpen && "overflow-y-hidden"
        }`}
      >
        <div
          className={`px-2.5 py-2.5 flex items-center border-b bg-neutral-800 border-neutral-300 ${
            sideNavOpen && "sm:hidden"
          }`}
        >
          <button //button to open/close the SideNav
            className="p-1 rounded-lg hover:bg-neutral-600 cursor-pointer"
            onClick={() => setSideNavOpen(true)}
          >
            <img //icon to open/close the SideNav
              className="w-[25px] h-[25px] rotate-180 invert brightness-0"
              src={closeSideNav}
              alt="Open Navbar Icon"
            />
          </button>
          <span className="grow text-center ml-[-33px] font-semibold text-lg text-neutral-50">
            Notes
          </span>
        </div>

        {selectedNote ? ( //condition so "selectedNotes" can be manipulated
          <div
            className={`px-8 ${
              //padding for the main content area
              sideNavOpen ? "sm:px-10 sm:py-8" : "sm:px-14 sm:py-12"
            } md:px-14 py-8 md:py-12 flex flex-col gap-5 max-w-4xl mx-auto h-full w-full`}
          >
            <input //input field for the note title
              type="text"
              placeholder="Enter Title Here..." //placeholder text
              className="text-4xl font-semibold font-montserrat text-neutral-50"
              value={selectedNote.title || ""} //use the title from selectedNotes
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                //use onChange along with React.ChangeEvent to modify the title
                setSelectedNote((prev) =>
                  prev ? { ...prev, title: e.target.value } : prev,
                );
              }}
            />

            <MDEditor //text editor
              value={selectedNote.content || ""} //use the content from selectedNotes
              height="80%"
              minHeight={300}
              preview={previewMode}
              onClick={() => {
                setPreviewMode("edit");
              }}
              onChange={(value) => {
                setSelectedNote((prev) =>
                  prev ? { ...prev, content: value || "" } : prev,
                );
              }}
              style={{
                backgroundColor: "oklch(26.9% 0 0)",
                color: "white", // Set text color to white
                borderRadius: "8px", // Optional: Add rounded corners
              }}
              previewOptions={{
                style: {
                  backgroundColor: "oklch(26.9% 0 0)", // Change preview box background color
                  color: "white", // Change preview text color
                },
              }}
            />
            <div className="relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button //Save Button
                  className={`p-1 rounded-lg cursor-pointer ${
                    !selectedNote.content || !selectedNote.title
                      ? "opacity-30 cursor-not-allowed bg-neutral-700 text-neutral-400"
                      : "hover:bg-neutral-500"
                  }`}
                  onClick={async () => {
                    const notebook =
                      selectedNote._id === ""
                        ? await createNotebook()
                        : await updateNotebook();

                    setSelectedNote((prev) =>
                      prev
                        ? {
                            ...prev,
                            ...notebook,
                          }
                        : prev,
                    );
                    setPreviewMode("preview");
                    await refreshNavBar();
                  }}
                  disabled={
                    //disable the button if the title is empty
                    selectedNote?.title === "" || selectedNote?.content === ""
                  }
                >
                  <img //icon for button
                    src={SaveNoteIcon}
                    alt="Save Icon"
                    className="w-[40px] h-[35px] invert brightness-0"
                  />
                </button>

                <button //Delete Button
                  className={`p-1 rounded-lg cursor-pointer ${
                    !selectedNote.content || !selectedNote.title
                      ? "opacity-30 cursor-not-allowed bg-neutral-700 text-neutral-400"
                      : "hover:bg-neutral-500"
                  }`}
                  onClick={async () => {
                    await handleDelete();
                    createNewNote();
                    await refreshNavBar();
                  }}
                  disabled={
                    //disable the button if the title is empty
                    selectedNote?.title === "" || selectedNote?.content === ""
                  }
                >
                  <img
                    src={DeleteNoteIcon}
                    alt="Delete Icon"
                    className="w-[35px] h-[35px] invert brightness-0"
                  />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full p-8 flex flex-col justify-center items-center gap-5 text-center" />
        )}
      </div>
    </div>
  );
};

export default Notes;
