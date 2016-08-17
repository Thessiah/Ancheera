(function() {
  var dailyNames = ['draws', 'coop', 'tweet'];
  var drawCount;
  var coopDailies =[];
  var tweet;
  //reward_stats:false if used in raid
  var $coopQuests = $('.coop-quest');
  var $coopProgresses = $('.coop-progress');

  window.Dailies = {
    Initialize: function() {
      loadDailies();
    },
    Reset: function() {
      setDraws(101);
      newCoop();
      setTweet(true);
      Casino.DailyReset();
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
      var description;
      for(var i = 0; i < json.daily_mission.length; i++) {
        description = json.daily_mission[i].description;
        // newDescription = "";
        // description.replace('Hard', 'H');
        // description.replace(' 1 time.', '.');
        // if(description.indexOf('stage') !== -1) {
        //   newDescription = "Clear " + description.substring(description.indexOf('stage') + 8, description.lastIndexOf(' ', description.lastIndexOf('time') - 2));
        //   if(newDescription.indexOf('(Hard)') !== -1) {
        //     newDescription = newDescription.replace('(Hard)', '(H' + description.charAt(12) + ').');
        //   } else {
        //     newDescription += ' (N' + description.charAt(12) + ').';
        //   }
        // } else {
        //   newDescription = description;
        // }

        coopDailies[i] = {
          rawDescription: description,
          description: parseDescription(description),
          progress: json.daily_mission[i].progress,
          max_progress: json.daily_mission[i].max_progress
        };
      }
      Storage.Set('coop', {'dailies': coopDailies});
      setCoop();
    },
    CompleteCoop: function(json) {
      if(json.url === 'coopraid') {
        var list = json.popup_data.coop_daily_mission;
        var exists;
        if(list.length > 0) {
          for(var i = 0; i < list.length; i++) {
            exists = false;
            for(var j = 0; j < coopDailies.length; i++) {
              if(coopDailies[j] !== null && coopDailies[j].rawDescription === list[i].description) {
                exists = true;
                coopDailies[j].progress = list[i].progress;
                break;
              }
            }
            if(!exists) {
              for(var j = 0; j < coopDailies.length; j++) {
                if(coopDailies[j] === null) {
                  coopDailies[j] = {
                    rawDescription: list[i].description,
                    description: parseDescription(list[i].description),
                    progress: list[i].progress,
                    max_progress: list[i].max_progress
                  };
                  break;
                }
              }
            }
          }
          Storage.Set('coop', {'dailies': coopDailies});
        }
      }
    },
    CheckTweet: function(json) {
      if(json.twitter.campaign_info.is_avail_twitter === true) {
        setTweet(true);
      } else {
        setTweet(false);
      }
    },
    UseTweet: function(json) {
      if(json.reward_status === true) {
        alert('using');
      } else {
        alert('used');
      }
      setTweet(false);
    }
  }

  var parseDescription = function(description) {
      newDescription = "";
      if(description.indexOf('stage') !== -1) {
        newDescription = "Clear " + description.substring(description.indexOf('stage') + 8, description.lastIndexOf(' ', description.lastIndexOf('time') - 2));
        if(newDescription.indexOf('(Hard)') !== -1) {
          newDescription = newDescription.replace('(Hard)', '(H' + description.charAt(12) + ').');
        } else {
          newDescription += ' (N' + description.charAt(12) + ').';
        }
      } else {
        newDescription = description;
      }
      return newDescription;
  }

  var setDraws = function(amt) {
    if(drawCount !== amt) {
      Storage.Set('draws', amt);
    }
    drawCount = amt;
    $('#draw-count').text('Rupee draws: ' + amt);
  }
  var setCoop = function() {
    $coopQuests.each(function(index) {
      if(coopDailies[index] !== null) {
        $(this).text(coopDailies[index].description);
      } else {
        $(this).text('???');
      }
    });
    $coopProgresses.each(function(index) {
      if(coopDailies[index] !== null) {
        $(this).text(coopDailies[index].progress + '/' + coopDailies[index].max_progress);
      } else {
        $(this).text('');
      }
    });
  }
  var newCoop = function() {
    for(var i = 0; i < 3; i++) {
      coopDailies[i] = null;
    }
    Storage.Set('coop', {'dailies': coopDailies});
    setCoop();
  }

  var setTweet = function(bool) {
    tweet = bool;
    Storage.Set('tweet', bool);
    if(bool) {
      $('#tweet-status').text('Tweet Refill: Available');
    } else {
      $('#tweet-status').text('Tweet Refill: Not Available');
    }
  }
  var loadDailies = function() {
    Storage.GetMultiple(['draws', 'coop', 'tweet'], function(response) {
      if(response['draws'] !== undefined) {
        setDraws(response['draws']);
      } else {
        setDraws(101);
      }
      
      if(response['coop'] !== undefined) {
        coopDailies = response['coop']['dailies'];
        setCoop();
      } else {
        newCoop();
      }

      if(response['tweet'] !== undefined) {
        if(response['tweet'] === true) {
          setTweet(true);
        } else {
          setTweet(false);
        }
      } else {
        setTweet(true);
      }
    });
  }
})();