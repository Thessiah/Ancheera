(function() {
  var currTabID = -1;
  var currURL = '';
  var pageLoaded = true;
var options = {
    enableNotifications: true,
    muteNotifications: false,
    apNotifications: true,
    epNotifications: true,
    dailyResetNotifications: true,
    strikeTimeNotifications:true,
    angelHaloNotifications: true,
    defenseOrderNotifications: true,
    isMagFest: false,
    '300031' : true,
    '300041' : true,
    '300051' : true,
    '300441' : false,

    '300081' : true,
    '300091' : true,
    '300101' : true,
    '300491' : false,

    '300141' : true,
    '300151' : true,
    '300161' : true,
    '300511' : false,

    '300181' : true,
    '300191' : true,
    '300261' : true,
    '300531' : false,
    
    '300211' : true,
    '300221' : true,
    '300271' : true,
    '300561' : false,
    
    '300241' : true,
    '300251' : true,
    '300281' : true,
    '300581' : false,
  }
  var responseList = {};
  chrome.storage.sync.get('options', function(response) {
    if(response.options !== undefined) {
      options = response.options.values;
    } else {
      chrome.storage.sync.set({'options': {'values': options}});
    }
  });
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.setOption) {
      var id = message.setOption.id;
      if(options[id] !== undefined) {
        var value =  message.setOption.value;
        if(options[id] !== value) {
          options[id] = value;
          if(devtoolsPort !== undefined) {
            devtoolsPort.postMessage({setOption: {
              id: id,
              value: value
            }});
          }
          // if(responseList[id] !== undefined) {
          //   for(var i = 0; i < responseList[id].length; i++) {
          //     responseList[i](id, value);
          //     console.log(id + ' ' + value);
          //   }
          // }
          chrome.storage.sync.set({'options': {'values': options}});
        }
      }
    }
    if(message.getOption) {
      var id = message.getOption;
      if(options[id] !== undefined) {
        //console.log(id + ' ' + message.getOption.response);
        // if(message.getOption.response !== undefined) {
        //   var response = message.getOption.response;
        //   if(responseList[id] === undefined) {
        //     responseList[id] = [];
        //   }
        //   if(responseList[id].indexOf(response) === -1) {
        //     responseList[id].push(response);
        //   }
        // }
        //console.log(id + ' ' + JSON.stringify(responseList));
        sendResponse({
        'id': id,
        'value': options[id]});
      }
    }
    if(message.notification) {
      if(options.enableNotifications && options[message.notification.type]) {
        chrome.notifications.create(message.notification.notification);
        if(!options.muteNotifications) {
          var sound = new Audio('src/assets/sounds/notification.wav');
          sound.play();
        }
      }
    }
    if(message.setCookie) {
      chrome.cookies.set(message.setCookie);
    }
    if(message.getCookie) {
      chrome.cookies.get(message.getCookie, function(cookie) {
        sendResponse({cookie: cookie});
      });
      return true;
    }
    if(message.getCookies) {
      chrome.cookies.getAll(message.getCookies, function(cookies) {
        sendResponse({cookies: cookies});
      });
      return true;
    }
    if(message.getURL) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if(tabs.length > 0) {
          console.log('queried');
          sendResponse({url: tabs[0].url});
        }
      });
    }
    if(message.pageLoad) {
      //chrome.storage.sync.set({'test': true});
      pageLoaded = true;
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if(tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {pageLoad: tabs[0].url});
          sendResponse({pageLoad: tabs[0].url});
        }
      });
      return true;
    }
    if(message.tabs) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if(tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, message.tabs , function(response) {
            sendResponse(response);
          });
        }
      });
      return true;
    }
    if(message.openURL) {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if(tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, message.openURL);
        }
      });
      return true;
    }

    if(message.consoleLog) {
      console.log(message.consoleLog.sender + ': ' + message.consoleLog.message);
    }
    if(message.devtools) {
      if(devtoolsPort !== undefined) {
        devtoolsPort.postMessage(message.devtools);
      }
    }
    // if(message.assault) {
    //   devtoolsPort.postMessage({assault: message.assault});
    // }
    // if(message.angel) {
    //   devtoolsPort.postMessage({angel: message.angel});
    // }
    // if(message.defense) {
    //   devtoolsPort.postMessage({defense: message.defense});
    // }
    if(message.refresh) {
      pageLoaded = false;
    }
  });
  var devtoolsPort = undefined;
  chrome.runtime.onConnect.addListener(function(port) {
    if (port.name !== "devtools") return;
    devtoolsPort = port;
    port.onMessage.addListener(function(msg) {
        console.log('Received message from devtools page', msg);
    });
  });
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(tab.url.indexOf('gbf.game.mbga.jp') !== -1) {
      if(currURL !== tab.url) {
        pageLoaded = false;
        currURL = tab.url;
      }
      if(currURL === tab.url && pageLoaded) {
        console.log('page updated');
        chrome.tabs.sendMessage(tabId, {pageUpdate: tab.url});
      }

    }
  });
})();