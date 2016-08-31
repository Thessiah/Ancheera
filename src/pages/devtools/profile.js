(function() {
  var profile = {
    lupi: null,
    level: null,
    levelPercent: null,
    levelNextExp: null,
    job: null,
    jobPercent: null,
    jobNextExp: null,
    jobPoints: null,
    zenith: null,
    zenithPercent: null,
    zenithNextExp: null,
    renown: null,
    prestige: null,
    casinoChips: null,
    weaponNumber: null,
    weaponMax: null,
    summonNumber: null,
    summonMax: null,
    characterNumber: null,
    drops: null,
    crystal: null,
    defenseBadges: null,
    defenseRank: null, 
    sparks: null,
  }
  var responseList = {};

  var $profile = $('#profile');
  var $restoreList = $profile.find('#restore-list');
  var profileNames = [];
  var loaded = false;
  var nextUncap = null;
  var nextCost = 0;
  var nextUpgrade = null;
  var updateRestoreList = function(id, amt) {
    $restoreList.find('#profile-' + id).first().text(amt);
  }
  window.Profile = {
    Initialize: function() {
      Storage.GetMultiple(['profile'], function(response) {
        if(response['profile'] !== undefined) {
          var hash = response['profile'].values;
          var updated = false;
          for(var property in hash) {
            if(hash.hasOwnProperty(property)) {
              if(profile[property] !== null && profile[property] !== hash[property]) {
                updated = true;
              } else {
                profile[property] = hash[property];
              }
              setJquery(property);
            }
          }
          if(updated) {
            saveProfile();
          }
        }
        // for(var property in profile) {
        //   if(profile.hasOwnProperty(property)) {
        //     setJquery(property);
        //   }
        // }
        loaded = true;
      });
      Message.ConsoleLog('profile.js', $restoreList.length);
      $restoreList.children('.profile-item').each(function(index) {
        Message.ConsoleLog('profile.js', $(this).data('id'));
        Message.ConsoleLog('profile.js', $(this).data('category'));
        $(this).find('.item-count').text(Supplies.Get($(this).data('id'), $(this).data('category'), updateRestoreList));
      });
    },
    Get: function(category, response) {
      if(response !== undefined) {
        if(responseList[category] === undefined) {
          responseList[category] = [];
        }
        responseList[category].push(response);
      }
      if(profile[category] !== undefined) {
        return profile[category];
      }
    },
    CompleteQuest: function(json) {
      incrementProfile('lupi', json.rewards.lupi.sum);
      if(setProfile('level', json.values.pc.param.new.level)) {
        var remain = 0;
        for(var i = 1; i <= json.values.pc.param.new.level; i++) {
          if(json.values.pc.param.next_exp_list['' + i] !== undefined) {
            remain += json.values.pc.param.next_exp_list['' + i];
          }
        }
        setProfile('levelNextExp', remain - json.values.pc.param.new.exp);
      } else {
        setProfile('levelNextExp', json.values.pc.param.remain_next_exp - (json.values.get_exp.exp + json.values.get_exp.exp_bonus));
      }
      setProfile('levelPercent', json.values.pc.param.new.exp_width + '%');
      
      if(setProfile('job', json.values.pc.job.new.level)) {
        var remain = 0;
        for(var i = 1; i <= json.values.pc.job.new.level; i++) {
          if(json.values.pc.job.next_exp_list['' + i] !== undefined) {
            remain += json.values.pc.job.next_exp_list['' + i];
          }
        }
        setProfile('jobNextExp', remain - json.values.pc.job.new.exp);
      } else {
        setProfile('jobNextExp', json.values.pc.job.remain_next_exp - (json.values.get_exp.job_exp + json.values.get_exp.job_exp_bonus));
      }
      setProfile('jobPercent', json.values.pc.job.new.exp_width + '%');
      
      setProfile('zenith', parseInt(json.values.pc.job.zenith.after_lp));
      setProfile('zenithPercent', json.values.pc.job.zenith.after_exp_gauge + '%');
      incrementProfile('zenithNextExp', -(json.values.get_exp.job_exp + json.values.get_exp.job_exp_bonus));
      var list = json.rewards.reward_list;
      var item;
      var category;
      for(var property in list) {
        if(list.hasOwnProperty(property)) {
          for(var i = 0; i < list[property].length; i++) {
            item = list[property][i];
            category = getCategory(item.item_kind);
            if(category !== undefined) {
              incrementProfile(category, 1);
            }
          }
        }
      }
      saveProfile();
    },
    CompleteRaid: function(json) {
      var path;
      var updated;
      if(!Array.isArray(json.mbp_info) && json.mbp_info !== undefined) {
        if(json.mbp_info.add_result["10100"] !== undefined) {
          path = json.mbp_info.add_result["10100"];
          if(path.add_point !== 0) {
            incrementProfile('renown', path.add_point);
            //incrementProfile('renown_weekly', path.add_point);
            updated = true;
          }
          path = json.mbp_info.add_result["20100"];
          if(path.add_point !== 0) {
            incrementProfile('renown', path.add_point);
            //incrementProfile('renown_r', path.add_point);
            updated = true;
          }
          path = json.mbp_info.add_result["20200"];
          if(path.add_point !== 0) {
            incrementProfile('renown', path.add_point);
            //incrementProfile('renown_sr', path.add_point);
            updated = true;
          }
        }
      }
      Profile.CompleteQuest(json);
    },
    SetChips: function(amount) {
      if(setProfile('casinoChips', parseInt(amount))) {
        saveProfile();
      }
    },
    SetWeaponNumber: function(json) {
      var updated = false;
      if(setProfile('weaponNumber', json.options.number)) {
        updated = true;
      }
      if( setProfile('weaponMax', parseInt(json.options.max_number))) {
        updated = true;
      }
      if(updated) {
        saveProfile();
      }
    },
    SetSummonNumber: function(json) {
      var updated = false;
      if(setProfile('summonNumber', json.options.number)) {
        updated = true;
      }
      if(setProfile('summonMax', parseInt(json.options.max_number))) {
        updated = true;
      }
      if(updated) {
        saveProfile();
      }
    },
    SetCharacterNumber: function(json) {
      for(var key in json.options.filter) {
        if(json.options.filter.hasOwnProperty(key)) {
          if(parseInt(json.options.filter[key]) !== 0) {
            return;
          }
        }
      }
      if(setProfile('characterNumber', json.options.number)) {
        saveProfile();
      }
    },
    MoveFromStash: function(json) {
      var updated = false;
      var type;
      if(json.from_name.indexOf('Weapon') !== -1) {
        type = 'weapon';
      } else if(json.from_name.indexOf('Summon') !== -1) {
        type = 'summon';
      }
      if(setProfile(type + 'Number', json.to_number)) {
        updated = true;
      }
      if(setProfile(type + 'Max', parseInt(json.to_max_number))) {
        updated = true;
      }
      if(updated) {
        saveProfile();
      }
    },
    MoveToStash: function(json) {
      var updated = false;
      var type;
      if(json.to_name.indexOf('Weapon') !== -1) {
        type = 'weapon';
      } else if(json.to_name.indexOf('Summon') !== -1) {
        type = 'summon';
      }
      if(setProfile(type + 'Number', json.from_number)) {
        updated = true;
      }
      if(setProfile(type + 'Max', parseInt(json.from_max_number))) {
        updated = true;
      }
      if(updated) {
        saveProfile();
      }
    },
    SetLupiCrystal: function(json) {
      var updated = false;
      if(json.mydata.notice !== undefined && json.mydata.trajectory_drop !== undefined) {
        if(incrementProfile('drops', parseInt(json.mydata.notice.trajectory_drop))) {
          updated = true;
        }
      }
      if(setProfile('lupi', parseInt(json.mydata.possessed.lupi))) {
        updated = true;
      }
      if(setProfile('crystal', parseInt(json.mydata.possessed.stone))) {
        updated = true;
      }
      if(updated) {
        saveProfile();
      }
    },
    LupiDraw: function(json) {
      setProfile('weaponNumber', parseInt(json.user_info.weapon_count));
      setProfile('weaponMax', parseInt(json.user_info.weapon_max));
      setProfile('summonNumber', parseInt(json.user_info.summon_count));
      setProfile('summonMax', parseInt(json.user_info.summon_max));
      setProfile('lupi', parseInt(json.user_info.money));
      setProfile('crystal', parseInt(json.user_info.user_money));
      saveProfile();
    },
    SetDrops: function(json) {
      var updated = false;
      if(setProfile('crystal', parseInt(json.amount))) {
        updated = true;
      }
      if(setProfile('drops', parseInt(json.trangect_drop))) {
        updated = true;
      }
      if(updated) {
        saveProfile();
      }
    },
    SetDefense: function(json) {
      var updated = false;
      if(json.defendorder_point_total !== undefined && setProfile('defenseBadges', parseInt(json.defendorder_point_total))) {
        updated = true;
      }
      if(json.defendorder_title !== undefined && setProfile('defenseRank', parseInt(json.defendorder_title.level))) {
        updated = true;
      }
      if(updated) {
        saveProfile();
      }
    },
    SpendCrystals: function(json) {
    },
    SetHomeProfile: function(rank, rankPercent, job, jobPercent, jobPoints, renown, prestige) {
      var updated = false;
      if(setProfile('level', parseInt(rank))) {
        updated = true;
      }
      if(setProfile('levelPercent', rankPercent.substring(rankPercent.indexOf(': ') + 2, rankPercent.indexOf(';')))) {
        updated = true;
      }
      if(setProfile('job', parseInt(job))) {
        updated = true;
      }
      if(profile['job'] === 20) {
        if(setProfile('zenithPercent', jobPercent.substring(jobPercent.indexOf(': ') + 2, jobPercent.indexOf(';')))) {
          updated = true;
        }
      } else {
        if(setProfile('jobPercent', jobPercent.substring(jobPercent.indexOf(': ') + 2, jobPercent.indexOf(';')))) {
          updated = true;
        }
      }

      if(setProfile('jobPoints', parseInt(jobPoints))) {
        updated = true;
      }
      if(setProfile('renown', parseInt(renown))) {
        updated = true;
      }
      if(setProfile('prestige', parseInt(prestige))) {
        updated = true;
      }
      if(updated) {
        saveProfile();
      }
    },
    AddLupi: function(amt) {
      if(incrementProfile('lupi', parseInt(amt))) {
        saveProfile();
      }
    },
    CheckWeaponSummon: function(json) {
      var updated = false;
      if(setProfile('weaponNumber', json.weapon_count.current_count)) {
        updated = true;
      }
      if(setProfile('weaponMax', parseInt(json.weapon_count.max_count))) {
        updated = true;
      }
      if(setProfile('summonNumber', json.summon_count.current_count)) {
        updated = true;
      }
      if(setProfile('summonMax', parseInt(json.summon_count.max_count))) {
        updated = true;
      }
      if(updated) {
        saveProfile();
      }
    },
    GetLoot: function(json) {
      var item;
      var updated =[];
      var list = json.rewards.reward_list;
      for(var property in list) {
        if(list.hasOwnProperty(property)) {
          for(var i = 0; i < list[property].length; i++) {
            item = list[property][i];
            category = getCategory(item.item_kind);
            if(category !== undefined && incrementProfile(category, 1)) {
              updated = true;
            }
          }
        }
      }
      list = json.rewards.article_list;
      for(var property in list) {
        if(list.hasOwnProperty(property)) {
          item = list[property];
          category = getCategory('' + item.kind);
          if(category !== undefined && incrementProfile(category, item.count)) {
            updated = true;
          }
        }
      }
      if(updated) {
        saveProfile();
      }
    },
    GetGift: function(json) {
      var category = getCategory(json.item_kind_id);
      if(category !== undefined && incrementProfile(category, parseInt(json.number))) {
        saveProfile(category);
      }
    },
    GetAllGifts: function(json) {
      var item;
      var category;
      var updated = false;
      for(var i = 0; i < json.presents.length; i++) {
        item = json.presents[i];
        category = getCategory(item.item_kind_id);
        if(category !== undefined && incrementProfile(category, parseInt(item.number))) {
          updated = true;
        }
      }
      if(updated) {
        saveProfile();
      }
    },
    PurchaseItem: function(json) {
      if(json.article.item_ids.length > 0 && json.article.is_get.result) {
        var updated = [];
        var id = json.article.item_ids[0];
        var category = getCategory(json.article.item_kind[0]);
        if(category !== undefined && setProfile(category, parseInt(json.article.is_get.item_cnt) + parseInt(json.purchase_number))) {
          saveProfile();
        }      
      }   
    },
    SetUncapItem: function(json) {
      nextUncap = null;
    },
    SetUncap: function(json, url) {
      if(url.indexOf('weapon') !== -1) {
        nextUncap = 'weaponNumber';
      } else if(url.indexOf('summon') !== -1) {
        nextUncap = 'summonNumber';
      } 
    },
    Uncap: function(json) {
      if(nextUncap !== null) {
        incrementProfile(nextUncap, -1);
        saveProfile();
      }
    },
    SetUncapCost: function(json) {
      nextCost = parseInt(json.cost);
      if(setProfile('lupi', parseInt(json.amount))) {
        saveProfile();
      }
    },
    BuyUncap: function() {
      incrementProfile('lupi', nextCost);
      saveProfile();
    },
    SetUpgrade: function(json, url) {
      var category;
      if(url.indexOf('weapon') !== -1 || url.indexOf('npc') !== -1) {
        category = 'weaponNumber';
      } else if(url.indexOf('summon') !== -1) {
        category = 'summonNumber';
      }
      nextUncap = {
        'amount': json.material_list.length,
        'category': category
      }
    },
    Upgrade: function(json) {
      if(nextUncap !== undefined) {
        incrementProfile(nextUncap.category, -nextUncap.amount);
        saveProfile();
      }
    }
  }
  saveProfile = function() {
    if(loaded) {
      Storage.Set('profile', {'values': profile});
    }
  }
  getCategory = function(item_kind) {
    if(item_kind === '1') {
      return 'weaponNumber';
    } else if(item_kind === '2') {
      return 'summonNumber';
    } else if(item_kind === '3') {
      return 'characterNumber';
    } else if(item_kind === '7') {
      return 'lupi';
    } else if(item_kind === '9') {
      return 'crystal';
    } else if(item_kind === '19') {
      return 'jobPoints';
    } else if(item_kind === '31') {
      return 'casinoChips';
    } else if(item_kind === '40') {
      return 'zenith';
    }else if(item_kind === '59') {
      return 'defenseBadges';
    }else {
      return undefined;
    }
  }

  setProfile = function(category, value) {
    var updated = false;
    if(value < 0) {
      value = 0;
    }
    if(profile[category] !== value) {
      profile[category] = value;
      updated = true;
      setJquery(category);
      if(responseList[category] !== undefined) {
        for(var i = 0; i < responseList[category].length; i++) {
          responseList[category][i](value);
        }
      }
    }
    return updated;
  }
  setJquery = function(category) {
    var value;
    if(category === 'jobNextExp' && profile.job === 20) {
      value = profile['zenithNextExp'];
    } else if(category === 'jobPercent' && profile.job === 20) {
      value = profile['zenithPercent'];
    } else if((category === 'weaponMax' || category === 'weaponNumber') && profile[category] !== null) {
      value = profile['weaponNumber'] + '/' + profile['weaponMax'];
      category = 'weapon';
    } else if((category === 'summonMax' || category === 'summonNumber') && profile[category] !== null) {
      value = profile['summonNumber'] + '/' + profile['summonMax'];
      category = 'summon';
    } else {
      value = profile[category];
    }
    if(value === null) {
      value = '???';
    }
    if(category === 'zenithNextExp') {
      value = '';
    }
    if(category === 'zenithNextExp' && profile.job === 20) {
      category = 'jobNextExp';
    } else if( category === 'zenithPercent') {
      category = 'jobPercent';
    }
    if(category === 'level') {
      $profile.find('#profile-' + category).text('Rank:  ' + value); 
    } else if(category === 'job') {
      $profile.find('#profile-' + category).text('Class: ' + value); 
    } else if(category === 'levelPercent' || category === 'jobPercent') {
      if(value !== '???') {
        $profile.find('#profile-' + category).css('width', value);
      } else {
        $profile.find('#profile-' + category).css('width', '0');
      }
    } else if(category === 'jobNextExp' && profile.job === '20') {
      $profile.find('#profile-' + category).text(numberWithCommas(value)); 
    } else {
      $profile.find('#profile-' + category).text(numberWithCommas(value)); 
    }
  }

  incrementProfile = function(category, amt) {
    if(profile[category] !== null) {
      if(category === 'weaponNumber' && profile[category] + amt > profile['weaponMax']) {
        return setProfile(category,  profile['weaponMax']);
      } else if(category === 'summonNumber' && profile[category] + amt > profile['summonMax']) {
        return setProfile(category,  profile['summonMax']);
      } 
      return setProfile(category, parseInt(profile[category]) + parseInt(amt));
    } else {
      return false;
    }
  }
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
})();