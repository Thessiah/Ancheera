(function() {
  var createItem = function(cost, remain, max) {
    return {
      cost: cost,
      remain: remain,
      max: max
    };
  }
  var dailyItems = {
    'names': ['Luminiera Omega Anima', 'Celeste Omega Anima', 'Tiamat Omega Anima', 'Colossus Omega Anima', 'Leviathan Omega Anima', 'Half Elixir', 'Soul Berry'],
    'Luminiera Omega Anima': createItem(20000, -1, 3),
    'Celeste Omega Anima': createItem(20000, -1, 3),
    'Tiamat Omega Anima': createItem(20000, -1, 3),
    'Colossus Omega Anima': createItem(20000, -1, 3),
    'Leviathan Omega Anima': createItem(20000, -1, 3),
    'Yggdrasil Omega Anima': createItem(20000, -1, 3),
    'Half Elixir': createItem(3000, -1, 5),
    'Soul Berry': createItem(1000, -1, 10)
  };

  var monthlyItems = {
    'names': ['Fury Stone', 'Fury Pebble', 'Half Elixir', 'Soul Berry'],
    'Fury Stone': createItem(100000, -1, 20),
    'Fury Pebble': createItem(20000, -1, 50),
    'Half Elixir': createItem(3000, -1, 100),
    'Soul Berry': createItem(1000, -1, 200)
  };
  var monthlyItems = [];
  window.Casino = {
    SetCasino: function(json) {
      var list = json.list;

      for(var i = 0; i < list.length; i++) {
        if(list[i].max_unit_per_day !== "" && dailyItems.hasOwnProperty(list[i].name)) {
          dailyItems[list[i].name].remain = list[i].remain_number;
        }
        if(list[i].max_unit_per_month !== "" && monthlyItems.hasOwnProperty(list[i].name)) {
          monthlyItems[list[i].name].remain = list[i].remain_number;
        }
      }
      setCasino();
      
    },
    BuyCasino: function(json) {
    }
  }
  var setCasino = function() {
    str = "";
    var $elements = $('#dailies').children('.casino-item');
    var i = 0;
              Message.ConsoleLog('casino.js', 1);
    $('#dailies').children('.casino-item').each(function(index) {
      var property = dailyItems.names[index];
      str += dailyItems[property].remain + ',';
      Message.ConsoleLog('casino.js', 'gucci');
      $(this).text(property + ': ' + dailyItems[property].remain + '/' + dailyItems[property].max);
      Message.ConsoleLog('casino.js', 'ayy');
    });
    // for(var property in dailyItems) {
    //   if(dailyItems.hasOwnProperty(property)) {
    //     Message.ConsoleLog('casino.js', property);
    //     str += dailyItems[property].remain + ',';
    //     Message.ConsoleLog('casino.js', $elements.length);
    //     $elements[i].text();//property + ': ' + dailyItems[property].remain + '/' + dailyItems[property].max);
    //     i++;
    //     Message.ConsoleLog('casino.js', $elements[i].text());
    //   }
    // }
    Message.ConsoleLog('casino.js', 4);
    $elements = $('#monthlies').children('.casino-item').toArray();
    i = 0;
    for(var property in monthlyItems) {
      if(monthlyItems.hasOwnProperty(property)) {
        str += monthlyItems[property].remain + ',';
        $elements[i].text(property + ': ' + monthlyItems[property].remain + '/' + monthlyItems[property].max);
        i++;
      }
    }
    Message.SetCookie('casino', str);
    Message.ConsoleLog('casino.js', 'bye');
  }

})();