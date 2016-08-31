(function() {
  var dailyNames = ['draws', 'coop', 'tweet'];
  var weeklyNames = ['renown'];
  var monthlyNames = ['moons', 'defense'];
  var drawCount = 101;
  var coopDailies =[];
  var tweet = true;
  var moons = {
    '30031': 1,
    '30032': 1,
    '30033': 1
  }

  var defenseRank = 1;
  var isHL = false;
  var defenseShop = {
    '1356': 5,
    '1357': 5,
    '1368': 1,
    '1381': 1
  }
  var defenseMax = {
    '1356': 5,
    '1357': 5,
    '1368': 1,
    '1381': 1
  }

  var renown = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0
  }
  var renownMax = {
    '1': 2000,
    '2': 500,
    '3': 500,
    '4': 500
  }
  
  var $dailiesPanel = $('#dailies-panel');
  var $weekliesPanel = $('#weeklies-panel');
  var $monthliesPanel = $('#monthlies-panel');

  var $coopQuests = $dailiesPanel.find('.coop-quest');
  var $coopProgresses = $dailiesPanel.find('.coop-progress');
  var $drawCount = $dailiesPanel.find('#draw-count');
  var $tweetStatus = $dailiesPanel.find('#tweet-status');

  var $defensePanel = $weekliesPanel.find('#defense-weekly-collapse');
  var $renownPanel = $weekliesPanel.find('#renown-weekly-collapse');

  var $moonPanel = $monthliesPanel.find('#moon-monthly-collapse');

  var $miscellaneousCollapse = $('#misc-daily-collapse');
  var $coopCollapse = $('#coop-daily-collapse');
  var $renownCollapse = $('#renown-weekly-collapse');
  var $defenseCollapse = $('#defense-weekly-collapse');
  var $moonCollapse = $('#moon-monthly-collapse');

  var $prestige = $('#weekly-prestige');
  var $defenseThree = $('#defense-three');
  var $defenseTwo = $('#defense-two');

  var hidePrestige = function(rank) {
    if(rank === null || rank < 101) {
      isHL = false;
      $prestige.hide();
    } else {
      isHL = true;
      $prestige.show();
    }
    checkRenown();
  }

  var hideDefenseShop = function(rank) {
    defenseRank = rank;
    if(rank === null || rank < 3) {
      $defenseThree.hide();
    } else if(rank === 3) {
      $defenseThree.show();
    }
    if(rank === null || rank < 2) {
      $defenseTwo.hide();
    } else if(rank >= 2) {
      $defenseTwo.show();
    }
    checkDefenseShop();
  }

  window.Dailies = {
    Initialize: function() {
      loadDailies();
      Profile.Get('level', hidePrestige);
      Profile.Get('defenseRank', hideDefenseShop);
    },
    Reset: function() {
      setDraws(101);
      newCoop();
      setTweet(true);
      Casino.DailyReset();
      Quest.DailyReset();
    },
    WeeklyReset: function() {
      var hash = renown;
      for(key in hash) {
        if(hash.hasOwnProperty(key)) {
          setRenown(key, 0);
        }
      }
      saveRenown();
      hash = defenseShop;
      for(key in hash) {
        if(hash.hasOwnProperty(key)) {
          setDefenseShop(key, defenseMax[key]);
        }
      }
      saveDefenseShop();
    },
    MonthlyReset: function() {
      setMoon('30031', 1);
      setMoon('30032', 1);
      setMoon('30033', 1);
      saveMoons();
      Casino.MonthlyReset();
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
          progress: parseInt(json.daily_mission[i].progress),
          max_progress: parseInt(json.daily_mission[i].max_progress)
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
            for(var j = 0; j < coopDailies.length; j++) {
              if(coopDailies[j] !== null && coopDailies[j].rawDescription === list[i].description) {
                exists = true;
                coopDailies[j].progress = parseInt(list[i].progress);
                break;
              }
            }
            if(!exists) {
              for(var j = 0; j < coopDailies.length; j++) {
                if(coopDailies[j] === null) {
                  coopDailies[j] = {
                    rawDescription: list[i].description,
                    description: parseDescription(list[i].description),
                    progress: parseInt(list[i].progress),
                    max_progress: parseInt(list[i].max_progress)
                  };
                  break;
                }
              }
            }
          }
          setCoop();
          Storage.Set('coop', {'dailies': coopDailies});
        }
      }
    },
    CompleteRaid: function(json) {
      var path;
      var updated = false;
      if(!Array.isArray(json.mbp_info) && json.mbp_info !== undefined && json.mbp_info.add_result !== undefined) {
        for(var key in json.mbp_info.add_result) {
          if(json.mbp_info.add_result.hasOwnProperty(key)) {
            path = json.mbp_info.add_result[key];
            if(path.add_point !== 0 && incrementRenown(path.mbp_id, path.add_point)) {
              updated = true;
            }
          }
        }
        if(updated) {
          saveRenown();
        }
      }
    },
    CheckRenown: function(json) {
      var updated = false;
      var hash = json.mbp_limit_info['92001'].limit_info;
      Message.ConsoleLog('dailies.js', 'renown1');
      for(var key in hash) {
        if(hash.hasOwnProperty(key)) {
          if(setRenown(hash[key].param.mbp_id, hash[key].data.weekly.get_number)) {
            updated = true;
          }
        }
      }
      Message.ConsoleLog('dailies.js', 'renown2');
      var path = json.mbp_limit_info['92002'].limit_info['10100'];
      if(setRenown(path.param.mbp_id, path.data.weekly.get_number)) {
        updated = true;
      }
      Message.ConsoleLog('dailies.js', updated);
      if(updated) {
        saveRenown();
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
        setTweet(false);
      } 
    },
    PurchaseMoon: function(json) {
      var id = json.article.item_ids[0];
      if(id === '30031' || id === '30032' || id === '30033') {
        if(setMoon(id, 0)) {
          saveMoons();
        }
      }
    },
    CheckMoons: function(json) {
      var id;
      var amounts = {'30031': 0, '30032': 0, '30033': 0};
      for(var i = 0; i < json.list.length; i++) {
        id = json.list[i].item_ids[0];
        if(id === '30031' || id === '30032' || id === '30033') {
          amounts[id] = 1;
        }
      }
      var updated = false;
      if(setMoon('30031', amounts['30031'])) {
        updated = true;
      }
      if(setMoon('30032', amounts['30032'])) {
        updated = true;
      }
      if(setMoon('30033', amounts['30033'])) {
        updated = true;
      }
      if(updated) {
        saveMoons();
      }
    },
    PurchaseDefense: function(json) {
      var id = json.article.item_ids[0];
      if(id === '30031' || id === '30032' || id === '30033') {
        if(setMoon(id, 0)) {
          saveMoons();
        }
      }
    },
//     '1356': 5,
    // '1357': 5,
    // '1368': 1,
    // '1381': 1
    CheckDefense: function(json, url) {
      var id;
      var amounts;
      switch(url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'))) {
        case '1':
          amounts = {'1356': 0, '1357': 0};
          break;
        case '2':
          amounts = {'1368': 0};
          break;
        case '3':
          amounts = {'1381': 0};
          break;
      }
      for(var i = 0; i < json.list.length; i++) {
        id = json.list[i].id;
        if(amounts[id] !== undefined) {
          amounts[id] = json.list[i].remain_number;
        }
      }
      Message.ConsoleLog('dailies.js', JSON.stringify(amounts));
      var updated = false;
      for(var key in amounts) {
        if(amounts.hasOwnProperty(key)) {
          if(setDefenseShop(key, amounts[key])) {
            updated = true;
          }
        }
      }
      if(updated) {
        saveDefenseShop();
      }
    },
  }

  var setDefenseShop = function(id, val) {
    $defensePanel.find('#defense-' + id).text(val + '/' + defenseMax[id]);
    if(defenseShop[id] !== val) {
      defenseShop[id] = val;
      checkDefenseShop();
      return true;
    }
    return false;
  }

  var checkDefenseShop = function() {
    var collapse = true;
    if(defenseShop['1356'] !== 0) {
      collapse = false;
    }
    if(defenseShop['1357'] !== 0) {
      collapse = false;
    }
    if(defenseRank >= 2 && defenseShop['1368'] !== 0) {
      collapse = false;
    }
    if(defenseRank === 3 && defenseShop['1381'] !== 0) {
      collapse = false;
    }
    if($defenseCollapse.hasClass('collapse in') && collapse) {
      $defenseCollapse.collapse('hide');
    } else if(!$defenseCollapse.hasClass('collapse in') && !collapse) {
      $defenseCollapse.collapse('show');
    }
  }

  var setRenown = function(id, val) {
    $renownPanel.find('#renown-' + id).text(val + '/' + renownMax[id]);
    
    if(renown[id] !== parseInt(val)) {
      renown[id] = parseInt(val);
      checkRenown();
      return true;
    }
    return false;
  }

  var checkRenown = function() {
    var collapse = true;
    for(var key in renown) {
      if(renown.hasOwnProperty(key) && renown[key] !== renownMax[key] && !(key === '4' && !isHL)) {
        collapse = false;
        break;
      } 
    }
    if($renownCollapse.hasClass('collapse in') && collapse) {
      $renownCollapse.collapse('hide');
    } else if(!$renownCollapse.hasClass('collapse in') && !collapse) {
      $renownCollapse.collapse('show');
    }
  }
  var incrementRenown = function(id, val) {
    return setRenown(id, renown[id] + val);
  }

  var setMoon = function(id, val) {
    $moonPanel.find('#moon-' + id).text(val + '/1');
    if(moons[id] !== val) {
      moons[id] = val;
        var collapse = true;
        for(var key in moons) {
          if(moons.hasOwnProperty(key) && moons[key] !== 0) {
            collapse = false;
            break;
          }
        }
        if($moonCollapse.hasClass('collapse in') && collapse) {
          $moonCollapse.collapse('hide');
        } else if(!$moonCollapse.hasClass('collapse in') && !collapse) {
          $moonCollapse.collapse('show');
        }
      return true;
    }
    return false;
  }
  var saveMoons = function() {
    Storage.Set('moons', {values: moons});
  }
  var saveDefenseShop = function() {
    Storage.Set('defenseShop', {
      values: defenseShop,
    });
  }
  var saveRenown = function() {
    Storage.Set('renown', {values: renown});
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
      } else if(description.indexOf('in Co-Op rooms') !== -1) {
        newDescription = description.substring(0, description.indexOf('in Co-Op rooms') - 1) + '.';
      } else {
        newDescription = description;
      }
      return newDescription;
  }

  var setDraws = function(amt) {
    if(drawCount !== amt) {
      drawCount = amt;
      if($miscellaneousCollapse.hasClass('collapse in') && drawCount === 0 && tweet === false) {
        $miscellaneousCollapse.collapse('hide');
      } else if(!$miscellaneousCollapse.hasClass('collapse in') && (drawCount !== 0 || tweet !== false)) {
        $miscellaneousCollapse.collapse('show');
      }
      Storage.Set('draws', amt);
    }

    $drawCount.text('Rupee draws: ' + amt);
  }
  var setCoop = function() {
    $coopQuests.each(function(index) {
      if(coopDailies[index] !== null) {
        $(this).text(coopDailies[index].description);
      } else {
        $(this).text('???');
      }
    });
    var complete = true;
    $coopProgresses.each(function(index) {
      if(coopDailies[index] === null || parseInt(coopDailies[index].progress) !== parseInt(coopDailies[index].max_progress)) {
        complete = false;
      }
      if(coopDailies[index] !== null) {
        $(this).text(coopDailies[index].progress + '/' + coopDailies[index].max_progress);
      } else {
        $(this).text('');
      }
    });
    if($coopCollapse.hasClass('collapse in') && complete) {
      $coopCollapse.collapse('hide');
    } else if(!$coopCollapse.hasClass('collapse in') && !complete) {
      $coopCollapse.collapse('show');
    }
  }
  var newCoop = function() {
    for(var i = 0; i < 3; i++) {
      coopDailies[i] = null;
    }
    Storage.Set('coop', {'dailies': coopDailies});
    setCoop();
  }

  var setTweet = function(bool) {
    Message.ConsoleLog('tweet1');
    if(tweet !== bool) {
      tweet = bool;
      if($miscellaneousCollapse.hasClass('collapse in') && drawCount === 0 && tweet === false) {
        $miscellaneousCollapse.collapse('hide');
      } else if(!$miscellaneousCollapse.hasClass('collapse in') && (drawCount !== 0 || tweet !== false)) {
        $miscellaneousCollapse.collapse('show');
      }
      Storage.Set('tweet', bool);
    }
    Message.ConsoleLog('tweet2');
    if(bool) {
      $tweetStatus.text('Tweet Refill: Available');
    } else {
      $tweetStatus.text('Tweet Refill: Not Available');
    }
    Message.ConsoleLog('tweet3');
  }
  var loadDailies = function() {
    Storage.GetMultiple(['draws', 'coop', 'tweet', 'moons', 'defenseShop', 'renown'], function(response) {
      Message.ConsoleLog('test');
      if(response['draws'] !== undefined) {
        setDraws(response['draws']);
      } else {
        setDraws(101);
      }
      Message.ConsoleLog('test3');
      if(response['coop'] !== undefined) {
        coopDailies = response['coop']['dailies'];
        setCoop();
      } else {
        newCoop();
      }
  Message.ConsoleLog('test4');
      if(response['tweet'] !== undefined) {
        if(response['tweet'] === true) {
          setTweet(true);
        } else {
          setTweet(false);
        }
      } else {
        setTweet(true);
      }
      Message.ConsoleLog('test6');
      if(response['moons'] !== undefined) {
        setMoon('30031', response['moons'].values['30031']);
        setMoon('30032', response['moons'].values['30032']);
        setMoon('30033', response['moons'].values['30033']);
      } else {
        setMoon('30031', 1);
        setMoon('30032', 1);
        setMoon('30033', 1);
      }
      Message.ConsoleLog('test');
      if(response['defenseShop'] !== undefined) {
        Message.ConsoleLog('test2');
        Message.ConsoleLog('test3');
        var hash = response['defenseShop'].values;
        Message.ConsoleLog('test4');
        for(key in hash) {
          if(hash.hasOwnProperty(key)) {
            setDefenseShop(key, hash[key]);
          }
        }
      } else {
        var hash = defenseShop;
        for(key in hash) {
          if(hash.hasOwnProperty(key)) {
            setDefenseShop(key, defenseMax[key]);
          }
        }
      }
      if(response['renown'] !== undefined) {
        var hash = response['renown'].values;
        for(key in hash) {
          if(hash.hasOwnProperty(key) && renown[key] === 0) {
            setRenown(key, hash[key]);
          }
        }
      } else {
        var hash = renown;
        for(key in hash) {
          if(hash.hasOwnProperty(key)) {
            setRenown(key, 0);
          }
        }
      }
    });
  }
})();