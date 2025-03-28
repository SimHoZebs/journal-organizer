import SideNav from "../components/SideNav";
import { useEffect, useState } from "react";
import closeSideNav from "../assets/icons/close-nav-icon.svg";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css"; // Import SimpleMDE styles

const Notes = () => {
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(true);
  const [selectedNotes, setSelectedNotes] = useState<{
    title: string;
    id: number;
    content?: string;
    [key: string]: string | number | boolean | undefined;
  } | null>(null);

  const getSelectedNotes = (id: number) => {
    console.log(id);
    if (id === -1) {
      createNewNote(-1);
    } else {
      setSelectedNotes({
        //have to update this manipulation the API
        title: "Cookies",
        id: 1,
        content:
          "I love cookies so much because of their sweetness and crisp. It reminds me of home and the fun times I used to have back then",
      });
    }
  };

  useEffect(() => {
    createNewNote(-1);
  }, []);

  const createNewNote = (id: number) => {
    setSelectedNotes({
      title: "Untitled Note",
      id,
      content: "",
    });
  };

  return (
    <div className="flex h-dvh overflow-hidden">
      {sideNavOpen && (
        <SideNav
          getSelectedItem={getSelectedNotes}
          page="Notes"
          closeNav={setSideNavOpen}
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
            <h3 className="text-4xl font-semibold font-montserrat">
              {selectedNotes.title}
            </h3>
            <SimpleMDE
              value={selectedNotes.content || ""}
              options={{
                spellChecker: false,
                placeholder: "Write your notes here...",
              }}
            />
          </div>
        ) : (
          <div className="h-full p-8 flex flex-col justify-center items-center gap-5 text-center"></div>
        )}
      </div>
    </div>
  );
};

export default Notes;
