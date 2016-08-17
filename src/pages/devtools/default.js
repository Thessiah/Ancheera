(function() {
  var initialized = false;
  var url;
  window.Default = {
    Initialize: function(newUrl) {
      if(!initialized) {
        initialized = true;
        url = newUrl.substring(0, newUrl.indexOf('#mypage'));
        Message.ConsoleLog('default.js', 'test1');
        Network.Initialize();
        Message.ConsoleLog('default.js', 'test2');
        Dailies.Initialize();
        Message.ConsoleLog('default.js', 'test3');
        Supplies.Initialize();
        Message.ConsoleLog('default.js', 'test4');
        //Quest.Initialize(); -> in supplies.initialize()
        Casino.Initialize();
        //Info.Initialize();
        Time.Initialize();
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
})();