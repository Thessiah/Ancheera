(function() {
  var nextQuest = null;
  var currQuest = null;
  var nextCoop = null;
  var currCoop = null;
  var nextRaids = null;
  var isMagFest = false;
  var nextRaids = {};
  var currRaids = [];
  var imageURL = "../../assets/images/";
  var raidImageURL = "http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/summon/qm/";
  var $currQuestCollapse = $('#curr-quest-collapse');
  var $currQuestImg = $('#curr-quest-img');
  var $currQuestName = $('#curr-quest-name');
  var $currRaidCollapse = $('#curr-raids-collapse');
  var $currRaidImgs = $currRaidCollapse.find('.quest-img');
  var $currRaidNames = $currRaidCollapse.find('.quest-name');
  var $currRaidPanels = $currRaidCollapse.find('.quest-panel');

  var $raidsPanel = $('#raids-panel');
  var $dailyRaidList = $('#daily-raid-list');
  var $completedRaidList = $('#completed-raid-list');
  var $dailyRaid = $dailyRaidList.find('.daily-quest-panel').first().clone();
  $dailyRaidList.find('.daily-quest-panel').first().remove();

  var updateAnimes = function(id, amt) {
    $raidsPanel.find('#count-' + id).first().text(amt);
  }

  var remainingQuests = {
    '300031' : null,
    '300041' : null,
    '300051' : null,
    '300441' : null,

    '300081' : null,
    '300091' : null,
    '300101' : null,
    '300491' : null,

    '300141' : null,
    '300151' : null,
    '300161' : null,
    '300511' : null,

    '300181' : null,
    '300191' : null,
    '300261' : null,
    '300531' : null,
    
    '300211' : null,
    '300221' : null,
    '300271' : null,
    '300561' : null,
    
    '300241' : null,
    '300251' : null,
    '300281' : null,
    '300581' : null,
  }
  var createRaid = function(sequence, name, max, magDelta, url, animeID, isHL) {
    return {
      sequence: sequence,
      name: name,
      max: max,
      magDelta: magDelta,
      url: imageURL + 'quests/' + url,
      animeID: animeID,
      isHL: isHL,
      isEnabled: true
    };
  }
  var raidList = [
    '300031', '300041', '300051', '300441', 
    '300081', '300091', '300101', '300491', 
    '300141', '300151', '300161', '300511',
    '300181', '300191', '300261', '300531',
    '300211', '300221', '300271', '300561',
    '300241', '300251', '300281', '300581'
  ]

    var currRaidList = [
    '300031', '300041', '300051', '300441', 
    '300081', '300091', '300101', '300491', 
    '300141', '300151', '300161', '300511',
    '300181', '300191', '300261', '300531',
    '300211', '300221', '300271', '300561',
    '300241', '300251', '300281', '300581'
  ]

  var completedRaidList = [];

  var raidInfo = {
    '300031' : createRaid(1, 'Tiamat (N)', 3, 2, '2030000000.jpg', null, false),
    '300041' : createRaid(2, 'Tiamat (H)', 3, 2, '2030000000_hard.jpg', null, false),
    '300051' : createRaid(3, 'Tiamat (EX)', 3, 2, '2040020000_ex.jpg', '18', false),
    '300441' : createRaid(4, 'Tiamat (HL)', 2, 3, '2040020000_high.jpg', '32', true),

    '300081' : createRaid(5, 'Colossus (N)', 3, 2, '2030001000.jpg', null, false),
    '300091' : createRaid(6, 'Colossus (H)', 3, 2, '2030001000_hard.jpg', null, false),
    '300101' : createRaid(7, 'Colossus (EX)', 3, 2, '2040034000_ex.jpg', '19', false),
    '300491' : createRaid(8, 'Colossus (HL)', 2, 3, '2040034000_high.jpg', '47', true),

    '300141' : createRaid(9, 'Leviathan (N)', 3, 2, '2030011000.jpg', null, false),
    '300151' : createRaid(10, 'Leviathan (H)', 3, 2, '2030011000_hard.jpg', null, false),
    '300161' : createRaid(11, 'Leviathan (EX)', 3, 2, '2040028000_ex.jpg', '20', false),
    '300511' : createRaid(12, 'Leviathan (HL)', 2, 3, '2040028000_high.jpg', '48', true),

    '300181' : createRaid(13, 'Yggdrasil (N)', 3, 2, '2030015000.jpg', null, false),
    '300191' : createRaid(14, 'Yggdrasil (H)', 3, 2, '2030015000_hard.jpg', null, false),
    '300261' : createRaid(15, 'Yggdrasil (EX)', 3, 2, '2040027000_ex.jpg', '21', false),
    '300531' : createRaid(16, 'Yggdrasil (HL)', 2, 3, '2040027000_high.jpg', '49', true),
    
    '300211' : createRaid(17, 'Luminiera (N)', 3, 2, '2030035000.jpg', null, false),
    '300221' : createRaid(18, 'Luminiera (H)', 3, 2, '2030035000_hard.jpg', null, false),
    '300271' : createRaid(19, 'Luminiera (EX)', 3, 2, '2040047000_ex.jpg', '26', false),
    '300561' : createRaid(20, 'Luminiera (HL)', 2, 3, '2040047000_high.jpg', '50', true),
    
    '300241' : createRaid(21, 'Celeste (N)', 3, 2, '2030041000.jpg', null, false),
    '300251' : createRaid(22, 'Celeste (H)', 3, 2, '2030041000_hard.jpg', null, false),
    '300281' : createRaid(23, 'Celeste (EX)', 3, 2, '2040046000_ex.jpg', '31', false),
    '300581' : createRaid(24, 'Celeste (HL)', 2, 3, '2040046000_high.jpg', '51', true)
  }

  var questImageURLs = {};


  var hideHLRaids = function(rank) {
    // if(rank < 101) {
      $dailyRaidList.children('.daily-quest-panel').each(function() {
        if(raidInfo[$(this).data('id')].isHL && raidInfo[$(this).data('id')].isEnabled) {
          if(rank < 101) {
            $(this).hide();
          } else {
            $(this).show();
          }
        }
      });
      $completedRaidList.children('.daily-quest-panel').each(function() {
        if(raidInfo[$(this).data('id')].isHL && raidInfo[$(this).data('id')].isEnabled) {
          if(rank < 101) {
            $(this).hide();
          } else {
            $(this).show();
          }
        }
      });
    // } else {
    //   $dailyRaidList.children('.daily-quest-panel').each(function() {
    //     if(raidInfo[$(this).data('id')].isHL) {
    //       $(this).show();
    //     }
    //   });
    //   $completedRaidList.children('.daily-quest-panel').each(function() {
    //     if(raidInfo[$(this).data('id')].isHL) {
    //       $(this).show();
    //     }
    //   });
    // }
  }

  var filterRaid = function(id, show) {
    raidInfo[id].isEnabled = show;
    if(!show) {
      $('#daily-raid-' + id).hide();
    } else {
      $('#daily-raid-' + id).show();
    }
  }

  var updateMagFest = function(id, enabled) {
    var raidID;
    var currMag = isMagFest;
    isMagFest = enabled;
    for(var i = 0; i < raidList.length; i++) {
      raidID = raidList[i];
      if(currMag && !enabled) {
        setRemainingRaids(raidID, remainingQuests[raidID] - raidInfo[raidID].magDelta);
      } else if(!currMag && enabled) {
        setRemainingRaids(raidID, remainingQuests[raidID] + raidInfo[raidID].magDelta);
      } else {
        setRemainingRaids(raidID, remainingQuests[raidID]);
      }
    }
    saveRemainingRaids();

  }

  window.Quest = {
    Initialize: function() {
        for(var i = 0; i < raidList.length; i++) {
          var raid = raidInfo[raidList[i]];
          var newRaid = $dailyRaid.clone();
          newRaid.data('id', raidList[i]);
          newRaid.attr('id', 'daily-raid-' + raidList[i]);
          newRaid.children('.quest-img').first().attr('src', raid.url);
          newRaid.children('.quest-name').first().text(raid.name);
          //newRaid.children('.quest-count').first().text(raid.max + '/' + raid.max);
          newRaid.children('.quest-count').first().attr('id', 'remaining-' + raidList[i]);
          newRaid.children('.quest-count').first().data('id', raidList[i]);
          if(raid.animeID !== null) {
            newRaid.find('.item-img').first().attr('src', imageURL + 'items/' + raid.animeID + '.jpg');
            var amount = Supplies.Get(raid.animeID, 'raid', updateAnimes);
            newRaid.find('.item-count').first().text(amount);
            newRaid.find('.item-count').first().attr('id', 'count-' + raid.animeID);
          } else {
            newRaid.children('.quest-item').first().remove();
          }
          $dailyRaidList.append(newRaid);
        }
      Storage.GetMultiple(['quests'], function(response) {
        if(response['quests'] !== undefined) {
          isMagFest = response['quests'].isMagFest;
          for(var i = 0; i < raidList.length; i++) {
            setRemainingRaids(raidList[i], response['quests'].dailies[raidList[i]]);
          }
          //remainingQuests = response['quests'].dailies;

        } else {
          for(var i = 0; i < raidList.length; i++) {
            setRemainingRaids(raidList[i], raidInfo[raidList[i]].max);
          }
          saveRemainingRaids();
        }


        $currQuestCollapse.find('.quest-panel').click(function() {
          if(currQuest !== null) {
            if(currQuest.roomURL !== null) {
              Message.OpenURL(currQuest.roomURL);
            }
          }
        });
        $currRaidCollapse.find('.quest-panel').each(function(index) {
          $(this).click(function() {
            if(index < currRaids.length && currRaids[index] !== undefined) {
              Message.OpenURL(currRaids[index].roomURL);
            }
          });
        });

              Profile.Get('level', hideHLRaids);
        for(var i = 0; i < raidList.length; i++) {
          Message.GetOption({
            id: raidList[i],
            response: filterRaid
          }, function(response) {
            //Message.ConsoleLog(response.id, response.value);
            filterRaid(response.id, response.value);
          });
        }
      

      $raidsPanel.find('.daily-quest-panel').each(function(index) {
        $(this).click(function() {
          var id = $(this).data('id');
          var url = Default.GetURL() + '#quest/supporter/' + id + '/1';
          if(raidInfo[id].animeID !== null) {
            url += '/0/' + raidInfo[id].animeID;
          }
          Message.OpenURL(url);
        });
      });

      Message.GetOption({
        id: 'isMagFest',
        response: updateMagFest
      }, function(response) {
        updateMagFest('isMagFest', response.value);
      });
      });



    },

    DailyReset: function() {
      for(var key in remainingQuests) {
        if(remainingQuests.hasOwnProperty(key)) {
         
          if(!isMagFest) {
            setRemainingRaids(key, raidInfo[key].max);
          } else {
            setRemainingRaids(key, raidInfo[key].max + raidInfo[key].magDelta);
          }
        }
      }
      saveRemainingRaids();
    },

    InitializeQuest: function(json, url) {
      nextQuest = {
        name: json.chapter_name,
        questID: parseQuestID(url),
        roomURL: null,
        roomID: null,
        imageURL: '../../assets/images/quests/unknown.jpg'
      };
    },
    InitializeQuestImg: function(url) {
      nextQuest.imageURL = url;
    },
    StartQuest: function(json) {
      currQuest = nextQuest;
      if(remainingQuests[currQuest.questID] !== undefined && remainingQuests[currQuest.questID] > 0) {
        setRemainingRaids(currQuest.questID, remainingQuests[currQuest.questID] - 1);
        saveRemainingRaids();
      }
      setQuest();
    },
    NextBattle: function(json) {
      if(currQuest !== null) {
        currQuest.roomURL = Default.GetURL() + "#raid/" + json.raid_id;
      }
    },
    CheckQuest: function(json) {
      if(json.progress_quest_info !== undefined) {
        var quest = json.progress_quest_info[0];
        if(currQuest !== null && currQuest.roomID === quest.raid_id) {
          return;
        }
        var url;
        if(quest.is_multi) {
          url = Default.GetURL() + "#raid_multi/" + quest.raid_id;
        } else {
          url = Default.GetURL() + "#raid/" + quest.raid_id;
        }
        currQuest = {
          name: quest.chapter_name,
          roomURL: url,
          roomID: quest.raid_id,
          imageURL: '../../assets/images/quests/unknown.jpg'
        };
        setQuest();
      } else {
        currQuest = null;
        setQuest();
      }
    },
    CompleteQuest: function(json) {
      currQuest = null;
      nextQuest = null;
      setQuest();
    },
    InitializeRaid: function(json, type) {
      nextRaids = {};
      var raids = json.assist_raids_data;
      for(var i = 0; i < raids.length; i++) {
        nextRaids[raids[i].raid.id] = {
          name: raids[i].chapter_name,
          roomURL: Default.GetURL() + "#raid_multi/" + raids[i].raid.id,
          roomID: raids[i].raid.id,
          imageURL: raidImageURL + raids[i].boss_image + '.jpg',
          raidType: type
        }
      }
    },
    InitializeRaidCode: function(json) {
      nextRaids = {};
      nextRaids[json.raid.id] = {
        name: json.chapter_name,
        roomURL: Default.GetURL() + "#raid_multi/" + json.raid.id,
        roomID: json.raid.id,
        imageURL: raidImageURL + json.boss_image + '.jpg',
        raidType: 'normal'
      }
    },
    CheckRaid: function(json) {
      currQuest.roomID = json.raid_id;
      if(json.is_multi === 1) {
        currQuest.roomURL = Default.GetURL() + "#raid_multi/" + json.raid_id;
        //$('#curr-quest-url').text(currQuest.roomURL);
      } else {
        currQuest.roomURL = Default.GetURL() + "#raid/" + json.raid_id;
        //$('#curr-quest-url').text(currQuest.roomURL);
      }
    },
    EnterRaid: function(json) {
      if(json.result) {
        currRaids.push(nextRaids[json.raid_id]);
        setRaids();
      }
    },
    CheckRaidReward: function(json, url) {
      var id = url.substring(url.indexOf('reward/') + 7, url.indexOf('?_='));
      Message.ConsoleLog(id);
      for(var i = 0; i < currRaids.length; i++) {
        Message.ConsoleLog(currRaids[i].roomID);
        if(currRaids[i].roomID === id) {
          Message.ConsoleLog('what');
          Message.ConsoleLog(currRaids.length);
          currRaids.splice(i, 1);
          setRaids();
          return;
        }
        if(parseInt(currRaids[i].roomID) === parseInt(id)) {
          Message.ConsoleLog('ok then');
        }
      }
    },
    CompleteRaid: function(json, url) {
      if(currQuest !== null && currQuest.roomID === url.substring(url.indexOf('data/') + 5, url.indexOf('?_='))) {
        Quest.CompleteQuest(json);
      }
    },
    CheckJoinedRaids(raids, unclaimed, type) {
      for(var i = 0; i < raids.length; i++) {
        Message.ConsoleLog('quest.js', JSON.stringify(raids[i]));
        for(var j = 0; j < currRaids.length; j++) {
          if(raids[i].id === currRaids[j].roomID) {
            raids.splice(i, 1);
            i--;
            break;
          }
        }
      }
      if(raids.length === 0 && !unclaimed) {
        Message.ConsoleLog('quest.js', 'clearing unclaimed');
        for(var i = 0; i < currRaids.length; i++) {
          if(type === currRaids[i].raidType) {
            currRaids.splice(i, 1);
            i--;
          }
        }
        setRaids();
        return;
      }
      for(var i = 0; i < raids.length; i++) {
        if(raids[i].host) {
          currQuest = {
            name: raids[i].name,
            roomURL: Default.GetURL() + "#raid_multi/" + raids[i].id,
            roomID: raids[i].id,
            imageURL: raids[i].imgURL
          };
          setQuest();
        } else {
          currRaids.push({
            name: raids[i].name,
            roomURL: Default.GetURL() + "#raid_multi/" + raids[i].id,
            roomID: raids[i].id,
            imageURL: raids[i].imgURL,
            raidType: type
          });
        }
      }
      if(raids.length > 0) {
        setRaids();
      }
    },
    CheckDailyRaid: function(json, url) {
      id = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'));
      if(remainingQuests[id] !== undefined) {
        if(json.result === 'ok') {
          setRemainingRaids(id, parseInt(json.limited_count));
        } else {
          setRemainingRaids(id, 0);
        }
      }
      saveRemainingRaids();
    },
    InitializeCoop: function(json) {
      nextCoop = json.quest_info.chapter_name;
    },
    EnterCoop: function(json) {
    },
    LoadImage: function(url) {
    },
    SetQuestImageURL: function(name, url) {
      questImageURLs[name] = url;
    }
  }
  // var parseRoomID = function(url) {
  //   return url.substring(url.indexOf('data/') + 5, url.indexOf('/1.json') - 1);
  // }
  var parseQuestID = function(url) {
    return url.substring(url.indexOf('data/') + 5, url.lastIndexOf('/'));
  }

  var setRemainingRaids = function(id, amount) {
    if(remainingQuests[id] !== undefined) {
        if(amount < 0) {
          amount = 0;
        }
        if(remainingQuests[id] !== amount && amount <= 0) {
          var currIndex = currRaidList.indexOf(id);
          currRaidList.splice(currIndex, 1);
          var newIndex = completedRaidList.length;
          for(var i = 0; i < completedRaidList.length; i++) {
            if(raidInfo[id].sequence < raidInfo[completedRaidList[i]].sequence) {
              newIndex = i;
              break;
            }
          }
          if(newIndex !== completedRaidList.length) {
            $completedRaidList.find('#daily-raid-' + completedRaidList[newIndex]).before($dailyRaidList.find('#daily-raid-' + id));
            completedRaidList.splice(newIndex, 0, id);
          } else {
            $completedRaidList.append($dailyRaidList.find('#daily-raid-' + id));
            completedRaidList.push(id);
          }
      } else if(remainingQuests[id] !== amount && amount > 0 && completedRaidList.indexOf(id) !== -1) {
        var currIndex = completedRaidList.indexOf(id);
        completedRaidList.splice(currIndex, 1);
        var newIndex = currRaidList.length;
        for(var i = 0; i < currRaidList.length; i++) {
          if(raidInfo[id].sequence < raidInfo[currRaidList[i]].sequence) {
            newIndex = i;
            break;
          }
        }
        if(newIndex !== currRaidList.length) {
          $dailyRaidList.find('#daily-raid-' + currRaidList[newIndex]).before($completedRaidList.find('#daily-raid-' + id));
          currRaidList.splice(newIndex, 0, id);
        } else {
          $dailyRaidList.append($completedRaidList.find('#daily-raid-' + id));
          currRaidList.push(id);
        }
      }
      Message.ConsoleLog('complete:', completedRaidList.length);


      remainingQuests[id] = amount;
      if(!isMagFest) {
        $raidsPanel.find('#remaining-' + id).first().text(amount + '/' + raidInfo[id].max);
      } else {
        $raidsPanel.find('#remaining-' + id).first().text(amount + '/' + (raidInfo[id].max + raidInfo[id].magDelta));
      }


    }
  }

  var saveRemainingRaids = function() {
      Storage.Set('quests', {
        'dailies': remainingQuests,
        'isMagFest': isMagFest
      });
  }


  var setQuest = function() {
    if(currQuest !== null) {
      $currQuestName.text(currQuest.name);
      $currQuestImg.attr('src', currQuest.imageURL);
      $currQuestCollapse.collapse('show');
    } else {
      $currQuestName.text('None');
      $currQuestImg.attr('src', '../../assets/images/quests/unknown.jpg');
      $currQuestCollapse.collapse('hide');
    }
  }

  var setRaids = function() {
    for(var i = 0; i < 4; i++) {
      if(currRaids[i] !== undefined) {
        $currRaidPanels.eq(i).show();
        $currRaidImgs.eq(i).attr('src', currRaids[i].imageURL);
        $currRaidNames.eq(i).text(currRaids[i].name);
      } else {
        $currRaidPanels.eq(i).hide();
      }
    }
    if(currRaids.length === 0) {
      $currRaidPanels.first().show();
      $currRaidImgs.first().attr('src', '../../assets/images/quests/unknown.jpg');
      $currRaidNames.first().text('None');
      $currRaidCollapse.collapse('hide');
    } else {
      $currRaidCollapse.collapse('show');
    }
    // $currRaidImgs.each(function(index) {
    //   if(index < currRaids.length) {
    //     if(currRaids[index] !== undefined) {
    //       $(this).attr('src', currRaids[index].imageURL);
    //     }
    //   } else {
    //     return;
    //   }
    // });
    // $currRaidNames.each(function(index) {
    //   if(index < currRaids.length) {
    //     if(currRaids[index] !== undefined) {
    //       $(this).text(currRaids[index].name);
    //     }
    //   } else {
    //     return;
    //   }
    // });
  }
})();