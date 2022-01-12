const { contextBridge, ipcRenderer, dialog } = require("electron");
const NodeID3 = require("node-id3");
const { readFileSync, writeFileSync, readdirSync } = require("fs");

/*
  getTotalTracks
  ----------------
  returns the total tracks in a folder by
  reading the directory and filtering out
  all non-mp3 files, then returning the
  length
*/
getTotalTracks = (dir) => {
  return readdirSync(dir).filter((file) => file.endsWith(".mp3")).length;
};

const api = {
  on: (event, callback) => {
    if (event === "dir-opened") {
      ipcRenderer.on("dir-opened", (event, args) => {
        callback(args);
      });
    }
  },

  openDir: () => {
    ipcRenderer.send("open-dir");
  },

  openFile: (dir, path, callback) => {
    const buffer = readFileSync(`${dir}/${path}`);
    let tags = NodeID3.read(buffer);
    tags = {
      album: tags.album || "",
      artist: tags.artist || "",
      comment: {
        language: "eng",
        text: tags.comment.text || "",
      },
      genre: tags.genre || "",
      APIC: tags.raw.APIC.imageBuffer || "",
      title: tags.title || "",
      trackNumber: tags.trackNumber || "",
      trackNum: tags.trackNumber ? Number(tags.trackNumber.split("/")[0]) : 0,

      totalTracks: getTotalTracks(dir),
      year: tags.year || "",
    };
    return { name: path, tags };
  },

  saveTrack: (path, tags) => {
    tags.APIC = Buffer.from(tags.APIC || "");
    const buffer = readFileSync(path);
    const newBuffer = NodeID3.update(tags, buffer);
    writeFileSync(path, newBuffer);
  },

  getFileBuffer: (path) => {
    return readFileSync(path);
  },
};

contextBridge.exposeInMainWorld("api", api);
