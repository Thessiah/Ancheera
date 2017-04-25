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
  var planners = {
    revenant: {},
    class: {}
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
              'tooltip': createTooltip(item.name)
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
    },

    BuildWeapon: function(weaponBuild) {
      if(weaponBuild.build.start <= weaponBuild.build.end) {
        var response = [];
        var itemHash = {};
        for(var i = weaponBuild.build.start; i <= weaponBuild.build.end; i++) {
          var items = planners[weaponBuild.type][i].items;
          for(var j = 0; j < items.length; j++) {
            var item = items[j];
            var category = item.type;
            var id;
            if(category === 'currency') {
              id = item.category;
              category = 'currency';
            }
            else if(category === 'element') {
              id = elements[item.materialType][item.materialTier][weaponBuild.build.element].id;
              category = elements[item.materialType][item.materialTier][weaponBuild.build.element].category;
            } else if(category === 'class') {

            } else {
              id = item.id;
              category = item.category;
            }
            var hash = category + '-' + id;
            if(itemHash[hash] !== undefined) {
              response[itemHash[hash]].total += item.count;
            } else {
              itemHash[hash] = response.length;
              var current = 0;
              var tooltip = '';
              var sequence = 0;
              if(category === 'currency') {
                current = Profile.Get(id, function(value) {
                });
                if(id === 'crystal') {
                  tooltip = 'Crystals';
                  sequence = 0;
                }
              } else {
                current = Supplies.Get(id, category, function(id, amt) {
                });
                var itemDatum = weaponSupplyInfo[category][id];
                if(itemDatum === undefined) {
                  debugger;
                }
                tooltip = createTooltip(itemDatum.name);
                sequence = itemDatum.sequence;
              }
              response.push({
                'id': id,
                'category': category,
                'current': current,
                'total': item.count,
                'tooltip': tooltip,
                'sequence': sequence
              });
            }
          }
        }
        response.sort(function(a, b) {
          if(a.category === b.category) {
            return a.sequence - b.sequence;
          } else {
            var categoryHash = {
              treasure: 0,
              raid: 1,
              material: 2,
              event: 3,
              coop: 4,
              misc: 5,
              recovery: 6,
              powerUp: 7,
              draw: 8,
              other: 9,
              currency: 10
            }
            return categoryHash[a.category] - categoryHash[b.category];
          }
        });
        console.log(response);
        return response;
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

  var savePlanner = function(category) {
    Storage.Set('planners', {'planners': planners});
  }

  var savePlanner = function(type) {
    Storage.Set('planner' + type, {'planner': planner[type]});
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
      'tooltip': createTooltip(name)
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

  var createTooltip = function(name) {
    var tooltip = name;
    if(tooltips[name]) {
      for(var i = 0; i < tooltips[name].length; i++) {
        tooltip += '\n' + tooltips[name][i];
      }
    }
    return tooltip;
  }

  var setPlanner = function(category, type, element, start, end) {
    if(start !== -1) {
      for(var i = start; i < end; i++) {

      }
    } else {
      planners[category] = {};
    }
    savePlanner(category);
  }

    var createPlannerCurrency = function(category, count) {
    return {
      'type': 'currency',
      'category': category,
      'count': count
    }
  }

  var createPlannerElement = function(materialType, materialTier, count) {
    return {
      'type': 'element',
      'materialType': materialType,
      'materialTier': materialTier,
      'count': count
    }
  }

  var createPlannerClass = function(materialType, count) {
    return {
      'type': 'class',
      'materialType': materialType,
      'count': count
    }
  }

  var createPlannerSupply = function(category, id, count) {
    return {
      'type': 'supply',
      'category': category,
      'id': id,
      'count': count
    }
  }

  var createSupplyInfo = function(category, id) {
    return{
      'category': category,
      'id': id
    }
  }

  var planners = {
    'Revenant': [
      {
        'name': 'Awakening',
        'items': [
          createPlannerSupply('material', '1052', 50),
          createPlannerSupply('material', '1351', 50),
          createPlannerSupply('material', '1353', 50),
          createPlannerSupply('material', '2001', 50),
          createPlannerSupply('material', '1052', 50),
          createPlannerCurrency('crystal', 100)
        ]
      },
      {
        'name': 'Element',
        'items': [
          createPlannerElement('orb', '0', 250),
          createPlannerElement('tome', '2', 250),
          createPlannerSupply('material', '1202', 250),
        ]
      },
      {
        'name': 'Upgrade 1',
        'items': [
          createPlannerSupply('treasure', '2', 300),
          createPlannerSupply('treasure', '5', 100),
          createPlannerSupply('treasure', '8', 100),
          createPlannerElement('orb', '0', 100),
          createPlannerElement('tome', '0', 100),
          createPlannerElement('tome', '1', 150),
          createPlannerElement('tome', '2', 100),
          createPlannerSupply('material', '2002', 10),
          createPlannerSupply('material', '1', 3),
          createPlannerCurrency('crystal', 100)
        ]
      },
      {
        'name': 'Upgrade 2',
        'items': [
          createPlannerSupply('treasure', '6', 100),
          createPlannerSupply('treasure', '24', 100),
          createPlannerSupply('treasure', '28', 100),
          createPlannerElement('orb', '0', 150),
          createPlannerElement('tome', '0', 150),
          createPlannerElement('tome', '2', 150),
          createPlannerElement('scale', '0', 30),
          createPlannerElement('magna', '3', 3),
          createPlannerSupply('material', '1204', 50),
          createPlannerSupply('material', '1', 5),
          createPlannerCurrency('crystal', 200)
        ]
      },
      {
        'name': 'Upgrade 3',
        'items': [
          createPlannerSupply('treasure', '3', 300),
          createPlannerSupply('treasure', '22', 100),
          createPlannerSupply('treasure', '39', 80),
          createPlannerElement('orb', '0', 200),
          createPlannerElement('orb', '1', 100),
          createPlannerElement('tome', '2', 200),
          createPlannerElement('magna', '0', 100),
          createPlannerSupply('material', '2002', 10),
          createPlannerSupply('material', '1', 7),
          createPlannerCurrency('crystal', 300)
        ]
      },
      {
        'name': 'Upgrade 4',
        'items': [
          createPlannerSupply('treasure', '17', 100),
          createPlannerSupply('treasure', '29', 100),
          createPlannerSupply('treasure', '40', 80),
          createPlannerElement('orb', '0', 250),
          createPlannerElement('tome', '2', 250),
          createPlannerElement('scale', '0', 50),
          createPlannerElement('magna', '3', 3),
          createPlannerSupply('material', '1204', 150),
          createPlannerSupply('material', '1', 10),
          createPlannerCurrency('crystal', 400)
        ]
      },
      {
        'name': 'Upgrade 5',
        'items': [
          createPlannerSupply('raid', '32', 20),
          createPlannerSupply('raid', '47', 20),
          createPlannerSupply('raid', '48', 20),
          createPlannerSupply('raid', '49', 20),
          createPlannerSupply('raid', '50', 20),
          createPlannerSupply('raid', '51', 20),
          createPlannerSupply('treasure', '54', 100),
          createPlannerElement('magna', '2', 60),
          createPlannerSupply('material', '2002', 10),
          createPlannerSupply('material', '1', 15),
          createPlannerCurrency('crystal', 500)
        ]
      },
      {
        'name': 'Upgrade 6',
        'items': [
          createPlannerSupply('raid', '41', 3),
          createPlannerSupply('raid', '42', 3),
          createPlannerSupply('raid', '43', 3),
          createPlannerSupply('raid', '44', 3),
          createPlannerSupply('raid', '45', 3),
          createPlannerSupply('raid', '46', 3),
          createPlannerSupply('material', '1204', 250),
          createPlannerSupply('material', '1', 30),
          createPlannerSupply('powerUp', '20004', 1),
          createPlannerCurrency('crystal', 500)
        ]
      },
    ],
    'Class': [
      {
        'name': 'Forge',
        'items': [
          createPlannerClass('primal'),
          createPlannerClass('coop1', 15),
          createPlannerClass('coop2', 15),
          createPlannerClass('creed', 10),
          createPlannerClass('tome', 70),
          createPlannerSupply('treasure', '54', 40),
          createPlannerSupply('material', '1201', 200),
          createPlannerSupply('material', '1', 5)
        ]
      },
      {
        'name': 'Rebuild',
        'items': [
          createPlannerClass('distinction', 10),
          createPlannerClass('stone', 256),
          createPlannerClass('quartz', 50),
          createPlannerClass('creed', 25),
          createPlannerSupply('material', '2001', 30),
          createPlannerSupply('material', '1201', 120),
          createPlannerSupply('material', '1', 5),
          createPlannerSupply('powerUp', '20003', 2),
          createPlannerElement('quartz', '0', 50),
        ]
      },
      {
        'name': 'Element',
        'items': [
          createPlannerClass('distinction', 30),
          createPlannerClass('stone', 512),
          createPlannerClass('grimoire1', 15),
          createPlannerClass('grimoire2', 15),
          createPlannerElement('magna', '4', 30),
          createPlannerElement('primal', '2', 200),
          createPlannerSupply('raid', '107', 3),
          createPlannerSupply('material', '1', 15),
        ]
      }
    ]
  }

  var elements = {
    'orb': {
      '0': {
        'Fire': createSupplyInfo('material', '1011'),
        'Water': createSupplyInfo('material', '1021'),
        'Earth': createSupplyInfo('material', '1031'),
        'Wind': createSupplyInfo('material', '1041'),
        'Light': createSupplyInfo('material', '1051'),
        'Dark' : createSupplyInfo('material', '1061')
      },
      '1': {
        'Fire': createSupplyInfo('material', '1012'),
        'Water': createSupplyInfo('material', '1022'),
        'Earth': createSupplyInfo('material', '1032'),
        'Wind': createSupplyInfo('material', '1042'),
        'Light': createSupplyInfo('material', '1052'),
        'Dark' : createSupplyInfo('material', '1062')
      }
    },
    'tome': {
      '0': {
        'Fire': createSupplyInfo('material', '1311'),
        'Water': createSupplyInfo('material', '1321'),
        'Earth': createSupplyInfo('material', '1331'),
        'Wind': createSupplyInfo('material', '1341'),
        'Light': createSupplyInfo('material', '1351'),
        'Dark' : createSupplyInfo('material', '1361')
      },
      '1': {
        'Fire': createSupplyInfo('material', '1312'),
        'Water': createSupplyInfo('material', '1322'),
        'Earth': createSupplyInfo('material', '1332'),
        'Wind': createSupplyInfo('material', '1342'),
        'Light': createSupplyInfo('material', '1352'),
        'Dark' : createSupplyInfo('material', '1362')
      },
      '2': {
        'Fire': createSupplyInfo('material', '1313'),
        'Water': createSupplyInfo('material', '1323'),
        'Earth': createSupplyInfo('material', '1333'),
        'Wind': createSupplyInfo('material', '1343'),
        'Light': createSupplyInfo('material', '1353'),
        'Dark' : createSupplyInfo('material', '1363')
      }
    },
    'scale': {
      '0': {
        'Fire': createSupplyInfo('material', '1111'),
        'Water': createSupplyInfo('material', '1121'),
        'Earth': createSupplyInfo('material', '1131'),
        'Wind': createSupplyInfo('material', '1141'),
        'Light': createSupplyInfo('material', '1151'),
        'Dark' : createSupplyInfo('material', '1161')
      }
    },
    'magna': {
      '0': {
        'Fire': createSupplyInfo('raid', '11'),
        'Water': createSupplyInfo('raid', '12'),
        'Earth': createSupplyInfo('raid', '13'),
        'Wind': createSupplyInfo('raid', '10'),
        'Light': createSupplyInfo('raid', '25'),
        'Dark' : createSupplyInfo('raid', '30')
      },
      '1': {
        'Fire': createSupplyInfo('raid', '19'),
        'Water': createSupplyInfo('raid', '20'),
        'Earth': createSupplyInfo('raid', '21'),
        'Wind': createSupplyInfo('raid', '18'),
        'Light': createSupplyInfo('raid', '26'),
        'Dark' : createSupplyInfo('raid', '31')
      },
      '2': {
        'Fire': createSupplyInfo('raid', '47'),
        'Water': createSupplyInfo('raid', '48'),
        'Earth': createSupplyInfo('raid', '49'),
        'Wind': createSupplyInfo('raid', '32'),
        'Light': createSupplyInfo('raid', '50'),
        'Dark' : createSupplyInfo('raid', '51')
      },
      '3': {
        'Fire': createSupplyInfo('raid', '41'),
        'Water': createSupplyInfo('raid', '42'),
        'Earth': createSupplyInfo('raid', '43'),
        'Wind': createSupplyInfo('raid', '44'),
        'Light': createSupplyInfo('raid', '45'),
        'Dark' : createSupplyInfo('raid', '46')
      },
      '4': {
        'Fire': createSupplyInfo('raid', '101'),
        'Water': createSupplyInfo('raid', '102'),
        'Earth': createSupplyInfo('raid', '103'),
        'Wind': createSupplyInfo('raid', '104'),
        'Light': createSupplyInfo('raid', '105'),
        'Dark' : createSupplyInfo('raid', '106')
      }
    },
    'quartz': {
      '0': {
        'Fire': createSupplyInfo('material', '5011'),
        'Water': createSupplyInfo('material', '5021'),
        'Earth': createSupplyInfo('material', '5031'),
        'Wind': createSupplyInfo('material', '5041'),
        'Light': createSupplyInfo('material', '5051'),
        'Dark' : createSupplyInfo('material', '5061')
      }
    }
  }

    var tooltips = {
      'Satin Feather': ['1: Scattered Cargo'],
      'Zephyr Feather': ['1: Scattered Cargo'],
      'Fine Sand Bottle': ['6: Lucky Charm Hunt'],
      'Untamed Flame': ['8-2', '6: Lucky Charm Hunt', '8: Special Op\'s Request'],
      'Fresh Water Jug': ['9: Threat to Fisheries'],
      'Soothing Splash': ['9: Threat to Fisheries'],
      'Rough Stone': ['15/53-3', '13/39/52: Whiff of Danger', '13/39/52: Fruit of Lumacie'],
      'Coarse Alluvium': ['15/53-3', '13/39/52: Whiff of Danger'],
      'Flying Sprout': ['1: Scattered Cargo'],
      'Glowing Coral': ['9: Threat to Fisheries'],
      'Swirling Amber': ['13/39/52: Whiff of Danger'],
      'Falcon Feather': ['17: I Challenge You', '20: What\'s in the Box'],
      'Spring Water Jug': ['17: I Challenge You', '20: What\'s in the Box'],
      'Vermilion Stone': ['17: I Challenge You', '20: What\'s in the Box', '(2x)18: Strength and Chilvary'],
      'Slimy Shroom': ['22: For Whom the Bell Tolls'],
      'Hollow Soul': ['22: For Whom the Bell Tolls', '(2x)22: Playing Cat & Mouse'],
      'Lacrimosa': ['22: For Whom the Bell Tolls'],
      'Wheat Stalk': ['25: Golonzo\'s Battle of Old'],
      'Iron Cluster': ['25: Golonzo\'s Battle of Old'],
      'Indigo Fruit': ['32-4', '30/44/65: The Dungeon Diet'],
      'Foreboding Clover': ['32-4', '30/44/65: The Dungeon Diet'],
      'Blood Amber': ['32-4', '30/44/65: The Dungeon Diet'],
      'Sand Brick': ['70-4', '33: No Need for Change', '(2x)34: Antiquarian Troubles'],
      'Antique Cloth': ['70-4', '33: No need for Charge', '(2x)34: Antiquarian Troubles'],
      'Prosperity Flame': ['(5x)56/58/72: Baker and the Merrymaker', '56/58/72: A Certain Soldier\'s Pride', '61: A Mechanical Beast'],
      'Explosive Material': ['(5x)56/58/72: Baker and the Merrymaker', '56/58/72: A Certain Soldier\'s Pride', '61: A Mechanical Beast'],
      'Steel Liquid': ['(5x)56/58/72: Baker and the Merrymaker', '56/58/72: A Certain Soldier\'s Pride'],
      'Affinity Seed': ['68: Peddler in a Pinch', '68: Tycoon Trouble'],
      'Frozen Foliole': ['74-2'],
      'Bastion Block': ['80-4', '81-1', '81-4', '82-4'],
      'Raw Gemstone': ['84-4']
  }
    var weaponSupplyInfo = {
  "powerUp": {
    "20002": {
      "name": "Red Steel Brick",
      "sequence": "120002"
    },
    "20003": {
      "name": "Steel Brick",
      "sequence": "120003"
    },
    "20004": {
      "name": "Gold Brick",
      "sequence": "120004"
    },
    "20005": {
      "name": "Damascus Ingot",
      "sequence": "120005"
    },
    "20012": {
      "name": "Brightstone",
      "sequence": "120012"
    },
    "20013": {
      "name": "Moonlight Stone",
      "sequence": "120013"
    },
    "20014": {
      "name": "Sunlight Stone",
      "sequence": "120014"
    }
  },
  "treasure": {
    "2": {
      "name": "Satin Feather",
      "sequence": 110
    },
    "3": {
      "name": "Zephyr Feather",
      "sequence": 120
    },
    "4": {
      "name": "Fine Sand Bottle",
      "sequence": 210
    },
    "5": {
      "name": "Untamed Flame",
      "sequence": 220
    },
    "6": {
      "name": "Fresh Water Jug",
      "sequence": 310
    },
    "7": {
      "name": "Soothing Splash",
      "sequence": 320
    },
    "8": {
      "name": "Rough Stone",
      "sequence": 410
    },
    "9": {
      "name": "Coarse Alluvium",
      "sequence": 420
    },
    "14": {
      "name": "Flying Sprout",
      "sequence": 130
    },
    "15": {
      "name": "Blistering Ore",
      "sequence": 230
    },
    "16": {
      "name": "Glowing Coral",
      "sequence": 330
    },
    "17": {
      "name": "Swirling Amber",
      "sequence": 430
    },
    "22": {
      "name": "Falcon Feather",
      "sequence": 510
    },
    "23": {
      "name": "Spring Water Jug",
      "sequence": 520
    },
    "24": {
      "name": "Vermilion Stone",
      "sequence": 530
    },
    "27": {
      "name": "Slimy Shroom",
      "sequence": 610
    },
    "28": {
      "name": "Hollow Soul",
      "sequence": 620
    },
    "29": {
      "name": "Lacrimosa",
      "sequence": 630
    },
    "33": {
      "name": "Wheat Stalk",
      "sequence": 710
    },
    "34": {
      "name": "Iron Cluster",
      "sequence": 720
    },
    "35": {
      "name": "Olea Plant",
      "sequence": 730
    },
    "38": {
      "name": "Indigo Fruit",
      "sequence": 810
    },
    "39": {
      "name": "Foreboding Clover",
      "sequence": 820
    },
    "40": {
      "name": "Blood Amber",
      "sequence": 830
    },
    "52": {
      "name": "Sand Brick",
      "sequence": 910
    },
    "53": {
      "name": "Native Reed",
      "sequence": 920
    },
    "54": {
      "name": "Antique Cloth",
      "sequence": 930
    },
    "69": {
      "name": "Prosperity Flame",
      "sequence": 1110
    },
    "70": {
      "name": "Explosive Material",
      "sequence": 1120
    },
    "71": {
      "name": "Steel Liquid",
      "sequence": 1130
    },
    "89": {
      "name": "Dydroit Stone",
      "sequence": 1210
    },
    "90": {
      "name": "Skyrock Blossom",
      "sequence": 1220
    },
    "91": {
      "name": "Affinity Seed",
      "sequence": 1230
    },
    "98": {
      "name": "Firn",
      "sequence": 1410
    },
    "99": {
      "name": "Frozen Foliole",
      "sequence": 1420
    },
    "100": {
      "name": "Cold Mold",
      "sequence": 1430
    },
    "119": {
      "name": "Merkmal Fig",
      "sequence": 1510
    },
    "120": {
      "name": "Bastion Block",
      "sequence": 1520
    },
    "121": {
      "name": "Corroded Cartridge",
      "sequence": 1530
    },
    "122": {
      "name": "Riot Root",
      "sequence": 1540
    },
    "123": {
      "name": "Basii Fruit",
      "sequence": 1550
    },
    "124": {
      "name": "Raw Gemstone",
      "sequence": 1560
    }
  },
  "raid": {
    "10": {
      "name": "Tiamat Anima",
      "sequence": 100110
    },
    "11": {
      "name": "Colossus Anima",
      "sequence": 100210
    },
    "12": {
      "name": "Leviathan Anima",
      "sequence": 100310
    },
    "13": {
      "name": "Yggdrasil Anima",
      "sequence": 100410
    },
    "18": {
      "name": "Tiamat Omega Anima",
      "sequence": 100120
    },
    "19": {
      "name": "Colossus Omega Anima",
      "sequence": 100220
    },
    "20": {
      "name": "Leviathan Omega Anima",
      "sequence": 100320
    },
    "21": {
      "name": "Yggdrasil Omega Anima",
      "sequence": 100420
    },
    "25": {
      "name": "Luminiera Anima",
      "sequence": 100510
    },
    "26": {
      "name": "Luminiera Omega Anima",
      "sequence": 100520
    },
    "30": {
      "name": "Celeste Anima",
      "sequence": 100610
    },
    "31": {
      "name": "Celeste Omega Anima",
      "sequence": 100620
    },
    "32": {
      "name": "Green Dragon Eye",
      "sequence": 100130
    },
    "36": {
      "name": "Mithra Anima",
      "sequence": 100710
    },
    "41": {
      "name": "True Fire Anima",
      "sequence": 100810
    },
    "42": {
      "name": "True Water Anima",
      "sequence": 100820
    },
    "43": {
      "name": "True Earth Anima",
      "sequence": 100830
    },
    "44": {
      "name": "True Wind Anima",
      "sequence": 100840
    },
    "45": {
      "name": "True Light Anima",
      "sequence": 100850
    },
    "46": {
      "name": "True Dark Anima",
      "sequence": 100860
    },
    "47": {
      "name": "Resolute Reactor",
      "sequence": 100230
    },
    "48": {
      "name": "Fanned Fin",
      "sequence": 100330
    },
    "49": {
      "name": "Genesis Bud",
      "sequence": 100430
    },
    "50": {
      "name": "Primal Bit",
      "sequence": 100530
    },
    "51": {
      "name": "Black Fog Sphere",
      "sequence": 100630
    },
    "55": {
      "name": "Omega Fragment",
      "sequence": 100910
    },
    "56": {
      "name": "Dawn Anima",
      "sequence": 100911
    },
    "57": {
      "name": "Dusk Anima",
      "sequence": 100920
    },
    "58": {
      "name": "Star Sand Scoop",
      "sequence": 100930
    },
    "59": {
      "name": "Horn of Bahamut",
      "sequence": 100940
    },
    "60": {
      "name": "Macula Marius Anima",
      "sequence": 110110
    },
    "61": {
      "name": "Gold Nugget",
      "sequence": 190010
    },
    "62": {
      "name": "Medusa Anima",
      "sequence": 110210
    },
    "63": {
      "name": "Dark Angel Oliva Anima",
      "sequence": 110310
    },
    "64": {
      "name": "Twin Elements Anima",
      "sequence": 110410
    },
    "65": {
      "name": "Nezha Anima",
      "sequence": 110510
    },
    "66": {
      "name": "Apollo Anima",
      "sequence": 110610
    },
    "67": {
      "name": "Odin Anima",
      "sequence": 110710
    },
    "68": {
      "name": "Grani Anima",
      "sequence": 110810
    },
    "72": {
      "name": "Lich Anima",
      "sequence": 110910
    },
    "73": {
      "name": "Macula Marius Omega Anima",
      "sequence": 110120
    },
    "74": {
      "name": "Medusa Omega Anima",
      "sequence": 110220
    },
    "75": {
      "name": "Dark Angel Olivia Omega Anima",
      "sequence": 110320
    },
    "76": {
      "name": "Twin Elements Omega Anima",
      "sequence": 110420
    },
    "77": {
      "name": "Nezha Omega Anima",
      "sequence": 110520
    },
    "78": {
      "name": "Apollo Omega Anima",
      "sequence": 110620
    },
    "79": {
      "name": "Primeval Horn",
      "sequence": 100950
    },
    "80": {
      "name": "Bright Spirits",
      "sequence": 120010
    },
    "81": {
      "name": "Murky Spirits",
      "sequence": 120020
    },
    "82": {
      "name": "Peacemaker Star",
      "sequence": 120110
    },
    "83": {
      "name": "Heavenly Horn",
      "sequence": 120130
    },
    "84": {
      "name": "Azure Feather",
      "sequence": 120120
    },
    "85": {
      "name": "Athena Anima",
      "sequence": 111000
    },
    "87": {
      "name": "Baal Anima",
      "sequence": 111100
    },
    "92": {
      "name": "Garuda Anima",
      "sequence": 111200
    },
    "94": {
      "name": "Gilgamesh Anima",
      "sequence": 111300
    },
    "101": {
      "name": "Rubeus Centrum",
      "sequence": 101010
    },
    "102": {
      "name": "Indicus Centrum",
      "sequence": 101020
    },
    "103": {
      "name": "Luteus Centrum",
      "sequence": 101030
    },
    "104": {
      "name": "Galbinus Centrum",
      "sequence": 101040
    },
    "105": {
      "name": "Niveus Centrum",
      "sequence": 101050
    },
    "106": {
      "name": "Ater Centrum",
      "sequence": 101060
    },
    "107": {
      "name": "Silver Centrum",
      "sequence": 101070
    },
    "111": {
      "name": "Fire Urn",
      "sequence": 101110
    },
    "112": {
      "name": "Water Urn",
      "sequence": 101120
    },
    "113": {
      "name": "Earth Urn",
      "sequence": 101130
    },
    "114": {
      "name": "Wind Urn",
      "sequence": 101140
    },
    "115": {
      "name": "Light Urn",
      "sequence": 101150
    },
    "116": {
      "name": "Dark Urn",
      "sequence": 101160
    },
    "117": {
      "name": "Ca Ong Anima",
      "sequence": 111500
    },
    "202": {
      "name": "Damascus Grain",
      "sequence": 190020
    },
    "203": {
      "name": "Damascus Crystal",
      "sequence": 190030
    },
    "204": {
      "name": "Rose Crystal Petal",
      "sequence": 120040
    },
    "205": {
      "name": "Rose Crystal",
      "sequence": 120050
    },
    "506": {
      "name": "Michael Anima",
      "sequence": 111660
    },
    "507": {
      "name": "Gabriel Anima",
      "sequence": 111670
    },
    "508": {
      "name": "Uriel Anima",
      "sequence": 111680
    },
    "509": {
      "name": "Raphael Anima",
      "sequence": 111690
    }
  },
  "material": {
    "1": {
      "name": "Blue Sky Crystal",
      "sequence": 220010
    },
    "206": {
      "name": "Golden Talisman",
      "sequence": 216000
    },
    "208": {
      "name": "Obsidian Talisman",
      "sequence": 216200
    },
    "1011": {
      "name": "Fire Orb",
      "sequence": 200010
    },
    "1012": {
      "name": "Inferno Orb",
      "sequence": 200110
    },
    "1021": {
      "name": "Water Orb",
      "sequence": 200020
    },
    "1022": {
      "name": "Frost Orb",
      "sequence": 200120
    },
    "1031": {
      "name": "Earth Orb",
      "sequence": 200030
    },
    "1032": {
      "name": "Rumbling Orb",
      "sequence": 200130
    },
    "1041": {
      "name": "Wind Orb",
      "sequence": 200040
    },
    "1042": {
      "name": "Cyclone Orb",
      "sequence": 200140
    },
    "1051": {
      "name": "Light Orb",
      "sequence": 200050
    },
    "1052": {
      "name": "Shining Orb",
      "sequence": 200150
    },
    "1061": {
      "name": "Dark Orb",
      "sequence": 200060
    },
    "1062": {
      "name": "Abysm Orb",
      "sequence": 200160
    },
    "1111": {
      "name": "Red Dragon Scale",
      "sequence": 203010
    },
    "1121": {
      "name": "Blue Dragon Scale",
      "sequence": 203020
    },
    "1131": {
      "name": "Brown Dragon Scale",
      "sequence": 203030
    },
    "1141": {
      "name": "Green Dragon Scale",
      "sequence": 203040
    },
    "1151": {
      "name": "White Dragon Scale",
      "sequence": 203050
    },
    "1161": {
      "name": "Black Dragon Scale",
      "sequence": 203060
    },
    "1201": {
      "name": "Prism Chip",
      "sequence": 202010
    },
    "1202": {
      "name": "Flawed Prism",
      "sequence": 202020
    },
    "1203": {
      "name": "Flawless Prism",
      "sequence": 202030
    },
    "1204": {
      "name": "Rainbow Prism",
      "sequence": 202040
    },
    "1311": {
      "name": "Red Tome",
      "sequence": 201010
    },
    "1312": {
      "name": "Hellfire Scroll",
      "sequence": 201110
    },
    "1313": {
      "name": "Infernal Whorl",
      "sequence": 201210
    },
    "1321": {
      "name": "Blue Tome",
      "sequence": 201020
    },
    "1322": {
      "name": "Flood Scroll",
      "sequence": 201120
    },
    "1323": {
      "name": "Tidal Whorl",
      "sequence": 201220
    },
    "1331": {
      "name": "Brown Tome",
      "sequence": 201030
    },
    "1332": {
      "name": "Thunder Scroll",
      "sequence": 201130
    },
    "1333": {
      "name": "Seismic Whorl",
      "sequence": 201230
    },
    "1341": {
      "name": "Green Tome",
      "sequence": 201040
    },
    "1342": {
      "name": "Gale Scroll",
      "sequence": 201140
    },
    "1343": {
      "name": "Tempest Whorl",
      "sequence": 201240
    },
    "1351": {
      "name": "White Tome",
      "sequence": 201050
    },
    "1352": {
      "name": "Skylight Scroll",
      "sequence": 201150
    },
    "1353": {
      "name": "Radiant Whorl",
      "sequence": 201250
    },
    "1361": {
      "name": "Black Tome",
      "sequence": 201060
    },
    "1362": {
      "name": "Chasm Scroll",
      "sequence": 201160
    },
    "1363": {
      "name": "Umbral Whorl",
      "sequence": 201260
    },
    "2001": {
      "name": "Champion Merit",
      "sequence": 210010
    },
    "2002": {
      "name": "Supreme Merit",
      "sequence": 210020
    },
    "2003": {
      "name": "Legendary Merit",
      "sequence": 210030
    },
    "4011": {
      "name": "Sword Stone",
      "sequence": 220110
    },
    "4021": {
      "name": "Dagger Stone",
      "sequence": 220210
    },
    "4031": {
      "name": "Spear Stone",
      "sequence": 220310
    },
    "4041": {
      "name": "Axe Stone",
      "sequence": 220410
    },
    "4051": {
      "name": "Staff Stone",
      "sequence": 220510
    },
    "4061": {
      "name": "Pistol Stone",
      "sequence": 220610
    },
    "4071": {
      "name": "Melee Stone",
      "sequence": 220710
    },
    "4081": {
      "name": "Bow Stone",
      "sequence": 220810
    },
    "4091": {
      "name": "Harp Stone",
      "sequence": 220910
    },
    "4101": {
      "name": "Katana Stone",
      "sequence": 221010
    },
    "5011": {
      "name": "Fire Quartz",
      "sequence": 230110
    },
    "5021": {
      "name": "Water Quartz",
      "sequence": 230210
    },
    "5031": {
      "name": "Earth Quartz",
      "sequence": 230310
    },
    "5041": {
      "name": "Wind Quartz",
      "sequence": 230410
    },
    "5051": {
      "name": "Light Quartz",
      "sequence": 230510
    },
    "5061": {
      "name": "Dark Quartz",
      "sequence": 230610
    },
    "5111": {
      "name": "Hellfire Fragment",
      "sequence": 230620
    },
    "5121": {
      "name": "Deluge Fragment",
      "sequence": 230630
    },
    "5131": {
      "name": "Wasteland Fragment",
      "sequence": 230640
    },
    "5141": {
      "name": "Typhoon Fragment",
      "sequence": 230650
    },
    "5211": {
      "name": "Fire Halo",
      "sequence": 230660
    },
    "5221": {
      "name": "Water Halo",
      "sequence": 230670
    },
    "5231": {
      "name": "Earth Halo",
      "sequence": 230680
    },
    "5241": {
      "name": "Wind Halo",
      "sequence": 230690
    },
    "5311": {
      "name": "Fire Pinion",
      "sequence": 230700
    },
    "5321": {
      "name": "Water Pinion",
      "sequence": 230710
    },
    "5331": {
      "name": "Earth Pinion",
      "sequence": 230720
    },
    "5341": {
      "name": "Wind Pinion",
      "sequence": 230730
    },
    "6001": {
      "name": "Zhuque Seal",
      "sequence": 215100
    },
    "6002": {
      "name": "Xuanwu Seal",
      "sequence": 215200
    },
    "6003": {
      "name": "Baihu Seal",
      "sequence": 215300
    },
    "6004": {
      "name": "Qinglong Seal",
      "sequence": 215400
    },
    "6006": {
      "name": "Zhu Jadeite",
      "sequence": 215600
    },
    "6007": {
      "name": "Xuan Jadeite",
      "sequence": 215700
    },
    "6008": {
      "name": "Bai Jadeite",
      "sequence": 215800
    },
    "6009": {
      "name": "Qing Jadeite",
      "sequence": 215900
    }
  },
  "coop": {
    "20001": {
      "name": "Bronze-Plated Disk",
      "sequence": 500010
    },
    "20002": {
      "name": "Silver-Plated Disk",
      "sequence": 500020
    },
    "20003": {
      "name": "Gold-Plated Disk",
      "sequence": 500030
    },
    "20011": {
      "name": "Gleaming Sand Bottle",
      "sequence": 500110
    },
    "20012": {
      "name": "Mystical Flame",
      "sequence": 500120
    },
    "20021": {
      "name": "Gleaming Water Jug",
      "sequence": 500210
    },
    "20022": {
      "name": "Mystical Splash",
      "sequence": 500220
    },
    "20031": {
      "name": "Gleaming Stone",
      "sequence": 500310
    },
    "20032": {
      "name": "Mystical Alluvium",
      "sequence": 500320
    },
    "20041": {
      "name": "Gleaming Feather",
      "sequence": 500410
    },
    "20042": {
      "name": "Mystical Feather",
      "sequence": 500420
    },
    "20111": {
      "name": "Searing Stone",
      "sequence": 501110
    },
    "20121": {
      "name": "Resplendent Coral",
      "sequence": 501210
    },
    "20131": {
      "name": "Opulent Amber",
      "sequence": 501310
    },
    "20141": {
      "name": "Vortical Pinwheel",
      "sequence": 501410
    },
    "20211": {
      "name": "Warrior Creed",
      "sequence": 502110
    },
    "20221": {
      "name": "Mage Creed",
      "sequence": 502210
    },
    "20411": {
      "name": "Gladiator Distinction",
      "sequence": 504110
    },
    "20421": {
      "name": "Guardian Distinction",
      "sequence": 504210
    },
    "20431": {
      "name": "Pilgrim Distinction",
      "sequence": 504310
    },
    "20441": {
      "name": "Mage Distinction",
      "sequence": 504410
    },
    "20451": {
      "name": "Bandit Distinction",
      "sequence": 504510
    },
    "20461": {
      "name": "Fencer Distinction",
      "sequence": 504610
    },
    "20471": {
      "name": "Combatant Distinction",
      "sequence": 504710
    },
    "20481": {
      "name": "Sharpshooter Distinction",
      "sequence": 504810
    },
    "20491": {
      "name": "Troubadour Distinction",
      "sequence": 504910
    },
    "20501": {
      "name": "Cavalryman Distinction",
      "sequence": 505010
    },
    "20511": {
      "name": "Alchemist Distinction",
      "sequence": 505110
    },
    "20611": {
      "name": "Infernal Garnet",
      "sequence": 511110
    },
    "20621": {
      "name": "Frozen Hell Prism",
      "sequence": 511210
    },
    "20631": {
      "name": "Evil Judge Crystal",
      "sequence": 511310
    },
    "20641": {
      "name": "Horseman's Plate",
      "sequence": 511410
    },
    "20651": {
      "name": "Halo Light Quartz",
      "sequence": 511510
    },
    "20661": {
      "name": "Phantom Demon Jewel",
      "sequence": 511610
    },
    "20671": {
      "name": "Samurai Distinction",
      "sequence": 505210
    },
    "20691": {
      "name": "Sword Master Distinction",
      "sequence": 505410
    },
    "20701": {
      "name": "Gunslinger Distinction",
      "sequence": 505510
    },
    "20711": {
      "name": "Fire Grimoire",
      "sequence": 512110
    },
    "20721": {
      "name": "Water Grimoire",
      "sequence": 512210
    },
    "20731": {
      "name": "Earth Grimoire",
      "sequence": 512310
    },
    "20741": {
      "name": "Wind Grimoire",
      "sequence": 512410
    },
    "20751": {
      "name": "Mystic Distinction",
      "sequence": 505610
    },
    "20761": {
      "name": "Assassin Distinction",
      "sequence": 505710
    },
    "25000": {
      "name": "セフィラストーン",
      "sequence": 550000
    },
    "25001": {
      "name": "火精のアストラ",
      "sequence": 550010
    },
    "25005": {
      "name": "光精のアストラ",
      "sequence": 550050
    },
    "25018": {
      "name": "Verum Proofs",
      "sequence": 550180
    },
    "25019": {
      "name": "Blurred Memoria",
      "sequence": 550190
    }
  }
}
})();