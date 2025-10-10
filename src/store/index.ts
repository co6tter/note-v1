import { atom } from "jotai";
import { Note } from "../domain/note";
import { Folder } from "../domain/folder";
import { type Id } from "../../convex/_generated/dataModel";

export type SortOption = "lastEditTime" | "title" | "createdTime";

export const notesAtom = atom<Note[]>([]);
export const foldersAtom = atom<Folder[]>([]);
export const selectedNoteIdAtom = atom<Id<"notes"> | null>(null);
export const searchQueryAtom = atom<string>("");
export const sortOptionAtom = atom<SortOption>("lastEditTime");
export const selectedTagAtom = atom<string | null>(null);
export const selectedFolderIdAtom = atom<Id<"folders"> | null>(null);
export const isDarkModeAtom = atom<boolean>(false);
export const isReadOnlyModeAtom = atom<boolean>(false);
export const isSavingAtom = atom<boolean>(false);

export const allTagsAtom = atom((get) => {
  const notes = get(notesAtom);
  const tagsSet = new Set<string>();

  notes.forEach((note) => {
    note.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
});

export const selectedNoteAtom = atom((get) => {
  const notes = get(notesAtom);
  const id = get(selectedNoteIdAtom);
  if (id === null) return null;

  return notes.find((note) => note.id === id);
});

export const filteredNotesAtom = atom((get) => {
  const notes = get(notesAtom);
  const searchQuery = get(searchQueryAtom);
  const sortOption = get(sortOptionAtom);
  const selectedTag = get(selectedTagAtom);
  const selectedFolderId = get(selectedFolderIdAtom);

  let filtered = notes;

  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery)
    );
  }

  if (selectedTag) {
    filtered = filtered.filter((note) => note.tags.includes(selectedTag));
  }

  if (selectedFolderId !== null) {
    filtered = filtered.filter((note) => note.folderId === selectedFolderId);
  } else if (selectedFolderId === null && !searchQuery.trim() && !selectedTag) {
    // Show only notes without folder when no folder is selected and no search/tag filter
    filtered = filtered.filter((note) => !note.folderId);
  }

  const sorted = [...filtered].sort((a, b) => {
    // Sort pinned first
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }

    // Then sort favorites
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }

    // Then sort by selected option
    switch (sortOption) {
      case "lastEditTime":
        return (b.lastEditTime || 0) - (a.lastEditTime || 0);
      case "title":
        return a.title.localeCompare(b.title);
      case "createdTime":
        return (a.lastEditTime || 0) - (b.lastEditTime || 0);
      default:
        return 0;
    }
  });

  return sorted;
});

export const saveNoteAtom = atom(null, (get, set, newContent: string) => {
  const note = get(selectedNoteAtom);
  if (!note) return;

  const updateNote = new Note(note.id, note.title, newContent, Date.now());
  const notes = get(notesAtom);
  const updateNotes = notes.map((note) =>
    note.id === updateNote.id ? updateNote : note
  );

  set(notesAtom, updateNotes);
});
