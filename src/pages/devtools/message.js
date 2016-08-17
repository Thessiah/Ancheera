(function() {
  window.Message = {
    Notify: function(title, message) {
      chrome.runtime.sendMessage({notification: {
        type: 'basic',
        title: title,
        message: message,
        iconUrl: 'src/assets/images/anchiraicon.png' 
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
  });
})();