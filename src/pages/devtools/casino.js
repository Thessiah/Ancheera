(function() {
  var createItem = function(cost, max, updated) {
    return {
      cost: cost,
      max: max,
      updated: updated
    };
  }
  var $dailies = $('#casino-dailies').find('.casino-item');
  var $monthlies = $('#casino-monthlies').find('.casino-item');
  var updatedPages = [false, false];
  var dailyItemNames = ['Luminiera Omega Anima', 'Celeste Omega Anima', 'Tiamat Omega Anima', 'Colossus Omega Anima', 'Leviathan Omega Anima', 'Yggdrasil Omega Anima', 'Half Elixir', 'Soul Berry'];
  var remainingDailyItems = {
    'Luminiera Omega Anima': 3,
    'Celeste Omega Anima': 3,
    'Tiamat Omega Anima': 3,
    'Colossus Omega Anima': 3,
    'Leviathan Omega Anima': 3,
    'Yggdrasil Omega Anima': 3,
    'Half Elixir': 5,
    'Soul Berry': 10
  };
  var dailyItemInfo = {
    'Luminiera Omega Anima': createItem(20000, 3, false),
    'Celeste Omega Anima': createItem(20000, 3, false),
    'Tiamat Omega Anima': createItem(20000, 3, false),
    'Colossus Omega Anima': createItem(20000, 3, false),
    'Leviathan Omega Anima': createItem(20000, 3, false),
    'Yggdrasil Omega Anima': createItem(20000, 3, false),
    'Half Elixir': createItem(3000, 5, false),
    'Soul Berry': createItem(1000, 10, false)
  };
  
  var monthlyItemNames = ['Moonlight Stone', 'Steel Brick', 'Fury Stone', 'Fury Pebble', 'Half Elixir', 'Soul Berry'];
  var remainingMonthlyItems = {
    'Moonlight Stone': 5,
    'Steel Brick': 5,
    'Fury Stone': 20,
    'Fury Pebble': 50,
    'Half Elixir': 100,
    'Soul Berry': 200
  };
  var monthlyItemInfo = {
    'Moonlight Stone': createItem(0, 5, false),
    'Steel Brick': createItem(500000, 5, false),
    'Fury Stone': createItem(100000, 20, false),
    'Fury Pebble': createItem(20000, 50, false),
    'Half Elixir': createItem(3000, 100, false),
    'Soul Berry': createItem(1000, 200, false)
  };
  window.Casino = {
    Initialize: function() {
      Message.ConsoleLog('casino.js', 'jfc');
      Storage.GetMultiple(['casino'], function(response) {
        if(response['casino'] !== undefined) {
          remainingDailyItems = response['casino'].dailies;
          remainingMonthlyItems = response['casino'].monthlies;
        } else {
          Storage.Set('casino', {
            'dailies': remainingDailyItems,
            'monthlies': remainingMonthlyItems
          });
        }
        setCasino();
      });
    },
    DailyReset: function() {
      var itemName;
      for(var i = 0; i < dailyItemNames.length; i++) {
        itemName = dailyItemNames[i];
        if((itemName === 'Half Elixir' || itemName === 'Soul Berry') && remainingMonthlyItems[itemName] < dailyItemInfo[itemName].max) {
          remainingDailyItems[itemName] = remainingMonthlyItems[itemName];
        } else {
          remainingDailyItems[itemName] = dailyItemInfo[itemName].max;
        }
      }
    },
    MonthlyReset: function() {
      for(var i = 0; i < monthlyItemNames.length; i++) {
        remainingMonthlyItems[monthlyItemNames[i]] = monthlyItemInfo[monthlyItemNames[i]].max;
      }
    },
    SetCasino1: function(json) {
      var list = json.list;
      var itemName;
      for(var i = 0; i < list.length; i++) {
        itemName = list[i].name;
        if(remainingDailyItems[itemName] !== undefined) {
          remainingDailyItems[itemName] = parseInt(list[i].remain_number);
          dailyItemInfo[itemName].updated = true;
        }
        if(remainingMonthlyItems[itemName] !== undefined) {
          remainingMonthlyItems[itemName] = parseInt(list[i].max_remain.number);
          monthlyItemInfo[itemName].updated = true;
        }
      }
      updatedPages[0] = true;
      if(json.next === 1 || (updatedPages[0] && updatedPages[1])) {
        checkUpdated();
      }
      Storage.Set('casino', {
        'dailies': remainingDailyItems,
        'monthlies': remainingMonthlyItems
      });
      setCasino();
    },
    SetCasino2: function(json) {
      var list = json.list;
      var shittyIndex;
      var itemName;
      for(var i = 10; i < json.count; i++) {
        shittyIndex = "" + i;
        Message.ConsoleLog('casino.js', shittyIndex);
        itemName = list[shittyIndex].name;
        Message.ConsoleLog('casino.js', itemName);
        if(remainingDailyItems[itemName] !== undefined) {
          remainingDailyItems[itemName] = parseInt(list[shittyIndex].remain_number);
          dailyItemInfo[itemName].updated = true;
        }
        if(remainingMonthlyItems[itemName] !== undefined) {
          remainingMonthlyItems[itemName] = parseInt(list[shittyIndex].max_remain.number);
          monthlyItemInfo[itemName].updated = true;
        }
      }
      updatedPages[1] = true;
      if(json.next === 2 && updatedPages[0] && updatedPages[1]) {
        checkUpdated();
      }
      Storage.Set('casino', {
        'dailies': remainingDailyItems,
        'monthlies': remainingMonthlyItems
      });
      setCasino();
    },
    BuyCasino: function(json) {
      var itemName = json.article.name;
      if(itemName === 'Half Elixir' || itemName === 'Soul Berry') {
        remainingMonthlyItems[itemName] -= remainingDailyItems[itemName];
        if(remainingMonthlyItems[itemName] < 0) {
          remainingMonthlyItems[itemName] = 0;
        }
      } else if(remainingMonthlyItems[itemName] !== undefined) {
        remainingMonthlyItems[itemName] = 0;
      }
      if(remainingDailyItems[itemName] !== undefined) {
        remainingDailyItems[itemName] = 0;
      }
    }
  }
  var setCasino = function() {
    str = "";
    var itemName;
    $dailies.each(function(index) {
      itemName = dailyItemNames[index];
      Message.ConsoleLog('casino.js', 'gucci');
      $(this).text(remainingDailyItems[itemName] + '/' + dailyItemInfo[itemName].max);
      Message.ConsoleLog('casino.js', 'ayy');
    });
    Message.ConsoleLog('casino.js', 4);
    $monthlies.each(function(index) {
      itemName = monthlyItemNames[index];
      $(this).text(remainingMonthlyItems[itemName] + '/' + monthlyItemInfo[itemName].max);
    });
    Message.ConsoleLog('casino.js', 'bye');

  }

  var checkUpdated = function() {
    Message.ConsoleLog('casino.js', 'checking updated');
    var itemName;
    for(var i = 0; i < dailyItemNames.length; i++) {
      itemName = dailyItemNames[i];
      if(!dailyItemInfo[itemName].updated) {
        remainingDailyItems[itemName] = 0;
      }
      dailyItemInfo[itemName].updated = false;
    }
    for(var i = 0; i < monthlyItemNames.length; i++) {
      itemName = monthlyItemNames[i];
      if(!monthlyItemInfo[itemName].updated && itemName != 'Half Elixir' && itemName != 'Soul Berry') {
        remainingMonthlyItems[itemName] = 0;
      }
      monthlyItemInfo[itemName].updated = false;
    }
    updatedPages = [false, false];
  }

})();