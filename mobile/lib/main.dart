import 'package:flutter/material.dart';

void main() {
  runApp(const JournalOrganizerApp());
}

class JournalOrganizerApp extends StatelessWidget {
  const JournalOrganizerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Journal Organizer',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Journal Organizer'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Journal Organizer Mobile App',
              style: TextStyle(fontSize: 20),
            ),
            const SizedBox(height: 20),
            const Text(
              'Coming soon...',
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}