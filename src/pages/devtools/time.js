(function () {
  var clocktimer = false;
  var date;
  var dailyReset = null;
  var weeklyReset = null;
  var monthlyReset = null;

  var isAssaultTime = false;
  var nextAssaultTime = null;
  var assaultTimes = [-1, -1];

  var isDefenseOrder = false;
  var nextDefenseOrder = null;

  var isAngelHalo = false;
  var nextAngelHalo = null;
  
  window.Time = {
    Initialize: function() {
      date = new Date();
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 540);
      Storage.GetMultiple(['daily', 'weekly', 'monthly', 'assault', 'angel', 'defense'], function(response) {
        if(response['daily'] !== undefined) {
          dailyReset = new Date(response['daily']);
        }
        if(response['weekly'] !== undefined) {
          weeklyReset = new Date(response['weekly']);
        }
        if(response['monthly'] !== undefined) {
          monthlyReset = new Date(response['monthly']);
        }
        if(response['assault'] !== undefined) {
          assaultTimes = response['assault']['times'];
        }
        newAssaultTime();
        setAssaultTime();
        if(response['angel'] !== undefined) {
          isAngelHalo = response['angel'].active;
          nextAngelHalo = new Date(response['angel'].time);
        }
        if(response['defense'] !== undefined) {
          isDefenseOrder = response['defense'].active;
          nextDefenseOrder = new Date(response['defense'].time);
        }
        if(dailyReset !== null && weeklyReset !== null && monthlyReset !== null) {
          if(Date.parse(date) >= Date.parse(dailyReset)) {
            if(Date.parse(date) >= Date.parse(monthlyReset) && Date.parse(date) >= Date.parse(weeklyReset)) {
            } else if(Date.parse(date) >= Date.parse(monthlyReset)) {
            } else if(Date.parse(date) >= Date.parse(weeklyReset)) {
            } else {
            }
            Message.ConsoleLog('time.js', 'reset1');
            Dailies.Reset();
          }
        } else {
          Message.ConsoleLog('time.js', dailyReset + ' ' + weeklyReset + ' ' + monthlyReset);
          Dailies.Reset();
        }
        newDate();
        startClock();
      });
    },
    SetAssaultTime: function(times) {
      saveAssaultTime(times);
      newAssaultTime();
    },
    SetDefenseOrder: function(minutes, active) {
      isDefenseOrder = active;
      if(active && minutes === -1) {
        if(nextDefenseOrder === null) {
          newDefenseTime(30);
        }
      } else {
        newDefenseTime(minutes);
      }
    },
    SetAngelHalo: function(delta, active) {
      isAngelHalo = active;
      newAngelTime(delta);
    }
  }

  var startClock = function() {
    clearInterval(clocktimer);
    clocktimer = setInterval(function() {
      date.setSeconds(date.getSeconds() + 1);
      checkNewDay();
      var now = Date.now() + (date.getTimezoneOffset() + 540) * 60000;
      if(date.getTime() - 10 <= now && date.getTime() + 10 >= now && (date.getMilliseconds() <= 10 || date.getMilliseconds() >= 990)) {
        setDate();
        //$('#test').text('good');
      } else {
        //$('#test').text('bad');
        refreshClock();
      }
    }, 1000);
  }

  var refreshClock = function() {
    newDate();
    clearInterval(clocktimer);
    clocktimer = setTimeout(function() {
      date.setSeconds(date.getSeconds() + 1);
      checkNewDay();
      setDate();
      startClock();
    }, 1000 - date.getMilliseconds());
  }

  var newDate = function() {
    date = new Date();
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 540);
    newDaily();
    newWeekly();
    newMonthly();
    newAssaultTime();
    checkAngelTime();
    checkDefenseOrder();
    setDate();
  }

  var newDaily = function() {
    dailyReset = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5, 0, 0, 0);
    if(date.getHours() >= 5) {
      dailyReset.setDate(date.getDate() + 1);
    }
    Storage.Set('daily', Date.parse(dailyReset));
  }
  var newWeekly = function() {
    weeklyReset = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5, 0, 0, 0);
    if(date.getDay() !== 0) {
      weeklyReset.setDate(date.getDate() + (8 - date.getDay()));
    } else {
      weeklyReset.setDate(date.getDate() + 1);
    }
    Storage.Set('weekly', Date.parse(weeklyReset));
  }
  var newMonthly = function() {
    monthlyReset = new Date(date.getFullYear(), date.getMonth() + 1, 1, 5, 0, 0, 0);
    Storage.Set('monthly', Date.parse(monthlyReset));
  }
  var newAssaultTime = function() {
    var hour = date.getHours();
    if(hour >= assaultTimes[0] && hour < assaultTimes[0] + 1) {
      isAssaultTime = true;
      nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), assaultTimes[0] + 1, 0, 0, 0);
    } else if(hour >= assaultTimes[1] && hour < assaultTimes[1] + 1) {
      isAssaultTime = true;
      nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), assaultTimes[1] + 1, 0, 0, 0);
    } else { 
      isAssaultTime = false;
      if(assaultTimes[1] === -1) {
        if(assaultTimes[0] === -1) {
          nextAssaultTime = null;
        } else {
          nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), assaultTimes[0], 0, 0, 0);
        }
      } else {
        if(hour < assaultTimes[0] && hour < assaultTimes[1]) {
          nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.min(assaultTimes[0], assaultTimes[1]), 0, 0, 0);
        } else if(hour > assaultTimes[0] && hour > assaultTimes[1]) {
          nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, Math.min(assaultTimes[0], assaultTimes[1]), 0, 0, 0);
        } else {
          nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.max(assaultTimes[0], assaultTimes[1]), 0, 0, 0);
        }
      }
    }
  }
  // var newDefenseTime = function(time) {
  //   if(time === null) {
  //     if(nextDefenseOrder !== null) {
  //       if(!isDefenseOrder && Date.parse(date) >= Date.parse(nextDefenseOrder) && Date.parse(date) < Date.parse(nextDefenseOrder) + 1800000) {
  //         isDefenseOrder = true;
  //         newDefenseTime(30);
  //       } else if((Date.parse(date) >= Date.parse(nextDefenseOrder) && isDefenseOrder) || (Date.parse(date) >= Date.parse(nextDefenseOrder) + 1800000)){
  //         newDefenseTime(-1);
  //       }
  //     }
  //     return;
  //   }
  //   if(time !== -1) {
  //     nextDefenseOrder = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + time, 0, 0);
  //   } else {
  //     nextDefenseOrder = null;
  //     isDefenseOrder = false;
  //   }
  //   Storage.Set('defense', {
  //     active: isDefenseOrder,
  //     time: nextDefenseOrder
  //   });
  // }

  var newAngelTime = function(delta) {
    if(delta !== -1) {
      nextAngelHalo = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + delta + 1, 0, 0, 0);
      Storage.Set('angel', {
        active: isAngelHalo,
        time: Date.parse(nextAngelHalo)
      });
    } else {
      isAngelHalo = false;
      nextAngelHalo = null;
      Storage.Set('angel', {
        active: false,
        time: null
      });
    }
  }

  var checkAngelTime = function() {
    if(nextAngelHalo !== null && Date.parse(date) >= Date.parse(nextAngelHalo)) {
      if(!isAngelHalo && Date.parse(date) < Date.parse(nextAngelHalo) + 3600000) {
        isAngelHalo = true;
        newAngelTime(1);
        return true;
      } else {
        newAngelTime(-1);
      }
    }
    return false;
  }

  var newDefenseTime = function(time) {
    if(time !== -1) {
      nextDefenseOrder = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + time, 0, 0);
      Storage.Set('defense', {
        active: isDefenseOrder,
        time: Date.parse(nextDefenseOrder)
      });  
    } else {
      isDefenseOrder = false;
      nextDefenseOrder = null;
      Storage.Set('defense', {
        active: false,
        time: null
      });
    }
  }

  var checkDefenseOrder = function() {
    if(nextDefenseOrder !== null && Date.parse(date) >= Date.parse(nextDefenseOrder)) {
      if(!isDefenseOrder && Date.parse(date) < Date.parse(nextDefenseOrder) + 1800000) {
        isDefenseOrder = true;
        newDefenseTime(30);
        return true;
      } else {
        newDefenseTime(-1);
      }
    }
    return false;
  }
  var checkNewDay = function() {
    if(Date.parse(date) >= Date.parse(nextAssaultTime) && Date.parse(date) < Date.parse(nextAssaultTime) + 3600000) {
      if(!isAssaultTime) {
        Message.Notify('Strike time has begun!', '');
      }
      newAssaultTime();
    } else if(Date.parse(date) >= Date.parse(nextAssaultTime) + 3600000) {
      newAssaultTime();
    }
    // if(nextDefenseOrder !== null) {
    //   if(Date.parse(date) >= Date.parse(nextDefenseOrder) && Date.parse(date) < Date.parse(nextDefenseOrder) + 1800000 && !isDefenseOrder) {
    //     isDefenseOrder = true;
    //     Message.Notify('Defense Order has begun!', '');
    //     newDefenseTime(30);
    //   } else if ((Date.parse(date) >= Date.parse(nextDefenseOrder) && isDefenseOrder) || (Date.parse(date) >= Date.parse(nextDefenseOrder) + 1800000)){
    //     isDefenseOrder = false;
    //     newDefenseTime(-1);
    //   }
    // }
    // if(nextAngelHalo !== null) {
    //   if(Date.parse(date) >= Date.parse(nextAngelHalo) && Date.parse(date) < Date.parse(nextAngelHalo) + 3600000 && !isAngelHalo) {
    //       isAngelHalo = true;
    //       Message.Notify('Angel Halo has begun!', '');
    //       newAngelTime(1);
    //   } else if ((Date.parse(date) >= Date.parse(nextAngelHalo) && isAngelHalo) || (Date.parse(date) >= Date.parse(nextAngelHalo) + 3600000)){
    //     isAngelHalo = false;
    //     newAngelTime(-1);
    //   }
    // }
    if(checkAngelTime()) {
      Message.Notify('Angel Halo has begun!', '');
    }
    if(checkDefenseOrder()) {
      Message.Notify('Defense Order has begun!', '');
    }
    if(Date.parse(date) >= Date.parse(dailyReset)) {
      if(Date.parse(date) >= Date.parse(monthlyReset) && Date.parse(date) >= Date.parse(weeklyReset)) {
        Message.Notify('Monthly and weekly reset!', '');
      } else if(Date.parse(date) >= Date.parse(monthlyReset)) {
        Message.Notify('Monthly reset!', '');
      } else if(Date.parse(date) >= Date.parse(weeklyReset)) {
        Message.Notify('Weekly reset!', '');
      } else {
        Message.Notify('Daily reset!', '');
      }
      Dailies.Reset();
      newDate();
    }
  }

  var setDate = function() {
    $('#jst-date').text(date.toDateString());
    var str = (date.getHours() % 12 || 12) + ':';
    if(date.getMinutes() < 10) {
      str += '0';
    }
    str += date.getMinutes() + ':'
    if(date.getSeconds() < 10) {
      str += '0';
    }
    str += date.getSeconds() + ' ';
    if(date.getHours() <= 11) {
      str += 'AM';
    } else {
      str += 'PM';
    }
    $('#jst-time').text(str);

    str = 'Daily reset in: ';
    str += parseTime(Math.abs(dailyReset - date), ['hour', 'minute']);
    $('#daily-reset').text(str);
    str = 'Weekly reset in: ';
    str += parseTime(Math.abs(weeklyReset - date), ['day', 'hour']);
    $('#weekly-reset').text(str);
    str = 'Monthly reset in: ';
    str += parseTime(Math.abs(monthlyReset - date), ['day', 'hour']);
    $('#monthly-reset').text(str);
    if(nextAssaultTime !== null) {
      if(isAssaultTime) {
        str = 'Remaining Strike Time: ';
        str += parseTime(Math.abs(nextAssaultTime - date), ['minute', 'second']);
      } else {
        str = 'Next Strike Time: ';
        str += parseTime(Math.abs(nextAssaultTime - date), ['hour', 'minute']);
      }
    } else {
      str = 'Next Strike Time: ???';
    }
    $('#next-assault').text(str);
    if(nextAngelHalo !== null) {
      if(isAngelHalo) {
        str = 'Remaining Angel Halo: ';
        str += parseTime(Math.abs(nextAngelHalo - date), ['minute', 'second']);
      } else {
        str = 'Next Angel Halo: ';
        str += parseTime(Math.abs(nextAngelHalo - date), ['hour', 'minute']);
      }
    } else {
      str = 'Next Angel Halo: ???';
    }
    $('#angel-halo').text(str);
    if(nextDefenseOrder !== null) {
      if(isDefenseOrder) {
        str = 'Remaining Defense Order: ';
        str += parseTime(Math.abs(nextDefenseOrder - date), ['minute', 'second']);
      } else {
        str = 'Next Defense Order: ';
        str += parseTime(Math.abs(nextDefenseOrder - date), ['hour', 'minute']);
      }
    } else {
      str = 'Next Defense Order: ???';
    }
    $('#defense-order').text(str);
  }
  parseTime = function(diff, units) {
    str = "";
    var time;
    for(var i = 0; i < units.length; i++) {
      switch(units[i]) {
        case 'day':
          time = parseInt(diff / (1000 * 60 * 60 * 24));
          break;
        case 'hour':
          time = parseInt(diff / (1000 * 60 * 60)) % 24;
          break;
        case 'minute':
          time = parseInt(diff / (1000 * 60)) % 60;
          break;
        case 'second':
          time = parseInt((diff / 1000) % 60);
          break;
      }
      if(i !== units.length - 1) {
        if(time > 1) {
          str += time + ' ' + units[i] +'s, ';
        } else if(time === 1) {
          str += '1 ' + units[i] +', ';
        }
      } else {
        if(time > 1) {
          str += time + ' ' + units[i] + 's';
        } else if(time === 1) {
          str += '1 ' + units[i];
        } else {
          str += '<1 ' + units[i];
        }
      }
    }
    return str;
  }
  saveAssaultTime = function(times) {
    for(var i = 0; i < times.length; i++) {
      assaultTimes[i] = times[i];
    }
    Storage.Set('assault', {'times': assaultTimes});
    setAssaultTime();
  }

  setAssaultTime = function() {
    $('.assault-time').each(function(index) {
      var str = 'Schedule '+ (index + 1) +': ';
      if(assaultTimes[index] === -1) {
        str += '???';
      } else if(assaultTimes[index] >= 1 && assaultTimes[index] <= 11) {
        str += assaultTimes[index] + ':00 AM';
      } else if(assaultTimes[index] >= 13 && assaultTimes[index] <= 23) {
        str += (assaultTimes[index] - 12) + ':00 PM';
      } else if(assaultTimes[index] === 0) {
        str += '12:00 AM';
      } else {
        str += '12:00 PM';
      }
      $(this).text(str);
    });
  }
})();