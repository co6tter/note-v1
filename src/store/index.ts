import { atom } from "jotai";
import { Note } from "../domain/note";
import { type Id } from "../../convex/_generated/dataModel";

export const notesAtom = atom<Note[]>([]);
export const selectedNoteIdAtom = atom<Id<"notes"> | null>(null);
export const searchQueryAtom = atom<string>("");

export const selectedNoteAtom = atom((get) => {
  const notes = get(notesAtom);
  const id = get(selectedNoteIdAtom);
  if (id === null) return null;

  return notes.find((note) => note.id === id);
});

export const filteredNotesAtom = atom((get) => {
  const notes = get(notesAtom);
  const searchQuery = get(searchQueryAtom);

  if (!searchQuery.trim()) return notes;

  const lowerQuery = searchQuery.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery)
  );
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
