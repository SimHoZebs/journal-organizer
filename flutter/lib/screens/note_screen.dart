import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:markdown/markdown.dart' as md;

class NoteScreen extends StatefulWidget {
  const NoteScreen({super.key, required this.title, required this.content});

  final String title;
  final String content;

  @override
  State<NoteScreen> createState() => _NoteScreenState();
}

class _NoteScreenState extends State<NoteScreen> {
  bool _isSelectable = false;
  bool _useMarkdownBody = false;
  bool _isEditMode = false;
  late final TextEditingController _editingController;

  // Custom extension set with emoji support
  final _markdownExtensionSet = md.ExtensionSet(
    md.ExtensionSet.gitHubFlavored.blockSyntaxes,
    <md.InlineSyntax>[
      md.EmojiSyntax(),
      ...md.ExtensionSet.gitHubFlavored.inlineSyntaxes,
    ],
  );

  @override
  void initState() {
    super.initState();
    // Initialize controller with the journal entry content
    _editingController = TextEditingController(text: widget.content);
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
                          try {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Text tapped')),
                            );
                          } catch (e) {
                            // Handle the error, e.g., show an error message
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Error: ${e.toString()}')),
                            );
                          }
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
