import { writable } from "svelte/store";

interface Mp3Directory {
  name: string;
  mp3Files: string[];
}

export const dir = writable<Mp3Directory>({ name: "", mp3Files: [] });
