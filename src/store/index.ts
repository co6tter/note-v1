import { atom } from "jotai";
import { Note } from "../domain/note";
import { type Id } from "../../convex/_generated/dataModel";

export type SortOption = "lastEditTime" | "title" | "createdTime";

export const notesAtom = atom<Note[]>([]);
export const selectedNoteIdAtom = atom<Id<"notes"> | null>(null);
export const searchQueryAtom = atom<string>("");
export const sortOptionAtom = atom<SortOption>("lastEditTime");

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

  let filtered = notes;

  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase();
    filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery)
    );
  }

  const sorted = [...filtered].sort((a, b) => {
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
