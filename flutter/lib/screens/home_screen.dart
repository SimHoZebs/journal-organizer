import 'package:flutter/material.dart';
import 'note_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Sample entries (replace with real data later)
    final List<Map<String, String>> journalEntries = [
      {
        "title": "A Day in Tokyo",
        "preview": "Explored Shibuya and found the coziest ramen spot...",
        "content":
            "# A Day in Tokyo\n\nExplored Shibuya and found the coziest ramen spot. The chef was very friendly and recommended their special tonkotsu ramen which was amazing! :heart_eyes:\n\nAfter lunch, I visited the famous Shibuya crossing and took some photos. The energy of the city is incredible.",
      },
      {
        "title": "Thoughts on Creativity",
        "preview":
            "Today I reflected on the role of solitude in creative work...",
        "content":
            "# Thoughts on Creativity\n\nToday I reflected on the role of solitude in creative work. Many great artists and writers throughout history have emphasized how important it is to have quiet, uninterrupted time for deep thinking and creation.\n\n## Key insights:\n* Distraction is the enemy of depth\n* Regular solitude creates space for new ideas\n* Balancing collaboration and solo work is crucial",
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text("Journal Organizer"),
        backgroundColor: Colors.deepPurple,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child:
            journalEntries.isEmpty
                ? const Center(
                  child: Text(
                    "No journal entries yet.\nStart writing!",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                  ),
                )
                : ListView.separated(
                  itemCount: journalEntries.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 16),
                  itemBuilder: (context, index) {
                    final entry = journalEntries[index];
                    return Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 4,
                      child: ListTile(
                        title: Text(
                          entry['title']!,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          entry['preview']!,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder:
                                  (context) => NoteScreen(
                                    title: entry['title']!,
                                    content: entry['content']!,
                                  ),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Navigate to create journal screen
        },
        backgroundColor: Colors.deepPurple,
        tooltip: "New Entry",
        child: const Icon(Icons.add),
      ),
    );
  }
}
