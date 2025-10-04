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
import { Download, ChevronDown } from "lucide-react";
import {
  downloadAsMarkdown,
  downloadAsHTML,
  downloadAsText,
} from "../utils/export";

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
  const [showExportMenu, setShowExportMenu] = useState(false);

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

  const handleExport = (format: "markdown" | "html" | "text") => {
    if (!selectedNote) return;

    switch (format) {
      case "markdown":
        downloadAsMarkdown(selectedNote.title, selectedNote.content);
        break;
      case "html":
        downloadAsHTML(selectedNote.title, selectedNote.content);
        break;
      case "text":
        downloadAsText(selectedNote.title, selectedNote.content);
        break;
    }

    setShowExportMenu(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      {selectedNote ? (
        <>
          <div
            className={`flex justify-end p-4 border-b ${isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}
          >
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-white hover:bg-gray-50 border border-gray-300"
                }`}
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">エクスポート</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showExportMenu && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${
                    isDarkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleExport("markdown")}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Markdown (.md)
                    </button>
                    <button
                      onClick={() => handleExport("html")}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      HTML (.html)
                    </button>
                    <button
                      onClick={() => handleExport("text")}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      テキスト (.txt)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <MDXEditor
            key={selectedNote.id}
            markdown={selectedNote.content}
            plugins={plugins}
            contentEditableClassName={`prose max-w-none focus:outline-none ${isDarkMode ? "prose-invert" : ""}`}
            className={`flex-1 ${isDarkMode ? "dark-theme dark-editor" : ""}`}
            placeholder="Markdownを入力してください"
            onChange={handleContentChange}
          />
        </>
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
