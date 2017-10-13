//I want namespaces n stuff
window.BackgroundMessageActionCollection = {
    performRequestAction: performRequestAction,
    performConnectPageLoad: performConnectPageLoad
};

function performConnectPageLoad(connection) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, {
                pageLoad: tabs[0].url
            });
            connection.postMessage({
                pageLoad: tabs[0].url
            });
            var index = tabs[0].url.indexOf('#quest/supporter/');
            if (index !== -1) {
                Message.PostAll({
                    'setClick': {
                        'id': '#quest-repeat',
                        'value': tabs[0].url.slice(index)
                    }
                });
            } else {
                index = tabs[0].url.indexOf('#event/');
                if (index !== -1 && tabs[0].url.indexOf('/supporter/') !== -1) {
                    Message.PostAll({
                        'setClick': {
                            'id': '#quest-repeat',
                            'value': tabs[0].url.slice(index)
                        }
                    });
                }
            }
        }
    });
}

function performRequestAction(message) {
    //verify current ap/ep
    if (message.request.url.indexOf('/user/status?') !== -1 ||
        message.request.url.indexOf('/user/data_assets?') !== -1 ||
        message.request.url.indexOf('/user/content/index?') !== -1 ||
        message.request.url.indexOf('/quest/content/') !== -1 ||
        message.request.url.indexOf('/coopraid/content/') !== -1) {
        APBP.VerifyAPBP(message.request.response);
        Profile.SetLupiCrystal(message.request.response);
    }
    //check entering raid resources
    if (message.request.url.indexOf('/quest/treasure_raid') !== -1) {
        Supplies.RaidTreasureInfo(message.request.response);
    }
    //check limited quest
    if (message.request.url.indexOf('/quest/check_quest_start/') !== -1) {
        Quest.CheckDailyRaid(message.request.response, message.request.url);
    }
    if (message.request.url.indexOf('/quest/content/newindex/') !== -1) {
        Quest.UpdateInProgress(message.request.response, message.id);
    }
    //initialize quest -> SELECTING QUEST
    if (message.request.url.indexOf('/quest/quest_data/') !== -1) {
        APBP.InitializeQuest(message.request.response);
    }
    //start quest -> ACTUALLY ENTER THE QUEST
    if (message.request.url.indexOf('/quest/create_quest?') !== -1) {
        Quest.CreateQuest(message.request.response, message.request.payload, message.id);
        APBP.StartQuest(message.request.response, message.request.payload);
        Dailies.DecPrimarchs(message.request.payload);
    }
    if (message.request.url.indexOf('/quest/raid_info?') !== -1) {
        Quest.CheckMulti(message.request.response);
        //is_multi
    }

    //quest loot
    // if(message.request.url.indexOf('/result/content/') !== -1) {
    //   Supplies.GetLoot(message.request.response.option.result_data);
    //   Profile.CompleteQuest(message.request.response.option.result_data);
    // }
    if (message.request.url.indexOf('/result/data/') !== -1) {
        Supplies.GetLoot(message.request.response);
        Profile.CompleteQuest(message.request.response);
    }
    // //initialize raid -> SELECTING RAID
    // if(message.request.url.indexOf('/quest/assist_list') !== -1) {
    //     APBP.InitializeRaid(message.request.response);
    // }
    // //initialize raid through code
    // if(message.request.url.indexOf('/quest/battle_key_check') !== -1) {
    //     APBP.InitializeRaidCode(message.request.response);
    // }
    //join raid
    if (message.request.url.indexOf('/quest/raid_deck_data_create') !== -1) {
        APBP.StartRaid(message.request.response, message.request.payload);
        Quest.CreateRaid(message.request.response, message.id);
    }
    // if(message.request.url.indexOf('/check_reward/') !== -1) {
    //   Quest.CompleteQuest(message.request.url);
    // }
    //raid loot
    // if(message.request.url.indexOf('/resultmulti/content/') !== -1) {
    //     Supplies.GetLoot(message.request.response.option.result_data);
    //     Profile.CompleteRaid(message.request.response.option.result_data);
    //     Dailies.CompleteCoop(message.request.response.option.result_data);
    //     Dailies.CompleteRaid(message.request.response.option.result_data);
    // }
    if (message.request.url.indexOf('/resultmulti/data/') !== -1) {
        Supplies.GetLoot(message.request.response);
        Profile.CompleteRaid(message.request.response);
        Dailies.CompleteCoop(message.request.response);
        Dailies.CompleteRaid(message.request.response);
    }
    if (message.request.url.indexOf('retire.json') !== -1) {
        Quest.AbandonQuest(message.request.payload);
    }

    //restore ap/bp
    if (message.request.url.indexOf('/quest/user_item') !== -1) {
        APBP.RestoreAPBP(message.request.response);
        Supplies.UseRecovery(message.request.response, message.request.payload);
    }
    //gacha
    if (message.request.url.indexOf('/gacha/list?_=') !== -1) {
        Dailies.SetDraws(message.request.response);
    }
    if (message.request.url.indexOf('/gacha/normal/result//normal/6?_=') !== -1) {
        Dailies.DecDraws(message.request.response);
        Profile.LupiDraw(message.request.response);
    }
    if (message.request.url.indexOf('/gacha/result//legend') !== -1) {
        Dailies.DecDraws(message.request.response);
        //Profile.CrystalDraw(message.request.response);
    }
    //co-op dailies
    if (message.request.url.indexOf('/coopraid/daily_mission?_=') !== -1) {
        Dailies.SetCoop(message.request.response);
    }
    //casino list
    if (message.request.url.indexOf('/casino/article_list/1/1?_=') !== -1 || message.request.url.indexOf('/casino/article_list/undefined/1?_=') !== -1) {
        Casino.SetCasino1(message.request.response);
        Profile.SetChips(message.request.response.medal.number);
    }
    if (message.request.url.indexOf('/casino/article_list/undefined/2?_=') !== -1) {
        Casino.SetCasino2(message.request.response);
        Profile.SetChips(message.request.response.medal.number);
    }
    //casino buy
    if (message.request.url.indexOf('/casino/exchange?_=') !== -1) {
        Casino.BuyCasino(message.request.response, message.request.payload);
        Supplies.BuyCasino(message.request.response, message.request.payload);
    }
    if (message.request.url.indexOf('/twitter/twitter_info/') !== -1) {
        Dailies.CheckTweet(message.request.response);
        Quest.CopyTweet(message.request.response);
    }
    if (message.request.url.indexOf('/twitter/tweet?_=') !== -1) {
        Dailies.UseTweet(message.request.response);
    }
    if (message.request.url.indexOf('/item/normal_item_list') !== -1) {
        Supplies.SetRecovery(message.request.response);
    }
    if (message.request.url.indexOf('/item/evolution_items') !== -1) {
        Supplies.SetPowerUp(message.request.response);
    }
    if (message.request.url.indexOf('/item/article_list') !== -1) {
        Supplies.SetTreasure(message.request.response);
    }
    if (message.request.url.indexOf('/item/gacha_ticket_list') !== -1) {
        Supplies.SetDraw(message.request.response);
    }
    if (message.request.url.indexOf('/present/possessed') !== -1) {
        Profile.CheckWeaponSummon(message.request.response);
    }
    if (message.request.url.indexOf('/present/receive?') !== -1) {
        Supplies.GetGift(message.request.response);
        Profile.GetGift(message.request.response);
    }
    if (message.request.url.indexOf('/present/receive_all?') !== -1 || message.request.url.indexOf('/present/term_receive_all?') !== -1) {
        Supplies.GetAllGifts(message.request.response);
        Profile.GetAllGifts(message.request.response);
    }
    //treasure trade purchase
    if (message.request.url.indexOf('/shop_exchange/purchase/') !== -1) {
        Supplies.PurchaseItem(message.request.response);
        Profile.PurchaseItem(message.request.response);
        Dailies.PurchaseDistinction(message.request.response);
    }
    if (message.request.url.indexOf('/weapon/list/') !== -1) {
        Profile.SetWeaponNumber(message.request.response);
    }
    if (message.request.url.indexOf('/npc/list/') !== -1) {
        Profile.SetCharacterNumber(message.request.response, message.request.url);
    }
    if (message.request.url.indexOf('/summon/list/') !== -1) {
        Profile.SetSummonNumber(message.request.response);
    }
    if (message.request.url.indexOf('/container/move?') !== -1) {
        Profile.MoveFromStash(message.request.response);
    }
    if (message.request.url.indexOf('/listall/move?') !== -1) {
        Profile.MoveToStash(message.request.response);
    }
    if (message.request.url.indexOf('/shop/point_list') !== -1) {
        Profile.SetDrops(message.request.response);
    }
    //Moon shop
    if (message.request.url.indexOf('/shop_exchange/article_list/5/1/1/null/null/null?') !== -1 || message.request.url.indexOf('/shop_exchange/article_list/5/1/1/null/null/3?') !== -1) {
        Dailies.CheckMoons(message.request.response);
    }
    //do shop
    if (message.request.url.indexOf('/shop_exchange/article_list/10/1/1/null/null/') !== -1) {
        Profile.SetDefense(message.request.response);
        //Dailies.CheckDefense(message.request.response, message.request.url);
    }
    //prestige
    if (message.request.url.indexOf('/shop_exchange/article_list/6/1/') !== -1) {
        Dailies.SetDistinctions(message.request.response);
        //Dailies.CheckDefense(message.request.response, message.request.url);
    }
    if (message.request.url.indexOf('/shop/purchase') !== -1) {
        Profile.SpendCrystals(message.request.response);
    }
    if (message.request.url.indexOf('mbp/mbp_info') !== -1 || message.request.url.indexOf('/user/content/index?') !== -1) {
        Dailies.CheckRenown(message.request.response);
    }
    if (message.request.url.indexOf('evolution_weapon/evolution?') !== -1 || message.request.url.indexOf('evolution_summon/evolution?') !== -1) {
        Profile.Uncap(message.request.response);
        Profile.BuyUncap();
    }
    if (message.request.url.indexOf('evolution_weapon/item_evolution?') !== -1 || message.request.url.indexOf('evolution_summon/item_evolution?') !== -1) {
        Supplies.Uncap(message.request.response);
        Profile.BuyUncap();
    }
    if (message.request.url.indexOf('item/evolution_items/') !== -1) {
        Supplies.CheckUncapItem(message.request.response);
    }
    if (message.request.url.indexOf('item/evolution_item_one') !== -1) {
        Supplies.SetUncapItem(message.request.response);
        Profile.SetUncapItem(message.request.response);
    }
    if (message.request.url.indexOf('weapon/weapon_base_material?') !== -1 || message.request.url.indexOf('summon/summon_base_material?') !== -1) {
        Supplies.SetUncap(message.request.response);
        Profile.SetUncap(message.request.response, message.request.url);
    }
    if (message.request.url.indexOf('npc/evolution_materials') !== -1) {
        Supplies.SetNpcUncap(message.request.response);
    }
    if (message.request.url.indexOf('evolution_npc/item_evolution?') !== -1) {
        Supplies.NpcUncap(message.request.response);
        Profile.BuyUncap();
    }
    if (message.request.url.indexOf('weapon/weapon_material') !== -1 ||
        message.request.url.indexOf('summon/summon_material') !== -1 ||
        message.request.url.indexOf('npc/npc_material') !== -1) {
        Profile.SetUpgrade(message.request.response, message.request.url);
    }
    if (message.request.url.indexOf('enhancement_weapon/enhancement') !== -1 ||
        message.request.url.indexOf('enhancement_summon/enhancement') !== -1 ||
        message.request.url.indexOf('enhancement_npc/enhancement') !== -1) {
        Profile.Upgrade(message.request.response);
    }

    if (message.request.url.indexOf('/shop_exchange/activate_personal_support?_=') !== -1) {
        Buffs.StartBuff(message.request.response, message.request.payload);
    }
    if (message.request.url.indexOf('/sell_article/execute') !== -1) {
        Supplies.SellCoop(message.request.response, message.request.payload);
        //Supplies.SellCoop(JSON.stringify(request.request.postData).replace(/:/g, '').replace(/,/g, '').split('\\\"'));
        // Profile.SellCoop(request.request.postData);
        //Profile.SellCoop(JSON.stringify(request.request.postData).replace(/:/g, '').replace(/,/g, '').split('\\\"'));
        //Message.ConsoleLog(request.request.text.postData.split('\"'));
        // request.getContent(function(responseBody) {
        //   Profile.SetShop(message.request.response);
        // })
    }
    if (message.request.url.indexOf('/raid/start.json?_=') !== -1 || message.request.url.indexOf('/multiraid/start.json?_=') !== -1) {
        Quest.StartBattle(message.request.response, message.id);
    }
    if (message.request.url.indexOf('/normal_attack_result.json?_=') !== -1 || message.request.url.indexOf('/ability_result.json?_=') !== -1 || message.request.url.indexOf('/summon_result.json?_=') !== -1) {
        Quest.BattleAction(message.request.response, message.request.payload, message.id);
    }
    if (message.request.url.indexOf('/quest/init_list') !== -1) {
        Quest.SetCurrentQuest(message.request.response);
    }
    if (message.request.url.indexOf('/quest/assist_list') !== -1) {
        Quest.CheckJoinedRaids(message.request.response);
    }
    if (message.request.url.indexOf('/gacha/list?') !== -1) {
        Dailies.CheckGacha(message.request.response);
    }
    if (message.request.url.indexOf('/gacha/legend/campaign') !== -1) {
        Dailies.RollCampaign(message.request.response, message.request.payload);
    }
    if (message.request.url.indexOf('/quest/content/newextra') !== -1) {
        Dailies.SetPrimarchs(message.request.response);
    }
}