import Dexie, { Table } from "dexie";

export interface ReplyRecord {
    id?: number;
    text: string;
    reply: string;
    type?: "text" | "image";
    imageUrls?: string[];
}

export class ChatDatabase extends Dexie {
    replies!: Table<ReplyRecord>;

    constructor() {
        super("chat-db");
        this.version(1).stores({
            replies: "++id",
        });
    }
}

export const db = new ChatDatabase();
