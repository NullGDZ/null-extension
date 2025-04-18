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
window.ghostCells = [{
    'x': 0,
    'y': 0,
    'size': 0,
    'mass': 0,
}];
window.botr = !1;
class GUI {
constructor(t) {
    this.socket = t;
    this.player = this.socket.player;
    this.body = document.getElementsByTagName("body")[0];
    this.divs = {
        maindiv: document.createElement("div"),
        img: document.createElement("div"),
        data: document.createElement("div"),
        rows: {
            bots: document.createElement("row"),
            eject: document.createElement("row"),
            split: document.createElement("row"),
            splitX2: document.createElement("row"),
            splitX4: document.createElement("row"),
            botgamemode: document.createElement("row"),
            botdestination: document.createElement("row"),
            vshield: document.createElement("row"),
            botspec: document.createElement("row"),
            massbots: document.createElement("row"),
            endtime: document.createElement("row"),
            startStop: document.createElement("row"),
            botnum: document.createElement("row"),
        }
    };
    this.inputs = {
        eject: document.createElement("input"),
        split: document.createElement("input"),
        splitX2: document.createElement("input"),
        splitX4: document.createElement("input"),
        botgamemode: document.createElement("input"),
        botdestination: document.createElement("input"),
        vShield: document.createElement("input"),
        botspec: document.createElement("input"),
        toggle: document.createElement("input"),
        startStop: document.createElement("input")
    };
    this.initialized = !1;
    this.rowsinit = !1;
    this.initialize();
}
initialize() {
    window.currentServer = '';
    setInterval(function() {
        if (window.CurrentServerPlaying != null && window.currentServer != window.CurrentServerPlaying) {
            window.startbot = !1;
            window.CurrentServerPlaying = window.currentServer
        }
    }, 70);
    
    try {
        var thot = this;
        window.app.on("spawn", (tab) => {
            window.isdead = !1;
            console.log("Client spawned")
        });
        window.app.on("death", () => {
            window.isdead = !0
        });
        
        this.divs.maindiv.setAttribute("class", "muzza-gui glowing-panel");
        this.divs.maindiv.setAttribute("style", `
            width: 160px;
            position: fixed;
            z-index: 999;
            left: 5px;
            top: -88px;
            background: rgba(10, 10, 10, 0.85);
            border: 1px solid #00aaff;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0, 170, 255, 0.7), 0 0 25px rgba(0, 170, 255, 0.4);
            font-family: 'Ubuntu', sans-serif;
            transition: all 0.3s ease;
        `);
        
        // Añadir estilos CSS para el efecto de brillo constante
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .glowing-panel {
                animation: glow 2s infinite alternate;
            }
            
            @keyframes glow {
                from {
                    box-shadow: 0 0 15px rgba(0, 170, 255, 0.7), 0 0 25px rgba(0, 170, 255, 0.4);
                    border-color: #00aaff;
                }
                to {
                    box-shadow: 0 0 20px rgba(0, 170, 255, 0.9), 0 0 30px rgba(0, 170, 255, 0.6);
                    border-color: #33bbff;
                }
            }
            
            .muzza-row {
                border-radius: 5px;
                transition: background-color 0.3s ease;
                padding: 3px 5px !important;
                margin: 2px 0 !important;
            }
            
            .muzza-row:hover {
                background-color: rgba(0, 170, 255, 0.2);
            }
            
            #bot_status {
                font-weight: bold;
                text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            }
            
            input[type="text"] {
                box-shadow: 0 0 5px rgba(0, 170, 255, 0.5);
                transition: all 0.3s ease;
            }
            
            input[type="text"]:hover, input[type="text"]:focus {
                box-shadow: 0 0 10px rgba(0, 170, 255, 0.8);
            }
        `;
        document.head.appendChild(styleElement);
        
        const titleDiv = document.createElement("div");
        titleDiv.textContent = "AGARBOT.OVH";
        titleDiv.setAttribute("style", "color: #00aaff; font-weight: bold; text-align: center; font-size: 19px; margin-bottom: 2px; text-shadow: 0 0 5px rgba(0, 170, 255, 0.5);");
        this.divs.maindiv.appendChild(titleDiv);
        
        const subtitleDiv = document.createElement("div");
        subtitleDiv.textContent = "Modified By Null";
        subtitleDiv.setAttribute("style", "color: #aaa; text-align: center; font-size: 13px; margin-bottom: 6px; text-shadow: 0 0 3px rgba(170, 170, 170, 0.3);");
        this.divs.maindiv.appendChild(subtitleDiv);
        
        const separator = document.createElement("div");
        separator.setAttribute("style", "border-bottom: 1px solid #00aaff; margin-bottom: 6px; box-shadow: 0 1px 5px rgba(0, 170, 255, 0.3);");
        this.divs.maindiv.appendChild(separator);
        
        this.divs.data.setAttribute("class", "data");
        this.divs.data.setAttribute("style", "width: 100%;");
        this.divs.maindiv.appendChild(this.divs.data);
        
        for (const t of Object.keys(this.inputs)) {
            this.inputs[t].setAttribute("id", t);
            this.inputs[t].setAttribute("maxlength", "1");
            this.inputs[t].setAttribute("style", `
                width: 24px;
                height: 24px;
                margin-right: 4px;
                background: #00aaff;
                padding: 0px;
                border: none;
                color: #FFF;
                text-align: center;
                cursor: pointer;
                outline: none;
                border-radius: 4px;
                float: right;
                text-transform: uppercase;
                font-size: 12px;
                box-shadow: 0 0 5px rgba(0, 170, 255, 0.5);
                transition: all 0.2s ease;
            `);
        }
        
        for (const t of Object.keys(this.divs.rows)) {
            this.divs.rows[t].setAttribute("class", "muzza-row");
            this.divs.rows[t].setAttribute("style", `
                color: #EEE;
                line-height: 24px;
                font-size: 12px;
                margin: 0 auto;
                width: 100%;
                padding: 2px 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                text-shadow: 0 0 2px rgba(255, 255, 255, 0.3);
            `);
            this.divs.data.appendChild(this.divs.rows[t]);
            
            let e = document.createElement("hr");
            e.setAttribute("id", t);
            e.setAttribute("style", "display: none;");
            this.divs.data.appendChild(e);
        }
        
        this.body.appendChild(this.divs.maindiv);
        this.initialized = !0;
        
        // Añadir interacción de hover para intensificar el brillo
        this.divs.maindiv.addEventListener('mouseenter', () => {
            this.divs.maindiv.style.boxShadow = '0 0 25px rgba(0, 170, 255, 0.9), 0 0 35px rgba(0, 170, 255, 0.7)';
        });
        
        this.divs.maindiv.addEventListener('mouseleave', () => {
            this.divs.maindiv.style.boxShadow = '0 0 15px rgba(0, 170, 255, 0.7), 0 0 25px rgba(0, 170, 255, 0.4)';
        });
        
        setTimeout(() => {
            this.updateRows()
        }, 500);
    } catch (t) {
        throw new Error(t)
    }
}
    updateBar() {
        if (this.socket.Transmitter.status.initialized) {
            if (window.sliderValue) {
                if (this.player.decoded.currentBots > window.sliderValue) {
                    this.player.decoded.currentBots = window.sliderValue
                }
                this.player.decoded.botsMax = window.sliderValue
            }
            const t = this.player.decoded.currentBots / this.player.decoded.botsMax * 100 - 1;
            document.getElementById("bots").style.width = t + "%", document.getElementById("bots").style.visibility = "visible"
        } else document.getElementById("bots").style.width = "0%", document.getElementById("bots").style.visibility = "hidden"
    }
    calculateTime() {
        const t = new Date();
        var e = new Date(this.player.decoded.expire) - t;
        if (window.playingtime) {
            window.expiretime--;
            e = window.expiretime * 1000
        }
        var d = Math.floor(e / 86400000),
            s = Math.floor(e % 864e5 / 36e5),
            i = Math.floor(e % 36e5 / 6e4),
            o = Math.floor(e % 6e4 / 1e3);
        if (e < 0)
            this.divs.rows.endtime.innerHTML = "Expired/No Plan!";
        else this.divs.rows.endtime.innerHTML = "End: " + d + "d " + s + "h " + i + "m " + o + "s"
    }
    getBotMode() {
        const t = this.socket.Transmitter.status.initialized,
            e = this.socket.Transmitter.status.botmode;
        return t ? 0 === e ? "Normal" : 1 === e ? "Farmer" : 2 === e ? "Normal" : 10 === e ? "Farmer" : 1337 === e ? "No AI" : void 0 : "Not connected!"
    }
    getvShieldMode() {
        const t = this.socket.Transmitter.status.initialized,
            e = this.socket.Transmitter.status.vshield;
        return t ? e ? "Actived" : "Disabled" : "Not connected!"
    }
    getmassbots() {
        const t = this.socket.Transmitter.status.initialized,
            e = this.socket.Transmitter.status.massbots;
        return t ? e ? "Actived" : "Disabled" : "Not connected!"
    }
    getbotspec() {
        const t = this.socket.Transmitter.status.initialized,
            e = this.socket.Transmitter.status.botspec;
        return t ? e ? "Actived" : "Disabled" : "Not connected!"
    }
    getbotdestinationMode() {
        const t = this.socket.Transmitter.status.initialized,
            e = this.socket.Transmitter.status.botdestination;
        return t ? e ? "Cell" : "Mouse" : "Not connected!"
    }
    onChange(t) {
        const e = t.target,
            s = t.data;
        if (!s) return this.updateRows();
        e === document.getElementById("eject") ? (this.socket.Hotkeys.keys.eject = s, this.socket.Hotkeys.setStorage("eject", s)) : e === document.getElementById("split") ? (this.socket.Hotkeys.keys.split = s, this.socket.Hotkeys.setStorage("split", s)) : e === document.getElementById("splitX2") ? (this.socket.Hotkeys.keys.splitX2 = s, this.socket.Hotkeys.setStorage("splitX2", s)) : e === document.getElementById("splitX4") ? (this.socket.Hotkeys.keys.splitX4 = s, this.socket.Hotkeys.setStorage("splitX4", s)) : e === document.getElementById("botgamemode") ? (this.socket.Hotkeys.keys.botmode = s, this.socket.Hotkeys.setStorage("botmode", s)) : e === document.getElementById("botdestination") ? (this.socket.Hotkeys.keys.botdestination = s, this.socket.Hotkeys.setStorage("botdestination", s)) : e === document.getElementById("botspec") ? (this.socket.Hotkeys.keys.botspec = s, this.socket.Hotkeys.setStorage("botspec", s)) : e === document.getElementById("toggle") ? (this.socket.Hotkeys.keys.toggle = s, this.socket.Hotkeys.setStorage("toggle", s)) : e === document.getElementById("vShield") ? (this.socket.Hotkeys.keys.vShield = s, this.socket.Hotkeys.setStorage("vShield", s)) : e === document.getElementById("vShield")
    }
    updateRows() {
        if (this.rowsinit) {
            document.getElementById("eject").value = this.socket.Hotkeys.keys.eject;
            document.getElementById("split").value = this.socket.Hotkeys.keys.split;
            document.getElementById("splitX2").value = this.socket.Hotkeys.keys.splitX2;
            document.getElementById("splitX4").value = this.socket.Hotkeys.keys.splitX4;
            document.getElementById("botgamemode").value = this.socket.Hotkeys.keys.botmode;
            document.getElementById("botdestination").value = this.socket.Hotkeys.keys.botdestination;
            document.getElementById("botspec").value = this.socket.Hotkeys.keys.botspec;
            document.getElementById("vShield").value = this.socket.Hotkeys.keys.vShield;
            document.getElementById("toggle").value = this.socket.Hotkeys.keys.toggle;
            document.getElementById("bot_mode_key").innerText = this.getBotMode();
            document.getElementById("vshield_mode_key").innerText = this.getvShieldMode();
            document.getElementById("bot_status").innerText = window.startbot ? "Started" : "Stopped";
            document.getElementById("botspec_mode_key").innerText = this.getbotspec();
            document.getElementById("botdestination_mode_key").innerText = this.getbotdestinationMode()
        } else {
            if (this.player.decoded.botsMax === undefined) {
                this.divs.rows.bots.innerHTML = `<span>Authentificating...</span>`
            } else if (this.player.decoded.botsMax == 0) {
                this.divs.rows.bots.innerHTML = `<span>Bots: 0/0</span>`
            }
            this.divs.rows.eject.innerHTML = `<span>Eject:</span> ${this.socket.GUI.inputs.eject.outerHTML}`;
            this.divs.rows.split.innerHTML = `<span>Split:</span> ${this.socket.GUI.inputs.split.outerHTML}`;
            this.divs.rows.splitX2.innerHTML = `<span>Split×2:</span> ${this.socket.GUI.inputs.splitX2.outerHTML}`;
            this.divs.rows.splitX4.innerHTML = `<span>Split×4:</span> ${this.socket.GUI.inputs.splitX4.outerHTML}`;
            this.divs.rows.botgamemode.innerHTML = `<span>Mode: <span id="bot_mode_key">${this.getBotMode()}</span></span> ${this.socket.GUI.inputs.botgamemode.outerHTML}`;
            this.divs.rows.botdestination.innerHTML = `<span>Dest: <span id="botdestination_mode_key">${this.getbotdestinationMode()}</span></span> ${this.socket.GUI.inputs.botdestination.outerHTML}`;
            this.divs.rows.vshield.innerHTML = `<span>Shield: <span id="vshield_mode_key">${this.getvShieldMode()}</span></span> ${this.socket.GUI.inputs.vShield.outerHTML}`;
            this.divs.rows.botspec.innerHTML = `<span>Spec: <span id="botspec_mode_key">${this.getbotspec()}</span></span> ${this.socket.GUI.inputs.botspec.outerHTML}`;
            this.divs.rows.massbots.innerHTML = `<span>Status: <span id="bot_status" style="color: ${window.startbot ? '#27ae60' : '#e74c3c'}">${window.startbot ? "Started" : "Stopped"}</span></span> ${this.socket.GUI.inputs.toggle.outerHTML}`;
            document.getElementById("eject").value = this.socket.Hotkeys.keys.eject;
            document.getElementById("split").value = this.socket.Hotkeys.keys.split;
            document.getElementById("splitX2").value = this.socket.Hotkeys.keys.splitX2;
            document.getElementById("splitX4").value = this.socket.Hotkeys.keys.splitX4;
            document.getElementById("botgamemode").value = this.socket.Hotkeys.keys.botmode;
            document.getElementById("botdestination").value = this.socket.Hotkeys.keys.botdestination;
            document.getElementById("botspec").value = this.socket.Hotkeys.keys.botspec;
            document.getElementById("vShield").value = this.socket.Hotkeys.keys.vShield;
            document.getElementById("toggle").value = this.socket.Hotkeys.keys.toggle;
            for (const t of Object.keys(this.inputs)) {
                if (t !== "massbots" && t !== "startStop") {
                    document.getElementById(this.inputs[t].id).addEventListener("input", t => this.onChange(t), !1);
                    document.getElementById(this.inputs[t].id).onclick = t => {
                        t.target.select()
                    }
                }
            }
            document.getElementById("toggle").addEventListener("input", t => this.onChange(t), !1);
            document.getElementById("toggle").onclick = t => {
                t.target.select()
            };
            this.divs.rows.botnum.innerHTML = "<div id=\"botnum\" style=\"margin-top:8px;width:100%;\"></div>";
            this.rowsinit = !0
        }
    }
    toggleBots() {
        if (window.startbot) {
            window.startbot = !1;
            window.botr = !1;
            if (this.socket.ws && this.socket.ws.readyState === 1) {
                this.socket.ws.close();
                setTimeout(() => {
                    this.socket.connect("wss://gamesrv.agarbot.ovh:8443")
                }, 500)
            }
        } else {
            window.startbot = !0;
            window.botr = !0;
            this.socket.Transmitter.status.botspec = 1
        }
        this.updateBotStatus()
    }
    updateBotStatus() {
        const statusElement = document.getElementById("bot_status");
        if (statusElement) {
            statusElement.innerText = window.startbot ? "Started" : "Stopped";
            statusElement.style.color = window.startbot ? "#27ae60" : "#e74c3c"
        }
    }
    update() {
        this.initialized && this.updateBar();
        var thot = this;
        var c = document.getElementById("botnum");
        if (window.sliderValue) {
            if (this.player.decoded.currentBots > window.sliderValue) {
                this.player.decoded.currentBots = window.sliderValue
            }
            this.player.decoded.botsMax = window.sliderValue
        }
        this.divs.rows.bots.innerHTML = `Bots: ${this.player.decoded.currentBots}/${500===this.player.decoded.botsMax?0:this.player.decoded.botsMax}`;
        if (!window.loadedBar) {
            window.loadedBar = !0;
            var that = this;
            let BotsDetected = setInterval(() => {
                if (this.player.decoded.botsMax != 0 && !window.loadedBarBots) {
                    window.maxBotsS = this.player.decoded.botsMax;
                    clearInterval(BotsDetected);
                    window.loadedBarBots = !0;
                    var c = document.getElementById("botnum");
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
                        tooltips: !0,
                        direction: 'ltr'
                    });
                    c.noUiSlider.set(parseInt(this.player.decoded.botsMax));
                    c.noUiSlider.on('change', function(values, handle) {
                        window.sliderValue = parseInt(c.noUiSlider.get().toString().replace(/\s+/g, ''));
                        if ((window.maxBotsS < 200) && (Date.now() - window.lastTimeusedSlide < 20000)) {
                            document.getElementById('botnum').style.display = "none";
                            var alreadyrefresh2 = !1;
                            if (document.getElementById('timerBtn')) {
                                document.getElementById('timerBtn').style.display = "block";
                                var timeleft = 20;
                                var downloadTimer = setInterval(function() {
                                    timeleft--;
                                    var days = Math.floor(timeleft / 24 / 60 / 60);
                                    var hoursLeft = Math.floor((timeleft) - (days * 86400));
                                    var hours = Math.floor(hoursLeft / 3600);
                                    var minutesLeft = Math.floor((hoursLeft) - (hours * 3600));
                                    var minutes = Math.floor(minutesLeft / 60);
                                    var remainingSeconds = timeleft % 60;
                                    if (remainingSeconds < 10) {
                                        remainingSeconds = "0" + remainingSeconds
                                    }
                                    if (days < 10) {
                                        days = "0" + days
                                    }
                                    if (hours < 10) {
                                        hours = "0" + hours
                                    }
                                    if (minutes < 10) {
                                        minutes = "0" + minutes
                                    }
                                    document.getElementById('timerBtn').innerHTML = '<button style="margin-bottom:12px;padding:5px;"class="btn btn-danger" onclick="">' + hours + 'h:' + minutes + 'm:' + remainingSeconds + 's</button>';
                                    if (timeleft <= 0) {
                                        clearInterval(downloadTimer);
                                        if (!alreadyrefresh2) {
                                            alreadyrefresh2 = !0;
                                            document.getElementById('botnum').style.display = "block";
                                            document.getElementById('timerBtn').style.display = "none"
                                        }
                                    }
                                }, 1000)
                            }
                        } else {
                            window.lastTimeusedSlide = Date.now()
                        }
                        window.botsDyn = parseInt(window.sliderValue.toString().replace(/\s+/g, ''));
                        if (window.botr) {
                            thot.socket.send({
                                req: 99,
                                botdynv2: parseInt(window.sliderValue.toString().replace(/\s+/g, ''))
                            })
                        }
                    })
                }
            }, 1000)
        }
    }
}
class Transmitter {
    constructor(t) {
        this.socket = t, this.status = {
            initialized: !1,
            botdestination: 0,
            vshield: 0,
            botspec: 0,
            massbots: !1,
            botmode: 0
        }
    }
    handshake(t, e) {
        let s = {};
        s.req = 1, s.ver = 3, this.socket.send(s);
        this.start()
    }
    start() {
        this.moveInterval = setInterval(() => {
            this.sendPosition()
        }, 50)
    }
    sendSplit() {
        console.log("sent split!"), this.socket.send({
            req: 3,
            cmd: 'split'
        })
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
                gamePkt.coords.mouse.y = app.unitManager.activeUnit.protocol_view.y
            } else {
                gamePkt.coords.mouse.x = app.stage.mouseWorldX;
                gamePkt.coords.mouse.y = app.stage.mouseWorldY
            }
            gamePkt.coords.fence.x = 0;
            gamePkt.coords.fence.y = 0;
            gamePkt.coords.cell.x = app.unitManager.activeUnit.protocol_view.x;
            gamePkt.coords.cell.y = app.unitManager.activeUnit.protocol_view.y;
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
                })
            }
        }
    }
    setBotMode() {
        this.setBotModeCode(), console.log("sent bot mode!")
    }
    vShield() {
        this.setvShieldCode(), console.log("sent vshield!")
    }
    botspec() {
        this.setbotspec(), console.log("sent botspec!")
    }
    massbots() {
        this.setmassbots(), console.log("sent massbots!")
    }
    botdestination() {
        this.setbotdestination(), console.log("bot destination!")
    }
    setvShieldCode() {
        return 0 === this.status.vshield ? this.status.vshield = 1 : 1 === this.status.vshield && (this.status.vshield = 0), this.status.vshield
    }
    setbotspec() {
        return 0 === this.status.botspec ? this.status.botspec = 1 : 1 === this.status.botspec && (this.status.botspec = 0), this.status.botspec
    }
    setmassbots() {
        return !1 === this.status.massbots ? this.status.massbots = !0 : !0 === this.status.massbots && (this.status.massbots = !1), this.status.massbots
    }
    setbotdestination() {
        return 0 === this.status.botdestination ? this.status.botdestination = 1 : 1 === this.status.botdestination && (this.status.botdestination = 0), this.status.botdestination
    }
    setBotModeCode() {
        return 0 === this.status.botmode ? this.status.botmode = 1 : 1 === this.status.botmode && (this.status.botmode = 0), this.status.botmode
    }
}
class Reader {
    constructor(t) {
        this.socket = t, this.player = t.player
    }
    read(t) {
        const e = t.data;
        if (1 == JSON.parse(e).req) {
            window.kick = !0;
            this.divs.rows.bots.innerHTML = `kicked refresh`
        }
        if (2 == JSON.parse(e).req) {
            var parsed = JSON.parse(e);
            parsed.currentBots = 0;
            parsed.expire = parsed.expireTime;
            console.log('loaded', e);
            this.player.initialized = 1;
            this.player.decoded = parsed;
            if (this.player.decoded.playingtime) window.playingtime = !0;
            window.expiretime = this.player.decoded.expire;
            window.expireTimeInt = setInterval(() => {
                this.socket.GUI.calculateTime()
            }, 1000);
            this.socket.GUI.update()
        }
        if (3 == JSON.parse(e).req) {
            var parsed = JSON.parse(e);
            parsed.currentBots = parsed.spawn;
            if (this.player.decoded.botsMax === undefined) {
                this.player.decoded.botsMax = 0
            }
            parsed.botsMax = parseInt(this.player.decoded.botsMax.toString().replace(/\s+/g, ''));
            window.botsDyn = parseInt(this.player.decoded.botsMax.toString().replace(/\s+/g, ''));
            if (window.botr) {
                this.socket.send({
                    req: 99,
                    botdynv2: parseInt(window.botsDyn.toString().replace(/\s+/g, ''))
                })
            }
            parsed.expire = this.player.decoded.expire;
            this.player.decoded = parsed;
            this.socket.GUI.update()
        }
    }
}
class MoreBotsHotkeys {
    constructor(t) {
        this.socket = t, this.Transmitter = t.Transmitter, this.storagekey = "agarbotdelta35_hotkeys", this.keys = {
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
