/**
 * Notes CRUD operations
 */

export interface Note {
  id: string;
  title: string;
  content: string;
}

export interface NoteListItem {
  id: string;
  title: string;
}

/**
 * Retrieves a specific note by ID
 */
export const getNote = async (id: string): Promise<Note> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/note/${id}`,
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
    console.log(data.message);
    console.log(data.note);

    return data.note;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred while fetching the note.");
  }
};

/**
 * Creates a new note
 */
export const createNote = async (note: Omit<Note, "id">): Promise<Note> => {
  try {
    console.log("Creating note...");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/note/create-note`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
        }),
      },
    );
    console.log("second base");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Server error ${response.status}: ${errorText || "No details"}`,
      );
    }

    const data = await response.json();

    console.log(data.message);
    console.log(data.note);

    return data.note;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred while saving the note.");
  }
};

/**
 * Updates an existing note
 */
export const updateNote = async (note: Note): Promise<Note> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/note/update-note/${note.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
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
    console.log(data.note);

    return data.note;
  } catch (error) {
    console.error("Error:", error);
    throw new Error(`An error occurred while saving the note. Error: ${error}`);
  }
};

/**
 * Deletes a note by ID
 */
export const deleteNote = async (id: string): Promise<void> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/note/delete-note/${id}`,
      {
        method: "DELETE",
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
    console.log(data.message);
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred while deleting the note.");
  }
};
