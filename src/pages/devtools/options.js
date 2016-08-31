(function() {
  var options = {
    enableNotifications: true,
    muteNotifications: false,
    isMagFest: false,
    enabledRaids: {
      '300031' : true,
      '300041' : true,
      '300051' : true,
      '300441' : false,

      '300081' : true,
      '300091' : true,
      '300101' : true,
      '300491' : false,

      '300141' : true,
      '300151' : true,
      '300161' : true,
      '300511' : false,

      '300181' : true,
      '300191' : true,
      '300261' : true,
      '300531' : false,
      
      '300211' : true,
      '300221' : true,
      '300271' : true,
      '300561' : false,
      
      '300241' : true,
      '300251' : true,
      '300281' : true,
      '300581' : false,
    }
  }
  var responseList = {};
  var createRaid = function(name, url, isHL) {
      return {
        name: name,
        url: imageURL + 'quests/' + url,
        isHL: isHL
      };
    }

  var raidInfo = {
    '300031' : createRaid('Tiamat (N)', '2030000000.jpg', false),
    '300041' : createRaid('Tiamat (H)', '2030000000_hard.jpg', false),
    '300051' : createRaid('Tiamat (EX)', '2040020000_ex.jpg', false),
    '300441' : createRaid('Tiamat (HL)', '2040020000_high.jpg', true),

    '300081' : createRaid('Colossus (N)', '2030001000.jpg', false),
    '300091' : createRaid('Colossus (H)', '2030001000_hard.jpg', false),
    '300101' : createRaid('Colossus (EX)', '2040034000_ex.jpg', false),
    '300491' : createRaid('Colossus (HL)', '2040034000_high.jpg', true),

    '300141' : createRaid('Leviathan (N)', '2030011000.jpg', false),
    '300151' : createRaid('Leviathan (H)', '2030011000_hard.jpg', false),
    '300161' : createRaid('Leviathan (EX)', '2040028000_ex.jpg', false),
    '300511' : createRaid('Leviathan (HL)', '2040028000_high.jpg', true),

    '300181' : createRaid('Yggdrasil (N)', '2030015000.jpg', false),
    '300191' : createRaid('Yggdrasil (H)', '2030015000_hard.jpg', false),
    '300261' : createRaid('Yggdrasil (EX)', '2040027000_ex.jpg', false),
    '300531' : createRaid('Yggdrasil (HL)', '2040027000_high.jpg', true),
    
    '300211' : createRaid('Luminiera (N)', '2030035000.jpg', false),
    '300221' : createRaid('Luminiera (H)', '2030035000_hard.jpg', false),
    '300271' : createRaid('Luminiera (EX)', '2040047000_ex.jpg', false),
    '300561' : createRaid('Luminiera (HL)', '2040047000_high.jpg', true),
    
    '300241' : createRaid('Celeste (N)', '2030041000.jpg', false),
    '300251' : createRaid('Celeste (H)', '2030041000_hard.jpg', false),
    '300281' : createRaid('Celeste (EX)', '2040046000_ex.jpg', false),
    '300581' : createRaid('Celeste (HL)', '2040046000_high.jpg', true)
  };


  window.Options = {
    Get = function(category, response) {
      if(response !== undefined) {
        if(responseList[category] === undefined) {
          responseList[category] = [];
        }
        responseList[category].push(response);
      }
      if(options[category] !== undefined) {
        return options[category];
      }
    },

  }
})();