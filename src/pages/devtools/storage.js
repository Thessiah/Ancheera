(function() {
  var cache = {};
  window.Storage = {

    Set: function(key, value) {
      //Message.ConsoleLog('storage.js' , 'attempting to store key: ' + JSON.stringify(key) + ' with value: ' + JSON.stringify(value));
      if(cache[key] !== value) {
        Message.ConsoleLog('storage.js' , 'replacing old cache: ' + JSON.stringify(cache[key]) + 'with new cache: ' + JSON.stringify(value));
        cache[key] = value;
        chrome.storage.sync.set({[key]: value});
      }
    },
    GetSingle: function(key, sendResponse) {
      chrome.storage.sync.get(key, function(response) {
        Message.ConsoleLog('storage.js', 'attempting to retrieve key: ' + key + ' result: ' + response);
        if (chrome.runtime.lastError) {
          Message.ConsoleLog(chrome.runtime.lastError);
        } else {
          cache[key] = response;
          sendResponse(response);
        }
      });
    },
    GetMultiple: function(key, sendResponse) {
      chrome.storage.sync.get(key, function(response) {
        if (chrome.runtime.lastError) {
          Message.ConsoleLog(chrome.runtime.lastError);
        } else {
          for(var i = 0; i < key.length; i++) {
            cache[key[i]] = response[key[i]];
          }
          sendResponse(response);
        }
      });
    }
  }
})();