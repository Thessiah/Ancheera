(function () {
  var clocktimer = false;
  var date;
  var dailyReset;
  var weeklyReset;
  var monthlyReset;
  var isAssaultTime = false;
  var nextAssaultTime = null;
  var assaultTimes = [-1, -1];

  window.Time = {
    Initialize: function() {
      var count = 0;
      Message.GetCookie('daily', function(cookie) {
        if(cookie) {
          dailyReset = cookie.value;
        }
        count++;
        if(count >= 3) {
          checkInitialize();
        }
      });
      Message.GetCookie('weekly', function(cookie) {
        if(cookie) {
          weeklyReset = cookie.value;
        }
        count++;
        if(count >= 3) {
          checkInitialize();
        }
      });
      Message.GetCookie('monthly', function(cookie) {
        if(cookie) {
          monthlyReset = cookie.value;
        }
        count++;
        if(count >= 3) {
          checkInitialize();
        }
      });
      Message.GetCookie('assaultTime', function(cookie) {
        if(cookie) {
          var times = cookie.value.split(',');
          assaultTimes[0] = parseInt(times[0]);
          assaultTimes[1] = parseInt(times[1]);
        } else {
          Message.SetCookie('assaultTime', '-1,-1'); 
        }
        newAssaultTime();
        setAssaultTime();
      });
    },
    SetAssaultTime: function(slot, time) {
      if(assaultTimes[slot] !== time) {
        saveAssaultTime(slot, time);
        newAssaultTime();
      }
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
    setDate();
  }

  var newDaily = function() {
    dailyReset = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5, 0, 0, 0);
    if(date.getHours() >= 5) {
      dailyReset.setDate(date.getDate() + 1);
    }
    Message.SetCookie('daily', Date.parse(dailyReset));
  }
  var newWeekly = function() {
    weeklyReset = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5, 0, 0, 0);
    if(date.getDay() !== 0) {
      weeklyReset.setDate(date.getDate() + (8 - date.getDay()));
    } else {
      weeklyReset.setDate(date.getDate() + 1);
    }
    Message.SetCookie('weekly', Date.parse(weeklyReset));
  }
  var newMonthly = function() {
    monthlyReset = new Date(date.getFullYear(), date.getMonth() + 1, 1, 5, 0, 0, 0);
    Message.SetCookie('monthly', Date.parse(monthlyReset));
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

  var checkNewDay = function() {
    if(Date.parse(date) >= Date.parse(nextAssaultTime) && Date.parse(date) < Date.parse(nextAssaultTime + 3600000)) {
      if(!isAssaultTime) {
        Message.Notify('Strike time has begun!', '');
      }
      newAssaultTime();
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

  var checkInitialize = function() {
    date = new Date();
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 540);
    if(Date.parse(date) >= Date.parse(dailyReset)) {
      if(Date.parse(date) >= Date.parse(monthlyReset) && Date.parse(date) >= Date.parse(weeklyReset)) {
      } else if(Date.parse(date) >= Date.parse(monthlyReset)) {
      } else if(Date.parse(date) >= Date.parse(weeklyReset)) {
      } else {
      }
      Dailies.Reset();
    }
    newDate();
    startClock();
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
    var diff = Math.abs(dailyReset - date);
    var hours = parseInt(diff / (1000 * 60 * 60)) % 24;
    var minutes = parseInt(diff / (1000 * 60)) % 60;
    if(hours !== 0) {
      str += hours + ':';
      if(minutes < 10) {
        str += '0';
      }
      str += minutes;
    } else if(minutes > 0) {
        str += minutes + ' minutes';
      } else {
        str += '<1 minute';
      }
    $('#daily-reset').text(str);

    str = 'Weekly reset in: ';
    diff = Math.abs(weeklyReset - date);
    var days = parseInt(diff / (1000 * 60 * 60 * 24)) % 7;
    if(days !== 0) {
      str += days + ' days, ';
    }
    if(hours !== 0 || days !== 0) {
      str += hours + ' hours';
    } else {
      str += '<1 hour';
    }
    $('#weekly-reset').text(str);

    str = 'Monthly reset in: ';
    diff = Math.abs(monthlyReset - date);
    days = parseInt(diff / (1000 * 60 * 60 * 24));
    if(days !== 0) {
      str += days + ' days, ';
    }
    if(hours !== 0 || days !== 0) {
      str += hours + ' hours';
    } else {
      str += '<1 hour';
    }
    $('#monthly-reset').text(str);

    if(nextAssaultTime !== null) {
      if(isAssaultTime) {
        str = 'Remaining strike time: ';
        diff = Math.abs(nextAssaultTime - date);
        minutes = parseInt(diff / (1000 * 60)) % 60;
        seconds = parseInt((diff / 1000) % 60) ;
        if(minutes !== 0) {
          str += minutes + ':';
          if(seconds < 10) {
            str += '0';
          }
          str += seconds;
        } else if(seconds > 0) {
          str += seconds + ' seconds';
        } else {
          str += '<1 second';
        }
      } else {
        str = 'Next strike time: ';
        diff = Math.abs(nextAssaultTime - date);
        hours = parseInt(diff / (1000 * 60 * 60)) % 24;
        minutes = parseInt(diff / (1000 * 60)) % 60;
        if(hours !== 0) {
          str += hours + ':';
          if(minutes < 10) {
            str += '0';
          }
          str += minutes;
        } else if(minutes > 0) {
          str += minutes + ' minutes';
        } else {
          str += '<1 minute';
        }
      }
    } else {
      str = 'Next strike time: ???';
    }
    $('#next-assault').text(str);
  }

  saveAssaultTime = function(slot, time) {
    Message.ConsoleLog('info', 'setting assault');
    if(slot === -1) {
      assaultTimes[0] = time;
      assaultTimes[1] = -1;
      Message.SetCookie('assaultTime', time + ',-1'); 
    } else {
      assaultTimes[slot] = time;
      Message.SetCookie('assaultTime', assaultTimes[0] + ',' + assaultTimes[1]);
    }
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