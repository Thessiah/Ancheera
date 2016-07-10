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
      if(request.request.url.indexOf('.css') !== -1 && request.request.url.indexOf('/css/common/index.css') === -1) {
        chrome.runtime.sendMessage({pageLoad : true}, function(response) {
          if(!Default.IsInitialized() && response.pageLoad.indexOf('#mypage') !== -1) {
            
            Default.Initialize();
          }
        });
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
    //verify current ap/ep
    if(request.request.url.indexOf('/user/status?') !== -1 || request.request.url.indexOf('/user/data_assets?') !== -1) {
      request.getContent(function(responseBody) {
        APBP.VerifyAPBP(JSON.parse(responseBody));
      });
    }
    //initialize quest
    if(request.request.url.indexOf('/quest/quest_data/') !== -1) {
      request.getContent(function(responseBody) {
        APBP.InitializeQuest(JSON.parse(responseBody));
        Quest.InitializeQuest(JSON.parse(responseBody));
      });
    }
    //start quest
    if(request.request.url.indexOf('/quest/create_quest?') !== -1) {
      request.getContent(function(responseBody) {
        APBP.StartQuest(JSON.parse(responseBody));
        Quest.StartQuest(JSON.parse(responseBody));
      });
    }
    //complete quest
    if(request.request.url.indexOf('/result/data/') !== -1) {
      request.getContent(function(responseBody) {
        Quest.CompleteQuest(JSON.parse(responseBody));
      });
    }
    //initialize raid
    if(request.request.url.indexOf('/quest/assist_list') !== -1) {
      request.getContent(function(responseBody) {
        APBP.InitializeRaid(JSON.parse(responseBody));
      });
    }
    //start raid
    if(request.request.url.indexOf('/quest/raid_deck_data_create') !== -1) {
      request.getContent(function(responseBody) {
        APBP.StartRaid(JSON.parse(responseBody));
      });
    }
    //clear raid
    if(request.request.url.indexOf('/resultmulti/check_reward/') !== -1) {
      request.getContent(function(responseBody) {
        APBP.ClearRaid(JSON.parse(responseBody));
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
    if(request.request.url.indexOf('/casino/article_list/') !== -1) {
      if(request.request.url.indexOf('/casino/article_list/1/1?_=') !== -1) {
        request.getContent(function(responseBody) {
          Casino.SetCasino(JSON.parse(responseBody));
        })
      }
    }
    //casino buy
    if(request.request.url.indexOf('/casino/exchange?_=') !== -1) {
      request.getContent(function(responseBody) {
        Casino.BuyCasino(JSON.parse(responseBody));
      })

    }
    if(request.request.url.indexOf('/twitter/twitter_info/') !== -1) {
      request.getContent(function(responseBody) {
        Dailies.SetTweet(JSON.parse(responseBody));
      })

    }
    if(request.request.url.indexOf('/twitter/tweet?_=') !== -1) {
      request.getContent(function(responseBody) {
        Dailies.SetTweet(JSON.parse(responseBody));
      })
    }

  }
})();