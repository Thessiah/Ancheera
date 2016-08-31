(function() {
  var networkQueue = [];
  window.Network = {
    Initialize: function() {
      for(var i = 0; i < networkQueue.length; i++) {
        checkRequest(networkQueue[i]);
      }
    }
  }
  chrome.devtools.network.onRequestFinished.addListener(function(request) {
    //page loaded
    //Message.ConsoleLog(JSON.stringify(request.response.content));
    // if(request.request.postData !== undefined) {
    //   Message.ConsoleLog('network.js', JSON.stringify(request.request.postData));
    // }
      if(request.request.url.indexOf('.css') !== -1 && request.request.url.indexOf('/css/common/index.css') === -1) {
        chrome.runtime.sendMessage({pageLoad : true}, function(response) {
          if(!Default.IsInitialized() && response.pageLoad.indexOf('#mypage') !== -1) {
            Default.Initialize(response.pageLoad);
          }
        });
        //Message.ConsoleLog('network.js', JSON.stringify(request));
        // Message.ConsoleLog(Object.keys(request));
        // Message.ConsoleLog(Object.keys(request.request));
        // Message.ConsoleLog(Object.keys(request.response));
      }
    if(request.request.url.indexOf('http://gbf.game.mbga.jp/') !== -1 || request.request.url.indexOf('http://game.granbluefantasy.jp/') !== -1) {
      if(Default.IsInitialized()) {
        checkRequest(request);
      } else {
        networkQueue.push(request);
      }
    }
  });
  var checkRequest = function(request) {
    if(request.request.url.indexOf('assets_en/img/sp/') !== -1 && request.request.url.indexOf('.jpg') !== -1) {
      Quest.LoadImage(request.request.url);
    }
    //profile
    if(request.request.url.indexOf('/mbp/mbp_info?_=') !== -1) {
      request.getContent(function(responseBody) {
        Profile.SetPendants(JSON.parse(responseBody));
      });
    }
    //verify current ap/ep
    if(request.request.url.indexOf('/user/status?') !== -1 || request.request.url.indexOf('/user/data_assets?') !== -1) {
      request.getContent(function(responseBody) {
        APBP.VerifyAPBP(JSON.parse(responseBody));
        Profile.SetLupiCrystal(JSON.parse(responseBody));
      });
    }
    //check entering raid resources
    if(request.request.url.indexOf('/quest/treasure_raid')  !== -1) {
      request.getContent(function(responseBody) {
        Supplies.RaidTreasureInfo(JSON.parse(responseBody));
      });
    }
    if(request.request.url.indexOf('/quest/treasure_check_item')  !== -1) {
      request.getContent(function(responseBody) {
        Supplies.RaidTreasureCheck(JSON.parse(responseBody), request.request.url);
      });
    }
    //check limited quest
    if(request.request.url.indexOf('/quest/check_quest_start/') !== -1) {
      request.getContent(function(responseBody) {
        //Message.ConsoleLog('network.js', 'test1');
        Message.MessageTabs({selectQuest: true});
        Quest.CheckDailyRaid(JSON.parse(responseBody), request.request.url);
        //Message.ConsoleLog('network.js', 'test2');
      });
    }
    //initialize quest -> SELECTING QUEST
    if(request.request.url.indexOf('/quest/quest_data/') !== -1) {
      request.getContent(function(responseBody) {
        APBP.InitializeQuest(JSON.parse(responseBody));
        Quest.InitializeQuest(JSON.parse(responseBody), request.request.url);
        Supplies.InitializeRaid(JSON.parse(responseBody), request.request.url);
        Message.MessageTabs({startQuest: {
          'name': JSON.parse(responseBody).chapter_name,
          'ap': JSON.parse(responseBody).action_point,
        }}, function(response) {
          Quest.InitializeQuestImg(response);
        });
        // chrome.runtime.sendMessage({enterQuest : {'name': JSON.parse(responseBody).chapter_name}}, function(response) {
        //   Message.ConsoleLog('network.js', response);
        //   //Quest.InitializeQuestImg(response);
        // })
      });
    }
    //start quest -> ACTUALLY ENTER THE QUEST
    if(request.request.url.indexOf('/quest/create_quest?') !== -1) {
      request.getContent(function(responseBody) {
        APBP.StartQuest(JSON.parse(responseBody));
        Quest.StartQuest(JSON.parse(responseBody));
        Supplies.EnterRaid(JSON.parse(responseBody));
      });
    }
    //CHECK IF HOSTING QUEST IS RAID
    if(request.request.url.indexOf('/quest/raid_info') !== -1) {
      request.getContent(function(responseBody) {
        Quest.CheckRaid(JSON.parse(responseBody));
      });
    }
    //PROGRESS TO NEXT STAGE IN QUEST
    if(request.request.url.indexOf('/raid/start.json') !== -1) {
      request.getContent(function(responseBody) {
        Quest.NextBattle(JSON.parse(responseBody));
      });
    }
    //quest page - check if currently in quest
    if(request.request.url.indexOf('quest/init_list/null?_=') !== -1) {
      request.getContent(function(responseBody) {
        Quest.CheckQuest(JSON.parse(responseBody));
      });
    }

    //quest loot
    if(request.request.url.indexOf('/result/data/') !== -1) {
      request.getContent(function(responseBody) {
        Quest.CompleteQuest(JSON.parse(responseBody));
        Profile.CompleteQuest(JSON.parse(responseBody));
        Supplies.GetLoot(JSON.parse(responseBody));
      });
    }
    //initialize raid -> SELECTING RAID
    if(request.request.url.indexOf('/quest/assist_list') !== -1) {
      request.getContent(function(responseBody) {
        APBP.InitializeRaid(JSON.parse(responseBody));
        if(request.request.url.indexOf('/0/') !== -1) {
          Quest.InitializeRaid(JSON.parse(responseBody), 'normal');
        } else {
          Quest.InitializeRaid(JSON.parse(responseBody), 'event');
        }
      });
      Message.MessageTabs({checkRaids: true}, function(response) {
        
      });
    }
    //initialize raid through code
    if(request.request.url.indexOf('/quest/battle_key_check') !== -1) {
      request.getContent(function(responseBody) {
        APBP.InitializeRaidCode(JSON.parse(responseBody));
        Quest.InitializeRaidCode(JSON.parse(responseBody));
      });
    }
    //join raid
    if(request.request.url.indexOf('/quest/raid_deck_data_create') !== -1) {
      request.getContent(function(responseBody) {
        APBP.StartRaid(JSON.parse(responseBody));
        Quest.EnterRaid(JSON.parse(responseBody));
      });
    }
    //enter raid
    if(request.request.url.indexOf('/multiraid/start.json?_=') !== -1) {
      request.getContent(function(responseBody) {
        //APBP.StartRaid(JSON.parse(responseBody));
      });
    }
    //check raid complete
    if(request.request.url.indexOf('/resultmulti/check_reward/') !== -1) {
      request.getContent(function(responseBody) {
        //APBP.ClearRaid(JSON.parse(responseBody), url);
        Quest.CheckRaidReward(JSON.parse(responseBody), request.request.url);
      });
    }
    //raid loot
    if(request.request.url.indexOf('/resultmulti/data/') !== -1) {
      request.getContent(function(responseBody) {
        Quest.CompleteRaid(JSON.parse(responseBody), request.request.url);
        Supplies.GetLoot(JSON.parse(responseBody));
        Profile.CompleteRaid(JSON.parse(responseBody));       
        Dailies.CompleteCoop(JSON.parse(responseBody));
        Dailies.CompleteRaid(JSON.parse(responseBody));
        //APBP.RestoreAPBP(JSON.parse(responseBody));
      });
    }
    //set coop room
    if(request.request.url.indexOf('/coopraid/room_quest_setting') !== -1) {
      request.getContent(function(responseBody) {
        Quest.InitializeCoop(JSON.parse(responseBody));
      });
    }
    //enter coop room
    if(request.request.url.indexOf('/coopraid/content/room/') !== -1) {
      request.getContent(function(responseBody) {
        Quest.EnterCoop(JSON.parse(responseBody));
      });
    }
    //restore ap/bp
    if(request.request.url.indexOf('/quest/user_item/') !== -1) {
      request.getContent(function(responseBody) {
        APBP.RestoreAPBP(JSON.parse(responseBody));
        Supplies.UseRecovery(JSON.parse(responseBody), request.request.url);
      });
    }
    //gacha
    if(request.request.url.indexOf('/gacha/list?_=') !== -1) {
      request.getContent(function(responseBody) {
        Dailies.SetDraws(JSON.parse(responseBody));
      });
    }
    if(request.request.url.indexOf('/gacha/normal/result//normal/6?_=') !== -1) {
      request.getContent(function(responseBody) {
        Dailies.DecDraws(JSON.parse(responseBody));
        Profile.LupiDraw(JSON.parse(responseBody));
      })
    } 
    if(request.request.url.indexOf('/gacha/result//legend') !== -1) {
      request.getContent(function(responseBody) {
        Dailies.DecDraws(JSON.parse(responseBody));
        Profile.CrystalDraw(JSON.parse(responseBody));
      })
    }

    
    //co-op dailies
    if(request.request.url.indexOf('/coopraid/daily_mission?_=') !== -1) {
      request.getContent(function(responseBody) {
        Dailies.SetCoop(JSON.parse(responseBody));
      })
    }
    //casino list
    if(request.request.url.indexOf('/casino/article_list/1/1?_=') !== -1 || request.request.url.indexOf('/casino/article_list/undefined/1?_=') !== -1) {
      request.getContent(function(responseBody) {
        Casino.SetCasino1(JSON.parse(responseBody));
        Profile.SetChips(JSON.parse(responseBody).medal.number);
      })
    }
    if(request.request.url.indexOf('/casino/article_list/undefined/2?_=') !== -1) {
      request.getContent(function(responseBody) {
        Casino.SetCasino2(JSON.parse(responseBody));
        Profile.SetChips(JSON.parse(responseBody).medal.number);
      })
    }
    //casino buy
    if(request.request.url.indexOf('/casino/exchange?_=') !== -1) {
      request.getContent(function(responseBody) {
        Casino.BuyCasino(JSON.parse(responseBody));
        Supplies.BuyCasino(JSON.parse(responseBody), JSON.stringify(request.request.postData).replace(/:/g, '').replace(/,/g, '').split('\\\"'));
      })

    }
    if(request.request.url.indexOf('/twitter/twitter_info/') !== -1) {
      request.getContent(function(responseBody) {
        Dailies.CheckTweet(JSON.parse(responseBody));
      })

    }
    if(request.request.url.indexOf('/twitter/tweet?_=') !== -1) {
      request.getContent(function(responseBody) {
        Dailies.UseTweet(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/item/normal_item_list') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetRecovery(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/item/evolution_items') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetPowerUp(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/item/article_list') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetTreasure(JSON.parse(responseBody));
      })
    }
        if(request.request.url.indexOf('/item/gacha_ticket_list') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetDraw(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/present/possessed') !== -1) {
      request.getContent(function(responseBody) {
        Profile.CheckWeaponSummon(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/present/receive?') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.GetGift(JSON.parse(responseBody));
        Profile.GetGift(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/present/receive_all?') !== -1 || request.request.url.indexOf('/present/term_receive_all?') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.GetAllGifts(JSON.parse(responseBody));
        Profile.GetAllGifts(JSON.parse(responseBody));
      })
    }
    //treasure trade purchase
    if(request.request.url.indexOf('/shop_exchange/purchase/') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.PurchaseItem(JSON.parse(responseBody));
        Dailies.PurchaseMoon(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/weapon/list/') !== -1) {
      request.getContent(function(responseBody) {
        Profile.SetWeaponNumber(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/npc/list/') !== -1) {
      request.getContent(function(responseBody) {
        Profile.SetCharacterNumber(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/summon/list/') !== -1) {
      request.getContent(function(responseBody) {
        Profile.SetSummonNumber(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/container/move?') !== -1) {
      request.getContent(function(responseBody) {
        Profile.MoveFromStash(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/listall/move?') !== -1) {
      request.getContent(function(responseBody) {
        Profile.MoveToStash(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/shop/point_list') !== -1) {
      request.getContent(function(responseBody) {
        Profile.SetDrops(JSON.parse(responseBody));
      })
    }
    //Moon shop
    if(request.request.url.indexOf('/shop_exchange/article_list/5/1/1/null/null/null?') !== -1 || request.request.url.indexOf('/shop_exchange/article_list/5/1/1/null/null/3?') !== -1) {
      request.getContent(function(responseBody) {
        Dailies.CheckMoons(JSON.parse(responseBody));
      })
    }
    //do shop
    if(request.request.url.indexOf('/shop_exchange/article_list/10/1/1/null/null/') !== -1) {
      request.getContent(function(responseBody) {
        Profile.SetDefense(JSON.parse(responseBody));
        Dailies.CheckDefense(JSON.parse(responseBody), request.request.url);
      })
    }
    if(request.request.url.indexOf('/shop/purchase') !== -1) {
      request.getContent(function(responseBody) {
        Profile.SpendCrystals(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/npc/list') !== -1 || request.request.url.indexOf('/weapon/list') !== -1 || request.request.url.indexOf('/summon/list') !== -1) {
      request.getContent(function(responseBody) {
        Profile.SetInventoryCount(JSON.parse(responseBody), request.request.url);
      })
    }
    if(request.request.url.indexOf('mbp/mbp_info') !== -1) {
      request.getContent(function(responseBody) {
        Dailies.CheckRenown(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('evolution_weapon/evolution?') !== -1 || request.request.url.indexOf('evolution_summon/evolution?') !== -1) {
      request.getContent(function(responseBody) {
        Profile.Uncap(JSON.parse(responseBody));
        Profile.BuyUncap();
      })
    }
    if(request.request.url.indexOf('evolution_weapon/item_evolution?') !== -1 || request.request.url.indexOf('evolution_summon/item_evolution?') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.Uncap(JSON.parse(responseBody));
        Profile.BuyUncap();
      })
    }
    if(request.request.url.indexOf('item/evolution_items/') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.CheckUncapItem(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('item/evolution_item_one') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetUncapItem(JSON.parse(responseBody));
        Profile.SetUncapItem(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('weapon/weapon_base_material?') !== -1 || request.request.url.indexOf('summon/summon_base_material?') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetUncap(JSON.parse(responseBody));
        Profile.SetUncap(JSON.parse(responseBody), request.request.url);
      })
    }
    if(request.request.url.indexOf('npc/evolution_materials') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetNpcUncap(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('evolution_npc/item_evolution?') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.NpcUncap(JSON.parse(responseBody));
        Profile.BuyUncap();
      })
    }
    if(request.request.url.indexOf('weapon/weapon_material') !== -1 || 
       request.request.url.indexOf('summon/summon_material') !== -1 ||
       request.request.url.indexOf('npc/npc_material') !== -1) {
      request.getContent(function(responseBody) {
        Profile.SetUpgrade(JSON.parse(responseBody), request.request.url);
      })
    }
    if(request.request.url.indexOf('enhancement_weapon/enhancement') !== -1 ||
       request.request.url.indexOf('enhancement_summon/enhancement') !== -1 ||
       request.request.url.indexOf('enhancement_npc/enhancement') !== -1) {
      request.getContent(function(responseBody) {
        Profile.Upgrade(JSON.parse(responseBody));
      })
    }

    if(request.request.url.indexOf('/shop_exchange/activate_personal_support?_=') !== -1) {
      // request.getContent(function(responseBody) {
      //   Dailies.UseTweet(JSON.parse(responseBody));
      // })
      //request payload
      //support_id int
      //support_level int
      //support_time string
      //success:true
      //Message.ConsoleLog(Object.keys(request.request));
      Buffs.StartBuff(JSON.stringify(request.request.postData).replace(/:/g, '').replace(/,/g, '').split('\\\"'));
    }
    if(request.request.url.indexOf('/sell_article/execute') !== -1) {
      Supplies.SellCoop(JSON.stringify(request.request.postData).replace(/:/g, '').replace(/,/g, '').split('\\\"'));
      // Profile.SellCoop(request.request.postData);
      //Profile.SellCoop(JSON.stringify(request.request.postData).replace(/:/g, '').replace(/,/g, '').split('\\\"'));
      //Message.ConsoleLog(request.request.text.postData.split('\"'));
      // request.getContent(function(responseBody) {
      //   Profile.SetShop(JSON.parse(responseBody));
      // })
    }
      // request.getContent(function(responseBody) {
      //   Dailies.UseTweet(JSON.parse(responseBody));
      // })
      //request payload
      //support_id int
      //support_level int
      //support_time string
      //success:true
      //Message.ConsoleLog(Object.keys(request.request));
      // Message.ConsoleLog(request.request.method);
       //Message.ConsoleLog(JSON.stringify(request));


  }
})();