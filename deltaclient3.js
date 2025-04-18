// New redesigned AgarBot panel with separate settings modal
window.realnames = !0;
window.loadedBar = !1;
window.loadedBarBots = !1;
window.maxBotsS = 0;
window.botsDyn = 0;
window.feedButtonPressed = !1;
window.isdead = !0;
window.startbot = !1;
window.CurrentServerPlaying = null;
window.playingtime = !1;
window.kick = !1;
window.ghostCells = [];
window.ghostCells = [{'x':0,'y':0,'size':0,'mass':0,}];
window.botr = !1;
window.settingsOpen = false;

class GUI {
  constructor(t) {
    this.socket = t;
    this.player = this.socket.player;
    this.body = document.getElementsByTagName("body")[0];
    
    // Main mini panel
    this.miniPanel = {
      container: document.createElement("div"),
      title: document.createElement("div"),
      botsCount: document.createElement("div"),
      statusButton: document.createElement("button"),
      settingsButton: document.createElement("button")
    };
    
    // Settings panel
    this.settingsPanel = {
      overlay: document.createElement("div"),
      container: document.createElement("div"),
      header: document.createElement("div"),
      title: document.createElement("div"),
      closeButton: document.createElement("button"),
      content: document.createElement("div"),
      keybinds: {
        eject: this.createKeybindRow("Eject"),
        split: this.createKeybindRow("Split"),
        splitX2: this.createKeybindRow("Split×2"),
        splitX4: this.createKeybindRow("Split×4"),
        botmode: this.createKeybindRow("Bot Mode"),
        botdestination: this.createKeybindRow("Bot Destination"),
        vShield: this.createKeybindRow("Shield"),
        botspec: this.createKeybindRow("Bot Spec"),
        toggle: this.createKeybindRow("Toggle Bots")
      },
      botSlider: document.createElement("div"),
      botModeInfo: document.createElement("div"),
      botDestInfo: document.createElement("div"),
      vShieldInfo: document.createElement("div"),
      botSpecInfo: document.createElement("div"),
      saveButton: document.createElement("button")
    };
    
    this.initialized = false;
    this.rowsinit = false;
    this.initialize();
  }

  createKeybindRow(label) {
    const row = document.createElement("div");
    const labelEl = document.createElement("span");
    const input = document.createElement("input");
    
    labelEl.textContent = label + ":";
    input.setAttribute("maxlength", "1");
    
    row.appendChild(labelEl);
    row.appendChild(input);
    
    return {row, input};
  }
  
  initialize() {
    try {
      var thot = this;
      
      // Set up event listeners
      window.app.on("spawn", (tab) => {
        window.isdead = false;
        console.log("Client spawned");
      });
      
      window.app.on("death", () => {
        window.isdead = true;
      });
      
      // Initialize Mini Panel
      this.setupMiniPanel();
      
      // Initialize Settings Panel
      this.setupSettingsPanel();
      
      // Add panels to body
      this.body.appendChild(this.miniPanel.container);
      this.body.appendChild(this.settingsPanel.overlay);
      
      this.initialized = true;
      
      // Update after setup
      setTimeout(() => {
        this.updatePanels();
      }, 500);
    } catch (t) {
      throw new Error(t);
    }
  }
  
  setupMiniPanel() {
    // Setup mini panel
    this.miniPanel.container.setAttribute("class", "agar-mini-panel");
    this.miniPanel.container.setAttribute("style", `
      position: fixed;
      z-index: 999;
      left: 10px;
      top: 10px;
      background: rgba(10, 10, 10, 0.85);
      border: 1px solid #555;
      padding: 8px;
      border-radius: 8px;
      box-shadow: 0 0 12px rgba(0,0,0,0.6);
      font-family: 'Ubuntu', sans-serif;
      width: 120px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    `);
    
    // Title
    this.miniPanel.title.textContent = "AGARBOT";
    this.miniPanel.title.setAttribute("style", `
      color: #00aaff;
      font-weight: bold;
      text-align: center;
      font-size: 14px;
      margin-bottom: 5px;
    `);
    
    // Bots count
    this.miniPanel.botsCount.setAttribute("style", `
      color: #eee;
      font-size: 12px;
      text-align: center;
    `);
    
    // Status button
    this.miniPanel.statusButton.setAttribute("style", `
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px;
      cursor: pointer;
      font-size: 11px;
      width: 100%;
      margin-top: 2px;
    `);
    this.miniPanel.statusButton.textContent = "Start";
    this.miniPanel.statusButton.onclick = () => this.toggleBots();
    
    // Settings button
    this.miniPanel.settingsButton.setAttribute("style", `
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px;
      cursor: pointer;
      font-size: 11px;
      width: 100%;
    `);
    this.miniPanel.settingsButton.textContent = "Settings";
    this.miniPanel.settingsButton.onclick = () => this.toggleSettingsPanel();
    
    // Append elements to container
    this.miniPanel.container.appendChild(this.miniPanel.title);
    this.miniPanel.container.appendChild(this.miniPanel.botsCount);
    this.miniPanel.container.appendChild(this.miniPanel.statusButton);
    this.miniPanel.container.appendChild(this.miniPanel.settingsButton);
  }
  
  setupSettingsPanel() {
    // Overlay
    this.settingsPanel.overlay.setAttribute("style", `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 1000;
      display: none;
      justify-content: center;
      align-items: center;
    `);
    
    // Container
    this.settingsPanel.container.setAttribute("style", `
      background: rgba(30, 30, 30, 0.95);
      border: 1px solid #555;
      border-radius: 8px;
      width: 300px;
      max-height: 80vh;
      overflow-y: auto;
      padding: 15px;
      font-family: 'Ubuntu', sans-serif;
    `);
    
    // Header
    this.settingsPanel.header.setAttribute("style", `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      border-bottom: 1px solid #555;
      padding-bottom: 8px;
    `);
    
    // Title
    this.settingsPanel.title.textContent = "AgarBot Settings";
    this.settingsPanel.title.setAttribute("style", `
      color: #00aaff;
      font-weight: bold;
      font-size: 16px;
    `);
    
    // Close button
    this.settingsPanel.closeButton.textContent = "×";
    this.settingsPanel.closeButton.setAttribute("style", `
      background: none;
      border: none;
      color: #eee;
      font-size: 20px;
      cursor: pointer;
    `);
    this.settingsPanel.closeButton.onclick = () => this.toggleSettingsPanel();
    
    // Content
    this.settingsPanel.content.setAttribute("style", `
      display: flex;
      flex-direction: column;
      gap: 12px;
    `);
    
    // Style all keybind rows
    Object.keys(this.settingsPanel.keybinds).forEach(key => {
      const {row, input} = this.settingsPanel.keybinds[key];
      
      row.setAttribute("style", `
        display: flex;
        justify-content: space-between;
        align-items: center;
      `);
      
      row.querySelector("span").setAttribute("style", `
        color: #eee;
        font-size: 13px;
      `);
      
      input.setAttribute("style", `
        width: 30px;
        height: 25px;
        background: #2c3e50;
        border: 1px solid #555;
        color: #FFF;
        text-align: center;
        cursor: pointer;
        outline: none;
        border-radius: 4px;
        text-transform: uppercase;
        font-size: 12px;
      `);
      
      input.setAttribute("id", key);
      input.addEventListener("input", e => this.onChange(e), false);
      input.onclick = e => e.target.select();
      
      this.settingsPanel.content.appendChild(row);
    });
    
    // Bot slider
    this.settingsPanel.botSlider.setAttribute("id", "botnum");
    this.settingsPanel.botSlider.setAttribute("style", `
      width: 100%;
      margin: 8px 0;
    `);
    
    // Status info rows
    const infoStyles = `
      color: #eee;
      font-size: 13px;
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
    `;
    
    this.settingsPanel.botModeInfo.setAttribute("style", infoStyles);
    this.settingsPanel.botDestInfo.setAttribute("style", infoStyles);
    this.settingsPanel.vShieldInfo.setAttribute("style", infoStyles);
    this.settingsPanel.botSpecInfo.setAttribute("style", infoStyles);
    
    // Save button
    this.settingsPanel.saveButton.textContent = "Save Settings";
    this.settingsPanel.saveButton.setAttribute("style", `
      background: #27ae60;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px;
      cursor: pointer;
      font-size: 13px;
      margin-top: 15px;
      width: 100%;
    `);
    this.settingsPanel.saveButton.onclick = () => this.toggleSettingsPanel();
    
    // Assemble header
    this.settingsPanel.header.appendChild(this.settingsPanel.title);
    this.settingsPanel.header.appendChild(this.settingsPanel.closeButton);
    
    // Add elements to content
    this.settingsPanel.content.appendChild(this.settingsPanel.botSlider);
    this.settingsPanel.content.appendChild(this.settingsPanel.botModeInfo);
    this.settingsPanel.content.appendChild(this.settingsPanel.botDestInfo);
    this.settingsPanel.content.appendChild(this.settingsPanel.vShieldInfo);
    this.settingsPanel.content.appendChild(this.settingsPanel.botSpecInfo);
    this.settingsPanel.content.appendChild(this.settingsPanel.saveButton);
    
    // Assemble settings panel
    this.settingsPanel.container.appendChild(this.settingsPanel.header);
    this.settingsPanel.container.appendChild(this.settingsPanel.content);
    this.settingsPanel.overlay.appendChild(this.settingsPanel.container);
  }
  
  toggleSettingsPanel() {
    window.settingsOpen = !window.settingsOpen;
    this.settingsPanel.overlay.style.display = window.settingsOpen ? "flex" : "none";
    if (window.settingsOpen) {
      this.updateSettingsPanel();
    }
  }
  
  updateBar() {
    if (this.socket.Transmitter.status.initialized) {
      if (window.sliderValue) {
        if (this.player.decoded.currentBots > window.sliderValue) {
          this.player.decoded.currentBots = window.sliderValue;
        }
        this.player.decoded.botsMax = window.sliderValue;
      }
    }
  }
  
  calculateTime() {
    const t = new Date();
    var e = new Date(this.player.decoded.expire) - t;
    if (window.playingtime) {
      window.expiretime--;
      e = window.expiretime * 1000;
    }
    var d = Math.floor(e / 86400000),
        s = Math.floor(e % 864e5 / 36e5),
        i = Math.floor(e % 36e5 / 6e4),
        o = Math.floor(e % 6e4 / 1e3);
    
    let timeDisplay = "";
    if (e < 0) {
      timeDisplay = "Expired/No Plan!";
    } else {
      timeDisplay = d + "d " + s + "h " + i + "m " + o + "s";
    }
    
    // Update in settings panel
    if (this.settingsPanel.subscriptionInfo) {
      this.settingsPanel.subscriptionInfo.textContent = "Subscription ends in: " + timeDisplay;
    }
  }
  
  getBotMode() {
    const t = this.socket.Transmitter.status.initialized,
          e = this.socket.Transmitter.status.botmode;
    return t ? 0 === e ? "Normal" : 1 === e ? "Farmer" : 2 === e ? "Normal" : 10 === e ? "Farmer" : 1337 === e ? "No AI" : void 0 : "Not connected!";
  }
  
  getvShieldMode() {
    const t = this.socket.Transmitter.status.initialized,
          e = this.socket.Transmitter.status.vshield;
    return t ? e ? "Actived" : "Disabled" : "Not connected!";
  }
  
  getmassbots() {
    const t = this.socket.Transmitter.status.initialized,
          e = this.socket.Transmitter.status.massbots;
    return t ? e ? "Actived" : "Disabled" : "Not connected!";
  }
  
  getbotspec() {
    const t = this.socket.Transmitter.status.initialized,
          e = this.socket.Transmitter.status.botspec;
    return t ? e ? "Actived" : "Disabled" : "Not connected!";
  }
  
  getbotdestinationMode() {
    const t = this.socket.Transmitter.status.initialized,
          e = this.socket.Transmitter.status.botdestination;
    return t ? e ? "Cell" : "Mouse" : "Not connected!";
  }
  
  onChange(t) {
    const e = t.target,
          s = t.data;
    
    if (!s) return this.updatePanels();
    
    if (e === document.getElementById("eject")) {
      this.socket.Hotkeys.keys.eject = s;
      this.socket.Hotkeys.setStorage("eject", s);
    } else if (e === document.getElementById("split")) {
      this.socket.Hotkeys.keys.split = s;
      this.socket.Hotkeys.setStorage("split", s);
    } else if (e === document.getElementById("splitX2")) {
      this.socket.Hotkeys.keys.splitX2 = s;
      this.socket.Hotkeys.setStorage("splitX2", s);
    } else if (e === document.getElementById("splitX4")) {
      this.socket.Hotkeys.keys.splitX4 = s;
      this.socket.Hotkeys.setStorage("splitX4", s);
    } else if (e === document.getElementById("botmode")) {
      this.socket.Hotkeys.keys.botmode = s;
      this.socket.Hotkeys.setStorage("botmode", s);
    } else if (e === document.getElementById("botdestination")) {
      this.socket.Hotkeys.keys.botdestination = s;
      this.socket.Hotkeys.setStorage("botdestination", s);
    } else if (e === document.getElementById("botspec")) {
      this.socket.Hotkeys.keys.botspec = s;
      this.socket.Hotkeys.setStorage("botspec", s);
    } else if (e === document.getElementById("toggle")) {
      this.socket.Hotkeys.keys.toggle = s;
      this.socket.Hotkeys.setStorage("toggle", s);
    } else if (e === document.getElementById("vShield")) {
      this.socket.Hotkeys.keys.vShield = s;
      this.socket.Hotkeys.setStorage("vShield", s);
    }
  }
  
  updatePanels() {
    // Update mini panel
    if (this.player.decoded.botsMax === undefined) {
      this.miniPanel.botsCount.textContent = "Authenticating...";
    } else {
      this.miniPanel.botsCount.textContent = `Bots: ${this.player.decoded.currentBots}/${this.player.decoded.botsMax === 500 ? 0 : this.player.decoded.botsMax}`;
    }
    
    this.updateBotStatus();
    
    // Update settings panel inputs
    if (this.rowsinit) {
      this.updateSettingsPanel();
    } else {
      // Initialize bot slider
      if (!window.loadedBar) {
        window.loadedBar = true;
        
        let BotsDetected = setInterval(() => {
          if (this.player.decoded.botsMax != 0 && !window.loadedBarBots) {
            window.maxBotsS = this.player.decoded.botsMax;
            clearInterval(BotsDetected);
            window.loadedBarBots = true;
            
            var c = document.getElementById("botnum");
            if (typeof noUiSlider !== 'undefined') {
              noUiSlider.create(c, {
                start: 0,
                step: 1,
                range: {
                  min: 0,
                  max: parseInt(this.player.decoded.botsMax)
                },
                format: wNumb({
                  decimals: 0,
                  thousand: '.',
                  postfix: ' ',
                }),
                tooltips: true,
                direction: 'ltr'
              });
              
              c.noUiSlider.set(parseInt(this.player.decoded.botsMax));
              
              c.noUiSlider.on('change', (values, handle) => {
                window.sliderValue = parseInt(c.noUiSlider.get().toString().replace(/\s+/g, ''));
                window.botsDyn = parseInt(window.sliderValue.toString().replace(/\s+/g, ''));
                
                if (window.botr) {
                  this.socket.send({
                    req: 99,
                    botdynv2: parseInt(window.sliderValue.toString().replace(/\s+/g, ''))
                  });
                }
              });
            }
          }
        }, 1000);
      }
      
      this.updateSettingsPanel();
      this.rowsinit = true;
    }
  }
  
  updateSettingsPanel() {
    // Set keybind values
    this.settingsPanel.keybinds.eject.input.value = this.socket.Hotkeys.keys.eject;
    this.settingsPanel.keybinds.split.input.value = this.socket.Hotkeys.keys.split;
    this.settingsPanel.keybinds.splitX2.input.value = this.socket.Hotkeys.keys.splitX2;
    this.settingsPanel.keybinds.splitX4.input.value = this.socket.Hotkeys.keys.splitX4;
    this.settingsPanel.keybinds.botmode.input.value = this.socket.Hotkeys.keys.botmode;
    this.settingsPanel.keybinds.botdestination.input.value = this.socket.Hotkeys.keys.botdestination;
    this.settingsPanel.keybinds.botspec.input.value = this.socket.Hotkeys.keys.botspec;
    this.settingsPanel.keybinds.vShield.input.value = this.socket.Hotkeys.keys.vShield;
    this.settingsPanel.keybinds.toggle.input.value = this.socket.Hotkeys.keys.toggle;
    
    // Update status info
    this.settingsPanel.botModeInfo.innerHTML = `<span>Bot Mode:</span> <span>${this.getBotMode()}</span>`;
    this.settingsPanel.botDestInfo.innerHTML = `<span>Destination:</span> <span>${this.getbotdestinationMode()}</span>`;
    this.settingsPanel.vShieldInfo.innerHTML = `<span>Shield:</span> <span>${this.getvShieldMode()}</span>`;
    this.settingsPanel.botSpecInfo.innerHTML = `<span>Bot Spec:</span> <span>${this.getbotspec()}</span>`;
  }
  
  toggleBots() {
    if (window.startbot) {
      window.startbot = false;
      window.botr = false;
      if (this.socket.ws && this.socket.ws.readyState === 1) {
        this.socket.ws.close();
        setTimeout(() => {
          this.socket.connect("wss://gamesrv.agarbot.ovh:8443");
        }, 500);
      }
    } else {
      window.startbot = true;
      window.botr = true;
      this.socket.Transmitter.status.botspec = 1;
    }
    this.updateBotStatus();
  }
  
  updateBotStatus() {
    this.miniPanel.statusButton.textContent = window.startbot ? "Stop" : "Start";
    this.miniPanel.statusButton.style.background = window.startbot ? "#27ae60" : "#e74c3c";
  }
  
  update() {
    this.initialized && this.updateBar();
    this.updatePanels();
  }
}

// Rest of the code remains the same as the original except for GUI class changes
// Transmitter, Reader, MoreBotsHotkeys and AgarBot classes can be kept as is

class Transmitter {
  constructor(t) {
    this.socket = t,
    this.status = {
      initialized: false,
      botdestination: 0,
      vshield: 0,
      botspec: 0,
      massbots: false,
      botmode: 0
    }
  }
  
  handshake(t, e) {
    let s = {};
    s.req = 1, s.ver = 3, this.socket.send(s);
    this.start();
  }
  
  start() {
    this.moveInterval = setInterval(() => {
      this.sendPosition();
    }, 50);
  }
  
  sendSplit() {
    console.log("sent split!"), this.socket.send({
      req: 3,
      cmd: 'split'
    });
  }
  
  sendPosition() {
    if (app && app.unitManager && app.unitManager.activeUnit && app.unitManager.activeUnit.protocol_view.x && app.unitManager.activeUnit.protocol_view.y) {
      var gamePkt = {};
      gamePkt.coords = {
        mouse: {},
        fence: {},
        cell: {},
        mod: 0
      };
      
      if (this.status.botdestination) {
        gamePkt.coords.mouse.x = app.unitManager.activeUnit.protocol_view.x;
        gamePkt.coords.mouse.y = app.unitManager.activeUnit.protocol_view.y;
      } else {
        gamePkt.coords.mouse.x = app.stage.mouseWorldX;
        gamePkt.coords.mouse.y = app.stage.mouseWorldY;
      }
      
      gamePkt.coords.fence.x = 0;
      gamePkt.coords.fence.y = 0;
      gamePkt.coords.cell.x = app.unitManager.activeUnit.protocol_view.x;
      gamePkt.coords.cell.y = app.unitManager.activeUnit.protocol_view.y;
      
      if (window.isdead) {
        gamePkt.ghostX = leaderboard.ghostCells[0].x;
        gamePkt.ghostY = leaderboard.ghostCells[0].y;
      } else if (leaderboard.ghostCells[0] && leaderboard.ghostCells[0].mass > app.unitManager.activeUnit.mass) {
        gamePkt.ghostX = leaderboard.ghostCells[0].x;
        gamePkt.ghostY = leaderboard.ghostCells[0].y;
      } else {
        gamePkt.ghostX = app.unitManager.activeUnit.protocol_view.x;
        gamePkt.ghostY = app.unitManager.activeUnit.protocol_view.y;
      }
      
      gamePkt.clientname = app.unitManager.activeUnit.nick;
      gamePkt.coords.mod = this.status.botmode;
      gamePkt.coords.vmod = this.status.vshield;
      gamePkt.coords.botspec = this.status.botspec;
      gamePkt.coords.massbots = this.status.massbots;
      gamePkt.botsDyn = parseInt(window.botsDyn.toString().replace(/\s+/g, ''));
      gamePkt.isdead = window.isdead;
      gamePkt.partyWebSocket = app.server.ws.replace(":443", "/");
      gamePkt.feedButtonPressed = window.feedButtonPressed;
      
      if (window.botr && window.startbot) {
        this.socket.send({
          req: 2,
          data: gamePkt
        });
      }
    }
  }
  
  setBotMode() {
    this.setBotModeCode(), console.log("sent bot mode!");
  }
  
  vShield() {
    this.setvShieldCode(), console.log("sent vshield!");
  }
  
  botspec() {
    this.setbotspec(), console.log("sent botspec!");
  }
  
  massbots() {
    this.setmassbots(), console.log("sent massbots!");
  }
  
  botdestination() {
    this.setbotdestination(), console.log("bot destination!");
  }
  
  setvShieldCode() {
    return 0 === this.status.vshield ? this.status.vshield = 1 : 1 === this.status.vshield && (this.status.vshield = 0), this.status.vshield;
  }
  
  setbotspec() {
    return 0 === this.status.botspec ? this.status.botspec = 1 : 1 === this.status.botspec && (this.status.botspec = 0), this.status.botspec;
  }
  
  setmassbots() {
    return !1 === this.status.massbots ? this.status.massbots = !0 : !0 === this.status.massbots && (this.status.massbots = !1), this.status.massbots;
  }
  
  setbotdestination() {
    return 0 === this.status.botdestination ? this.status.botdestination = 1 : 1 === this.status.botdestination && (this.status.botdestination = 0), this.status.botdestination;
  }
  
  setBotModeCode() {
    return 0 === this.status.botmode ? this.status.botmode = 1 : 1 === this.status.botmode && (this.status.botmode = 0), this.status.botmode;
  }
}

class Reader {
  constructor(t) {
    this.socket = t;
    this.player = t.player;
  }
  
  read(t) {
    const e = t.data;
    
    if (1 == JSON.parse(e).req) {
      window.kick = !0;
      this.socket.GUI.miniPanel.botsCount.textContent = "Kicked, refresh";
    }
    
    if (2 == JSON.parse(e).req) {
      var parsed = JSON.parse(e);
      parsed.currentBots = 0;
      parsed.expire = parsed.expireTime;
      console.log('loaded', e);
      this.player.initialized = 1;
      this.player.decoded = parsed;
      
      if (this.player.decoded.playingtime) 
        window.playingtime = !0;
      
      window.expiretime = this.player.decoded.expire;
      window.expireTimeInt = setInterval(() => {
        this.socket.GUI.calculateTime();
      }, 1000);
      
      this.socket.GUI.update();
    }
    
    if (3 == JSON.parse(e).req) {
      var parsed = JSON.parse(e);
      parsed.currentBots = parsed.spawn;
      
      if (this.player.decoded.botsMax === undefined) {
        this.player.decoded.botsMax = 0;
      }
      
      parsed.botsMax = parseInt(this.player.decoded.botsMax.toString().replace(/\s+/g, ''));
      window.botsDyn = parseInt(this.player.decoded.botsMax.toString().replace(/\s+/g, ''));
      
      if (window.botr) {
        this.socket.send({
          req: 99,
          botdynv2: parseInt(window.botsDyn.toString().replace(/\s+/g, ''))
        });
      }
      
      parsed.expire = this.player.decoded.expire;
      this.player.decoded = parsed;
      this.socket.GUI.update();
    }
  }
}

class MoreBotsHotkeys {
  constructor(t) {
    this.socket = t;
    this.Transmitter = t.Transmitter;
    this.storagekey = "agarbotdelta35_hotkeys";
    this.keys = {
      eject: this.getStorage("eject"),
      split: this.getStorage("split"),
      splitX2: this.getStorage("splitX2"),
      splitX4: this.getStorage("splitX4"),
      botmode: this.getStorage("botmode"),
      botdestination: this.getStorage("botdestination"),
      vShield: this.getStorage("vShield"),
      botspec: this.getStorage("botspec"),
      toggle: this.getStorage("toggle"),
            startStop: this.getStorage("startStop")
        }, this.active = new Set, this.macro = null, this.keydown(), this.keyup()
    }
    keydown() {
        document.body.addEventListener("keydown", t => {
            const e = t.keyCode;
            if (document.getElementById('message-box').style.display == 'none') {
                if (!(8 === e || t.ctrlKey || t.shiftKey || t.altKey)) {
                    if (e === this.getKey(this.keys.eject)) {
                        window.feedButtonPressed = !0;
                        if (this.isActive(this.keys.eject)) return;
                        this.active.add(this.keys.eject);
                        window.feedButtonPressed = !0
                    }
                    if (e === this.getKey(this.keys.split)) {
                        if (this.isActive(this.keys.split)) return;
                        this.active.add(this.keys.split);
                        this.socket.Transmitter.sendSplit()
                    }
                    if (e === this.getKey(this.keys.splitX2)) {
                        if (this.isActive(this.keys.splitX2)) return;
                        this.active.add(this.keys.splitX2);
                        for (let i = 0; i < 2; i++) {
                            setTimeout(() => {
                                this.socket.Transmitter.sendSplit()
                            }, 40 * i)
                        }
                    }
                    if (e === this.getKey(this.keys.splitX4)) {
                        if (this.isActive(this.keys.splitX4)) return;
                        this.active.add(this.keys.splitX4);
                        for (let i = 0; i < 4; i++) {
                            setTimeout(() => {
                                this.socket.Transmitter.sendSplit()
                            }, 40 * i)
                        }
                    }
                    if (e === this.getKey(this.keys.botmode)) {
                        if (this.isActive(this.keys.botmode)) return;
                        this.active.add(this.keys.botmode), this.socket.Transmitter.setBotMode()
                    }
                    if (e === this.getKey(this.keys.vShield)) {
                        if (this.isActive(this.keys.vShield)) return;
                        this.active.add(this.keys.vShield), this.socket.Transmitter.vShield()
                    }
                    if (e === this.getKey(this.keys.botspec)) {
                        if (this.isActive(this.keys.botspec)) return;
                        this.active.add(this.keys.botspec), this.socket.Transmitter.botspec()
                    }
                    if (e === this.getKey(this.keys.toggle)) {
                        if (this.isActive(this.keys.toggle)) return;
                        this.active.add(this.keys.toggle);
                        this.socket.GUI.toggleBots()
                    }
                    if (e === this.getKey(this.keys.botdestination)) {
                        if (this.isActive(this.keys.botdestination)) return;
                        this.active.add(this.keys.botdestination), this.socket.Transmitter.botdestination()
                    }
                }
            }
        }), app.on("spawn", t => {
            this.Transmitter.status.initialized = 1;
            this.socket.GUI.initialized = 1;
            this.socket.GUI.updateRows();
            window.CurrentServerPlaying = window.currentServer
        }), app.server.on("estabilished", t => {
            let serv = app.server.ws;
            this.socket.change(serv)
        })
    }
    keyup() {
        document.body.addEventListener("keyup", t => {
            if (document.getElementById('message-box').style.display == 'none') {
                const e = t.keyCode;
                8 === e || t.ctrlKey || t.shiftKey || t.altKey || (e === this.getKey(this.keys.eject) && (this.active.delete(this.keys.eject)), window.feedButtonPressed = !1, e === this.getKey(this.keys.split) && this.active.delete(this.keys.split), e === this.getKey(this.keys.splitX2) && this.active.delete(this.keys.splitX2), e === this.getKey(this.keys.splitX4) && this.active.delete(this.keys.splitX4), e === this.getKey(this.keys.botmode) && this.active.delete(this.keys.botmode), e === this.getKey(this.keys.botdestination) && this.active.delete(this.keys.botdestination), e === this.getKey(this.keys.vShield) && this.active.delete(this.keys.vShield), e === this.getKey(this.keys.toggle) && this.active.delete(this.keys.toggle), e === this.getKey(this.keys.botspec) && this.active.delete(this.keys.botspec), this.socket.GUI.updateRows())
            }
        })
    }
    setStorage(t, e) {
        const s = JSON.parse(localStorage.getItem(this.storagekey));
        s[t] = e, localStorage.setItem(this.storagekey, JSON.stringify(s)), this.keys[t] = e.toUpperCase(), this.socket.GUI.updateRows()
    }
    getStorage(t) {
        return localStorage.hasOwnProperty(this.storagekey) || localStorage.setItem(this.storagekey, JSON.stringify({
            eject: "C",
            split: "X",
            splitX2: "E",
            splitX4: "R",
            botmode: "M",
            botdestination: "D",
            vShield: "V",
            botspec: "B",
            toggle: "P",
            startStop: "1"
        })), JSON.parse(localStorage.getItem(this.storagekey))[t]
    }
    isActive(t) {
        return this.active.has(t)
    }
    getKey(t) {
        return t.toUpperCase().charCodeAt()
    }
}
class AgarBot {
    constructor(t) {
        this.ip = "", this.ws = null, this.player = {
            isPremium: !1,
            PremiumType: 0,
            PureFeeder: !1,
            startTime: Date.now(),
            decoded: {},
            initialized: !1,
        }, this.GUI = new GUI(this), this.Reader = new Reader(this), this.Transmitter = new Transmitter(this), this.Hotkeys = new MoreBotsHotkeys(this), this.get = function(t, e) {
            let s = new XMLHttpRequest;
            s.open("GET", t), s.send(), s.onload = function() {
                200 != s.status ? lert("Response failed") : e(s.responseText)
            }, s.onerror = function() {
                alert("Request failed")
            }
        }, this.connect("wss://gamesrv.agarbot.ovh:8443")
    }
    connect(t) {
        this.ip = "wss://gamesrv.agarbot.ovh";
        let reconnectDelay = 2000;
        let maxRetries = 2000;
        let attempt = 0;
        const connectWebSocket = () => {
            console.log(`[AGARBOT] Trying connect (${attempt + 1}/${maxRetries +1})...`);
            this.ws = new WebSocket(this.ip);
            this.ws.onopen = () => {
                attempt = 0;
                console.log("[AGARBOT] connected");
                this.onopen()
            };
            this.ws.onmessage = t => this.Reader.read(t);
            this.ws.onerror = () => {
                console.warn("[AGARBOT] Websocket error !")
            };
            this.ws.onclose = () => {
                console.warn("[AGARBOT] closed");
                window.playingtime = !1;
                clearInterval(window.expireTimeInt);
                if (++attempt <= maxRetries && !window.kick && window.startbot) {
                    console.log(`[AGARBOT] Reconnect in ${reconnectDelay / 3000} sec...`);
                    setTimeout(connectWebSocket, reconnectDelay)
                } else {
                    console.error("[AGARBOT] kicked or Too many fail.")
                }
            }
        };
        connectWebSocket()
    }
    onopen() {
        window.sliderValue = undefined;
        console.log("[AGARBOT] Authenticating to the server!"), this.Transmitter.handshake("220720", "Delta")
        setTimeout(() => {
            if (this.GUI && this.GUI.updateBotStatus) {
                this.GUI.updateBotStatus()
            }
        }, 700)
    }
    send(t) {
        this.ws && this.ip && 1 === this.ws.readyState && this.ws.send(JSON.stringify(t))
    }
    reset() {
        this.player = {
            isPremium: !1,
            PremiumType: 0,
            PureFeeder: !1,
            startTime: Date.now(),
            decoded: {
                currentBots: 0
            },
            initialized: !1
        }, this.Transmitter.status = {
            initialized: !1,
            vshield: 0,
            botspec: 0,
            massbots: !1,
            botmode: 0,
            botdestination: 0
        }
    }
    change(serv) {
        console.log('#1 CHANGE SERVER TO ' + serv + ' OLD ' + window.currentServer);
        if (window.currentServer != serv && serv) {
            console.log('#2 CHANGE SERVER TO ' + serv + ' OLD ' + window.currentServer);
            window.currentServer = serv;
            var gamePkt = {};
            gamePkt.coords = {
                mouse: {},
                fence: {},
                cell: {},
                mod: 0
            };
            try {
                if (this.status && this.status.botdestination) {
                    gamePkt.coords.mouse.x = app.unitManager.activeUnit.protocol_view.x;
                    gamePkt.coords.mouse.y = app.unitManager.activeUnit.protocol_view.y
                } else {
                    gamePkt.coords.mouse.x = app.stage.mouseWorldX;
                    gamePkt.coords.mouse.y = app.stage.mouseWorldY
                }
                gamePkt.coords.fence.x = 0;
                gamePkt.coords.fence.y = 0;
                if (this.status) {
                    gamePkt.coords.cell.x = app.unitManager.activeUnit.protocol_view.x;
                    gamePkt.coords.cell.y = app.unitManager.activeUnit.protocol_view.y
                } else {
                    gamePkt.coords.cell.x = 0;
                    gamePkt.coords.cell.y = 0
                }
                if (this.status) {
                    if (window.isdead) {
                        gamePkt.ghostX = leaderboard.ghostCells[0].x;
                        gamePkt.ghostY = leaderboard.ghostCells[0].y
                    } else if (leaderboard.ghostCells[0] && leaderboard.ghostCells[0].mass > app.unitManager.activeUnit.mass) {
                        gamePkt.ghostX = leaderboard.ghostCells[0].x;
                        gamePkt.ghostY = leaderboard.ghostCells[0].y
                    } else {
                        gamePkt.ghostX = app.unitManager.activeUnit.protocol_view.x;
                        gamePkt.ghostY = app.unitManager.activeUnit.protocol_view.y
                    }
                } else {
                    gamePkt.ghostX = 0;
                    gamePkt.ghostY = 0
                }
                if (app && app.unitManager && app.unitManager.activeUnit) {
                    gamePkt.clientname = app.unitManager.activeUnit.nick
                } else {
                    gamePkt.clientname = ""
                }
                if (this.status) {
                    gamePkt.coords.mod = this.status.botmode;
                    gamePkt.coords.vmod = this.status.vshield;
                    gamePkt.coords.botspec = this.status.botspec;
                    gamePkt.coords.massbots = this.status.massbots
                } else {
                    gamePkt.coords.mod = 1;
                    gamePkt.coords.vmod = 0;
                    gamePkt.coords.botspec = 0;
                    gamePkt.coords.massbots = !1
                }
                gamePkt.partyWebSocket = app.server.ws.replace(":443", "/");
                gamePkt.feedButtonPressed = window.feedButtonPressed;
                this.ws.send(JSON.stringify({
                    req: 2,
                    data: gamePkt
                }))
            } catch (err) {
                console.log(this);
                console.log(err)
            }
            window.botr = !1
        }
    }
}
let check = setInterval(() => {
    if (window.app !== undefined)
        clearInterval(check);
    document.getElementsByClassName('chatbox')[0].style.zIndex = 9;
    new AgarBot()
}, 500);

function hideHTML(elements) {
    elements = elements.length ? elements : [elements];
    for (var index = 0; index < elements.length; index++) {
        elements[index].style.display = 'none'
    }
}
const originalSend = WebSocket.prototype.send;
window.sockets = [];
WebSocket.prototype.send = function(...args) {
    if (window.sockets.indexOf(this) === -1)
        window.sockets.push(this);
    return originalSend.call(this, ...args)
};
var IntCheckext = setInterval(() => {
    for (let i = 0; i < window.sockets.length; i++) {
        if (window.sockets[i].url.includes('op')) {
            console.log('Detected other ext conflicting with ovh extension');
            window.sockets[i].close();
            hideHTML(document.getElementById('miniUI'));
            hideHTML(document.querySelectorAll('.mainop'));
            clearInterval(IntCheckext)
        }
    }
}, 500);
setTimeout(() => {
    console.log('No conflic ext detected');
    clearInterval(IntCheckext)
}, 10000)
