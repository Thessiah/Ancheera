(function() {
  var nextQuest = null;
  var currQuest = null;
  var nextCoop = null;
  var currCoop = null;
  var nextRaids = null;
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

  var $dailyRaidList = $('#daily-raid-list');
  var $dailyRaid = $dailyRaidList.find('.daily-quest-panel').first().clone();
  $dailyRaidList.find('.daily-quest-panel').first().remove();

  var updateAnimes = function(id, amt) {
    $dailyRaidList.find('#count-' + id).first().text(amt);
  }



  var remainingQuests = {
    '300031' : 3,
    '300041' : 3,
    '300051' : 3,
    '300441' : 2,

    '300081' : 3,
    '300091' : 3,
    '300101' : 3,
    '300491' : 2,

    '300141' : 3,
    '300151' : 3,
    '300161' : 3,
    '300511' : 2,

    '300181' : 3,
    '300191' : 3,
    '300261' : 3,
    '300531' : 2,
    
    '300211' : 3,
    '300221' : 3,
    '300271' : 3,
    '300561' : 2,
    
    '300241' : 3,
    '300251' : 3,
    '300281' : 3,
    '300581' : 2,
  }
  var createRaid = function(name, max, url, animeID) {
    return {
      name: name,
      max: max,
      url: imageURL + 'quests/' + url,
      animeID: animeID
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

  var raidInfo = {
    '300031' : createRaid('Tiamat (N)', 3, '2030000000.jpg', null),
    '300041' : createRaid('Tiamat (H)', 3, '2030000000_hard.jpg', null),
    '300051' : createRaid('Tiamat (EX)', 3, '2040020000_ex.jpg', '18'),
    '300441' : createRaid('Tiamat (HL)', 2, '2040020000_high.jpg', '32'),

    '300081' : createRaid('Colossus (N)', 3, '2030001000.jpg', null),
    '300091' : createRaid('Colossus (H)', 3, '2030001000_hard.jpg', null),
    '300101' : createRaid('Colossus (EX)', 3, '2040034000_ex.jpg', '19'),
    '300491' : createRaid('Colossus (HL)', 2, '2040034000_high.jpg', '47'),

    '300141' : createRaid('Leviathan (N)', 3, '2030011000.jpg', null),
    '300151' : createRaid('Leviathan (H)', 3, '2030011000_hard.jpg', null),
    '300161' : createRaid('Leviathan (EX)', 3, '2040028000_ex.jpg', '20'),
    '300511' : createRaid('Leviathan (HL)', 2, '2040028000_high.jpg', '48'),

    '300181' : createRaid('Yggdrasil (N)', 3, '2030015000.jpg', null),
    '300191' : createRaid('Yggdrasil (H)', 3, '2030015000_hard.jpg', null),
    '300261' : createRaid('Yggdrasil (EX)', 3, '2040027000_ex.jpg', '21'),
    '300531' : createRaid('Yggdrasil (HL)', 2, '2040027000_high.jpg', '49'),
    
    '300211' : createRaid('Luminiera (N)', 3, '2030035000.jpg', null),
    '300221' : createRaid('Luminiera (H)', 3, '2030035000_hard.jpg', null),
    '300271' : createRaid('Luminiera (EX)', 3, '2040047000_ex.jpg', '26'),
    '300561' : createRaid('Luminiera (HL)', 2, '2040047000_high.jpg', '50'),
    
    '300241' : createRaid('Celeste (N)', 3, '2030041000.jpg', null),
    '300251' : createRaid('Celeste (H)', 3, '2030041000_hard.jpg', null),
    '300281' : createRaid('Celeste (EX)', 3, '2040046000_ex.jpg', '31'),
    '300581' : createRaid('Celeste (HL)', 2, '2040046000_high.jpg', '51'),
  }

  var questImageURLs = {};




  window.Quest = {
    Initialize: function() {
      for(var i = 0; i < raidList.length; i++) {
        var raid = raidInfo[raidList[i]];
        var newRaid = $dailyRaid.clone();
        newRaid.data('id', raidList[i]);
        newRaid.children('.quest-img').first().attr('src', raid.url);
        newRaid.children('.quest-name').first().text(raid.name);
        newRaid.children('.quest-count').first().text(raid.max + '/' + raid.max);
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

      $dailyRaidList.find('.daily-quest-panel').each(function(index) {
        $(this).click(function() {
          Message.ConsoleLog('quest.js', $(this).data('id'));
          Message.OpenURL(Default.GetURL() + '#quest/supporter/' + $(this).data('id') + '/1');
        });
      });
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
    UpdateAnimes: function() {
      updateAnimes();
    },
    InitializeQuestImg: function(url) {
      nextQuest.imageURL = url;
    },
    StartQuest: function(json) {
      currQuest = nextQuest;
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
    InitializeCoop: function(json) {
      nextCoop = json.quest_info.chapter_name;
    },
    EnterCoop: function(json) {
    },
    CheckLimited: function(json, url) {
      var url = url.substring(url.indexOf('/1/') + 1, url.indexOf('?_='));
      if(remainingQuests[url] !== undefined) {
        remainingQuests[url] = json.limited_count;
      }
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