import { writable } from "svelte/store";
import type { Track } from "../types";

export let emptyTrack: Track = {
  name: "",
  tags: {
    album: "",
    artist: "",
    comment: {
      language: "",
      text: "",
    },
    genre: "",
    APIC: "",
    title: "",
    trackNumber: "",
    trackNum: 0,
    totalTracks: 0,
    year: "",
  },
};

export const currentTrack = writable<Track>(emptyTrack);
