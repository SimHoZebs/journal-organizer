import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Markdown Journal',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Markdown Journal'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool _isSelectable = false;
  bool _useMarkdownBody = false;

  // Sample markdown content
  final String _markdownContent = '''
# Markdown Example

This is a **bold text** and this is an *italic text*.

## Lists
* Item 1
* Item 2
  * Subitem 1
  * Subitem 2

## Code
```dart
void main() {
  print('Hello, Markdown!');
}
```

## Links
[Flutter](https://flutter.dev)

## Images
![Flutter Logo](https://flutter.dev/assets/images/shared/brand/flutter/logo/flutter-lockup.png)

## Blockquotes
> This is a blockquote
> It can span multiple lines

## Tables
| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
''';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
        actions: [
          Switch(
            value: _isSelectable,
            onChanged: (value) {
              setState(() {
                _isSelectable = value;
              });
            },
          ),
          Switch(
            value: _useMarkdownBody,
            onChanged: (value) {
              setState(() {
                _useMarkdownBody = value;
              });
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Selectable: ${_isSelectable ? 'Yes' : 'No'}',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                Text(
                  'Using: ${_useMarkdownBody ? 'MarkdownBody' : 'Markdown'}',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ],
            ),
            const SizedBox(height: 16),
            Expanded(
              child:
                  _useMarkdownBody
                      ? MarkdownBody(
                        data: _markdownContent,
                        selectable: _isSelectable,
                      )
                      : Markdown(
                        data: _markdownContent,
                        selectable: _isSelectable,
                        onTapText: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Text tapped')),
                          );
                        },
                      ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // You could implement editing functionality here
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(const SnackBar(content: Text('Edit button pressed')));
        },
        tooltip: 'Edit',
        child: const Icon(Icons.edit),
      ),
    );
  }
}
