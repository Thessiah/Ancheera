(function() {
  var supplies = {
    all: {},
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

  var updatedSupplies = [];
  var sortedSupplies = [];
  var filter = 'all';
  var search = '';

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
      var categories = ['supplyrecovery', 'supplypowerUp', 'supplytreasure', 'supplyraid', 'supplymaterial', 'supplyevent', 'supplycoop'];
      Storage.GetMultiple(categories, function(response) {
        var category;
        for(var i = 0; i < categories.length; i++) {
          category = categories[i].replace('supply', '');
          if(response[categories[i]] !== undefined) {
            for(var key in response[categories[i]]) {
              if(response[categories[i]].hasOwnProperty(key)) {
                newSupply(key, category, response[categories[i]][key].count, response[categories[i]][key].name, response[categories[i]][key].sequence);
              }
            }
          }
        }
        Quest.Initialize();
      });
    },
    Get: function(id, response) {
      var category = supplies.all[id];
      if(category !== undefined) { 
        if(response !== undefined) {
          supplies[category][id].responseList.push(response);
        }
        return supplies[category][id].count;
      }
      return 0;
    },
    Set: function(id, amount) {
      var category = supplies.all[id];
      if(category !== undefined) {
        updateSupply(id, category, amount); 
      }
    },
    Increment: function(id, amount) {
      var category = supplies.all[id];
      if(category !== undefined) {
        updateSupply(id, category, supplies[category][id].count + amount); 
      }
    },
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
            updated = newSupply(id, 'recovery', json[i].number, json[i].name, id);
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
      var category;
      var list = json.rewards.reward_list;
      for(var property in list) {
        if(list.hasOwnProperty(property)) {
          Message.ConsoleLog('supplies.js', 'property: ' + property);
          for(var i = 0; i < list[property].length; i++) {
            item = list[property][i];
            Message.ConsoleLog('supplies.js', JSON.stringify(item));
            category = supplies.all[item.id];
            if(category !== undefined) {
              if(incrementSupply(item.id, category, 1)) {
                if(updated.indexOf(category) === -1) {
                  updated.push(category);
                }
              }
            }
          }
        }
      }
      list = json.rewards.article_list;
      for(var property in list) {
        if(list.hasOwnProperty(property)) {
          item = list[property];
          category = supplies.all[item.id];
          if(incrementSupply(item.id, category, item.count)) {
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
    GetGifts: function(json) {
      var item;
      var category;
      var updated = [];
      for(var i = 0; i < json.presents.length; i++) {
        item = json.presents[i];
        category = supplies.all[item.item_id];
        if(category !== undefined && incrementSupply(item.item_id, category, item.number)) {
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
        var category = supplies.all[id];
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
            category = supplies.all[id];
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
    }
  }

  var saveSupply = function(category) {
    Storage.Set('supply' + category, supplies[category]);
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
      Message.ConsoleLog('supplies.js', 'updating: ' + supply.name + ': '+supply.count + ' ' + intNum + ' ' + $supplyList.children('#supply-' + supply.sequence).length);
      $supplyList.children('#supply-' + supply.sequence).children('.item-count').first().text(intNum);
      updatedSupplies.push(id);
      for(var i = 0; i < supply.responseList.length; i++) {
        supply.responseList[i]();
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
      responseList: []
    };
    supplies.all[id] = category;
    updatedSupplies.push(id);
    var newItem = $supplyItem.clone();
    newItem.attr('id', 'supply-' + sequence);
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
        if (sortedSupplies[mid] < parseInt(sequence)) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      //Message.ConsoleLog('supplies.js', 'low: ' + low + ' low value: ' + sortedSupplies[low]);
      if(low < sortedSupplies.length) {
        $supplyList.children('#supply-' + sortedSupplies[low]).before(newItem);
        sortedSupplies.splice(low, 0, parseInt(sequence));
      } else {
        $supplyList.append(newItem);
        sortedSupplies.push(parseInt(sequence));
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