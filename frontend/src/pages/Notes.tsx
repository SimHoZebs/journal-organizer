import SideNav from "../components/SideNavNote";
import { useEffect, useState, useRef } from "react";
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css"; // Import SimpleMDE styles
import SaveNoteIcon from "../assets/icons/save-note-icon.svg";
import DeleteNoteIcon from "../assets/icons/delete-note-icon.svg";

const Notes = () => {
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(true);
  const [selectedNotes, setSelectedNotes] = useState<{
    title: string;
    existingNoteFlag: number; //0 if it's a new note, 1 if it's an existing note
    content?: string;
    [key: string]: string | number | boolean | undefined;
  } | null>(null);
  const [displayList, setDisplayList] = useState<
    { id: string; name: string }[]
  >([]);

  const userID = localStorage.getItem("userId");

  const getSelectedNotes = (existingNoteFlag: number) => {
    if (existingNoteFlag === -1) {
      createNewNote();
    } else {
      setSelectedNotes({
        title: localStorage.getItem("journalTitle") || "",
        existingNoteFlag: 1,
        content: localStorage.getItem("journalContent") || "",
      });
    }
  };

  useEffect(() => {
    createNewNote();
  }, []);

  const createNewNote = () => {
    setSelectedNotes({
      title: "",
      existingNoteFlag: 0,
      content: "",
    });
  };
  const editorContentRef = useRef<string>("");

  //HANDLE SAVE----------------------------------------------------------
  const handleSave = async () => {
    setSelectedNotes((prev) =>
      prev
        ? {
            ...prev,
            content: editorContentRef.current,
          }
        : null,
    );
    const updatedContent = editorContentRef.current;

    if (selectedNotes?.existingNoteFlag === 0) {
      if (userID === null) {
        console.error("User ID is not available in local storage.");
        return;
      }
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/journal/create-notebook`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: selectedNotes.title,
              content: updatedContent, // Use the updated content from the editor
              userId: userID,
            }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Server error ${response.status}: ${errorText || "No details"}`,
          );
        }
        const data = await response.json();
        console.log(data.message);
        console.log(data.notebook);

        setSelectedNotes((prev) =>
          prev
            ? {
                ...prev,
                existingNoteFlag: 1,
                notebookId: data.notebook._id,
                updateFlag: 0,
                updateDelete: 0,
              }
            : null,
        );
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while saving the note.");
      }
    }
    getAllJournals();
  }; //END OF HANDLESAVE--------------------------------------------------------------------

  //HANDLE UPDATE--------------------------------------------------------------------------
  const handleUpdate = async () => {
    setSelectedNotes((prev) =>
      prev
        ? {
            ...prev,
            content: editorContentRef.current || prev.content,
          }
        : null,
    );
    const updatedContent = editorContentRef.current;

    if (selectedNotes?.updateFlag === 0) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/journal/update-notebook/${
            selectedNotes?.notebookId
          }`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: selectedNotes?.title,
              content: updatedContent,
              notebookId: selectedNotes?.notebookId,
            }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Server error ${response.status}: ${errorText || "No details"}`,
          );
        }
        const data = await response.json();
        console.log(data.message);
        console.log(data.notebook);

        setSelectedNotes((prev) =>
          prev
            ? {
                ...prev,
                updateFlag: 1,
              }
            : null,
        );
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while saving the note.");
      }
    } else {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/journal/update-notebook/${localStorage.getItem("notebookId")}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: selectedNotes?.title,
              content: updatedContent,
              notebookId: localStorage.getItem("notebookId"),
            }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Server error ${response.status}: ${errorText || "No details"}`,
          );
        }
        const data = await response.json();
        console.log(data.message);
        console.log(data.notebook);

        setSelectedNotes((prev) =>
          prev
            ? {
                ...prev,
                updateDelete: 1,
              }
            : null,
        );
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while saving the note.");
      }
    }
    getAllJournals();
  }; //END OF HANDLE UPDATE--------------------------------------------------------------------------

  //HANDLE DELETE---------------------------------------------------------------------------
  const handleDelete = async () => {
    if (selectedNotes?.updateDelete === 0) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/journal/delete-notebook/${
            selectedNotes?.notebookId
          }`, // Use the notebookId from selectedNotes to delete the specific note
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              notebookId: selectedNotes?.notebookId,
            }),
          },
        );

        if (!response.ok) {
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
    } else {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/journal/delete-notebook/${localStorage.getItem("notebookId")}`, // Use the notebookId from selectedNotes to delete the specific note
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              notebookId: localStorage.getItem("notebookId"),
            }),
          },
        );

        if (!response.ok) {
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
    }

    createNewNote();
    getAllJournals();
  };
  //END OF HANDLE DELETE--------------------------------------------------------------------------

  const getAllJournals = async () => {
    if (userID === null) {
      console.error("User ID is not available in local storage.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/journal/all/${userID}`,
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

  return (
    <div className="flex h-dvh overflow-hidden">
      {sideNavOpen && (
        <SideNav
          getSelectedItem={getSelectedNotes}
          page="Notes"
          closeNav={setSideNavOpen}
          displayList={displayList}
          setDisplayList={setDisplayList}
        />
      )}

      <div
        className={`flex flex-col h-full grow sm:overflow-y-auto ${
          sideNavOpen && "overflow-y-hidden"
        }`}
      >
        <div
          className={`px-2.5 py-2.5 flex items-center border-b ${
            sideNavOpen && "sm:hidden"
          }`}
        >
          <button
            className="p-1 rounded-lg hover:bg-gray-200 cursor-pointer"
            onClick={() => setSideNavOpen(true)}
          >
            <img
              className="w-[25px] h-[25px] rotate-180"
              src={closeSideNav}
              alt="Open Navbar Icon"
            />
          </button>
          <span className="grow text-center ml-[-33px] font-semibold text-lg">
            Notes
          </span>
        </div>

        {selectedNotes ? (
          <div
            className={`px-10 ${
              sideNavOpen ? "sm:px-10" : "sm:px-14"
            } md:px-14 py-8 ${
              sideNavOpen ? "sm:py-8" : "sm:py-12"
            } md:py-12 flex flex-col gap-5 max-w-4xl mx-auto`}
          >
            <input
              type="text"
              placeholder="Untitled Note" // Placeholder for the input field
              className="text-4xl font-semibold font-montserrat"
              value={selectedNotes.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSelectedNotes((prev) =>
                  prev
                    ? {
                        ...prev,
                        title: e.target.value,
                      }
                    : null,
                );
              }}
            />
            <SimpleMDE
              value={selectedNotes.content || ""}
              onChange={(value: string) => {
                editorContentRef.current = value;
              }}
              options={{
                spellChecker: false,
                placeholder: "Write your notes here...",
              }}
            />
            <div className="relative">
              {/* Buttons Container */}
              <div className="absolute top-4 right-4 flex gap-2">
                {/* Save Button */}
                <button
                  className="p-1 rounded-lg hover:bg-gray-200 cursor-pointer"
                  onClick={
                    selectedNotes?.existingNoteFlag === 0
                      ? handleSave
                      : handleUpdate
                  }
                >
                  <img
                    src={SaveNoteIcon}
                    alt="Save Icon"
                    className="w-[40px] h-[35px]"
                  />
                </button>
                {/* Delete Button */}
                <button
                  className="p-1 rounded-lg hover:bg-gray-200 cursor-pointer"
                  onClick={handleDelete}
                >
                  <img
                    src={DeleteNoteIcon}
                    alt="Delete Icon"
                    className="w-[35px] h-[35px]"
                  />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full p-8 flex flex-col justify-center items-center gap-5 text-center"></div>
        )}
      </div>
    </div>
  );
};

export default Notes;
