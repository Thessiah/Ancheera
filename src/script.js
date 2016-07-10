(function() {
  var gameStart = false;

  $(document).ready(function() {
    if(!gameStart) {
      gameStart = true;
      chrome.runtime.sendMessage({gameStart: true});
    }
  });

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.pageLoad) {
      // if($('.prt-assault-time').length !== 0 && $('.prt-assault-time').text() !== '0') {
      //   chrome.runtime.sendMessage({assault: true});
      // }
      if($('.prt-assault-guildinfo').length > 0) {
        $('.prt-assault-guildinfo').find('.prt-item-status').each(function(index) {
          var text = $(this).text();
          var hour = parseInt(text.split(':')[0]);
          if(text.indexOf('p.m.') !== -1 && text.indexOf('p.m') < text.length - 5) {
            if(hour !== 12) {
              hour += 12;
            }
          } else if(hour === 12) {
            hour = 0;
          }
          chrome.runtime.sendMessage({assault:{
              'slot': index,
              'hour': hour
            }
          });
        });
      }
      if($('.txt-do-remain-on-button').length !== 0) {

      }
      if($('do-underway').length !== 0) {
      }
    }
  });
})();