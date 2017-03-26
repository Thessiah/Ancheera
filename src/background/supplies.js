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

  var tooltips = {
    'treasure': {
      '2': 'Satin Feather\n 1: Scattered Cargo',
      '3': 'Zephyr Feather\n 1: Scattered Cargo',
      '4': 'Fine Sand Bottle\n 6: Lucky Charm Hunt',
      '5': 'Untamed Flame\n 6: Lucky Charm Hunt\n 8: Special Op\'s Request',
      '6': 'Fresh Water Jug\n 9: Threat to Fisheries',
      '7': 'Soothing Splash\n 9: Threat to Fisheries',
      '8': 'Rough Stone\n 13/39/52: Fruit of Lumacie',
      '9': 'Coarse Alluvium\n 13/39/52: Whiff of Danger',
      '14': 'Flying Sprout\n1: Scattered Cargo',
      '16': 'Glowing Coral\n 9: Threat to Fisheries',
      '17': 'Swirling Amber\n 13/39/52: Whiff of Danger',
      '22': 'Falcon Feather\n 17: I Challenge You\n 20: What\'s in the Box',
      '23': 'Spring Water Jug\n 17: I Challenge You\n 20: What\'s in the Box',
      '24': 'Vermillion Stone\n 17: I Challenge You\n 20: What\'s in the Box\n (2x)18: Strength and Chilvary',
      '27': 'Slimy Shroom\n 22: For Whom the Bell Tolls',
      '28': 'Hollow Soul\n 22: For Whom the Bell Tolls\n (2x)22: Playing Cat & Mouse',
      '29': 'Lacrimosa\n 22: For Whom the Bell Tolls',
      '33': 'Wheat Stalk\n 25: Golonzo\'s Battle of Old',
      '34': 'Iron Cluster\n 25: Golonzo\'s Battle of Old',
      '38': 'Indigo Fruit\n 30/44/65: The Dungeon Diet',
      '39': 'Foreboding Clover\n 30/44/65: The Dungeon Diet',
      '40': 'Blood Amber\n 30/44/65: The Dungeon Diet',
      '52': 'Sand Brick\n 70-4\n 33: No Need for Change\n (2x)34: Antiquarian Troubles',
      '54': 'Antique Cloth\n 36-3 \n70-4\n33: No need for Charge\n (2x)34: Antiquarian Troubles',
      '69': 'Prosperity Flame\n (5x)56/58/72: Baker and the Merrymaker\n 56/58/72: A Certain Soldier\'s Pride\n 61: A Mechanical Beast',
      '70': 'Explosive Material\n (5x)56/58/72: Baker and the Merrymaker\n 56/58/72: A Certain Soldier\'s Pride\n 61: A Mechanical Beast',
      '71': 'Steel Liquid\n(5x)56/58/72: Baker and the Merrymaker\n 56/58/72: A Certain Soldier\'s Pride',
      '91': 'Affinity Seed\n 68: Peddler in a Pinch\n 68: Tycoon Trouble',
      '99': 'Frozen Foliole\n 74-2',
      '101': 'Bastion Block?\n 80-4 \n 81-1\n 81-4\n 82-4',
      '102': 'Raw Gemstone?\n 84-4'
    }
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
    Initialize: function(callback) {
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
        if(callback !== undefined) {
          callback();
        }
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
              'sequence': item.sequence,
              'tooltip': tooltips[category] ? tooltips[category][id] : undefined
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
          id = json.items[i].item_id;
          if(supplies.powerUp[id] !== undefined) {
            if(updateSupply(id, 'powerUp', json.items[i].number)){
              updated = true;
            }
          } else {
            updated = newSupply(id, 'powerUp', json.items[i].number, json.items[i].name, '' + (100000 + parseInt(id)));
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
            id = json[i].item_id;
            if(supplies.draw[id] !== undefined) {
              if(updateSupply(id, 'draw', json[i].number)){
                updated = true;
              }
            } else {
              updated = newSupply(id, 'draw', json[i].number, json[i].name, '' + (200000 + parseInt(id)));
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
    if(supplies[category][id] !== undefined) {
      return updateSupply(id, category, supplies[category][id].count + parseInt(number));
    }
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
      'sequence': sequence,
      'tooltip': tooltips[category] ? tooltips[category][id] : undefined
    }});
    if(responseList[category] !== undefined && responseList[category][id] !== undefined) {
      for(var i = 0; i < responseList[category][id].length; i++) {
        responseList[category][id][i](id, number);
      }
    }
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