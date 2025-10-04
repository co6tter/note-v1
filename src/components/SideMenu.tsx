import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  notesAtom,
  selectedNoteIdAtom,
  searchQueryAtom,
  filteredNotesAtom,
  sortOptionAtom,
  selectedTagAtom,
  allTagsAtom,
  isDarkModeAtom,
  type SortOption,
} from "../store";
import type { Id } from "../../convex/_generated/dataModel";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Note } from "../domain/note";
import { useDebounce } from "@uidotdev/usehooks";
import { Plus, Trash2, Search, Star, Tag, X, Moon, Sun } from "lucide-react";

function SideMenu() {
  const [notes, setNotes] = useAtom(notesAtom);
  const filteredNotes = useAtomValue(filteredNotesAtom);
  const setSelectedNoteId = useSetAtom(selectedNoteIdAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [sortOption, setSortOption] = useAtom(sortOptionAtom);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom);
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  const allTags = useAtomValue(allTagsAtom);
  const createNote = useMutation(api.notes.create);
  const deleteNote = useMutation(api.notes.deleteNote);
  const updateNote = useMutation(api.notes.updateNote);
  const toggleFavorite = useMutation(api.notes.toggleFavorite);
  const updateTags = useMutation(api.notes.updateTags);
  const selectedNoteId = useAtomValue(selectedNoteIdAtom);
  const [editingTitle, setEditingTitle] = useState<{
    id: Id<"notes">;
    title: string;
  } | null>(null);
  const [editingTags, setEditingTags] = useState<{
    id: Id<"notes">;
    tags: string[];
  } | null>(null);
  const [newTag, setNewTag] = useState("");

  const handleCreateNote = async () => {
    const noteId = await createNote({ title: "Untitled", content: "" });

    const newNote = new Note(noteId, "Untitled", "", Date.now());
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = async (noteId: Id<"notes">) => {
    await deleteNote({ noteId });
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const handleToggleFavorite = async (noteId: Id<"notes">) => {
    const note = notes.find((note) => note.id === noteId);
    if (!note) return;

    const newIsFavorite = !note.isFavorite;
    await toggleFavorite({ noteId, isFavorite: newIsFavorite });

    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, isFavorite: newIsFavorite } : note
      )
    );
  };

  const handleUpdateTitle = useCallback(
    async (noteId: Id<"notes">, newTitle: string) => {
      const note = notes.find((note) => note.id === noteId);
      if (!note) return;

      await updateNote({ noteId, title: newTitle, content: note.content });
    },
    [notes, updateNote]
  );

  const debounceTitle = useDebounce(editingTitle?.title, 500);
  useEffect(() => {
    if (editingTitle && debounceTitle) {
      handleUpdateTitle(editingTitle.id, debounceTitle);
    }
  }, [editingTitle, debounceTitle, handleUpdateTitle]);

  const handleTitleChange = (noteId: Id<"notes">, title: string) => {
    setEditingTitle({ id: noteId, title });

    setNotes((prev) =>
      prev.map((note) => (note.id === noteId ? { ...note, title } : note))
    );
  };

  const handleAddTag = (noteId: Id<"notes">) => {
    if (!newTag.trim()) return;

    const note = notes.find((note) => note.id === noteId);
    if (!note) return;

    const updatedTags = [...note.tags, newTag.trim()];
    updateTags({ noteId, tags: updatedTags });

    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, tags: updatedTags } : note
      )
    );

    setNewTag("");
    setEditingTags(null);
  };

  const handleRemoveTag = (noteId: Id<"notes">, tagToRemove: string) => {
    const note = notes.find((note) => note.id === noteId);
    if (!note) return;

    const updatedTags = note.tags.filter((tag) => tag !== tagToRemove);
    updateTags({ noteId, tags: updatedTags });

    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, tags: updatedTags } : note
      )
    );
  };

  return (
    <div className={`w-64 h-dvh p-4 flex flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Notes</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"}`}
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={handleCreateNote}
            className={`p-2 rounded ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-gray-50"}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="検索..."
          className={`w-full pl-10 pr-4 py-2 rounded border focus:outline-none focus:ring-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-gray-600"
              : "bg-white border-gray-200 focus:ring-gray-400"
          }`}
        />
      </div>
      <div className="mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-200"
          }`}
        >
          <option value="lastEditTime">最終更新日時順</option>
          <option value="title">タイトル順</option>
          <option value="createdTime">作成日時順</option>
        </select>
      </div>
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2 py-1 text-xs rounded ${
                selectedTag === tag
                  ? "bg-blue-500 text-white"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <ul className="flex flex-col">
        {filteredNotes.map((note) => (
          <li
            key={note.id}
            className={`p-2 rounded cursor-pointer flex justify-between items-center group ${
              selectedNoteId === note.id
                ? isDarkMode
                  ? "bg-gray-800"
                  : "bg-white"
                : isDarkMode
                ? "hover:bg-gray-800"
                : "hover:bg-white"
            }`}
            onClick={() => setSelectedNoteId(note.id)}
          >
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={note.title}
                onChange={(e) => handleTitleChange(note.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className={`font-medium bg-transparent outline-none w-full ${isDarkMode ? "text-white" : ""}`}
                placeholder="Untitled"
              />
              <p className={`text-xs truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {note.lastEditTime
                  ? new Date(note.lastEditTime).toLocaleString()
                  : "Never edited"}
              </p>
              <div className="flex flex-wrap gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
                  >
                    {tag}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(note.id, tag);
                      }}
                      className="hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {editingTags?.id === note.id ? (
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddTag(note.id);
                      } else if (e.key === "Escape") {
                        setEditingTags(null);
                        setNewTag("");
                      }
                    }}
                    onBlur={() => {
                      if (newTag.trim()) {
                        handleAddTag(note.id);
                      } else {
                        setEditingTags(null);
                      }
                    }}
                    className={`px-1 py-0.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-gray-700 border-blue-600 text-white"
                        : "border-blue-300"
                    }`}
                    placeholder="タグ名"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTags({ id: note.id, tags: note.tags });
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs border border-dashed rounded ${
                      isDarkMode
                        ? "text-gray-400 hover:text-gray-300 border-gray-600 hover:border-gray-500"
                        : "text-gray-500 hover:text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(note.id);
                }}
                className={`p-1 rounded transition-all ${
                  note.isFavorite
                    ? "text-yellow-500"
                    : "text-gray-400 opacity-0 group-hover:opacity-100"
                } hover:text-yellow-500`}
              >
                <Star
                  className={`h-4 w-4 ${note.isFavorite ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id);
                }}
                className="text-gray-400 hover:text-red-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideMenu;
