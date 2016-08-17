(function() {
  var initialized = false;
  var url;
  window.Default = {
    Initialize: function(newUrl) {
      if(!initialized) {
        initialized = true;
        url = newUrl.substring(0, newUrl.indexOf('#mypage'));
        Network.Initialize();
        Dailies.Initialize();
        Supplies.Initialize();
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