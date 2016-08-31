(function() {
  var initialized = false;
  var url;
  $('#contents').find('.open-url').each(function() {
    $(this).click(function() {
      Message.OpenURL(url + $(this).data('url'));
    });
  });

  window.Default = {
    Initialize: function(newUrl) {
      if(!initialized) {
        initialized = true;
        url = newUrl.substring(0, newUrl.indexOf('#mypage'));
        Network.Initialize();
        Dailies.Initialize();
        Supplies.Initialize();
        //Quest.Initialize(); -> in supplies.initialize()
        //Profile.Initialize(); -> in supplies.initialize()
        Buffs.Initialize();
        Casino.Initialize();
        //Info.Initialize();
        Time.Initialize();
        restore_options();
        $('#wait').hide();
        $('#contents').show();
      }
    },
    IsInitialized: function() {
      return initialized;
    },
    GetURL: function() {
      return url;
    }
  }

  var restore_options = function() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get('options', function(items) {
    if(items.options !== undefined) {
      if(items.options.enableNotifications !== undefined) {
        setOptions(items.options.enableNotifications, 'enableNotifications');
      }
      if(items.options.muteNotifications !== undefined) {
        setOptions(items.options.muteNotifications, 'muteNotifications');
      }
    }
  });
}
var setOptions = function(value, option) {
    chrome.runtime.sendMessage({options: {
      [option]: value
    }});
}
})();