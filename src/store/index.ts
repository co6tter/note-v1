import { atom } from "jotai";
import { Note } from "../domain/note";
import { type Id } from "../../convex/_generated/dataModel";

export type SortOption = "lastEditTime" | "title" | "createdTime";

export const notesAtom = atom<Note[]>([]);
export const selectedNoteIdAtom = atom<Id<"notes"> | null>(null);
export const searchQueryAtom = atom<string>("");
export const sortOptionAtom = atom<SortOption>("lastEditTime");
export const selectedTagAtom = atom<string | null>(null);
export const isDarkModeAtom = atom<boolean>(false);

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

  const sorted = [...filtered].sort((a, b) => {
    // Sort favorites first
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
