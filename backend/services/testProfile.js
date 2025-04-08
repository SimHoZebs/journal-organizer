// testProfile.js
const axios = require("axios");

async function testCreateProfile() {
  try {
    const url = "http://localhost:3000/profile/create-profile";

    // Example notes referencing "Mary"
    const noteContents = [
      "Mary is a 32-year-old software engineer working at TechCorp.",
      "She completed her M.S. in Computer Science last year.",
      "Mary is based in Seattle, enjoys painting, and often collaborates with the AI research team.",
      "She wants to travel to Tokyo next summer for a conference.",
      "Mary's current project is considered high priority and is due next month.",
    ];

    const response = await axios.post(url, {
      tag: "Mary",
      tagType: "person",
      noteContents,
    });

    console.log("Profile creation response:", response.data);
  } catch (error) {
    console.error(
      "Error calling createProfile endpoint:",
      error.response?.data || error.message,
    );
  }
}

testCreateProfile();
