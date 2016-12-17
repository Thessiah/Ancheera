(function() {
  var cache = {};
  window.Storage = {

    Set: function(key, value) {
      console.log('Storing: ' + key);
      chrome.storage.sync.set({[key]: value});
    },
    SetLocal: function(key, value) {
      chrome.storage.local.set({[key]: value});
    },
    Get: function(key, sendResponse) {
      chrome.storage.sync.get(key, function(response) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        } else {
          sendResponse(response);
        }
      });
    },
    GetMultiple: function(key, sendResponse) {
      chrome.storage.sync.get(key, function(response) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        } else {
          for(var i = 0; i < key.length; i++) {
            cache[key[i]] = response[key[i]];
          }
          sendResponse(response);
        }
      });
    },
    GetMultipleLocal: function(key, sendResponse) {
      chrome.storage.local.get(key, function(response) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
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