(function() {
  var initialized = false;
  window.Default = {
    Initialize: function() {
      if(!initialized) {
        initialized = true;
        $("#wait").hide();
        
        Network.Initialize();
        //Info.Initialize();
        Time.Initialize();
        Dailies.Initialize();
      }
    },
    IsInitialized: function() {
      return initialized;
    }
  }
})();