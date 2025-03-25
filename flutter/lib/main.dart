import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:markdown/markdown.dart' as md;

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
  bool _isEditMode = false;
  TextEditingController _editingController = TextEditingController();

  // Custom extension set with emoji support
  final _markdownExtensionSet = md.ExtensionSet(
    md.ExtensionSet.gitHubFlavored.blockSyntaxes,
    <md.InlineSyntax>[
      md.EmojiSyntax(),
      ...md.ExtensionSet.gitHubFlavored.inlineSyntaxes,
    ],
  );

  // Updated sample markdown content with emojis and image examples
  final String _markdownContent = '''
# Markdown Example :notebook:

This is a **bold text** and this is an *italic text*. I'm happy :smiley: about this!

## Lists
* Item 1 :apple:
* Item 2 :banana:
  * Subitem 1 :cherry:
  * Subitem 2 :grapes:

## Code
```dart
void main() {
  print('Hello, Markdown!');
}
```

## Links
[Flutter](https://flutter.dev)

## Images
### Network Image
![Flutter Logo](https://flutter.dev/assets/images/shared/brand/flutter/logo/flutter-lockup.png)

### Asset Image (example syntax)
![Asset Image](resource:assets/images/example.png)

### Local File Image (example syntax)
![Local Image](/data/user/0/com.example.app/files/image.jpg)

## Blockquotes
> This is a blockquote :bulb:
> It can span multiple lines

## Tables
| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2 :thumbsup: |
| Cell 3   | Cell 4 :star: |
''';

  @override
  void initState() {
    super.initState();
    // Set the text after controller is initialized
    _editingController.text = _markdownContent;
  }

  @override
  void dispose() {
    _editingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
        actions: [
          if (!_isEditMode) // Only show switches in view mode
            Switch(
              value: _isSelectable,
              onChanged: (value) {
                setState(() {
                  _isSelectable = value;
                });
              },
            ),
          if (!_isEditMode) // Only show switches in view mode
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
            if (!_isEditMode) // Only show this row in view mode
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
            if (!_isEditMode) const SizedBox(height: 16),
            Expanded(
              child:
                  _isEditMode
                      ? TextField(
                        controller: _editingController,
                        maxLines: null,
                        expands: true,
                        decoration: const InputDecoration(
                          border: OutlineInputBorder(),
                          hintText: 'Edit your markdown here',
                        ),
                      )
                      : Markdown(
                        data: _editingController.text,
                        selectable: _isSelectable,
                        extensionSet: _markdownExtensionSet,
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
          setState(() {
            _isEditMode = !_isEditMode;
          });
        },
        tooltip: _isEditMode ? 'View' : 'Edit',
        child: Icon(_isEditMode ? Icons.visibility : Icons.edit),
      ),
    );
  }
}
