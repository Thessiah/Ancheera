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
  
  var timeZone;

  var isJST = true;
  var $jstDate = $('#jst-date');
  var $jstTime = $('#jst-time');
  var $dailyReset = $('#daily-reset');
  var $dailyDate = $('#daily-date');
  var $weeklyDate = $('#weekly-date');
  var $monthlyDate = $('#monthly-date');
  var $weeklyReset = $('#weekly-reset');
  var $monthlyReset = $('#monthly-reset');
  var $nextAssault = $('#next-assault');
  var $isAssault = $('#is-assault');
  var $angelHalo = $('#angel-halo');
  var $angelDate = $('#angel-date');
  var $isAngel = $('#is-angel');
  var $defenseOrder = $('#defense-order');
  var $defenseDate = $('#defense-date');
  var $isDefense = $('#is-defense');
  var $assaultTime = $('.assault-time');
  var $isDaily = $('#is-daily');
  var $isWeekly = $('#is-weekly');
  var $isMonthly = $('#is-monthly');

  var $timeZone = $('#time-zone');
  var $lightPink = '#f5f5f5';
  var $darkPink = '#ffd4e3';
  // var $lightPink = '#ffd4e3';
  // var $darkPink = '#f0c0cb';
  var $lightYellow = '#f8e5be';

  $timeZone.click(function() {
    isJST = !isJST;
    //Message.Notify('test', '', 'epNotifications');
    if(isJST) {
      $(this).text('JST');
      //$(this).css('background-color', $lightPink);
    } else {
      $(this).text(timeZone);
      //$(this).css('background-color', $lightYellow);
    }
    setDate();
    setAssaultTime();
  });
  
  window.Time = {
    Initialize: function() {
      date = new Date();
      var temp = /\((.*)\)/.exec(date.toString())[1].split(' ');
      timeZone = '';
      for(var i = 0; i < temp.length; i++) {
        timeZone += temp[i][0];
      }
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 540);
      Message.ConsoleLog('time.js', 'test1');
      Storage.GetMultiple(['daily', 'weekly', 'monthly', 'assault', 'angel', 'defense'], function(response) {
        if(response['daily'] !== undefined) {
          dailyReset = new Date(response['daily']);
        } else {
          newDaily();
        }
        if(response['weekly'] !== undefined) {
          weeklyReset = new Date(response['weekly']);
        } else {
          newWeekly();
        }
        if(response['monthly'] !== undefined) {
          monthlyReset = new Date(response['monthly']);
        } else {
          newMonthly();
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
        Message.ConsoleLog('time.js', 'test2');
        if(dailyReset !== null && weeklyReset !== null && monthlyReset !== null) {
          if(Date.parse(date) >= Date.parse(dailyReset)) { 

            if(Date.parse(date) >= Date.parse(monthlyReset)) {
              Message.ConsoleLog('time.js', 'm reset');
              Dailies.MonthlyReset();
              newMonthly();
            } 
            if(Date.parse(date) >= Date.parse(weeklyReset)) {
              Message.ConsoleLog('time.js', 'w reset');
              Dailies.WeeklyReset();
              newWeekly();
            }
            Message.ConsoleLog('time.js', 'd reset');
            Dailies.Reset();
            newDaily();
          }
        }
        Message.ConsoleLog('time.js', 'good');
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
          newDefenseTime(29);
        }
      } else {
        newDefenseTime(minutes);
      }
    },
    SetAngelHalo: function(delta, active) {
      isAngelHalo = active;
      newAngelTime(delta);
      setDate();
    }, 
    ParseTime: function(diff, unit) {
      str = "";
      var time;
      var times = ['d', 'h', 'm', 's'];
      var index = times.indexOf(unit);
      if(index !== -1) {
        for(var i = index, count = 0; i < times.length && count < 2; i++) {
          switch(times[i]) {
            case 'd':
              time = parseInt(diff / (1000 * 60 * 60 * 24));
              break;
            case 'h':
              time = parseInt(diff / (1000 * 60 * 60)) % 24;
              break;
            case 'm':
              time = parseInt(diff / (1000 * 60)) % 60;
              break;
            case 's':
              time = parseInt((diff / 1000) % 60);
              break;
          }
          if(i < times.length - 1 || count > 0 || time > 0) {
            if(count > 0) {
              count++;
              str += time + times[i];
            } else {
              if(time > 0 && i < times.length - 1) {
                str += time  + times[i] + ', ';
                count++;
              } else if(time > 0 && i === times.length - 1) {
                str += time + times[i];
              }
            }
          } else {
            str = '<1s';
          }
        }
      } else {
        str = "PARSETIME ERROR";
      }
      return str;
    }
  }

  var startClock = function() {
    clearInterval(clocktimer);
    clocktimer = setInterval(function() {
      date.setSeconds(date.getSeconds() + 1);
      checkNewDay();
      var now = Date.now() + (date.getTimezoneOffset() + 540) * 60000;
      if(date.getTime() - 100 <= now && date.getTime() + 100 >= now && (date.getMilliseconds() <= 100 || date.getMilliseconds() >= 900)) {
        setDate();
      } else {
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
    // newDaily();
    // newWeekly();
    // newMonthly();
    // newAssaultTime();
    // checkAngelTime();
    // checkDefenseOrder();
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
    if(date.getDay() === 0) {
      weeklyReset.setDate(date.getDate() + 1);
    } else if(date.getDay() === 1 && date.getHours() < 5) {
    } else {
      weeklyReset.setDate(date.getDate() + (8 - date.getDay()));
    }
    Storage.Set('weekly', Date.parse(weeklyReset));
  }
  var newMonthly = function() {
    if(date.getDate() === 1 && date.getHours() < 5) {
      monthlyReset = new Date(date.getFullYear(), date.getMonth(), 1, 5, 0, 0, 0);
    } else {
      monthlyReset = new Date(date.getFullYear(), date.getMonth() + 1, 1, 5, 0, 0, 0);
    }
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
      nextAngelHalo = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + delta, 0, 0, 0);
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
      nextDefenseOrder = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + time, 59, 0);
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
        newDefenseTime(29);
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
        Message.Notify('Strike time has begun!', '', 'strikeTimeNotifications');
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
      Message.Notify('Angel Halo has begun!', '', 'angelHaloNotifications');
    }
    if(checkDefenseOrder()) {
      Message.Notify('Defense Order has begun!', '', 'defenseOrderNotifications');
    }
    if(Date.parse(date) >= Date.parse(dailyReset)) {
      if(Date.parse(date) >= Date.parse(monthlyReset) && Date.parse(date) >= Date.parse(weeklyReset)) {
        Dailies.WeeklyReset();
        Dailies.MonthlyReset();
        newWeekly();
        newMonthly();
        Message.Notify('Monthly and weekly reset!', '' ,'dailyResetNotifications');
      } else if(Date.parse(date) >= Date.parse(monthlyReset)) {
        Dailies.MonthlyReset();
        newMonthly();
        Message.Notify('Monthly reset!', '' ,'dailyResetNotifications');
      } else if(Date.parse(date) >= Date.parse(weeklyReset)) {
        Dailies.WeeklyReset();
        newWeekly();
        Message.Notify('Weekly reset!', '' ,'dailyResetNotifications');
      } else {
        Message.Notify('Daily reset!', '' ,'dailyResetNotifications');
      }
      Dailies.Reset();
      newDaily();
      newDate();
    }
  }

  var setDate = function() {
    var str = "";
    str = Time.ParseTime(Math.abs(dailyReset - date), 'h');
    if(str.indexOf('h') === -1) {
      $isDaily.css('background-color', $darkPink);
    } else {
      $isDaily.css('background-color', $lightPink);
    }
    $dailyReset.text(str);

    str = Time.ParseTime(Math.abs(weeklyReset - date), 'd' );
    if(str.indexOf('d') === -1) {
      $isWeekly.css('background-color', $darkPink);
    } else {
      $isWeekly.css('background-color', $lightPink);
    }
    $weeklyReset.text(str);

    str = Time.ParseTime(Math.abs(monthlyReset - date), 'd');
    if(str.indexOf('d') === -1) {
      $isMonthly.css('background-color', $darkPink);
    } else {
      $isMonthly.css('background-color', $lightPink);
    }
    $monthlyReset.text(str);

    if(nextAssaultTime !== null) {
      if(isAssaultTime) {
        $isAssault.css('background-color', $darkPink);
        str = Time.ParseTime(Math.abs(nextAssaultTime - date), 'm');
      } else {
        $isAssault.css('background-color', $lightPink);
        str = Time.ParseTime(Math.abs(nextAssaultTime - date), 'h');
      }
    } else {
      //str = 'Next Strike Time: ???';
      $isAssault.css('background-color', $lightPink);
      str = '???';
    }
    $nextAssault.text(str);
    if(nextAngelHalo !== null) {
      if(isAngelHalo) {
        $isAngel.css('background-color', $darkPink);
        str = Time.ParseTime(Math.abs(nextAngelHalo - date), 'm');
      } else {
        $isAngel.css('background-color', $lightPink);
        str = Time.ParseTime(Math.abs(nextAngelHalo - date), 'h');
      }
    } else {
      $isAngel.css('background-color', $lightPink);
      str = '???'
    }
    $angelHalo.text(str);
    if(nextDefenseOrder !== null) {
      if(isDefenseOrder) {
        $isDefense.css('background-color', $darkPink);
        //str = 'Remaining Defense Order: ';
        str = Time.ParseTime(Math.abs(nextDefenseOrder - date), 'm');
      } else {
        $isDefense.css('background-color', $lightPink);
        //str = 'Next Defense Order: ';
        str = Time.ParseTime(Math.abs(nextDefenseOrder - date), 'h');
      }
    } else {
      $isDefense.css('background-color', $lightPink);
      //str = 'Next Defense Order: ???';
      str = '???';
    }
    $defenseOrder.text(str);




    var offset = - (date.getTimezoneOffset() + 540);
    if(!isJST) {
      date.setMinutes(date.getMinutes() + offset);
      if(nextAngelHalo !== null) {
        nextAngelHalo.setMinutes(nextAngelHalo.getMinutes() + offset);
      }
      if(nextDefenseOrder !== null) {
        nextDefenseOrder.setMinutes(nextDefenseOrder.getMinutes() + offset);
      }
      dailyReset.setMinutes(dailyReset.getMinutes() + offset);
      weeklyReset.setMinutes(weeklyReset.getMinutes() + offset);
      monthlyReset.setMinutes(monthlyReset.getMinutes() + offset);
    }
    str = "";
    var array = date.toDateString().split(' ');
    for(var i = 0; i < array.length; i++) {
      if(i !== 3) {
        str += array[i] + ' ';
      }
    }
    $jstDate.text(str);
    str = (date.getHours() % 12 || 12) + ':';
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
    $jstTime.text(str);
    // Message.ConsoleLog(nextAngelHalo);
    // Message.ConsoleLog(nextAngelHalo + offset);

      $angelDate.text(parseDate(nextAngelHalo));
      $defenseDate.text(parseDate(nextDefenseOrder));
      $dailyDate.text(parseDate(dailyReset));
      $weeklyDate.text(parseDate(weeklyReset));
      $monthlyDate.text(parseDate(monthlyReset));

    if(!isJST) {
      date.setMinutes(date.getMinutes() - offset);
      if(nextAngelHalo !== null) {
        nextAngelHalo.setMinutes(nextAngelHalo.getMinutes() - offset);
      }
      if(nextDefenseOrder !== null) {
        nextDefenseOrder.setMinutes(nextDefenseOrder.getMinutes() - offset);
      }
      dailyReset.setMinutes(dailyReset.getMinutes() - offset);
      weeklyReset.setMinutes(weeklyReset.getMinutes() - offset);
      monthlyReset.setMinutes(monthlyReset.getMinutes() - offset);
    }
  }

  var parseDate = function(date) {
    if(date === null) {
      return '';
    }
    var array = date.toString().split(' ');
    var str = '';
    switch(array[1]) {
      case 'Jan':
        str += '1';
        break;
      case 'Feb':
        str += '2';
        break;
      case 'Mar':
        str += '3';
        break;
      case 'Apr':
        str += '4';
        break;
      case 'May':
        str += '5';
        break;
      case 'Jun':
        str += '6';
        break;
      case 'Jul':
        str += '7';
        break;
      case 'Aug':
        str += '8';
        break;
      case 'Sep':
        str += '9';
        break;
      case 'Oct':
        str += '10';
        break;
      case 'Nov':
        str += '11';
        break;
      case 'Dec':
        str += '12';
        break;
    }
    str += '/' + array[2] + ' ';
    var time = parseInt(array[4][0] + array[4][1]);
    if(time >= 1 && time <= 11) {
      str += time + 'AM';
    } else if(time >= 13 && time <= 23) {
      str += (time - 12) + 'PM';
    } else if(time === 0) {
      str += '12AM';
    } else {
      str += '12PM';
    }
    return str;
  }
  // var parseTime = function(diff, units) {
  //   str = "";
  //   var time;
  //   for(var i = 0; i < units.length; i++) {
  //     switch(units[i]) {
  //       case 'day':
  //         time = parseInt(diff / (1000 * 60 * 60 * 24));
  //         break;
  //       case 'hour':
  //         time = parseInt(diff / (1000 * 60 * 60)) % 24;
  //         break;
  //       case 'minute':
  //         time = parseInt(diff / (1000 * 60)) % 60;
  //         break;
  //       case 'second':
  //         time = parseInt((diff / 1000) % 60);
  //         break;
  //     }
  //     if(i !== units.length - 1) {
  //       if(time > 1) {
  //         str += time + ' ' + units[i] +'s, ';
  //       } else if(time === 1) {
  //         str += '1 ' + units[i] +', ';
  //       }
  //     } else {
  //       if(time > 1) {
  //         str += time + ' ' + units[i] + 's';
  //       } else if(time === 1) {
  //         str += '1 ' + units[i];
  //       } else {
  //         str += '<1 ' + units[i];
  //       }
  //     }
  //   }
  //   return str;
  // }
  saveAssaultTime = function(times) {
    for(var i = 0; i < times.length; i++) {
      assaultTimes[i] = times[i];
    }
    Storage.Set('assault', {'times': assaultTimes});
    setAssaultTime();
  }

  setAssaultTime = function() {
    $assaultTime.each(function(index) {
      //var str = 'Schedule '+ (index + 1) +': ';
      var str = '';
      if(assaultTimes[index] === -1) {
        str += '';
      } else {
        var time = assaultTimes[index];
        if(!isJST) {
          time -= (date.getTimezoneOffset() / 60 + 9);
        }
        while(time < 0) {
          time += 24;
        }
        while(time > 23) {
          time -= 24;
        }
        if(time >= 1 && time <= 11) {
          str += time + 'AM';
        } else if(time >= 13 && time <= 23) {
          str += (time - 12) + 'PM';
        } else if(time === 0) {
          str += '12AM';
        } else {
          str += '12PM';
        }
      }
      $(this).text(str);
    });
  }
})();