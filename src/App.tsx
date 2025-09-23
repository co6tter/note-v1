import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const notes = useQuery(api.notes.get);

  return (
    <div className="App">
      {notes?.map(({ _id, title }) => (
        <div key={_id}>{title}</div>
      ))}
    </div>
  );
}

export default App;
