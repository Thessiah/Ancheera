(function() {
  var supplies = {
    treasureHash: {},
    recovery: {},
    powerUp: {},
    treasure: {},
    raid: {},
    material: {},
    event: {},
    coop: {},
    misc: {},
    draw: {},
    other: {}
  }
  var responseList = {
  }

  var updatedSupplies = [];
  var sortedSupplies = [];
  var filter = 'all';
  var search = '';
  var nextUncap = null;
  var nextNpcUncap = null;
  var nextRaid = {
    id: null,
    items: {},
    next: {}
  }

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


  $searchSupplies.on('input paste', function(){
    if($(this).val() !== '') {
      $currCategory.removeClass('active');
      $firstCategory.addClass('active');
      filter = 'all';
    }
    searchSupplies($(this).val());
  });

  window.Supplies = {
    Initialize: function() {
      var categories = ['supplyrecovery', 'supplypowerUp', 'supplytreasure', 'supplyraid', 'supplymaterial', 'supplyevent', 'supplycoop', 'supplymisc', 'supplydraw'];
      Storage.GetMultiple(categories, function(response) {
        var category;
        for(var i = 0; i < categories.length; i++) {
          category = categories[i].replace('supply', '');
          if(response[categories[i]] !== undefined) {
            var hash = response[categories[i]].supplies
            for(var key in hash) {
              if(hash.hasOwnProperty(key)) {
                newSupply(key, category, hash[key].count, hash[key].name, hash[key].sequence);
              }
            }
          }
        }
        Quest.Initialize();
        Profile.Initialize(); 
      });
    },
    Get: function(id, category, response) {
      if(response !== undefined) {
        if(responseList[category] === undefined) {
          responseList[category] = {};
        }
        if(responseList[category][id] === undefined) {
          responseList[category][id] = [];
        }
        responseList[category][id].push(response);
      }
      
      if(supplies[category][id] !== undefined) { 

        // if(response !== undefined) {
        //   supplies[category][id].responseList.push(response);
        // }
        return supplies[category][id].count;
      }
      return 0;
    },
    // Set: function(id, amount) {
    //   var category = supplies.all[id];
    //   if(category !== undefined) {
    //     updateSupply(id, category, amount); 
    //   }
    // },
    // Increment: function(id, amount) {
    //   var category = supplies.all[id];
    //   if(category !== undefined) {
    //     updateSupply(id, category, supplies[category][id].count + amount); 
    //   }
    // },
    SetRecovery: function(json) {
      if(json !== undefined) {
        var updated = false;
        var id;
        for(var i = 0; i < json.length; i++) {
          id = json[i].item_id;
          if(supplies.recovery[id] !== undefined) {
            if(updateSupply(id, 'recovery', json[i].number)){
              updated = true;
            }
          } else {
            Message.ConsoleLog('supplies.js', 'working?');
            updated = newSupply(id, 'recovery', json[i].number, json[i].name, id);
            Message.ConsoleLog('supplies.js', 'okay..');
          }
        }
        if(updated) {
          saveSupply('recovery');
        }
      }
    },
    SetPowerUp: function(json) {
      if(json !== undefined) {
        var updated = false;
        var id;
        for(var i = 0; i < json.items.length; i++) {
          if(json.items[i].number !== "0") {
            id = json.items[i].item_id;
            if(supplies.powerUp[id] !== undefined) {
              if(updateSupply(id, 'powerUp', json.items[i].number)){
                updated = true;
              }
            } else {
              updated = newSupply(id, 'powerUp', json.items[i].number, json.items[i].name, '' + (100000 + parseInt(id)));
            }
          }
        }
        if(updated) {
          saveSupply('powerUp');
        }
      }
    },
    SetTreasure: function(json) {
      if(json !== undefined) {
        var categories = ['treasure', 'raid', 'material', 'event', 'coop', 'misc'];
        var updated = {
          'treasure': false,
          'raid': false,
          'material': false,
          'event': false,
          'coop': false,
          'misc': false
        }
        var id;
        var category;

        for(var i = 0; i < json.length; i++) {
          id = json[i].item_id;
          if(json[i].seq_id < 10001) {
            category = 'treasure';
          } else if(json[i].seq_id < 20001) {
            category = 'raid';
          } else if(json[i].seq_id < 30001) {
            category = 'material';
          } else if(json[i].seq_id < 50001) {
            category = 'event';
          } else if(json[i].seq_id < 60001) {
            category = 'coop';
          } else {
            category = 'misc';
          }
          if(supplies[category][id] !== undefined) {
            if(updateSupply(id, category, json[i].number)){
              updated[category] = true;
            }
          } else {
            updated[category] = newSupply(id, category, json[i].number, json[i].name, json[i].seq_id);
          }
        }
        for(var i = 0; i < categories.length; i++) {
          if(updated[categories[i]]) {
            saveSupply(categories[i]);
          }
        }
      }
    },
    SetDraw: function(json) {
      if(json !== undefined) {
        var updated = false;
        var id;
        for(var i = 0; i < json.length; i++) {
          if(json[i].number !== "0") {
            id = json[i].item_id;
            if(supplies.draw[id] !== undefined) {
              if(updateSupply(id, 'draw', json[i].number)){
                updated = true;
              }
            } else {
              updated = newSupply(id, 'draw', json[i].number, json[i].name, '' + (200000 + parseInt(id)));
            }
          }
        }
        if(updated) {
          saveSupply('draw');
        }
      }
    },
    SetOther: function(json) {
      Message.ConsoleLog('supplies.js', JSON.stringify(supplies));
      Message.ConsoleLog('supplies.js', sortedSupplies);
    },
    GetLoot: function(json) {
      var item;
      var updated =[];
      var list = json.rewards.reward_list;
      for(var property in list) {
        if(list.hasOwnProperty(property)) {
          for(var i = 0; i < list[property].length; i++) {
            item = list[property][i];
            //Message.ConsoleLog('supplies.js', JSON.stringify(item));
            category = getCategory(item.id, item.item_kind);
            if(category !== undefined && incrementSupply(item.id, category, 1)) {
              if(updated.indexOf(category) === -1) {
                updated.push(category);
              }
            }
          }
        }
      }
      list = json.rewards.article_list;
      for(var property in list) {
        if(list.hasOwnProperty(property)) {
          item = list[property];
          category = getCategory(item.id, '' + item.kind);
          if(category !== undefined && incrementSupply(item.id, category, item.count)) {
            if(updated.indexOf(category) === -1) {
              updated.push(category);
            }
          }
        }
      }
      for(var i = 0; i < updated.length; i++) {
        saveSupply(updated[i]);
      }
    },
    GetGift: function(json) {
      Message.ConsoleLog('supplies.js', 'gift1');
      var id = json.item_id;
      Message.ConsoleLog('supplies.js', id);
      var category = getCategory(id, json.item_kind_id);
      Message.ConsoleLog('supplies.js', category);
      if(category !== undefined && incrementSupply(id, category, parseInt(json.number))) {
        Message.ConsoleLog('supplies.js', parseInt(json.number));
        saveSupply(category);
      }
    },
    GetAllGifts: function(json) {
      Message.ConsoleLog('good');
      var item;
      var category;
      var updated = [];
      for(var i = 0; i < json.presents.length; i++) {
        item = json.presents[i];
        category = getCategory(item.item_id, item.item_kind_id);
        if(category !== undefined && incrementSupply(item.item_id, category, parseInt(item.number))) {
          if(updated.indexOf(category) === -1) {
            updated.push(category);
          }
        }
      }
      for(var i = 0; i < updated.length; i++) {
        saveSupply(updated[i]);
      }
    },
    PurchaseItem: function(json) {
      if(json.article.item_ids.length > 0 && json.article.is_get.result) {
        var updated = [];
        var id = json.article.item_ids[0];
        var category = getCategory(id, json.article.item_kind[0]);
        if(category !== undefined && updateSupply(id, category, parseInt(json.article.is_get.item_cnt) + parseInt(json.purchase_number))) {
          if(updated.indexOf(category) === -1) {
            updated.push(category);
          }
        }      
        var article;
        var articleNumber;
        for(var i = 0; i < 4; i++) {
          article = json.article['article' + ('' + i)];
          articleNumber = json.article['article' + ('' + i) + '_number'];
          if(article !== '' && articleNumber !== '' && article !== undefined && article.master !== undefined) {
            id = article.master.id;
            category = getCategory(id, '10');
            if(category !== undefined && updateSupply(id, category, parseInt(article.has_number) - parseInt(articleNumber) * parseInt(json.purchase_number))) {
              if(updated.indexOf(category) === -1) {
                updated.push(category);
              }
            }
          }
        }
        for(var i = 0; i < updated.length; i++) {
          saveSupply(updated[i]);
        }
      }   
    },
    UseRecovery: function(json, url) {
      if(json.success && json.result.use_flag) {
        var id = url.substring(url.indexOf('item/') + 5, url.indexOf('.json'));
        Message.ConsoleLog('supplies.js', id);
        incrementSupply(id, 'recovery', -parseInt(json.result.recovery));
      }
    },
    SellCoop: function(array) {
      for(var i = 0; i < array.length; i++) {
        Message.ConsoleLog(i, array[i]);
      }
      
      var id = '' + array[5];
      var amt;
      if(array[8] !== '') {
         amt = parseInt(array[8]);
      } else if(array[9] !== '') {
        amt = parseInt(array[9]);
      } else {
        amt = 0;
      }
      incrementSupply(id, 'coop', - amt)
      saveSupply('coop');
      var lupi;
      switch(array[5]) {
        //bronze
        case '20001':
          lupi = 50;
          break;
        //silver
        case '20002':
          lupi = 300;
          break;
        //gold
        case '20003':
          lupi = 1000;
          break;
        case '20111':
        case '20121':
        case '20131':
        case '20141':
          lupi = 5000;
          break;
      }
      Profile.AddLupi(lupi * amt);
    },

    RaidTreasureInfo: function(json) {
      var updated = [];
      var id;
      var category;
      nextRaid.items = {};
      nextRaid.id = json.chapter_id;
      for(var i = 0; i < json.treasure_id.length; i++) {
        id = json.treasure_id[i];
        category = getCategory(id, '10');
        nextRaid.items[id] = json.consume[i];
        if(category !== undefined && updateSupply(id, category, json.num[i])) {
          if(updated.indexOf(category) === -1) {
            updated.push(category);
          }
        }
      }
      for(var i = 0; i < updated.length; i++) {
        saveSupply(updated[i]);
      }
    },
    RaidTreasureCheck: function(json, url) {
      if(json.result) {
        var id = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'));
        Message.ConsoleLog('supplies.js', id);
        if(nextRaid.items[id] !== undefined) {
          nextRaid.next = {
            'id': id,
            'count': parseInt(nextRaid.items[id])
          }
          Message.ConsoleLog('supplies.js', JSON.stringify(nextRaid.next));
        } else {
          nextRaid.next = undefined;
        }
      }
    },
    InitializeRaid: function(json, url) {
      if(url.substring(url.indexOf('data/') + 5, url.lastIndexOf('/')) !== nextRaid.id) {
        nextRaid.next = undefined;
      }
    },
    EnterRaid: function(json) {
      if(nextRaid.next !== undefined) {
        var category = getCategory(nextRaid.next.id, '10');
        if(incrementSupply(nextRaid.next.id, category, -nextRaid.next.count)) {
          saveSupply(category);
        }
      }
    },
    BuyCasino: function(json, array) {
      for(var i = 0; i < array.length; i++) {
        Message.ConsoleLog(i, array[i]);
      }
      var id = json.article.item_ids[0];
      var category = getCategory(id, json.article.item_kind[0]);
      var fuckyou;
      if(array[8] !== '') {
        fuckyou = 8;
      } else if(array[9] !== '') {
        fuckyou = 9;
      }
      if(incrementSupply(id, category, parseInt(array[fuckyou]))) {
        saveSupply();
      }
    },
    CheckUncapItem: function(json) {
      var updated = false;
      var item;
      for(var i = 0; i < json.items.length; i++) {
        item = json.items[i];
        if(updateSupply(item.item_id, 'powerUp', item.number)) {
          updated = true;
        }
      }
      if(updated) {
        saveSupply('powerUp');
      }
    },
    SetUncapItem: function(json) {
      nextUncap = json.item_id;

    },
    SetUncap: function(json) {
      nextUncap = null;
    },
    Uncap: function(json) {
      if(nextUncap !== null && nextUncap !== undefined) {
        incrementSupply(nextUncap, 'powerUp', -1);
      }
    },
    SetNpcUncap: function(json) {
      nextNpcUncap = [];
      var updated = [];
      var item;
      var category;
      for(var i = 0; i < json.requirements.length; i++) {
        item = json.requirements[i];
        nextNpcUncap.push({
          id: item.item_id,
          item_kind: item.item_kind.id,
          cost: item.item_number,
        });
        category = getCategory(item.item_id, item.item_kind.id);
        if(category !== undefined && updateSupply(item.item_id, category, parseInt(item.item_possessed))) {
          if(updated.indexOf(category) === -1) {
            updated.push(category);
          }
        }
      }
      for(var i = 0; i < updated.length; i++) {
        saveSupply(updated[i]);
      }
    },
    NpcUncap: function(json) {
      var updated = [];
      var category;
      for(var i = 0; i < nextNpcUncap.length; i++) {
        category = getCategory(nextNpcUncap[i].id, nextNpcUncap[i].item_kind);
        incrementSupply(nextNpcUncap[i].id, category, -nextNpcUncap[i].cost);
        if(updated.indexOf(category) === -1) {
          updated.push(category);
        }
      }
      for(var i = 0; i < updated.length; i++) {
        saveSupply(updated[i]);
      }
    } 
  }

  var getCategory = function(id, item_kind) {
    if(item_kind === '4') {
      return 'recovery';
    } else if(item_kind === '8') {
      return 'draw';
    } else if(item_kind === '17') {
      return 'powerUp';
    } else if(item_kind === '10') {
      return supplies.treasureHash[id];
    } else {
      return undefined;
    }
  }

  var saveSupply = function(category) {
    Storage.Set('supply' + category, {'supplies': supplies[category]});
  }

  var saveUpdateSupply = function(id, category, number) {
    if(updateSupply(id, category, number)) {
      saveSupply(category);
    }
  }

  var updateSupply = function(id, category, number) {
    var ret = false;
    var supply = supplies[category][id];
    var intNum = parseInt(number);
    if(intNum < 0) {
      intNum = 0;
    }
    
    if(supply !== undefined && supply.count !== intNum) {
      supply.count = intNum;
      Message.ConsoleLog('supplies.js', 'updating: ' + supply.name + ': '+supply.count + ' ' + intNum);
      $supplyList.children('#supply-' + supply.sequence + '-' + id).children('.item-count').first().text(intNum);
      updatedSupplies.push(id);
      // for(var i = 0; i < supply.responseList.length; i++) {
      //   supply.responseList[i](id, intNum);
      // }
      if(responseList[category] !== undefined && responseList[category][id] !== undefined) {
        for(var i = 0; i < responseList[category][id].length; i++) {
          responseList[category][id][i](id, intNum);
        }
      }
      ret = true;
    }
    return ret;
  }

  var incrementSupply = function(id, category, number) {
    return updateSupply(id, category, supplies[category][id].count + parseInt(number));
  }

  var newSupply = function(id, category, number, name, sequence) {
    supplies[category][id] = {
      name: name,
      count: parseInt(number),
      sequence: sequence,
      //responseList: []
    };
    if(category !== 'recovery' && category !== 'powerUp' && category !== 'draw') {
      supplies.treasureHash[id] = category;
    }
    //supplies.all[id] = category;
    updatedSupplies.push(id);
    var newItem = $supplyItem.clone();
    newItem.attr('id', 'supply-' + sequence + '-' + id);
    if(category === 'recovery' || category === 'draw' || category === 'powerUp') {
      newItem.data('category', 'misc');
    } else {
      newItem.data('category', category);
    }
    if((filter !== 'all' && filter !== category) || name.toLowerCase().indexOf(search) === -1) {
      newItem.hide();
    }
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
    imgURL += id + '.jpg';
    newItem.children('.item-img').first().attr('src', imgURL);
    newItem.children('.item-count').first().text(number);
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
      if(responseList[category] !== undefined && responseList[category][id] !== undefined) {
        for(var i = 0; i < responseList[category][id].length; i++) {
          responseList[category][id][i](id, parseInt(number));
        }
      }
    return true;
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

  // var setSupplies = function() {
  //   var id;
  //   var element;
  //   while(updatedSupplies.length >= 0) {
  //     id = updatedSupplies.shift();
  //     element = $supplyList.children('#supply-' + id);
  //     if(element.length > 0) {
  //       //element.first().children('.item-count').first().text(supplies.all[id].count);
  //     } else {

  //     }
  //   }
  // }
})();