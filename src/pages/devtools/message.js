(function() {
  var initialized = false;
  var url = "";
  var jQueryCache = {};
  var isJST = true;
  var times = {};
  var timeZone = '';
  var filter = 'all';
  var search = '';
  var sortedSupplies = [];
  var imageURL = "../../assets/images/";

  var $supplyList = $('#supply-list');
  var $supplyItem = $supplyList.find('.supply-item').first().clone();
  $supplyList.find('.supply-item').first().remove();
  $searchSupplies = $("#search-supplies");
  $supplyCategories = $('#supply-categories');
  $firstCategory = $supplyCategories.children('.active');
  $currCategory = $firstCategory;
  $('#supply-categories > li > a').click(function() {
    if($(this).data('category') !== 'all') {
      search = '';
      $searchSupplies.val('');
    }
    filterSupplies($(this).data('category'));
    $currCategory = $(this).parent('li');
  });

  var $raidsPanel = $('#raids-panel');
  var $dailyRaidList = $('#daily-raid-list');
  var $completedRaidList = $('#completed-raid-list');
  var $dailyRaid = $dailyRaidList.find('.daily-quest-panel').first().clone();
  $dailyRaidList.find('.daily-quest-panel').first().remove();

  var $questCharactersPanel = $('#quest-characters-panel');
  var $questCharacter = $('#quest-character').clone();
  $('#quest-character').remove();
  
  var $questEnemiesPanel = $('#quest-enemies-panel');
  var $questEnemy = $('#quest-enemy').clone();
  $('#quest-enemy').remove();

  var $buffsPanel = $('#quest-buffs-panel');
  var $questBuff = $('#quest-buff').clone();
  $('#quest-buff').remove();
  

  $searchSupplies.on('input paste', function(){
    if($(this).val() !== '') {
      $currCategory.removeClass('active');
      $firstCategory.addClass('active');
      filter = 'all';
    }
    searchSupplies($(this).val());
  });



  $('#contents').find('.open-url').each(function() {
    $(this).click(function() {
      if($(this).data('url') !== undefined && $(this).data('url') !== '') {
        Message.Post({'openURL': url + $(this).data('url')});
      }
    });
  });

  $('#time-zone').click(function() {
    isJST = !isJST;
    Message.Post({'debug': true});
    if(isJST) {
      $(this).text('JST');
    } else {
      $(this).text(timeZone);
    }
    toggleTimes();
  });
  
  var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
  });
  backgroundPageConnection.postMessage({
    connect: chrome.devtools.inspectedWindow.tabId
  });
  
  backgroundPageConnection.onMessage.addListener(function(message, sender) {
    if(message.pageLoad) {
      if(!initialized && message.pageLoad.indexOf('#mypage') !== -1) {
        initialized = true;
        url = message.pageLoad.substring(0, message.pageLoad.indexOf('#mypage'));
        Message.Post({initialize: true});
      }
    }
    if(message.initialize) {
      for(var i = 0; i < message.initialize.length; i++) {
        var msg = message.initialize[i];
        if(msg != undefined) {
          
          if(msg.setText) {
            setText(msg.setText.id, msg.setText.value);
          } else if(msg.setImage) {
            setImage(msg.setImage.id, msg.setImage.value);
          } else if(msg.setBar) {
            setBar(msg.setBar.id, msg.setBar.value);
          } else if(msg.setColor) {
            setColor(msg.setColor.id, msg.setColor.value);
          } else if(msg.setTime) {
            setTime(msg.setTime.id, msg.setTime.jst, msg.setTime.normal);
          } else if(msg.addItem) {
            addItem(msg.addItem.id, msg.addItem.category, msg.addItem.number, msg.addItem.name, msg.addItem.sequence); 
          } else if(msg.hideObject) {
            hideObject(msg.hideObject.id, msg.hideObject.value);
          } else if(msg.addQuest) {
            addQuest(msg.addQuest.id, msg.addQuest.url, msg.addQuest.name, msg.addQuest.amount, msg.addQuest.max, msg.addQuest.animeID, msg.addQuest.animeAmount);
          } else if(msg.collapsePanel) {
            collapsePanel(msg.collapsePanel.id, msg.collapsePanel.value);
          } else if(msg.appendObject) {
            appendObject(msg.appendObject.id, msg.appendObject.target);
          } else if(msg.beforeObject) {
            beforeObject(msg.beforeObject.id, msg.beforeObject.target);
          } else if(msg.addQuestCharacter) {
            addQuestCharacter(msg.addQuestCharacter.index);
          } else if(msg.addQuestEnemy) {
            addQuestEnemy(msg.addQuestEnemy.index);
          } else if(msg.setOpacity) {
            setOpacity(msg.setOpacity.id, msg.setOpacity.value);
          } else if(msg.setClick) {
            setClick(msg.setClick.id, msg.setClick.value);
          }
        }
      }
      $('#wait').hide();
      $('#contents').show();
    }
    if(message.setText) {
      setText(message.setText.id, message.setText.value);
      return;
    }
    if(message.setImage) {
      setImage(message.setImage.id, message.setImage.value);
      return;
    }
    if(message.setBar) {
      setBar(message.setBar.id, message.setBar.value);
      return;
    }
    if(message.setColor) {
      setColor(message.setColor.id, message.setColor.value);
      return;
    }
    if(message.setTime) {
      setTime(message.setTime.id, message.setTime.jst, message.setTime.normal);
      return;
    }
    if(message.setTimeZone) {
      timeZone = message.setTimeZone;
      return;
    }
    if(message.addItem) {
      addItem(message.addItem.id, message.addItem.category, message.addItem.number, message.addItem.name, message.addItem.sequence);
      return;
    }
    if(message.hideObject) {
      hideObject(message.hideObject.id, message.hideObject.value);
      return;
    }
    if(message.addQuest) {
      addQuest(message.addQuest.id, message.addQuest.url, message.addQuest.name, message.addQuest.amount, message.addQuest.max, message.addQuest.animeID, message.addQuest.animeAmount);
      return;
    }
    if(message.collapsePanel) {
      collapsePanel(message.collapsePanel.id, message.collapsePanel.value);
    }
    if(message.appendObject) {
      appendObject(message.appendObject.id, message.appendObject.target);
    }
    if(message.beforeObject) {
      beforeObject(message.beforeObject.id, message.beforeObject.target);
    }
    if(message.setOpacity) {
      setOpacity(message.setOpacity.id, message.setOpacity.value);
    }
    if(message.setClick) {
      setClick(message.setClick.id, message.setClick.value);
    }
    if(message.openURL) {
      Message.Post({'openURL': url + message.openURL});
    }
  });
  
  var setText = function(id, value) {
    if(jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].text(value);
  }
  var setImage = function(id, value) {
    if(jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].attr('src', value);
  }
  var setOpacity = function(id, value) {
    if(jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].fadeTo('fast', value);
  }
  var hideObject = function(id, value) {
    if(jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    if(value) {
      jQueryCache[id].hide();
    } else {
      jQueryCache[id].show();
    }   
  }
  var setBar = function(id, value) {
    if(id !== '#bp-bar') {
      if(jQueryCache[id] === undefined) {
        jQueryCache[id] = $(id);
      }
      jQueryCache[id].css('width', value);
    } else {
      if(jQueryCache[id] === undefined) {
        jQueryCache[id] = $(id).find('.active-circle-icon');
      }
      jQueryCache[id].each(function(index) {
        if(index >= value) {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
    }
  }
  var setColor = function(id, value) {
    if(jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].css('background-color', value);
  }
  var setTime = function(id, jstTime, normalTime) {
    if(jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    times[id] = {
      'jst': jstTime,
      'normal': normalTime
    }
    if(isJST) {
      jQueryCache[id].text(jstTime);
    } else {
      jQueryCache[id].text(normalTime);
    }
  }
  var collapsePanel = function(id, value) {
    if(jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    //alert(value + ' ' + jQueryCache[id].hasClass('collapse in'));
    if(value && jQueryCache[id].hasClass('collapse in')) {
      jQueryCache[id].collapse('hide');
    } else if(!value && !jQueryCache[id].hasClass('collapse in')) {
      jQueryCache[id].collapse('show');
    }
  }
  var appendObject = function(id, targetID) {
    if(jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    if(jQueryCache[targetID] === undefined) {
      jQueryCache[targetID] = $(targetID);
    }
    //alert(id + ' ' + targetID);
    jQueryCache[targetID].append(jQueryCache[id]);
  }
  var setClick = function(id, value) {
    if(jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    jQueryCache[id].data('url', value);
    if(value !== '') {
      jQueryCache[id].addClass('open-url');
    } else {
      jQueryCache[id].removeClass('open-url');
    }
  }
  var beforeObject = function(id, targetID) {
    if(jQueryCache[id] === undefined) {
      jQueryCache[id] = $(id);
    }
    if(jQueryCache[targetID] === undefined) {
      jQueryCache[targetID] = $(targetID);
    }
    jQueryCache[targetID].before(jQueryCache[id]);
  }
  var addItem = function(id, category, number, name, sequence) {
    var newItem = $supplyItem.clone();
    newItem.attr('id', 'supply-' + sequence + '-' + id);
    if(category === 'recovery' || category === 'draw' || category === 'powerUp') {
      newItem.data('category', 'misc');
    } else {
      newItem.data('category', category);
    }
        //alert(1);
    if((filter !== 'all' && filter !== category) || name.toLowerCase().indexOf(search) === -1) {
      newItem.hide();
    }
        console.log('hi');
    newItem.data('name', name.toLowerCase());
    var imgURL;
    if(category === 'recovery') {
      imgURL = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/assets/item/normal/s/';
    } else if(category === 'powerUp') {
      imgURL = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/assets/item/evolution/s/';
    } else if(category === 'draw') {
      imgURL = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/assets/item/ticket/';
    } else {
      imgURL = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/assets/item/article/s/';
    }
        //alert(2);
    imgURL += id + '.jpg';
    newItem.children('.item-img').first().attr('src', imgURL);
    newItem.children('.item-count').first().text(number);
    newItem.children('.item-count').first().attr('id', 'supply-' + sequence + '-' + id + '-count');
        //alert(3);
    //if(sortedSupplies.length > 0) {
    var low = 0
    var high = sortedSupplies.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (sortedSupplies[mid].sequence < parseInt(sequence)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
        //alert(4);
    //Message.ConsoleLog('supplies.js', 'low: ' + low + ' low value: ' + sortedSupplies[low]);
    if(low < sortedSupplies.length) {
      $supplyList.children('#supply-' + sortedSupplies[low].sequence + '-' + sortedSupplies[low].id).before(newItem);
      sortedSupplies.splice(low, 0, {
        'sequence': parseInt(sequence),
        'id': parseInt(id)
      });
    } else {
      $supplyList.append(newItem);
      sortedSupplies.push({
        'sequence': parseInt(sequence),
        'id': parseInt(id)
      });
    }
  }
  var addQuest = function(id, imgUrl, name, amount, max, animeID, animeAmount) {
    var newRaid = $dailyRaid.clone();
    newRaid.data('id', id);
    newRaid.attr('id', 'daily-raid-' + id);

    newRaid.children('.quest-img').first().attr('src', imgUrl);
    newRaid.children('.quest-name').first().text(name);
    //newRaid.children('.quest-count').first().text(raid.max + '/' + raid.max);
    newRaid.children('.quest-count').first().attr('id', 'remaining-' + id);
    newRaid.children('.quest-count').first().data('id', id);
    newRaid.children('.quest-count').first().text(amount + '/' + max);
    if(animeID !== null) {
      newRaid.find('.item-img').first().attr('src', imageURL + 'items/' + animeID + '.jpg');
      newRaid.find('.item-count').first().text(animeAmount);
      newRaid.find('.item-count').first().attr('id', 'count-' + animeID);
      newRaid.click(function() {
        Message.Post({'openURL': url + '#quest/supporter/' + id + '/1/0/' + animeID});
      });
    } else {
      newRaid.children('.quest-item').first().remove();
      newRaid.click(function() {
        Message.Post({'openURL': url + '#quest/supporter/' + id + '/1'});
      });
    }
    $dailyRaidList.append(newRaid);
  }

  var addQuestCharacter = function(index) {
    var newCharacter = $questCharacter.clone();
    newCharacter.attr('id', 'quest-character-' + index);
    newCharacter.find('.quest-character-image').attr('id', 'quest-character-image-' + index);
    newCharacter.find('.quest-skill').each(function(i) {
      $(this).attr('id', 'quest-skill-' + index + '-' + i);
      $(this).find('.quest-skill-image').attr('id', 'quest-skill-image-' + index + '-' + i);
      $(this).find('.quest-skill-text').attr('id', 'quest-skill-text-' + index + '-' + i);
    });
    newCharacter.find('.quest-character-buffs').attr('id', 'quest-character-buffs-' + index);
    $questCharactersPanel.append(newCharacter);
  }

  var addQuestEnemy = function(index) {
    var newEnemy = $questEnemy.clone();
    newEnemy.attr('id', 'quest-enemy-' + index);
    newEnemy.find('.quest-enemy-image').attr('id', 'quest-enemy-image-' + index);
    newEnemy.find('.quest-enemy-buffs').attr('id', 'quest-enemy-buffs-' + index);
    $questEnemiesPanel.append(newEnemy);
  }

  var filterSupplies = function(category) {
    filter = category;
    $supplyList.children().each(function(index) {
      if(category === $(this).data('category') || category === 'all') {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
  var searchSupplies = function(query) {
    search = query.toLowerCase();
    $supplyList.children().each(function(index) {
      if($(this).data('name').indexOf(search) !== -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
  var toggleTimes = function() {
    Object.keys(times).forEach(function(key) {
      if(isJST) {
        jQueryCache[key].text(times[key].jst);
      } else {
        jQueryCache[key].text(times[key].normal);
      }
    });
  }
  window.Message = {
    Post: function(message) {
      message.id = chrome.devtools.inspectedWindow.tabId;
      backgroundPageConnection.postMessage(message);
    }
  }
  
})();