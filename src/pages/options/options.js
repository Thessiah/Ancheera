var createRaid = function(name, type, url, isHL) {
    return {
      name: name,
      type: type,
      url: url,
      isHL: isHL
    };
  }

var raidInfo = {
  '300031' : createRaid('Tiamat (N)', 'tiamat', '2030000000.jpg', false),
  '300041' : createRaid('Tiamat (H)', 'tiamat', '2030000000_hard.jpg', false),
  '300051' : createRaid('Tiamat (EX)', 'tiamat', '2040020000_ex.jpg', false),
  '300441' : createRaid('Tiamat (HL)', 'tiamat', '2040020000_high.jpg', true),

  '300081' : createRaid('Colossus (N)', 'colossus', '2030001000.jpg', false),
  '300091' : createRaid('Colossus (H)', 'colossus', '2030001000_hard.jpg', false),
  '300101' : createRaid('Colossus (EX)', 'colossus', '2040034000_ex.jpg', false),
  '300491' : createRaid('Colossus (HL)', 'colossus', '2040034000_high.jpg', true),

  '300141' : createRaid('Leviathan (N)', 'leviathan', '2030011000.jpg', false),
  '300151' : createRaid('Leviathan (H)', 'leviathan', '2030011000_hard.jpg', false),
  '300161' : createRaid('Leviathan (EX)', 'leviathan', '2040028000_ex.jpg', false),
  '300511' : createRaid('Leviathan (HL)', 'leviathan', '2040028000_high.jpg', true),

  '300181' : createRaid('Yggdrasil (N)', 'yggdrasil', '2030015000.jpg', false),
  '300191' : createRaid('Yggdrasil (H)', 'yggdrasil',  '2030015000_hard.jpg', false),
  '300261' : createRaid('Yggdrasil (EX)', 'yggdrasil',  '2040027000_ex.jpg', false),
  '300531' : createRaid('Yggdrasil (HL)', 'yggdrasil',  '2040027000_high.jpg', true),
  
  '300211' : createRaid('Luminiera (N)', 'luminiera', '2030035000.jpg', false),
  '300221' : createRaid('Luminiera (H)', 'luminiera', '2030035000_hard.jpg', false),
  '300271' : createRaid('Luminiera (EX)', 'luminiera', '2040047000_ex.jpg', false),
  '300561' : createRaid('Luminiera (HL)', 'luminiera', '2040047000_high.jpg', true),
  
  '300241' : createRaid('Celeste (N)', 'celeste', '2030041000.jpg', false),
  '300251' : createRaid('Celeste (H)', 'celeste', '2030041000_hard.jpg', false),
  '300281' : createRaid('Celeste (EX)', 'celeste', '2040046000_ex.jpg', false),
  '300581' : createRaid('Celeste (HL)', 'celeste', '2040046000_high.jpg', true)
};

var options = [
    'enableNotifications',
    'muteNotifications',
    'apNotifications',
    'epNotifications',
    'dailyResetNotifications',
    'strikeTimeNotifications',
    'angelHaloNotifications',
    'defenseOrderNotifications',
    'isMagFest',
    '300031',
    '300041',
    '300051',
    '300441',

    '300081',
    '300091',
    '300101',
    '300491',

    '300141',
    '300151',
    '300161',
    '300511',

    '300181',
    '300191',
    '300261',
    '300531',
    
    '300211',
    '300221',
    '300271',
    '300561',
    
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
    var newRaid = $raid.clone();
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
      $('#' + response.id).prop('checked', response.value);
      checkEnabled($('#' + response.id));
  });
}