(function() {
  var options = {
    skip: true,
    skipNext: false,
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
    '300441' : null,

    '300081' : true,
    '300091' : true,
    '300101' : true,
    '300491' : null,

    '300141' : true,
    '300151' : true,
    '300161' : true,
    '300511' : null,

    '300181' : true,
    '300191' : true,
    '300261' : true,
    '300531' : null,
    
    '300211' : true,
    '300221' : true,
    '300271' : true,
    '300561' : null,
    
    '300241' : true,
    '300251' : true,
    '300281' : true,
    '300581' : null,
  }

  var hlRaids = ['300441', '300491', '300511', '300531', '300561', '300581'];
  var isHL = false;
  var responseList = {};

  window.Options = {
    Initialize: function() {
      Storage.Get(['options'], function(response) {
        if(response.options !== undefined) {
          options = response.options;
        } else {
          Storage.Set('options', options);
        }
        Profile.Get('level', function(value) {
          if(!isHL && value >= 101) {
            isHL = true;
            for(var i = 0; i < hlRaids.length; i++) {
              if(options[hlRaids[i]] === null) {
                setOption(hlRaids[i], false);
              }
            }
          }
        });
      });

    },
    Get: function(id, response) {
      if(response !== undefined) {
        if(responseList[id] === undefined) {
          responseList[id] = [];
        }
        responseList[id].push(response);
      }
      if(options[id] === undefined) {
        options[id] = false;
      }
      return options[id];
    },
    Set: function(id, value) {
      setOption(id, value);
    }
  };

  var setOption = function(id, value) {
    if(options[id] !== value) {
      options[id] = value;
      Storage.Set('options', options);
      if(responseList[id] !== undefined) {
        for(var i = 0; i < responseList[id].length; i++) {
          responseList[id][i](id, value);
        }
      }
    }
  }
})();