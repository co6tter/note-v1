import "./App.css";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const notes = useQuery(api.notes.get);

  return (
    <div className="App">
      {notes?.map(({ _id, title, content }) => (
        <>
          <div key={_id}>{title}</div>
          <p>{content}</p>
        </>
      ))}
    </div>
  );
}

export default App;
