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
    if(request.request.url.indexOf('http://gbf.game.mbga.jp/') !== -1) {
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
      })
    }
    if(request.request.url.indexOf('/casino/article_list/undefined/2?_=') !== -1) {
      request.getContent(function(responseBody) {
        Casino.SetCasino2(JSON.parse(responseBody));
      })
    }
    //casino buy
    if(request.request.url.indexOf('/casino/exchange?_=') !== -1) {
      request.getContent(function(responseBody) {
        Casino.BuyCasino(JSON.parse(responseBody));
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
    if(request.request.url.indexOf('/item/normal_item_list/') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetRecovery(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/item/evolution_items/') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetPowerUp(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/item/article_list/') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetTreasure(JSON.parse(responseBody));
      })
    }
        if(request.request.url.indexOf('/item/gacha_ticket_list/') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetDraw(JSON.parse(responseBody));
      })
    }
        if(request.request.url.indexOf('/item/others_items/') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.SetOther(JSON.parse(responseBody));
      })
    }
    if(request.request.url.indexOf('/item/others_items/') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.GetGifts(JSON.parse(responseBody));
      })
    }
    //treasure trade purchase
    if(request.request.url.indexOf('/shop_exchange/purchase/') !== -1) {
      request.getContent(function(responseBody) {
        Supplies.PurchaseItem(JSON.parse(responseBody));
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
      Message.ConsoleLog(JSON.stringify(request));
      Message.ConsoleLog(JSON.stringify(request.request.postData));

    }
        if(request.request.url.indexOf('/ob/r?t=') !== -1) {
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


  }
})();