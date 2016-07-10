(function() {
  var drawCount;
  var coopDailies =[];
  var tweet;
  window.Dailies = {
    Initialize: function() {
      loadDailies();
    },
    Reset: function() {
      setDraws(101);
      newCoop();
      setTweet(true);
    },

    SetDraws: function(json) {
      if(json.user_info.is_free) {
        setDraws(101);
      } else {
        setDraws(json.user_info.free_count);
      }
    },
    DecDraws: function(json) {
      if(json.gacha[0].name === 'Rupie Draw') {
        setDraws(drawCount - json.count);
      }
    },
    SetCoop: function(json) {
      str = "";
      for(var i = 0; i < json.daily_mission.length; i++) {
        coopDailies[i] = {
          description: json.daily_mission[i].description,
          progress: json.daily_mission[i].progress,
          max_progress: json.daily_mission[i].max_progress
        };
        str += coopDailies[i].description + ',' + coopDailies[i].progress + ',' + coopDailies[i].max_progress + ','; 
        Message.SetCookie('coop', str);
      }
      setCoop();
    },
    SetTweet: function(json) {
      if(json.twitter.campaign_info.is_avail_twitter === true) {
        setTweet(true);
      } else {
        setTweet(false);
      }
    }
  }

  var setDraws = function(amt) {
    if(drawCount !== amt) {
      Message.SetCookie('draws', amt);
    }
    drawCount = amt;
    $('#draw-count').text('Rupee draws: ' + amt);
  }
  var setCoop = function() {
    $('.coop-quest').each(function(index) {
      if(coopDailies[index] !== null) {
        $(this).text(coopDailies[index].description + '\n' + coopDailies[index].progress + '/' + coopDailies[index].max_progress);
      } else {
        $(this).text('???');
      }
    });
  }
  var newCoop = function() {
    for(var i = 0; i < 3; i++) {
      coopDailies[i] = null;
    }
    setCoop();
  }

  var setTweet = function(bool) {
    if(tweet !== bool) {
      tweet = bool;
      Message.SetCookie('tweet', bool);
      if(bool) {
        $('#tweet-status').text('Tweet Refill: Available');
      } else {
        $('#tweet-status').text('Tweet Refill: Not Available');
      }
    }
  }
  var loadDailies = function() {
    var cookie;
    Message.GetCookie('draws', function(cookie) {
      if(cookie) {
        setDraws(cookie.value);
      } else {
        setDraws(101);
      }
    });
    Message.GetCookie('coop', function(cookie) {
      if(cookie) {
        var coops = cookie.value.split(',');
        for(var i = 0; i < coops.length - 3; i += 3) {
          coopDailies[i / 3] = {
            description: coops[i],
            progress: coops[i + 1],
            max_progress: coops[i + 2]
          }
        }
        setCoop();
      } else {
        newCoop();
      }
    });
    Message.GetCookie('tweet', function(cookie) {
      if(cookie) {
        setTweet(cookie.value);
      } else {
        setTweet(true);
      }
    });
  }
})();