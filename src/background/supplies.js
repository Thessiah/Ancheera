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

  // var $supplyList = $('#supply-list');
  // var $supplyItem = $supplyList.find('.supply-item').first().clone();
  // $supplyList.find('.supply-item').first().remove();
  // $searchSupplies = $("#search-supplies");
  // $supplyCategories = $('#supply-categories');
  // $firstCategory = $supplyCategories.children('.active');
  // $currCategory = $firstCategory;

  // $('#supply-categories > li > a').click(function() {
  //   if($(this).data('category') !== 'all') {
  //     search = '';
  //     $searchSupplies.val('');
  //   }
  //   filterSupplies($(this).data('category'));
  //   $currCategory = $(this).parent('li');
  // });


  // $searchSupplies.on('input paste', function(){
  //   if($(this).val() !== '') {
  //     $currCategory.removeClass('active');
  //     $firstCategory.addClass('active');
  //     filter = 'all';
  //   }
  //   searchSupplies($(this).val());
  // });

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
    InitializeDev: function() {
      var response = [];
      var item;
      Object.keys(supplies).forEach(function(category) {
        if(category !== 'treasureHash') {
          Object.keys(supplies[category]).forEach(function(id) {
            item = supplies[category][id];
            response.push({addItem: {
              'id': id,
              'category': category,
              'number': item.count,
              'name': item.name,
              'sequence': item.sequence
            }});
          });
        }
      });
      return response;
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
        if(supplies[category][id] !== undefined) { 
          response(id, supplies[category][id].count);
        } else {
          response(id, 0);
        }
      }
      
      if(supplies[category][id] !== undefined) { 

        // if(response !== undefined) {
        //   supplies[category][id].responseList.push(response);
        // }
        return supplies[category][id].count;
      }
      return 0;
    },
    Set: function(id, item_kind, amount) {
      var category = getCategory(id, item_kind);
      if(category !== undefined) {
        updateSupply(id, category, amount); 
      }
    },
    Increment: function(id, item_kind, amount) {
      var category = getCategory(id, item_kind);
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
          var seq_id = parseInt(json[i].seq_id);
          if(seq_id < 100001) {
            category = 'treasure';
          } else if(seq_id < 200001) {
            category = 'raid';
          } else if(seq_id < 300001) {
            category = 'material';
          } else if(seq_id < 500001) {
            category = 'event';
          } else if(seq_id < 600001) {
            category = 'coop';
          } else {
            category = 'misc';
          }
          if(supplies[category][id] !== undefined) {
            if(updateSupply(id, category, json[i].number)){
              updated[category] = true;
            }
          } else {
            updated[category] = newSupply(id, category, json[i].number, json[i].name, seq_id);
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
    },
    GetLoot: function(json) {
      var item;
      var updated =[];
      var list = json.rewards.reward_list;
      console.log(list);
      for(var property in list) {
        if(list.hasOwnProperty(property)) {
          for(var i = 0; i < list[property].length; i++) {
            console.log(item);
            item = list[property][i];
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
      console.log(list);
      for(var property in list) {
        if(list.hasOwnProperty(property)) {
          item = list[property];
          console.log(item);
          category = getCategory(item.id, '' + item.kind);
          if(category !== undefined && incrementSupply(item.id, category, item.count)) {
            if(updated.indexOf(category) === -1) {
              updated.push(category);
            }
          }
        }
      }
      for(var i = 0; i < updated.length; i++) {
        console.log(updated);
        saveSupply(updated[i]);
      }
    },
    GetGift: function(json) {
      var id = json.item_id;
      var category = getCategory(id, json.item_kind_id);
      if(category !== undefined && incrementSupply(id, category, parseInt(json.number))) {
        saveSupply(category);
      }
    },
    GetAllGifts: function(json) {
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
    UseRecovery: function(json, payload) {
      if(json.success && json.result.use_flag) {
        var id = payload.item_id.toString();
        incrementSupply(id, 'recovery', -payload.num);
      }
    },
    SellCoop: function(json, payload) {
      if(json.success) {      
        var id = payload.item_id
        var amt = parseInt(payload.number);
        incrementSupply(id, 'coop', - amt)
        saveSupply('coop');
        var lupi;
        switch(id) {
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
      }
    },

    RaidTreasureInfo: function(json) {
      var updated = [];
      var id;
      var category;
      for(var i = 0; i < json.treasure_id.length; i++) {
        id = json.treasure_id[i];
        category = getCategory(id, '10');
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

    BuyCasino: function(json, payload) {
      var id = json.article.item_ids[0];
      var category = getCategory(id, json.article.item_kind[0]);
      if(incrementSupply(id, category, parseInt(payload.num))) {
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
      if(intNum > 9999) {
        intNum = 9999;
      }
      Message.PostAll({'setText': {
        'id': '#supply-' + supply.sequence + '-' + id + '-count',
        'value': intNum
      }});
      //$supplyList.children('#supply-' + supply.sequence + '-' + id).children('.item-count').first().text(intNum);
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
    if(number > 9999) {
      number = 9999;
    }
    Message.PostAll({addItem: {
      'id': id,
      'category': category,
      'number': number,
      'name': name,
      'sequence': sequence
    }});
    if(responseList[category] !== undefined && responseList[category][id] !== undefined) {
      for(var i = 0; i < responseList[category][id].length; i++) {
        responseList[category][id][i](id, number);
      }
    }
    //supplies.all[id] = category;
    // var newItem = $supplyItem.clone();
    // newItem.attr('id', 'supply-' + sequence + '-' + id);
    // if(category === 'recovery' || category === 'draw' || category === 'powerUp') {
    //   newItem.data('category', 'misc');
    // } else {
    //   newItem.data('category', category);
    // }
    // if((filter !== 'all' && filter !== category) || name.toLowerCase().indexOf(search) === -1) {
    //   newItem.hide();
    // }
    // newItem.data('name', name.toLowerCase());
    // var imgURL;
    // if(category === 'recovery') {
    //   imgURL = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/assets/item/normal/s/';
    // } else if(category === 'powerUp') {
    //   imgURL = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/assets/item/evolution/s/';
    // } else if(category === 'draw') {
    //   imgURL = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/assets/item/ticket/';
    // } else {
    //   imgURL = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/assets/item/article/s/';
    // }
    // imgURL += id + '.jpg';
    // newItem.children('.item-img').first().attr('src', imgURL);
    // newItem.children('.item-count').first().text(number);
    // //if(sortedSupplies.length > 0) {
    //   var low = 0
    //   var high = sortedSupplies.length;
    //   while (low < high) {
    //     var mid = low + high >>> 1;
    //     if (sortedSupplies[mid].sequence < parseInt(sequence)) {
    //       low = mid + 1;
    //     } else {
    //       high = mid;
    //     }
    //   }
    //   //Message.ConsoleLog('supplies.js', 'low: ' + low + ' low value: ' + sortedSupplies[low]);
    //   if(low < sortedSupplies.length) {
    //     $supplyList.children('#supply-' + sortedSupplies[low].sequence + '-' + sortedSupplies[low].id).before(newItem);
    //     sortedSupplies.splice(low, 0, {
    //       'sequence': parseInt(sequence),
    //       'id': parseInt(id)
    //     });
    //   } else {
    //     $supplyList.append(newItem);
    //     sortedSupplies.push({
    //       'sequence': parseInt(sequence),
    //       'id': parseInt(id)
    //     });
    //   }
    //   if(responseList[category] !== undefined && responseList[category][id] !== undefined) {
    //     for(var i = 0; i < responseList[category][id].length; i++) {
    //       responseList[category][id][i](id, parseInt(number));
    //     }
    //   }
    return true;
  }

  var filterSupplies = function(category) {
    filter = category;
    // $supplyList.children().each(function(index) {
    //   if(category === $(this).data('category') || category === 'all') {
    //     $(this).show();
    //   } else {
    //     $(this).hide();
    //   }
    // });
  }

  var searchSupplies = function(query) {
    search = query.toLowerCase();
    // $supplyList.children().each(function(index) {
    //   if($(this).data('name').indexOf(search) !== -1) {
    //     $(this).show();
    //   } else {
    //     $(this).hide();
    //   }
    // });
  }
})();