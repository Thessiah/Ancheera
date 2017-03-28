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
      'Vermillion Stone': ['17: I Challenge You', '20: What\'s in the Box', '(2x)18: Strength and Chilvary'],
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

  var createPlannerCrystal = function(count) {
    return {
      'type': 'crystal',
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
    'revenant': [
      {
        'name': 'Awakening',
        'items': [
          createPlannerSupply('material', '1052', 50),
          createPlannerSupply('material', '1351', 50),
          createPlannerSupply('material', '1353', 50),
          createPlannerSupply('material', '2001', 50),
          createPlannerSupply('material', '1052', 50),
          createPlannerCrystal(100)
        ]
      },
      {
        'name': 'Element Change',
        'items': [
          createPlannerElement('orb', '0', 250),
          createPlannerElement('tome', '2', 250),
          createPlannerSupply('material', '1202', 250),
        ]
      },
      {
        'name': 'First Upgrade',
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
          createPlannerCrystal(100)
        ]
      },
      {
        'name': 'Second Upgrade',
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
          createPlannerCrystal(200)
        ]
      },
      {
        'name': 'Third Upgrade',
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
          createPlannerCrystal(300)
        ]
      },
      {
        'name': 'Fourth Upgrade',
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
          createPlannerCrystal(400)
        ]
      },
      {
        'name': 'Fifth Upgrade',
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
          createPlannerCrystal(500)
        ]
      },
      {
        'name': 'Sixth Upgrade',
        'items': [
          createPlannerSupply('raid', '41', 3),
          createPlannerSupply('raid', '42', 3),
          createPlannerSupply('raid', '43', 3),
          createPlannerSupply('raid', '44', 3),
          createPlannerSupply('raid', '45', 3),
          createPlannerSupply('raid', '46', 3),
          createPlannerSupply('material', '1204', 250),
          createPlannerSupply('material', '1', 30),
          createPlannerSupply('powerUp', '200004', 1),
          createPlannerCrystal(500)
        ]
      },
    ],
    'class': [
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
        'name': 'Element Change',
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
        'fire': createSupplyInfo('material', '1011'),
        'water': createSupplyInfo('material', '1021'),
        'earth': createSupplyInfo('material', '1031'),
        'wind': createSupplyInfo('material', '1041'),
        'light': createSupplyInfo('material', '1051'),
        'dark' : createSupplyInfo('material', '1061')
      },
      '1': {
        'fire': createSupplyInfo('material', '1012'),
        'water': createSupplyInfo('material', '1022'),
        'earth': createSupplyInfo('material', '1032'),
        'wind': createSupplyInfo('material', '1042'),
        'light': createSupplyInfo('material', '1052'),
        'dark' : createSupplyInfo('material', '1062')
      }
    },
    'tome': {
      '0': {
        'fire': createSupplyInfo('material', '1311'),
        'water': createSupplyInfo('material', '1321'),
        'earth': createSupplyInfo('material', '1331'),
        'wind': createSupplyInfo('material', '1341'),
        'light': createSupplyInfo('material', '1351'),
        'dark' : createSupplyInfo('material', '1361')
      },
      '1': {
        'fire': createSupplyInfo('material', '1312'),
        'water': createSupplyInfo('material', '1322'),
        'earth': createSupplyInfo('material', '1332'),
        'wind': createSupplyInfo('material', '1342'),
        'light': createSupplyInfo('material', '1352'),
        'dark' : createSupplyInfo('material', '1362')
      },
      '2': {
        'fire': createSupplyInfo('material', '1313'),
        'water': createSupplyInfo('material', '1323'),
        'earth': createSupplyInfo('material', '1333'),
        'wind': createSupplyInfo('material', '1343'),
        'light': createSupplyInfo('material', '1353'),
        'dark' : createSupplyInfo('material', '1363')
      }
    },
    'scale': {
      '0': {
        'fire': createSupplyInfo('material', '1111'),
        'water': createSupplyInfo('material', '1121'),
        'earth': createSupplyInfo('material', '1131'),
        'wind': createSupplyInfo('material', '1141'),
        'light': createSupplyInfo('material', '1151'),
        'dark' : createSupplyInfo('material', '1161')
      }
    },
    'magna': {
      '0': {
        'fire': createSupplyInfo('raid', '11'),
        'water': createSupplyInfo('raid', '12'),
        'earth': createSupplyInfo('raid', '13'),
        'wind': createSupplyInfo('raid', '10'),
        'light': createSupplyInfo('raid', '25'),
        'dark' : createSupplyInfo('raid', '30')
      },
      '1': {
        'fire': createSupplyInfo('raid', '19'),
        'water': createSupplyInfo('raid', '20'),
        'earth': createSupplyInfo('raid', '21'),
        'wind': createSupplyInfo('raid', '18'),
        'light': createSupplyInfo('raid', '26'),
        'dark' : createSupplyInfo('raid', '31')
      },
      '2': {
        'fire': createSupplyInfo('raid', '47'),
        'water': createSupplyInfo('raid', '48'),
        'earth': createSupplyInfo('raid', '49'),
        'wind': createSupplyInfo('raid', '32'),
        'light': createSupplyInfo('raid', '50'),
        'dark' : createSupplyInfo('raid', '51')
      },
      '3': {
        'fire': createSupplyInfo('raid', '41'),
        'water': createSupplyInfo('raid', '42'),
        'earth': createSupplyInfo('raid', '43'),
        'wind': createSupplyInfo('raid', '44'),
        'light': createSupplyInfo('raid', '45'),
        'dark' : createSupplyInfo('raid', '46')
      },
      '4': {
        'fire': createSupplyInfo('raid', '101'),
        'water': createSupplyInfo('raid', '102'),
        'earth': createSupplyInfo('raid', '103'),
        'wind': createSupplyInfo('raid', '104'),
        'light': createSupplyInfo('raid', '105'),
        'dark' : createSupplyInfo('raid', '106')
      }
    },
    'quartz': {
      '0': {
        'fire': createSupplyInfo('material', '5011'),
        'water': createSupplyInfo('material', '5021'),
        'earth': createSupplyInfo('material', '5031'),
        'wind': createSupplyInfo('material', '5041'),
        'light': createSupplyInfo('material', '5051'),
        'dark' : createSupplyInfo('material', '5061')
      }
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
})();