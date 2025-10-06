import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import SideMenu from "./components/SideMenu";
import Editor from "./components/Editor";
import { notesAtom, foldersAtom, isDarkModeAtom } from "./store";
import { useSetAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { Note } from "./domain/note";
import { Folder } from "./domain/folder";

function App() {
  const setNotes = useSetAtom(notesAtom);
  const setFolders = useSetAtom(foldersAtom);
  const isDarkMode = useAtomValue(isDarkModeAtom);
  const initNotes = useQuery(api.notes.get);
  const initFolders = useQuery(api.folders.get);

  useEffect(() => {
    const notes = initNotes?.map(
      (note) =>
        new Note(
          note._id,
          note.title,
          note.content,
          note.lastEditTime,
          note.isFavorite ?? false,
          note.tags ?? [],
          note.folderId ?? null
        )
    );
    setNotes(notes || []);
  }, [initNotes, setNotes]);

  useEffect(() => {
    const folders = initFolders?.map(
      (folder) => new Folder(folder._id, folder.name, folder.createdTime)
    );
    setFolders(folders || []);
  }, [initFolders, setFolders]);

  return (
    <div
      className={`flex h-screen w-full ${isDarkMode ? "bg-gray-950" : "bg-white"}`}
    >
      <SideMenu />
      <Editor />
    </div>
  );
}

export default App;
