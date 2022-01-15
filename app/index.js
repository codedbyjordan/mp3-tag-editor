const {
  app,
  BrowserWindow,
  Menu,
  dialog,
  ipcMain,
  ipcRenderer,
} = require("electron");
const { readdirSync, readFileSync } = require("fs");
const path = require("path");
const NodeID3 = require("node-id3");

if (!app.isPackaged) {
  try {
    require("electron-reloader")(module);
  } catch (_) {}
}

let window;

const openDir = () => {
  const dir = dialog.showOpenDialogSync({
    properties: ["openDirectory"],
  });

  if (dir) {
    let contents = readdirSync(dir[0]);
    contents = contents.filter((fileOrDir) => fileOrDir.endsWith(".mp3"));
    window.webContents.send("dir-opened", { name: dir[0], contents });
  }
};

app.whenReady().then(() => {
  window = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });
  if (!app.isPackaged) {
    window.loadURL("http://localhost:3000");
    window.webContents.openDevTools();
  } else {
    window.loadFile(path.join(__dirname, "../public/index.html"));
  }

  const template = [
    { label: "" },
    {
      label: "File",
      submenu: [
        {
          label: "Open...",
          click() {
            openDir();
          },
          accelerator: "CommandOrControl+O",
        },
        {
          label: "Toggle Developer Tools",
          role: "toggleDevTools",
          accelerator: "CommandOrControl+Option+I",
        },
        {
          label: "Quit",
          role: "quit",
          accelerator: "CommandOrControl+Q",
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Reload",
          role: "reload",
          accelerator: "ControlOrCommand+R",
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  window.on("ready-to-show", () => {
    window.show();
  });
});

ipcMain.on("open-dir", (event, args) => openDir());
