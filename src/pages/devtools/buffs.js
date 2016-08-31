(function() {
  var newBuff = function(id, level, endTime) {
    return {
      id: id,
      level: level,
      endTime: endTime
    };
  }
  var supportURL = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/item/support/support_';
  var buffInfo = {
    '1': 20501,
    '2': 20401,
    '3': 20701,
    '4': 20801,
    '5': 10601,
    '6': 10301
  };
// {
// 	"data": [
// 		{
// 			"endTime": 1471567639148,
// 			"id": "6",
// 			"level": "1"
// 		}
// 	]
// }
  var buffs = [];
  var buffTimers = [];
  var $buffs = $('#buffs');
  var $buffTimes = $buffs.find('.item-count');
  var $buffIcons = $buffs.find('.item-img');
  window.Buffs = {
    Initialize: function() {
      for(var i = 0; i < 3; i++) {
        setBuff(i);
      }
      Storage.GetMultiple(['buffs'], function(response) {
        if(response['buffs'] !== undefined) {
          buffs = response['buffs'].data;
          var updated = false;
          for(var i = 0; i < buffs.length; i++) {
            if(Date.now() < buffs[i].endTime) {
              startBuffTimer(buffs[i]);
            } else {
              buffs.splice(i, 1);
              i--;
              updated = true;
            }
          }
          if(updated) {
            saveBuffs();
          }
          for(var i = 0; i < 3; i++) {
            setBuff(i);
          }
        }
      });
    },
    StartBuff: function(array) {
      var id = array[4];
      var level = array[6];
      var duration = parseInt(array[9]);
      var startTime = Date.now();
      var index = buffs.length;
      buffs.push(newBuff(id, level, startTime + duration * 3600000));
      startBuffTimer(buffs[index]);
      saveBuffs();
    }

  };

  var setBuff = function(index) {
    if(buffs.length > index) {
      var id = buffs[index].id;
      if($buffIcons.eq(index).is(':hidden')) {
        $buffTimes.eq(index).show();
        $buffIcons.eq(index).show();
      }
      if($buffIcons.eq(index).data('id') !== id) {
        $buffIcons.eq(index).data('id', id);
        $buffIcons.eq(index).attr('src', supportURL + buffInfo[id] + '_' + buffs[index].level + '.png');
      }
      $buffTimes.eq(index).text(Time.ParseTime(Math.abs(buffs[index].endTime - Date.now()), 'h').replace(',',''));
    
    } else {
      $buffTimes.eq(index).text('');
      $buffIcons.eq(index).data('id', '0');
      $buffIcons.eq(index).hide();
    }
  }

  var startBuffTimer = function(buff) {
    buffTimers.push(setInterval(function() {
      var index = buffs.indexOf(buff);
      if(Date.now() >= buff.endTime) {
        buffs.splice(index, 1);
        clearInterval(buffTimers[index]);
        buffTimers.splice(index, 1);
        for(var i = index; i < 3; i++) {
          setBuff(i);
        }
        saveBuffs();
      } else {
       setBuff(index);
      }
    }, 1000));
  }

  var saveBuffs = function() {
    Storage.Set('buffs', {'data': buffs});
  }

})();