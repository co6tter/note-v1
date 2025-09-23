import { type Id } from "../../convex/_generated/dataModel";

export class Note {
  id: Id<"notes">;
  title: string;
  content: string;
  lastEditTime: number;

  constructor(
    id: Id<"notes">,
    title: string,
    content: string,
    lastEditTime: number
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.lastEditTime = lastEditTime;
  }
}
