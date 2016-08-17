(function() {
  var currAP = 0;
  var maxAP = 0;
  var currBP = 0;
  var maxBP = 0;
  var apTime = {hour:0, minute:0, second:0};
  var bpTime = {hour:0, minute:0, second:0};
  var apTimer;
  var bpTimer;
  var availableRaids = {};
  var currRaids = {};
  var decAP = 0;
  var decBP = 0;

  var $apNumber = $('#ap-number');
  var $apTime = $('#ap-time');
  var $bpNumber = $('#bp-number');
  var $bpTime = $('#bp-time');

  var $apBar = $('#ap-bar').find('.progress-bar');
  var $bpBar = $('#bp-bar').find('.active-circle-icon');

  window.APBP = {
    VerifyAPBP: function(json) {
      var status;
      if(json.status !== undefined) {
        status = json.status;
      } else {
        status = json.mydata.status;
      }
      setAP(status.ap, status.max_ap);
      setBP(status.bp, status.max_bp);
      if(status.action_point_remain.indexOf('00:00') === -1) {
        var index = status.action_point_remain.indexOf('h');
        var hour = apTime.hour;
        var minute = apTime.minute;
        if(index !== -1) {
          apTime.hour = Number(status.action_point_remain.substring(0, index));
        } else {
          bpTime.hour = 0;
        }
        if(status.action_point_remain.indexOf('m') !== -1) {
          apTime.minute = Number(status.action_point_remain.substring(index + 1, status.action_point_remain.length - 1));
        } else {
          apTime.minute = 0;
        }
        if(hour !== apTime.hour || minute !== apTime.minute) { 
          apTime.second = 59;
          setAPTime();
          resetAPTimer();
        }
      } else {
        stopAPTimer();
      }
      if(status.battle_point_remain.indexOf('00:00') === -1) {
        index = status.battle_point_remain.indexOf('h');
        hour = bpTime.hour;
        minute = bpTime.minute;
        if(index !== -1) {
          bpTime.hour = Number(status.battle_point_remain.substring(0, index));
        } else {
          bpTime.hour = 0;
        }
        if(status.battle_point_remain.indexOf('m') !== -1) {
          bpTime.minute = Number(status.battle_point_remain.substring(index + 1, status.battle_point_remain.length - 1));
        } else {
          bpTime.minute = 0;
        }
        if(hour !== bpTime.hour || minute !== bpTime.minute) {
          bpTime.second = 59;
          setBPTime();
          resetBPTimer();
        }
      } else {
        stopBPTimer();
      }
    },

    InitializeQuest: function(json) {
      decAP = json.action_point;
    },

    StartQuest: function(json) {
      spendAP(decAP);
      decAP = 0;
    },

    InitializeRaid: function(json) {
      availableRaids = {};
      var raid;
      for(var i = 0; i < json.assist_raids_data.length; i++) {
        raid = json.assist_raids_data[i];
        availableRaids[raid.raid.id] = {
          bp: raid.used_battle_point
        };
      }
    },
    InitializeRaidCode: function(json) {
      availableRaids = {};
      availableRaids[json.raid.id] = {
        bp: json.used_battle_point
      };
    },

    StartRaid: function(json) {
      if(json.result !== false) {
        if(json.is_host === false) {
          spendBP(availableRaids[json.raid_id].bp);
        }
        currRaids[json.raid_id] = availableRaids[json.raid_id];
      }
      availableRaids = {};
      decAP = 0;
    },

    ClearRaid: function(json, url) {
      // var index = url.indexOf('/check_reward/') + '/check_reward/'.length;
      // if(currRaids[index] !== null) {
      //   delete currRaids[index];
      // }
    },
    
    RestoreAPBP: function(json) {
      if(json.result.recovery_str === "AP") {
        addAP(json.result.after - json.result.before);
      } else if(json.result.recovery_str === "EP") {
        addBP(json.result.after - json.result.before);
      }
    }
  }
  //   //COOP??
  //   if(request.request.url.indexOf('/room_quest_setting/') !== -1) {
  //   }

  var spendAP = function(amt) {
    setAP(currAP - amt, maxAP);
    apTime.minute += amt * 5 % 60;
    if(apTime.minute >= 60) {
      apTime.minute -= 60;
      apTime.hour++;
    }
    apTime.hour += Math.floor(amt * 5 / 60); 
    setAPTime();
    if(!apTimer) {
      resetAPTimer();
    }
  }

  var addAP = function(amt) {
    setAP(currAP + amt, maxAP);
    if(currAP >= maxAP) {
      stopAPTimer();
    } else {
      apTime.minute -= amt * 5 % 60;
      if(apTime.minute < 0) {
        apTime.minute += 60;
        apTime.hour--;
      }
      apTime.hour -= Math.floor(amt * 5 / 60); 
      setAPTime();
    }
  }

  var spendBP = function(amt) {
    setBP(currBP - amt, maxBP);
    bpTime.minute += amt * 20 % 60;
    if(bpTime.minute >= 60) {
      bpTime.minute -= 60;
      bpTime.hour++;
    }
    bpTime.hour += Math.floor(amt * 20 / 60); 
    setBPTime();
    if(!bpTimer) {
      resetBPTimer();
    }
  }

  var addBP = function(amt) {
    setBP(currBP + amt, maxBP);
    if(currBP >= maxBP) {
      stopBPTimer();
    } else {
      bpTime.minute -= amt * 20 % 60;
      if(bpTime.minute < 0) {
        bpTime.minute += 60;
        bpTime.hour--;
      }
      bpTime.hour -= Math.floor(amt * 20 / 60); 
      setBPTime();
    }
  }

  var setAP = function(curr, max) {
    currAP = curr;
    maxAP = max;
    $apNumber.text('AP: ' + currAP + '/' + maxAP);
    $apBar.css('width', ((currAP / maxAP) * 100) + '%');
  }

  var setBP = function(curr, max) {
    currBP = curr;
    maxBP = max;
    $bpNumber.text('EP: ' + currBP + '/' + maxBP);
    $bpBar.each(function(index) {
      if(index >= currBP) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  }

  var setAPTime = function() {
    var str = "";
    if(apTime.hour > 0) {
      str += apTime.hour + ':';
      if(apTime.minute < 10) {
        str += '0'
      }
    }
    if(apTime.minute > 0 || (apTime.minute == 0 && apTime.hour > 0)) {
      str += apTime.minute + ':';
      if(apTime.second < 10) {
        str += '0';
      }
    }
    str += apTime.second;
    if(parseInt(str) <= 0) {
      str = "";
    }
    $apTime.text(str);
  }
  var setBPTime = function() {
    var str = "";
    if(bpTime.hour > 0) {
      str += bpTime.hour + ':';
      if(bpTime.minute < 10) {
        str += '0'
      }
    }
    if(bpTime.minute > 0 || (bpTime.minute == 0 && bpTime.hour > 0)) {
      str += bpTime.minute + ':';
      if(bpTime.second < 10) {
        str += '0';
      }
    }
    str += bpTime.second;
    if(parseInt(str) <= 0) {
      str = "";
    }
    $bpTime.text(str);
  }

  var resetAPTimer = function() {
    clearInterval(apTimer);
    apTimer = setInterval(function() {
      apTime.second--;
      if(apTime.second < 0) {
        apTime.minute--;
        if(apTime.minute < 0) {
          apTime.hour--;
          if(apTime.hour < 0) {
            stopAPTimer();
            setAP(currAP + 1, maxAP);
            setAPTime();
            Message.Notify('Your AP is full!', currAP + '/' + maxAP + ' AP\n' + currBP + '/' + maxBP + ' EP');
            return;
          }
          apTime.minute = 59;
        }
        var max = maxAP * 20;
        if((apTime.minute % 10 === 4 || apTime.minute % 10 === 9) && !(apTime.hour === Math.floor((maxAP * 5 - 1) / 60) && apTime.minute === (maxAP * 5 - 1) % 60)) {
          setAP(currAP + 1, maxAP);
          if(currAP == 50) {
            Message.Notify('You have 50 AP!', currAP + '/' + maxAP + ' AP\n' + currBP + '/' + maxBP + ' EP');
          }
        }         
        apTime.second = 59;
      }
      setAPTime();
    }, 1000);
  }

  var stopAPTimer = function() {
    apTime.second = 0;
    apTime.minute = 0;
    apTime.hour = 0;
    clearInterval(apTimer);
    apTimer = false;
    setAPTime();
  }

  var resetBPTimer = function() {
    clearInterval(bpTimer);
    bpTimer = setInterval(function() {
      bpTime.second--;
      if(bpTime.second < 0) {
        bpTime.minute--;
        if(bpTime.minute < 0) {
          bpTime.hour--;
          if(bpTime.hour < 0) {
            setBP(currBP + 1, maxBP);
            stopBPTimer();
            setBPTime();
            Message.Notify('Your EP is full!', currAP + '/' + maxAP + ' AP\n' + currBP + '/' + maxBP + ' EP');
            return;
          }
          bpTime.minute = 59;
        }
        if((bpTime.minute === 19 || bpTime.minute === 39 || bpTime.minute === 59) && !(bpTime.hour === Math.floor((maxBP * 20 - 1) / 60) && bpTime.minute === (maxBP * 20 - 1) % 60)) {
          setBP(currBP + 1, maxBP);
        }
        bpTime.second = 59;
      }
      setBPTime();
    }, 1000);
  }
  var stopBPTimer = function() {
    bpTime.second = 0;
    bpTime.minute = 0;
    bpTime.hour = 0;
    clearInterval(bpTimer);
    bpTimer = false;
    setBPTime();
  }
})();