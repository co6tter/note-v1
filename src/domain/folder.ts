import { type Id } from "../../convex/_generated/dataModel";

export class Folder {
  id: Id<"folders">;
  name: string;
  createdTime: number;

  constructor(id: Id<"folders">, name: string, createdTime: number) {
    this.id = id;
    this.name = name;
    this.createdTime = createdTime;
  }
}
