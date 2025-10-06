import { type Id } from "../../convex/_generated/dataModel";

export class Note {
  id: Id<"notes">;
  title: string;
  content: string;
  lastEditTime: number;
  isFavorite: boolean;
  tags: string[];
  folderId: Id<"folders"> | null;

  constructor(
    id: Id<"notes">,
    title: string,
    content: string,
    lastEditTime: number,
    isFavorite: boolean = false,
    tags: string[] = [],
    folderId: Id<"folders"> | null = null
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.lastEditTime = lastEditTime;
    this.isFavorite = isFavorite;
    this.tags = tags;
    this.folderId = folderId;
  }
}
