(function() {
  var optionResponses = {};

  window.Message = {
    Notify: function(title, message, type) {
      chrome.runtime.sendMessage({notification: {
        type: type,
        notification: {
          type: 'basic',
          title: title,
          message: message,
          iconUrl: 'src/assets/images/icon.png' 
        }
      }});
    },
    SetCookie: function(name, value) {
      chrome.runtime.sendMessage({setCookie: {
        name: name,
        url: 'http://gbf.game.mbga.jp/',
        value: value.toString(),
        expirationDate: Date.now() / 1000 + 2419200
      }});
    },
    GetCookie: function(name, sendResponse) {
      chrome.runtime.sendMessage({getCookie: {
        name: name,
        url: 'http://gbf.game.mbga.jp/'
      }}, function(response) {
        
        sendResponse(response.cookie);
      });
    },
    GetURL: function(sendResponse) {
      chrome.runtime.sendMessage({getURL: true}, function(response) {
        sendResponse(response.url);
      });
    },
    OpenURL: function(url) {
      //Message.ConsoleLog('message.js', 'opening url: ' + url);
      chrome.runtime.sendMessage({openURL: {
        url: url
      }});
    },
    MessageTabs: function(message, sendResponse) {
      chrome.runtime.sendMessage({tabs: message}, function(response) {
        sendResponse(response);
      });
    },
    GetOption: function(message, sendResponse) {

      if(message.response !== undefined) {
        if(optionResponses[message.id] == undefined) {
          optionResponses[message.id] = [];
        }
        if(optionResponses[message.id].indexOf(message.response) === -1) {
          optionResponses[message.id].push(message.response);
        }
      }
      chrome.runtime.sendMessage({getOption: message.id}, function(response) {
        sendResponse(response);
      });
    },
    // GetCookies: function(names, sendResponse) {

    //   for(var i = 0; i < names.length; i++) {
    //     chrome.runtime.sendMessage({getCookies: {
    //       name: names,
    //       url: 'http://gbf.game.mbga.jp/'
    //     }}, function(response) {
    //       sendResponse(response.cookies);
    //     });
    //   }
    // },
    ConsoleLog: function(sender, message) {
      chrome.runtime.sendMessage({consoleLog: {
        sender: sender,
        message: message
      }});
    }
  };
  var port = chrome.runtime.connect({name: 'devtools'});
  port.onMessage.addListener(function(msg) {
    Message.ConsoleLog(JSON.stringify(msg));
    if(msg.assault) {
      Time.SetAssaultTime(msg.assault.times);
    }
    if(msg.angel) {
      Time.SetAngelHalo(msg.angel.delta, msg.angel.active);
    }
    if(msg.defense) {
     Time.SetDefenseOrder(msg.defense.time, msg.defense.active);
    }
    if(msg.checkRaids) {
      Quest.CheckJoinedRaids(msg.checkRaids.raids, msg.checkRaids.unclaimed, msg.checkRaids.type);
    }
    if(msg.chips) {
      Profile.SetChips(msg.chips.amount);
    }
    if(msg.profile) {
      Profile.SetHomeProfile(msg.profile.rank, msg.profile.rankPercent, msg.profile.job, msg.profile.jobPercent, msg.profile.jobPoints, msg.profile.renown, msg.profile.prestige);
    }
    if(msg.setOption) {
      var id = msg.setOption.id;
      Message.ConsoleLog(optionResponses[id].length);
      if(optionResponses[id] !== undefined) {
        for(var i = 0; i < optionResponses[id].length; i++) {
          optionResponses[id][i](id, msg.setOption.value);
        }
      }
    }
  });
})();