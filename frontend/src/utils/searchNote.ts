const searchNote = async (query: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/note/search?query=${
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
      const errorText = await response.json();
      throw new Error(
        `Server error ${response.status}: ${errorText || "No details"}`,
      );
    }

    const data = await response.json();
    console.log(data.message);

    return data.notes;
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while fetching the notes.");
    return null;
  }
};

export default searchNote;
