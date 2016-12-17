var createRaid = function(name, type, url, isHL) {
    return {
      name: name,
      type: type,
      url: url,
      isHL: isHL
    };
  }

var raidInfo = {
  '300011' : createRaid('Griffin', 'tiamat', '2030003000.jpg', false),
  '300021' : createRaid('Griffin (H)', 'tiamat', '2030003000_hard.jpg', false),
  '300031' : createRaid('Tiamat', 'tiamat', '2030000000.jpg', false),
  '300041' : createRaid('Tiamat (H)', 'tiamat', '2030000000_hard.jpg', false),
  '300051' : createRaid('Tiamat (EX)', 'tiamat', '2040020000_ex.jpg', false),
  '300441' : createRaid('Tiamat (HL)', 'tiamat', '2040020000_high.jpg', true),

  '300061' : createRaid('Flame', 'colossus', '2020018001.jpg', false),
  '300071' : createRaid('Flame (H)', 'colossus', '2020018001_hard.jpg', false),
  '300081' : createRaid('Colossus', 'colossus', '2030001000.jpg', false),
  '300091' : createRaid('Colossus (H)', 'colossus', '2030001000_hard.jpg', false),
  '300101' : createRaid('Colossus (EX)', 'colossus', '2040034000_ex.jpg', false),
  '300491' : createRaid('Colossus (HL)', 'colossus', '2040034000_high.jpg', true),

  '300111' : createRaid('Guard', 'leviathan', '2030013001.jpg', false),
  '300121' : createRaid('Guard (H)', 'leviathan', '2030013001_hard.jpg', false),
  '300141' : createRaid('Leviathan', 'leviathan', '2030011000.jpg', false),
  '300151' : createRaid('Leviathan (H)', 'leviathan', '2030011000_hard.jpg', false),
  '300161' : createRaid('Leviathan (EX)', 'leviathan', '2040028000_ex.jpg', false),
  '300511' : createRaid('Leviathan (HL)', 'leviathan', '2040028000_high.jpg', true),

  '300170' : createRaid(null, 'yggdrasil', null, false),
  '300171' : createRaid('Dragon (H)', 'yggdrasil', '2030004000_hard.jpg', false),
  '300181' : createRaid('Yggdrasil', 'yggdrasil', '2030015000.jpg', false),
  '300191' : createRaid('Yggdrasil (H)', 'yggdrasil',  '2030015000_hard.jpg', false),
  '300261' : createRaid('Yggdrasil (EX)', 'yggdrasil',  '2040027000_ex.jpg', false),
  '300531' : createRaid('Yggdrasil (HL)', 'yggdrasil',  '2040027000_high.jpg', true),
  
  '300200' : createRaid(null, 'luminiera', null, false),
  '300201' : createRaid('Wisp (H)', 'luminiera', '2030027000_hard.jpg', false),
  '300211' : createRaid('Luminiera', 'luminiera', '2030035000.jpg', false),
  '300221' : createRaid('Luminiera (H)', 'luminiera', '2030035000_hard.jpg', false),
  '300271' : createRaid('Luminiera (EX)', 'luminiera', '2040047000_ex.jpg', false),
  '300561' : createRaid('Luminiera (HL)', 'luminiera', '2040047000_high.jpg', true),
  
  '300230' : createRaid(null, 'celeste', null, false),
  '300231' : createRaid('Eye (H)', 'celeste', '2030038000_hard.jpg', false),
  '300241' : createRaid('Celeste', 'celeste', '2030041000.jpg', false),
  '300251' : createRaid('Celeste (H)', 'celeste', '2030041000_hard.jpg', false),
  '300281' : createRaid('Celeste (EX)', 'celeste', '2040046000_ex.jpg', false),
  '300581' : createRaid('Celeste (HL)', 'celeste', '2040046000_high.jpg', true)
};

var options = [
    'ougiRefresh',
    'skip',
    'skipNext',
    'enableNotifications',
    'muteNotifications',
    'apNotifications',
    'epNotifications',
    'dailyResetNotifications',
    'strikeTimeNotifications',
    'angelHaloNotifications',
    'defenseOrderNotifications',
    'isMagFest',

    '300011',
    '300021',
    '300031',
    '300041',
    '300051',
    '300441',

    '300061',
    '300071',
    '300081',
    '300091',
    '300101',
    '300491',

    '300111',
    '300121',
    '300141',
    '300151',
    '300161',
    '300511',

    '300171',
    '300181',
    '300191',
    '300261',
    '300531',
    
    '300201',
    '300211',
    '300221',
    '300271',
    '300561',
    
    '300231',
    '300241',
    '300251',
    '300281',
    '300581',
];
var $raids = $('#raids');
var $raid = $raids.find('.raid').first().clone();
$raids.find('.raid').first().remove();
for(var key in raidInfo) {
  if(raidInfo.hasOwnProperty(key)) {
    if(raidInfo[key].name !== null) {
      var newRaid = $raid.clone();
      newRaid.attr('id', 'raid-' + key);
      newRaid.children('.check').attr('id', key);
      // if(raidInfo[key].isHL) {
      //   newRaid.children('.check').prop('checked', false);
      // } else {
      //   newRaid.children('.check').prop('checked', true);
      // }
      newRaid.children('.name').text(raidInfo[key].name);
      //$raids.children('#' + raidInfo[key].type).append(newRaid);
      newRaid.appendTo('#' + raidInfo[key].type);
    }
    else
    {
      var newRaid = $raid.clone();
      newRaid.children('.check').hide();
      newRaid.children('.name').text('  ');
      newRaid.appendTo('#' + raidInfo[key].type);
    }
  }
}

$(':checkbox').each(function() {
  $(this).click(function() {
    checkEnabled($(this));
    chrome.runtime.sendMessage({setOption: {
      'id': [$(this).attr('id')],
      'value': $(this).is(':checked')
    }
  });
});
});

var checkEnabled = function(obj) {
  if(obj.attr('id') === 'enableNotifications') {
    var checked = obj.is(':checked')
    $('#notifications').find('.check').each(function() {
      $(this).prop('disabled', !checked);
    });
    $('#notifications').find('.name').each(function() {
      if(checked) {
        $(this).css('color', '#333333');
      } else {
        $(this).css('color', 'grey');
      }
    });
  }
}

var setCheckBox = function(id, value) {
  $('#' + id).prop('checked', value);
}

for(var i = 0; i < options.length; i++) {
  chrome.runtime.sendMessage({getOption : options[i]
  }, function(response) {
      if(response.value !== null) {
        $('#' + response.id).prop('checked', response.value);
        checkEnabled($('#' + response.id));
      } else {
        $('#raid-' + response.id).hide();
      }
  });
}