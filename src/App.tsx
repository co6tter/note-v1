import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import SideMenu from "./components/SideMenu";
import Editor from "./components/Editor";
import { notesAtom } from "./store";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { Note } from "./domain/note";

function App() {
  const setNotes = useSetAtom(notesAtom);
  const initNotes = useQuery(api.notes.get);

  useEffect(() => {
    const notes = initNotes?.map(
      (note) => new Note(note._id, note.title, note.content, note.lastEditTime)
    );
    setNotes(notes || []);
  }, [initNotes, setNotes]);

  return (
    <div className="flex h-screen w-full bg-white">
      <SideMenu />
      <Editor />
    </div>
  );
}

export default App;
