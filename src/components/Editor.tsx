import { useAtomValue, useSetAtom } from "jotai";
import { saveNoteAtom, selectedNoteAtom, isDarkModeAtom } from "../store";
import {
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  InsertCodeBlock,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

const plugins = [
  headingsPlugin(),
  listsPlugin(),
  markdownShortcutPlugin(),
  codeBlockPlugin({
    defaultCodeBlockLanguage: "js",
  }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: "javascript",
      jsx: "javascript JSX",
      ts: "TypeScript",
      tsx: "TypeScript JSX",
      python: "Python",
      css: "CSS",
      html: "HTML",
      json: "JSON",
    },
  }),
  toolbarPlugin({
    toolbarContents: () => (
      <>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <BoldItalicUnderlineToggles />
          </div>
          <div className="flex gap-1">
            <ListsToggle />
          </div>
          <InsertCodeBlock />
        </div>
      </>
    ),
  }),
];

function Editor() {
  const selectedNote = useAtomValue(selectedNoteAtom);
  const isDarkMode = useAtomValue(isDarkModeAtom);
  const updateNote = useMutation(api.notes.updateNote);
  const saveNote = useSetAtom(saveNoteAtom);
  const [content, setContent] = useState<string>(selectedNote?.content || "");

  const debounceContent = useDebounce(content, 1000);
  useEffect(() => {
    if (!selectedNote || !debounceContent) return;
    updateNote({
      noteId: selectedNote.id,
      title: selectedNote.title,
      content: debounceContent,
    });
  }, [debounceContent, selectedNote, updateNote]);

  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      saveNote(newContent);
    },
    [saveNote]
  );

  return (
    <div className="flex-1">
      {selectedNote ? (
        <MDXEditor
          key={selectedNote.id}
          markdown={selectedNote.content}
          plugins={plugins}
          contentEditableClassName={`prose max-w-none focus:outline-none ${isDarkMode ? "prose-invert" : ""}`}
          className={`h-full ${isDarkMode ? "dark-theme dark-editor" : ""}`}
          placeholder="Markdownを入力してください"
          onChange={handleContentChange}
        />
      ) : (
        <div className="h-screen flex items-center justify-center">
          <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
            ノートを選択するか、新しいノートを作成してください
          </p>
        </div>
      )}
    </div>
  );
}

export default Editor;
