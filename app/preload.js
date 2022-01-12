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
      album: "",
      artist: "",
      comment: {
        language: "",
        text: "",
      },
      genre: "",
      title: "",
      trackNumber: "",
      trackNum: 0,
      totalTracks: 0,
      year: "",
      ...tags,
      APIC: tags.raw.APIC.imageBuffer,
      trackNum: tags.trackNumber ? Number(tags.trackNumber.split("/")[0]) : 1,
      totalTracks: getTotalTracks(dir),
    };

    // remove un-needed properties
    delete tags.image;
    delete tags.raw;

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
