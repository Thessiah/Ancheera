(function () {
    var currTabID = -1;
    var currURL = '';
    var pageLoaded = true;

    var CURRENT_VERSION = '1.1.2';
    var BASE_VERSION = '1.0.1';
    var patchNotes = {
        '1.0.1': {
            'index': 0,
            'notes': ['-Vira and Narumaya themes added',
                '-Supply name + location tooltips added',
                '(thanks lolPseudoSmart for supply locations)',
                '-Primarch misc daily added',
                '-Primarch raid + xeno jp names added'
            ]
        },
        '1.1.0': {
            'index': 1,
            'notes': ['-Weapon Series planner added',
                'Try it out in the supply tab!',
                '-Vira and Narumaya themes removed'
            ]
        },
        '1.1.1': {
            'index': 2,
            'notes': ['-Primarch daily changed to option',
                '-Small UI tweaks'
            ]
        },
        '1.1.2': {
            'index': 3,
            'notes': ['-GW 5* planner added',
                '(sorry it\'s so late D:)',
                '(also sorry no weapon drop tracking orz)',
                '-Tooltips added to repeat last quest',
                'and copy to clipboard buttons'
            ]
        }
    }
    var patchNoteList = [
        '1.0.1',
        '1.1.0',
        '1.1.1',
        '1.1.2'
    ]
    var currentVersion = undefined;

    chrome.browserAction.onClicked.addListener(function () {
        chrome.runtime.openOptionsPage();
    });

    Storage.GetMultiple(['version'], function (response) {
        currentVersion = response['version'];
        if (!currentVersion) {
            currentVersion = CURRENT_VERSION;
            Storage.Set('version', CURRENT_VERSION);
        }
    });

    var generateNote = function (id) {
        if (patchNotes[id]) {
            var note = 'Version ' + id + ':\n';
            for (var i = 0; i < patchNotes[id].notes.length; i++) {
                note += patchNotes[id].notes[i] + '\n';
            }
            return note;
        }
    }

    Options.Initialize(function () {
        Dailies.Initialize(function () {
            Quest.Initialize(function () {
                Casino.Initialize(function () {
                    Time.Initialize(function () {
                        Supplies.Initialize();
                        Profile.Initialize();
                        Buffs.Initialize();
                    });
                });
            });
        });
    });

    var responseList = {};
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.setOption) {
            Options.Set(message.setOption.id, message.setOption.value);
        }
        if (message.getOption) {
            var id = message.getOption;
            sendResponse({
                'id': id,
                'value': Options.Get(id)
            });
        }

        if (message.consoleLog) {
            console.log(message.consoleLog.sender + ': ' + message.consoleLog.message);
        }
        if (message.content) {
            var msg = message.content;
            if (msg.assault) {
                Time.SetAssaultTime(msg.assault.times);
            }
            if (msg.angel) {
                Time.SetAngelHalo(msg.angel.delta, msg.angel.active);
            }
            if (msg.defense) {
                Time.SetDefenseOrder(msg.defense.time, msg.defense.active);
            }
            if (msg.checkRaids) {
                Quest.CheckJoinedRaids(msg.checkRaids.raids, msg.checkRaids.unclaimed, msg.checkRaids.type);
            }
            if (msg.chips) {
                Profile.SetChips(msg.chips.amount);
            }
            if (msg.profile) {
                Profile.SetHomeProfile(msg.profile.rank, msg.profile.rankPercent, msg.profile.job, msg.profile.jobPercent, msg.profile.jobPoints, msg.profile.renown, msg.profile.prestige);
            }
            if (msg.coopCode) {
                Quest.SetCoopCode(msg.coopCode, sender.tab.id);
            }
        }
    });


    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (tab.url.indexOf('gbf.game.mbga.jp') !== -1) {
            if (currURL !== tab.url) {
                pageLoaded = false;
                currURL = tab.url;
            }
            if (currURL === tab.url && pageLoaded) {
                chrome.tabs.sendMessage(tabId, {
                    pageUpdate: tab.url
                });
            }

        }
    });

    var connections = {};

    chrome.runtime.onConnect.addListener(function (port) {
        var extensionListener = function (message, sender) {
            if (message.connect) {
                connections[message.connect] = port;
                return;
            }
            if (message.initialize) {
                var response = [];
                response[0] = {
                    'setTheme': Options.Get('windowTheme')
                };
                response = response.concat(Profile.InitializeDev());
                response = response.concat(Time.InitializeDev());
                response = response.concat(Dailies.InitializeDev());
                response = response.concat(Casino.InitializeDev());
                response = response.concat(Supplies.InitializeDev());
                response = response.concat(Buffs.InitializeDev());
                response = response.concat(Quest.InitializeDev());
                connections[message.id].postMessage({
                    initialize: response
                });
                return;
            }
            if (message.pageLoad) {
                pageLoaded = true;
                BackgroundMessageActionCollection.performConnectPageLoad(connections[message.id]);
                return;
            }
            if (message.openURL) {
                chrome.tabs.update(message.id, {
                    'url': message.openURL
                });
                return;
            }
            if (message.getPlanner) {
                Supplies.GetPlanner(message.id, message.getPlanner);
            }
            if (message.refresh) {
                chrome.tabs.reload(message.id);
                return;
            }
            if (message.devAwake) {
                if (currentVersion !== CURRENT_VERSION) {
                    var note = "";
                    if (patchNotes[currentVersion] === undefined) {
                        currentVersion = BASE_VERSION;
                        note += generateNote(currentVersion);
                    }
                    var index = patchNotes[currentVersion].index + 1;
                    for (var i = index; i < patchNoteList.length; i++) {
                        currentVersion = patchNoteList[i];
                        note += generateNote(currentVersion);
                    }
                    Message.Post(message.id, {
                        'setMessage': note
                    })
                    currentVersion = CURRENT_VERSION;
                    Storage.Set('version', CURRENT_VERSION);
                }
                Message.Post(message.id, {
                    'setTheme': Options.Get('windowTheme', function (id, value) {
                        Message.PostAll({
                            'setTheme': value
                        });
                        Time.UpdateAlertColor();
                    })
                });
            }
            if (message.debug) {
                Message.Notify('hey', 'its me ur brother', 'apNotifications');
                APBP.SetMax();
                // Dailies.Reset();
            }
            if (message.weaponBuild) {
                Supplies.BuildWeapon(message.id, message.weaponBuild);
            }
            if (message.consoleLog) {
                console.log(message.consoleLog);
            }
            if (message.request) {
                BackgroundMessageActionCollection.performRequestAction(message);
            }
        }
        port.onMessage.addListener(extensionListener);

        port.onDisconnect.addListener(function (port) {
            port.onMessage.removeListener(extensionListener);

            var tabs = Object.keys(connections);
            for (var i = 0, len = tabs.length; i < len; i++) {
                if (connections[tabs[i]] == port) {
                    delete connections[tabs[i]]
                    break;
                }
            }
        });
    });

    //[MD] Message needs connections, so this /has/ to live here for now
    window.Message = {
        PostAll: function (message) {
            Object.keys(connections).forEach(function (key) {
                if (message !== undefined) {
                    connections[key].postMessage(message);
                }
            });
        },
        Post: function (id, message) {
            if (connections[id] !== undefined) {
                if (message !== undefined) {
                    connections[id].postMessage(message);
                }
                return true;
            } else {
                return false;
            }
        },
        Notify: function (title, message, source) {
            if (Options.Get('enableNotifications') && Options.Get(source)) {
                var theme = Options.Get('notificationTheme');
                if (theme === 'Random') {
                    var rand = Math.random() * 3;
                    if (rand < 1) {
                        theme = 'Sheep';
                    } else if (rand < 2) {
                        theme = 'Rooster';
                    } else {
                        theme = 'Monkey';
                    }
                }
                if (new Date().getMonth() === 3 && new Date().getDate() === 1) {
                    theme = 'Garbage';
                }
                if (!Options.Get('muteNotifications')) {
                    var sound = new Audio('src/assets/sounds/' + theme + '.wav');
                    sound.play();
                }
                if (Math.random() * 300 < 1) {
                    theme += '2';
                }
                chrome.notifications.create({
                    type: 'basic',
                    title: title,
                    message: message,
                    iconUrl: 'src/assets/images/' + theme + '.png'
                });
            }
        },
        OpenURL: function (url, devID) {
            chrome.runtime.sendMessage({
                openURL: {
                    url: url
                }
            });

        },
        MessageBackground: function (message, sendResponse) {},
        MessageTabs: function (message, sendResponse) {
            chrome.runtime.sendMessage({
                tabs: message
            }, function (response) {
                sendResponse(response);
            });
        },
        ConsoleLog: function (sender, message) {
            chrome.runtime.sendMessage({
                consoleLog: {
                    sender: sender,
                    message: message
                }
            });
        }
    };
})();