(function() {
    var nextQuest = null;
    var nextCoop = null;
    var currCoop = null;
    var nextRaids = null;
    var isMagFest = false;
    var nextRaids = {};
    var currRaids = [];
    var imageURL = '../../assets/images/';
    var greyIcon = '../../assets/images/icons/6201763.png';
    var blankIcon = '../../assets/images/icons/handtinytrans.gif';
    var eyeIcon = '../../assets/images/icons/5100123.png';
    var dogeIcon = '../../assets/images/icons/1300023.png';
    var raidImageURL = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/summon/qm/';
    var isHL = false;

    var currRaidID = null;
    var currCoopID = null;

    //var mainCharacterImageURL = "http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/leader/raid_normal/";
    //var characterImageURL = "http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/npc/raid_normal/";
    var mainCharacterImageURL = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/leader/quest/';
    var characterImageURL = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/npc/quest/';
    var enemyImageURL = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/enemy/s/';
    var skillImageURL = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/ui/icon/ability/m/';
    var skillImageClosingURL = '.png?1458197995';
    var buffImageURL = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/ui/icon/status/x64/';
    var summonImageURL = 'http://gbf.game-a.mbga.jp/assets_en/img/sp/assets/summon/m/';
    var remainingQuests = {
        '300011' : null,
        '300021' : null,
        '300031' : null,
        '300041' : null,
        '300051' : null,
        '300421' : null,
        '301381' : null,
        '300441' : null,
        '300451' : null,

        '300061' : null,
        '300071' : null,
        '300081' : null,
        '300091' : null,
        '300101' : null,
        '300411' : null,
        '301071' : null,
        '300491' : null,
        '300501' : null,

        '300111' : null,
        '300121' : null,
        '300141' : null,
        '300151' : null,
        '300161' : null,
        '300381' : null,
        '300481' : null,
        '300511' : null,
        '300521' : null,

        '300171' : null,
        '300181' : null,
        '300191' : null,
        '300261' : null,
        '300391' : null,
        '301371' : null,
        '300531' : null,
        '300541' : null,

        '300201' : null,
        '300211' : null,
        '300221' : null,
        '300271' : null,
        '300431' : null,
        '300461' : null,
        '300561' : null,
        '300571' : null,

        '300231' : null,
        '300241' : null,
        '300251' : null,
        '300281' : null,
        '300401' : null,
        '300551' : null,
        '300581' : null,
        '300591' : null,

        '300291' : null,
        '301051' : null,
        '300471' : null,
        '301061' : null,
    };
    var createRaid = function(sequence, sequence2, name, max, magDelta, url, animeIDs, animeCounts, animeTypes, isHL) {
        return {
            sequence: sequence,
            sequence2: sequence2,
            name: name,
            max: max,
            magDelta: magDelta,
            url: imageURL + 'quests/' + url,
            animeIDs: animeIDs,
            animeCounts: animeCounts,
            animeTypes: animeTypes,
            isHL: isHL,
            isEnabled: true,
        };
    };
    var raidList = [
        '300011', '300021', '300031', '300041', '300051', '300421', '301381', '300441', '300451',
        '300061', '300071', '300081', '300091', '300101', '300411', '301071', '300491', '300501',
        '300111', '300121', '300141', '300151', '300161', '300381', '300481', '300511', '300521',
        '300171', '300181', '300191', '300261', '300391', '301371', '300531', '300541',
        '300201', '300211', '300221', '300271', '300431', '300461', '300561', '300571',
        '300231', '300241', '300251', '300281', '300401', '300551', '300581', '300591',
        '300291', '301051', '300471', '301061'
    ];

    //   var currRaidList = [
    //   '300031', '300041', '300051', '300441',
    //   '300081', '300091', '300101', '300491',
    //   '300141', '300151', '300161', '300511',
    //   '300181', '300191', '300261', '300531',
    //   '300211', '300221', '300271', '300561',
    //   '300241', '300251', '300281', '300581'
    // ]
    var currRaidList = [];
    var hiddenRaidList = [];
    var completedRaidList = [];

    var raidInfo = {
        '300011' : createRaid(1, 1, 'Griffin (N)', 3, 2, '2030003000.jpg', null, null, null, false),
        '300021' : createRaid(2, 4, 'Griffin (H)', 3, 2, '2030003000_hard.jpg', null, null, null, false),
        '300031' : createRaid(3, 10, 'Tiamat (N)', 3, 2, '2030000000.jpg', null, null, null, false),
        '300041' : createRaid(4, 16, 'Tiamat (H)', 3, 2, '2030000000_hard.jpg', null, null, null, false),
        '300051' : createRaid(5, 22, 'Tiamat (EX)', 3, 2, '2040020000_ex.jpg', ['18'], [3], ['raid'], false),
        '300421' : createRaid(6, 28, 'Nezha (EX)', 2, 0, '2040042000_ex.jpg', ['1343', '1141'], [50, 6], ['material', 'material'], false),
        '301381' : createRaid(7, 34, 'Garuda (EX)', 2, 0, '2040071000_ex.jpg', ['1343', '1141'], [50, 6], ['material', 'material'], false),
        '300441' : createRaid(8, 42, 'Tiamat (HL)', 2, 0, '2040020000_high.jpg', ['32'], [3], ['raid'], true),
        '300451' : createRaid(9, 49, 'Nezha (HL)', 1, 0, '2040042000_high.jpg', ['44'], [1], ['raid'], true),

        '300061' : createRaid(10, 2, 'Flame (N)', 3, 2, '2020018001.jpg', null, null, null, false),
        '300071' : createRaid(11, 5, 'Flame (H)', 3, 2, '2020018001_hard.jpg', null, null, null, false),
        '300081' : createRaid(12, 11, 'Colossus (N)', 3, 2, '2030001000.jpg', null, null, null, false),
        '300091' : createRaid(13, 17, 'Colossus (H)', 3, 2, '2030001000_hard.jpg', null, null, null, false),
        '300101' : createRaid(16, 25, 'Colossus (EX)', 3, 2, '2040034000_ex.jpg', ['19'], [3], ['raid'], false),
        '300411' : createRaid(14, 29, 'Elements (EX)', 2, 0, '2040063000_ex.jpg', ['1313', '1111'], [50, 6], ['material', 'material'], false),
        '301071' : createRaid(15, 35, 'Athena (EX)', 2, 0, '2040021000_ex.jpg', ['1313', '1111'], [50, 6], ['material', 'material'], false),
        '300491' : createRaid(17, 43, 'Colossus (HL)', 2, 0, '2040034000_high.jpg', ['47'], [3], ['raid'], true),
        '300501' : createRaid(18, 50, 'Elements (HL)', 1, 0, '2040063000_high.jpg', ['41'], [1], ['raid'], true),

        '300111' : createRaid(19, 3, 'Guard (N)', 3, 2, '2030013001.jpg', null, null, null, false),
        '300121' : createRaid(20, 6, 'Guard (H)', 3, 2, '2030013001_hard.jpg', null, null, null, false),
        '300141' : createRaid(21, 12, 'Leviathan (N)', 3, 2, '2030011000.jpg', null, null, null, false),
        '300151' : createRaid(22, 18, 'Leviathan (H)', 3, 2, '2030011000_hard.jpg', null, null, false),
        '300161' : createRaid(23, 23, 'Leviathan (EX)', 3, 2, '2040028000_ex.jpg', ['20'], [3], ['raid'], false),
        '300381' : createRaid(24, 30, 'Macula (EX)', 2, 0, '2040002000_ex.jpg', ['1323', '1121'], [50, 6], ['material', 'material'], false),
        '300481' : createRaid(25, 36, 'Grani (EX)', 2, 0, '2040007000_ex.jpg', ['1323', '1121'], [50, 6], ['material', 'material'], false),
        '300511' : createRaid(26, 44, 'Leviathan (HL)', 2, 0, '2040028000_high.jpg', ['48'], [3], ['raid'], true),
        '300521' : createRaid(27, 51, 'Macula (HL)', 1, 0, '2040002000_high.jpg', ['42'], [1], ['raid'], true),

        '300171' : createRaid(28, 7, 'Dragon (H)', 3, 2, '2030004000_hard.jpg', null, null, null, false),
        '300181' : createRaid(29, 13, 'Yggdrasil (N)', 3, 2, '2030015000.jpg', null, null, null, false),
        '300191' : createRaid(30, 19, 'Yggdrasil (H)', 3, 2, '2030015000_hard.jpg', null, null, null, false),
        '300261' : createRaid(31, 24, 'Yggdrasil (EX)', 3, 2, '2040027000_ex.jpg', ['21'], [3], ['raid'], false),
        '300391' : createRaid(32, 31, 'Medusa (EX)', 2, 0, '2040059000_ex.jpg', ['1333', '1131'], [50, 6], ['material', 'material'], false),
        '301371' : createRaid(33, 37, 'Baal (EX)', 2, 0, '2040013000_ex.jpg', ['1333', '1131'], [50, 6], ['material', 'material'], false),
        '300531' : createRaid(34, 45, 'Yggdrasil (HL)', 2, 0, '2040027000_high.jpg', ['49'], [3], ['raid'], true),
        '300541' : createRaid(35, 52, 'Medusa (HL)', 1, 0, '2040059000_high.jpg', ['43'], [1], ['raid'], true),

        '300201' : createRaid(36, 8, 'Wisp (H)', 3, 2, '2030027000_hard.jpg', null, null, null, false),
        '300211' : createRaid(37, 14, 'Adversa (N)', 3, 2, '2030035000.jpg', null, null, null, false),
        '300221' : createRaid(38, 20, 'Adversa (H)', 3, 2, '2030035000_hard.jpg', null, null, null, false),
        '300271' : createRaid(39, 26, 'Luminiera (EX)', 3, 2, '2040047000_ex.jpg', ['26'], [3], ['raid'], false),
        '300431' : createRaid(40, 32, 'Apollo (EX)', 2, 0, '2040023000_ex.jpg', ['1353', '1151'], [50, 6], ['material', 'material'], false),
        '300461' : createRaid(41, 38, 'Odin (EX)', 2, 0, '2040029000_ex.jpg', ['1353', '1151'], [50, 6], ['material', 'material'], false),
        '300561' : createRaid(42, 46, 'Luminiera (HL)', 2, 0, '2040047000_high.jpg', ['50'], [3], ['raid'], true),
        '300571' : createRaid(43, 53, 'Apollo (HL)', 1, 0, '2040023000_high.jpg', ['45'], [1], ['raid'], true),

        '300231' : createRaid(44, 9, 'Eye (H)', 3, 2, '2030038000_hard.jpg', null, null, null, false),
        '300241' : createRaid(45, 15, 'Celeste (N)', 3, 2, '2030041000.jpg', null, null, null, false),
        '300251' : createRaid(46, 21, 'Celeste (H)', 3, 2, '2030041000_hard.jpg', null, null, null, false),
        '300281' : createRaid(47, 27, 'Celeste (EX)', 3, 2, '2040046000_ex.jpg', ['31'], [3], ['raid'], false),
        '300401' : createRaid(48, 33, 'Olivia (EX)', 2, 0, '2040005000_ex.jpg', ['1363', '1161'], [50, 6], ['material', 'material'], false),
        '300551' : createRaid(49, 39, 'Lich (EX)', 2, 0, '2040012000_ex.jpg', ['1363', '1161'], [50, 6], ['material', 'material'], false),
        '300581' : createRaid(50, 47, 'Celeste (HL)', 2, 0, '2040046000_high.jpg', ['51'], [3], ['raid'], true),
        '300591' : createRaid(51, 54, 'Olivia (HL)', 1, 0, '2040005000_high.jpg', ['46'], [1], ['raid'], true),

        '300291' : createRaid(52, 40, 'Bahamut (EX)', 3, 0, '2030002000_hell.jpg', ['58'], [1], ['raid'], false),
        '301051' : createRaid(53, 41, 'Grand (EX)', 2, 0, '2040065000_hell.jpg', ['82'], [1], ['raid'], false),
        '300471' : createRaid(54, 48, 'Rose (HL)', 1, 0, '2040105000_high.jpg', ['1204'], [10], ['material'], true),
        '301061' : createRaid(55, 55, 'Bahamut (HL)', 1, 0, '2040128000_hell.jpg', ['59'], [1], ['raid'], true),
    };

    var tweetHash = {
        'Lvl 20 Griffin': 'Lv20 グリフォン',
        'Lvl 30 Griffin': 'Lv30 グリフォン',
        'Lvl 30 Tiamat': 'Lv30 ティアマト',
        'Lvl 50 Tiamat': 'Lv50 ティアマト',
        'Lvl 50 Tiamat Omega': 'Lv50 ティアマト・マグナ',
        'Lvl 100 Nezha': 'Lv100 ナタク',
        'Lvl 100 Garuda': 'Lv100 ガルーダ',
        'Lvl 100 Tiamat Omega Ayr': 'Lv100 ティアマト・マグナ＝エア',
        'Lvl 120 Nezha': 'Lv120 ナタク',

        'Lvl 20 Zarchnal Flame': 'Lv20 ザリチュナルフレイム',
        'Lvl 30 Zarchnal Flame': 'Lv30 ザリチュナルフレイム',
        'Lvl 30 Colossus': 'Lv30 コロッサス',
        'Lvl 50 Colossus': 'Lv50 コロッサス',
        'Lvl 70 Colossus Omega': 'Lv70 コロッサス・マグナ',
        'Lvl 100 Twin Elements': 'Lv100 フラム＝グラス',
        'Lvl 100 Athena': 'Lv100 アテナ',
        'Lvl 100 Colossus Omega': 'Lv100 コロッサス・マグナ',
        'Lvl 120 Twin Elements': 'Lv120 フラム＝グラス',

        'Lvl 20 Imperial Guard': 'Lv20 インペリアルガード',
        'Lvl 30 Imperial Guard': 'Lv30 インペリアルガード',
        'Lvl 30 Leviathan': 'Lv30 リヴァイアサン',
        'Lvl 50 Leviathan': 'Lv50 リヴァイアサン',
        'Lvl 60 Leviathan Omega': 'Lv60 リヴァイアサン・マグナ',
        'Lvl 100 Macula Marius': 'Lv100 マキュラ・マリウス',
        'Lvl 100 Grani': 'Lv100 グラニ',
        'Lvl 100 Leviathan Omega': 'Lv100 リヴァイアサン・マグナ',
        'Lvl 120 Macula Marius': 'Lv120 マキュラ・マリウス',

        'Lvl 30 Ancient Dragon': 'Lv30 エンシェントドラゴン',
        'Lvl 30 Yggdrasil': 'Lv30 ユグドラシル',
        'Lvl 50 Yggdrasil': 'Lv50 ユグドラシル',
        'Lvl 60 Yggdrasil Omega': 'Lv60 ユグドラシル・マグナ',
        'Lvl 100 Medusa': 'Lv100 メドゥーサ',
        'Lvl 100 Baal': 'Lv100 バアル',
        'Lvl 100 Yggdrasil Omega': 'Lv100 ユグドラシル・マグナ',
        'Lvl 120 Medusa': 'Lv120 メドゥーサ',

        'Lvl 30 Will-o\'-Wisp': 'Lv30 ウィル･オ･ウィスプ',
        'Lvl 30 Adversa': 'Lv30 アドウェルサ',
        'Lvl 50 Adversa': 'Lv50 アドウェルサ',
        'Lvl 75 Luminiera Omega': 'Lv75 シュヴァリエ・マグナ',
        'Lvl 100 Apollo': 'Lv100 アポロン',
        'Lvl 100 Odin': 'Lv100 オーディン',
        'Lvl 100 Luminiera Omega': 'Lv100 シュヴァリエ・マグナ',
        'Lvl 120 Apollo': 'Lv120 アポロン',

        'Lvl 30 Evil Eye': 'Lv30 イービルアイ',
        'Lvl 30 Celeste': 'Lv30 セレスト',
        'Lvl 50 Celeste': 'Lv50 セレスト',
        'Lvl 75 Celeste Omega': 'Lv75 セレスト・マグナ',
        'Lvl 100 Dark Angel Olivia': 'Lv100 Dエンジェル・オリヴィエ',
        'Lvl 100 Lich': 'Lv100 リッチ',
        'Lvl 100 Celeste Omega': 'Lv100 セレスト・マグナ',
        'Lvl 120 Dark Angel Olivia': 'Lv120 Dエンジェル・オリヴィエ',

        'Lvl 100 Proto Bahamut': 'Lv100 プロトバハムート',
        'Lvl 100 Grand Order': 'Lv100 ジ・オーダー・グランデ',
        'Lvl 110 Rose Queen': 'Lv110 ローズクイーン',
        'Lvl 150 Proto Bahamut': 'Lv150 プロトバハムート',

        'Lvl 120 Morrigna': 'Lv120 バイヴカハ',
        'Lvl 120 Prometheus': 'Lv120 プロメテウス',
        'Lvl 120 Ca Ong': 'Lv120 カー・オン',
        'Lvl 120 Gilgamesh': 'Lv120 ギルガメッシュ',
        'Lvl 120 Hector': 'Lv120 ヘクトル',
        'Lvl 120 Anubis': 'Lv120 アヌビス',

        'Lvl 60 Zhuque': 'Lv60 朱雀',
        'Lvl 60 Xuanwu': 'Lv60 玄武',
        'Lvl 60 Baihu': 'Lv60 白虎',
        'Lvl 60 Qinglong': 'Lv60 青竜',

        'Lvl 90 Agni': 'Lv90 アグニス',
        'Lvl 90 Neptune': 'Lv90 ネプチューン',
        'Lvl 90 Titan': 'Lv90 ティターン',
        'Lvl 90 Zephyrus': 'Lv90 ゼピュロス',

        'Lvl 100 Huanglong': 'Lv100 黄龍',
        'Lvl 100 Qilin': 'Lv100 黒麒麟',

        'Lvl 100 Xeno Ifrit': 'Lv100 ゼノ・イフリート',
        'Lvl 100 Xeno Vohu Manah': 'Lv100 ゼノ・ウォフマナフ',
        'Lvl 100 Xeno Cocytus': 'Lv100 ゼノ・コキュートス',
        'Lvl 100 Xeno Sagittarius': 'Lv100 ゼノ・サジタリウス',
        'Lvl 100 Xeno Diablo': 'Lv100 ゼノ・ディアボロス',
        'Lvl 100 Xeno Corow': 'Lv100 ゼノ・コロゥ',

        'Lvl 100 Raphael': 'Lv100 ラファエル',
        'Lvl 100 Gabriel': 'Lv100 ガブリエル',
        'Lvl 100 Uriel': 'Lv100 ウリエル',
        'Lvl 100 Michael': 'Lv100 ミカエル'
    };

    var sortByElement = function(a, b) {
        return raidInfo[a].sequence - raidInfo[b].sequence;
    };

    var sortByDifficulty = function(a, b) {
        return raidInfo[a].sequence2 - raidInfo[b].sequence2;
    };

    var quest = null;
    var raids = [];
    var createQuest = function(id, url, devID) {
        var devIDs = [];
        if(devID !== undefined) {
            devIDs.push(devID);
        }
        return {
            id: id,
            url: url,
            image: greyIcon,
            characters: [null, null, null, null, null, null],
            formation: [],
            buffs: [],
            enemies: [null, null, null],
            summons: [null, null, null, null, null, null],
            devIDs: devIDs
        };
    };

    // var characters = [
    //   null,
    //   null,
    //   null,
    //   null
    // ];

    //var buffs = [];

    var createCharacter = function(image, currHP, maxHP, currCharge, maxCharge) {
        return {
            image: image,
            currHP: currHP,
            maxHP: maxHP,
            currCharge: currCharge,
            maxCharge: maxCharge,
            skills: [null, null, null, null],
            buffs: []
        };
    };
    var createSkill = function(name, image, cooldown, turns, time) {
        return {
            name: name,
            image: image,
            cooldown: cooldown,
            turns: turns,
            time: time,
        };
    };
    var createBuff = function(owner, image, turns) {
        return {
            owner: owner,
            image: image,
            turns: turns
        };
    };

    //var enemies = [null, null, null];

    var createEnemy = function(image, currHP, maxHP, currCharge, maxCharge, mode) {
        return {
            image: image,
            currHP: currHP,
            maxHP: maxHP,
            currCharge: currCharge,
            maxCharge: maxCharge,
            mode: mode,
            debuffs: []
        };
    };

    var createDebuff = function(owner, image, time) {
        return {
            owner: owner,
            image: image,
            time: time
        };
    };
    var createSummon = function(image, cooldown) {
        return {
            image: image,
            cooldown: cooldown
        };
    };
    var questImageURLs = {};

    var events = [];


    var createEvent = function(url) {
        var bosses = [];
        var bossID = null;
        var currency1 = null;
        var currency2 = null;
        if(url.indexOf('teamraid') !== -1) {
            currency1 = '10022';
            bossID = '7139';
            bosses.push({
                'image': eyeIcon,
                'id': '31',
                'ap': 25,
                'currency1': 0,
                'currency2': 0,
                'hasAP': false,
                'hasCurrency': true
            });
            bosses.push({
                'image': dogeIcon,
                'id': '41',
                'ap': 30,
                'currency1': 2,
                'currency2': 0,
                'hasAP': false,
                'hasCurrency': false
            });
            bosses.push({
                'image': dogeIcon,
                'id': '51',
                'ap': 50,
                'currency1': 5,
                'currency2': 0,
                'hasAP': false,
                'hasCurrency': false
            });
        }
        return {
            url: url,
            bosses: bosses,
            bossID: bossID,
            currency1: currency1,
            currency2: currency2,
        };
    };
    events.push(createEvent('#event/teamraid024'));

    window.Quest = {
        Initialize: function(callback) {
            if(Options.Get('sortRaidsDifficulty')) {
                raidList.sort(sortByDifficulty);
            }
            for(var i = 0; i < raidList.length; i++) {
                // if(Options.Get(raidList[i])) {
                currRaidList.push(raidList[i]);
                // }
            }
            Storage.GetMultiple(['quests'], function(response) {
                if(response['quests'] !== undefined) {
                    var modified = false;
                    if(response['quests']['301061'] == undefined) {
                        for(var key in remainingQuests) {
                            if(response['quests'][key] == undefined) {
                                //response['quests'][key] = remainingQuests[key];
                                if(!Options.Get('isMagFest')) {
                                    response['quests'][key] = raidInfo[key].max;
                                } else {
                                    response['quests'][key] = raidInfo[key].max + raidInfo[key].magDelta;
                                }
                            }
                        }
                        modified = true;
                    }



                    for(var i = 0; i < raidList.length; i++) {
                        setRemainingRaids(raidList[i], response['quests'][raidList[i]]);
                    }
                    //remainingQuests = response['quests'].dailies;
                    if(modified) {
                        saveRemainingRaids();
                    }
                } else {
                    for(var i = 0; i < raidList.length; i++) {
                        console.log(Options.Get('isMagFest'));
                        if(!Options.Get('isMagFest')) {
                            setRemainingRaids(raidList[i], raidInfo[raidList[i]].max);
                        } else {
                            setRemainingRaids(raidList[i], raidInfo[raidList[i]].max + raidInfo[raidList[i]].magDelta);
                        }
                    }
                    saveRemainingRaids();
                }
                if(callback !== undefined) {
                    callback();
                }
            });
            isMagFest = Options.Get('isMagFest', function(id, value) {
                var currMag = isMagFest;
                isMagFest = value;
                for(var i = 0; i < raidList.length; i++) {
                    raidID = raidList[i];
                    if(currMag && !value) {
                        setRemainingRaids(raidID, remainingQuests[raidID] - raidInfo[raidID].magDelta);
                    } else if(!currMag && value) {
                        setRemainingRaids(raidID, remainingQuests[raidID] + raidInfo[raidID].magDelta);
                    } else {
                        setRemainingRaids(raidID, remainingQuests[raidID]);
                    }
                }
                saveRemainingRaids();
            });
            Options.Get('sortRaidsDifficulty', function(id, value) {
                sortRaids(value);
            });
            for(var i = 0; i < raidList.length; i++) {
                Options.Get(raidList[i], function(id, value) {
                    setRemainingJquery(id);
                    // Message.PostAll({'hideObject': {
                    //     'id': '#daily-raid-' + id,
                    //     'value': !value
                    //   }});
                });
            }
            for(var i = 0; i < raidList.length; i++) {
                var id = raidList[i];
                if(raidInfo[id].animeIDs !== null) {
                    for(var j = 0; j < raidInfo[id].animeIDs.length; j++) {
                        var temp = id;
                        Supplies.Get(raidInfo[id].animeIDs[j], raidInfo[id].animeTypes[j], function(animeID, num) {
                            Message.PostAll({'setText': {
                                'id': '.anime-count-' + animeID,
                                'value': num
                            }});
                        });
                    }
                }
            }
            for(var i = 0; i < events.length; i++) {
                if(events[i].currency1 !== null) {
                    Supplies.Get(events[i].currency1, 'event', function(id, num) {
                        for(var i = 0; i < events.length; i++) {
                            if(events[i].currency1 === id) {
                                Message.PostAll({'setText': {
                                    'id': '#event-item-' + i,
                                    'value': num
                                }});
                                for(var j = 0; j < events[i].bosses.length; j++) {
                                    if(num >= events[i].bosses[j].currency1) {
                                        events[i].bosses[j].hasCurrency = true;
                                    } else {
                                        events[i].bosses[j].hasCurrency = false;
                                    }
                                    var url;
                                    if(!events[i].bosses[j].hasAP || ! events[i].bosses[j].hasCurrency) {
                                        url = events[i].url;
                                    } else {
                                        url = events[i].url + '/supporter/' + events[i].bossID + events[i].bosses[j].id + '/1';
                                    }
                                    Message.PostAll({'setClick': {
                                        'id': '#event-image-' + j,
                                        'value': url
                                    }});
                                }
                            }
                        }
                    });
                }
            }
            APBP.GetAP(function(num) {
                for(var i = 0; i < events.length; i++) {
                    for(var j = 0; j < events[i].bosses.length; j++) {
                        if(num >= events[i].bosses[j].ap) {
                            events[i].bosses[j].hasAP = true;
                        } else {
                            events[i].bosses[j].hasAP = false;
                        }
                        var url;
                        if(!events[i].bosses[j].hasAP || ! events[i].bosses[j].hasCurrency) {
                            url = events[i].url;
                        } else {
                            url = events[i].url + '/supporter/' + events[i].bossID + events[i].bosses[j].id + '/1';
                        }
                        Message.PostAll({'setClick': {
                            'id': '#event-image-' + j,
                            'value': url
                        }});
                    }
                }
            });
        },
        InitializeDev: function() {
            var response = [];
            for(var i = 0; i < raidList.length; i++) {
                var raid = raidInfo[raidList[i]];
                var animeAmounts = null;
                if(raid.animeIDs !== null) {
                    animeAmounts = [];
                    for(var j = 0; j < raid.animeIDs.length; j++) {
                        animeAmounts[j] = Supplies.Get(raid.animeIDs[j], raid.animeTypes[j]);
                    }
                }
                var max = raid.max;
                if(Options.Get('isMagFest')) {
                    max += raid.magDelta;
                }
                response.push({'addQuest': {
                    'id': raidList[i],
                    'url': raid.url,
                    'name': raid.name,
                    'amount': remainingQuests[raidList[i]],
                    'max': max,
                    'animeIDs': raid.animeIDs,
                    'animeAmounts': animeAmounts
                }});

            }
            for(var i = 0; i < completedRaidList.length; i++) {
                response.push({'appendObject': {
                    'id': '#daily-raid-' + completedRaidList[i],
                    'target': '#completed-raid-list'
                }});
            }
            for(var i = 0; i < 4; i++) {
                response.push({'addQuestCharacter': {
                    'index': i
                }});
            }
            for(var i = 0; i < 3; i++) {
                response.push({'addQuestEnemy': {
                    'index': i
                }});
            }
            //setQuestsJQuery();
            for(var i = 0; i < events.length; i++) {
                response.push({'setText': {
                    'id': '#event-item-' + i,
                    'value': Supplies.Get(events[i].currency1, 'event')
                }});
                for(var j = 0; j < events[i].bosses.length; j++) {
                    response.push({'setClick': {
                        'id': '#event-image-' + j,
                        'value': events[i].bosses[j].url
                    }});
                }
            }
            for(var i = 0; i < raidList.length; i++) {
                response.push({'hideObject': {
                    'id': '#daily-raid-' + raidList[i],
                    'value': !Options.Get(raidList[i])
                }});
            }
            return response;
        },

        Reset: function() {
            for(var key in remainingQuests) {
                if(remainingQuests.hasOwnProperty(key)) {
                    if(!Options.Get('isMagFest')) {
                        setRemainingRaids(key, raidInfo[key].max);
                    } else {
                        setRemainingRaids(key, raidInfo[key].max + raidInfo[key].magDelta);
                    }
                }
            }
            saveRemainingRaids();
        },
        CheckDailyRaid: function(json, url) {
            id = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'));
            if(remainingQuests[id] !== undefined) {
                if(json.result === 'ok') {
                    setRemainingRaids(id, parseInt(json.limited_count));
                } else {
                    setRemainingRaids(id, 0);
                }
            }
            saveRemainingRaids();
        },
        CreateQuest: function(json, payload, devID) {
            if(json.result !== undefined && json.result === 'ok') {
                quest = createQuest(json.raid_id, '#raid/', devID);
                var id = '' + payload.quest_id;
                if(id !== undefined) {
                    if(remainingQuests[id] !== undefined) {
                        setRemainingRaids(id, remainingQuests[id] - 1);
                        saveRemainingRaids();
                        if(raidInfo[id].animeIDs !== null && payload.use_item_id !== undefined) {
                            var index = raidInfo[id].animeIDs.indexOf(payload.use_item_id);
                            Supplies.Increment(raidInfo[id].animeIDs[index], '10', -raidInfo[id].animeCounts[index]);
                        }
                    }
                    for(var i = 0; i < events.length; i++) {
                        if(events[i].bossID !== null) {
                            for(var j = 0; j < events[i].bosses.length; j++) {
                                if(id === (events[i].bossID + events[i].bosses[j].id)) {
                                    APBP.InitializeQuest({'action_point': events[i].bosses[j].ap});
                                    if(events[i].currency1 !== null) {
                                        Supplies.Increment(events[i].currency1, '10', -events[i].bosses[j].currency1);
                                    }
                                    if(events[i].currency2 !== null) {
                                        Supplies.Increment(events[i].currency2, '10', -events[i].bosses[j].currency2);
                                    }
                                }
                            }
                        }
                    }
                }
                setQuestsJQuery();
            }
        },
        CheckMulti: function(json) {
            if(json.is_multi) {
                quest.url = '#raid_multi/';
            }
        },
        CreateRaid: function(json, devID) {
            if(json.result !== false && json.is_host === false) {
                var id = '' + json.raid_id;
                for(var i = 0; i < raids.length; i++) {
                    if(raids.id === id) {
                        return;
                    }
                }
                raids.push(createQuest(id, '#raid_multi/', devID));
                setQuestsJQuery();
            }
        },
        CompleteQuest: function(url) {
            var id = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'));
            if(quest !== null) {
                //console.log(quest.id);
            }
            for(var i = 0; i < raids.length; i++) {
                //console.log(raids[i].id);
            }
            if(quest !== null && quest.id === id) {
                quest = null;
            } else {
                for(var i = 0; i < raids.length; i++) {
                    if(raids[i].id === id) {
                        raids.splice(i, 1);
                    }
                }
            }
            setQuestsJQuery();
        },
        StartBattle: function(json, devID) {
            var id = '' + json.raid_id;
            var currQuest;
            if(json.twitter !== undefined && json.twitter.battle_id !== undefined) {
                Message.Post(devID, {'setClick': {
                    'id': '#quest-copy',
                    'value': json.twitter.battle_id + ' (' +  json.twitter.monster + ') '
                }});
                Message.Post(devID, {'setTooltip': {
                    'id': '#quest-copy',
                    'text': json.twitter.battle_id + ' (' +  json.twitter.monster + ') '
                }});
            }
            if(quest !== null && quest.id === id) {
                quest.image = enemyImageURL + json.boss.param[0].cjs.substring(json.boss.param[0].cjs.lastIndexOf('_') + 1) + '.png';
                currQuest = quest;

            } else {
                var exists = false;
                var image = enemyImageURL + json.boss.param[0].cjs.substring(json.boss.param[0].cjs.lastIndexOf('_') + 1) + '.png';
                for(var i = 0; i < raids.length; i++) {
                    if(raids[i].id === id) {
                        exists = true;
                        raids[i].image = image;
                        currQuest = raids[i];
                        break;
                    }
                }
                if(!exists) {
                    raids.push(createQuest(id, '#raid_multi/', devID));
                    raids[raids.length - 1].image = image;
                    currQuest = raids[raids.length - 1];
                }
            }
            if(currQuest.devIDs.indexOf(devID) === -1) {
                currQuest.devIDs.push(devID);
            }
            setQuestsJQuery();
            // if(json.player !== undefined) {
            //   for(var i = 0; i < 6; i++) {
            //     if(i < json.player.number) {
            //       var character = json.player.param[i];
            //       var image;
            //       if(i !== 0) {
            //         image = characterImageURL + character.pid_image + '.jpg';
            //       } else {
            //         image = mainCharacterImageURL + character.pid_image + '.jpg';
            //       }
            //       if(currQuest.characters[i] === null) {
            //         currQuest.characters[i] = createCharacter(image, parseInt(character.hp), parseInt(character.hpmax), parseInt(character.recast), parseInt(character.recastmax));
            //       } else {
            //         currQuest.characters[i].image = image;
            //         currQuest.characters[i].currHP = parseInt(character.hp);
            //         currQuest.characters[i].maxHP = parseInt(character.hpmax);
            //         currQuest.characters[i].currCharge = parseInt(character.recast);
            //         currQuest.characters[i].maxCharge = parseInt(character.recastmax);
            //       }
            //     } else {
            //       currQuest.characters[i] = null;
            //     }
            //   }
            // }
            // if(json.ability !== undefined) {
            //   for(var i = 0; i < 4; i++) {
            //     if(json.ability[(i + 1)] !== undefined) {
            //       var pos = json.ability[(i + 1)].pos;
            //       for(var j = 0; j < 4; j++) {
            //         var skill = json.ability[(i + 1)].list[(j + 1)];
            //         if(skill !== undefined) {
            //           image = skillImageURL + skill[0].class.substring(11, skill[0].class.indexOf(' ')) + skillImageClosingURL;
            //           var turns = parseInt(skill[0].duration) || null;
            //           var time = parseInt(skill[0]['duration-second']) || null;
            //           if(currQuest.characters[pos].skills[j] === null) {
            //             currQuest.characters[pos].skills[j] = createSkill(skill[0]['ability-name'], image, parseInt(skill[0]['ability-recast']), turns, time);
            //           } else {
            //             currQuest.characters[pos].skills[j].name = skill[0]['ability-name'];
            //             currQuest.characters[pos].skills[j].image = image;
            //             currQuest.characters[pos].skills[j].cooldown = parseInt(skill[0]['ability-recast']);
            //             currQuest.characters[pos].skills[j].turns = turns;
            //             currQuest.characters[pos].skills[j].time = time;
            //           }
            //         } else {
            //           currQuest.characters[pos].skills[j] = null;
            //         }
            //       }
            //     }
            //   }
            // }
            // if(json.formation !== undefined) {
            //   currQuest.formation = [];
            //   for(var i = 0; i < json.formation.length; i++) {
            //     currQuest.formation.push(parseInt(json.formation[i]));
            //   }
            // }
            // if(json.boss !== undefined) {
            //   for(var i = 0; i < 3; i++) {
            //     if(i < json.boss.number) {
            //       var boss = json.boss.param[i];
            //       var image = enemyImageURL + boss.cjs.substring(boss.cjs.lastIndexOf('_') + 1) + '.png';
            //       if(currQuest.enemies[i] === null || currQuest.enemies[i].image !== image) {
            //         currQuest.enemies[i] = createEnemy(image, parseInt(boss.hp), parseInt(boss.hpmax), parseInt(boss.recastmax), parseInt(boss.recast), parseInt(boss.modeguage));
            //         if(boss.recastmax === 99999) {
            //           currQuest.enemies[i].currCharge = 0;
            //           currQuest.enemies[i].maxCharge = 0;
            //         }
            //         if(boss.modeflag === 0) {
            //           currQuest.enemies[i].mode = null;
            //         }
            //       }
            //     } else {
            //       currQuest.enemies[i] = null;
            //     }
            //   }
            // }
            // if(json.summon !== undefined) {
            //   for(var i = 0; i < 5; i++) {
            //     var summon = json.summon[i];
            //     if(summon.id !== '') {
            //       var image = summonImageURL + summon.id + '.jpg';
            //       if(currQuest.summons[i] === null) {
            //         currQuest.summons[i] = createSummon(image, parseInt(summon.recast));
            //       } else {
            //         currQuest.summons[i].image = image;
            //         currQuest.summons[i].cooldown = parseInt(summon.recast);
            //       }
            //     } else {
            //       currQuest.summons[i] = null;
            //     }
            //   }
            // }
            // if(json.supporter !== undefined) {
            //   var summon = json.supporter;
            //   var image = summonImageURL + summon.id + '.jpg';
            //   if(currQuest.summons[5] === null) {
            //     currQuest.summons[5] = createSummon(image, parseInt(summon.recast));
            //   } else {
            //     currQuest.summons[5].image = image;
            //     currQuest.summons[5].cooldown = parseInt(summon.recast);
            //   }
            // }
            // setBattleJQuery(currQuest);
        },
        BattleAction: function(json, payload, devID) {
            if(json.popup !== undefined) {
                return;
            }
            var id = '' + payload.raid_id;
            var currQuest;
            if(quest !== null && quest.id === id) {
                currQuest = quest;
            } else {
                for(var i = 0; i < raids.length; i++) {
                    if(raids[i].id === id) {
                        currQuest = raids[i];
                        break;
                    }
                }
            }
            if(currQuest.devIDs.indexOf(devID) === -1) {
                currQuest.devIDs.push(devID);
            }
            // //is_event
            // //is_event_quest
            // if(json.status !== undefined) {
            //   for(var i = 0; i < 4; i++) {
            //     if(json.status.ability[(i + 1)] !== undefined) {
            //       var pos = json.status.ability[(i + 1)].pos;
            //       for(var j = 0; j < 4; j++) {
            //         var skill = json.status.ability[(i + 1)].list[(j + 1)];
            //         if(skill !== undefined) {
            //           image = skillImageURL + skill[0].class.substring(11, skill[0].class.indexOf(' ')) + skillImageClosingURL;
            //           var turns = parseInt(skill[0].duration) || null;
            //           var time = parseInt(skill[0]['duration-second']) || null;
            //           if(currQuest.characters[pos].skills[j] === null) {
            //             currQuest.characters[pos].skills[j] = createSkill(skill[0]['ability-name'], image, parseInt(skill[0]['ability-recast']), turns, time);
            //           } else {
            //             currQuest.characters[pos].skills[j].name = skill[0]['ability-name'];
            //             currQuest.characters[pos].skills[j].image = image;
            //             currQuest.characters[pos].skills[j].cooldown = parseInt(skill[0]['ability-recast']);
            //             currQuest.characters[pos].skills[j].turns = turns;
            //             currQuest.characters[pos].skills[j].time = time;
            //           }
            //         } else {
            //           currQuest.characters[pos].skills[j] = null;
            //         }
            //       }
            //     }
            //   }
            //   for(var i = 0; i < 5; i++) {
            //     var cooldown = json.status.summon.recast[i];
            //     if(cooldown !== null) {
            //       currQuest.summons[i].cooldown = parseInt(cooldown);
            //     } else {
            //       currQuest.summons[i] = null;
            //     }
            //   }
            //   currQuest.summons[5].cooldown = parseInt(json.status.supporter.recast);
            // }
            var refresh = false;
            for(var i = 0; i < json.scenario.length; i++) {
                // if(json.scenario[i].cmd === 'finished') {
                //   currQuest.url = currQuest.url.replace('raid', 'result');
                //   if(Options.Get('skip')) {
                //     Message.Post(devID, {'openURL': currQuest.url + currQuest.id});
                //   }
                // }
                if(json.scenario[i].cmd === 'win') {
                    currQuest.id = '' + json.scenario[i].raid_id;
                    if(json.scenario[i].is_last_raid) {
                        currQuest.url = currQuest.url.replace('raid', 'result');
                        if(Options.Get('skip')) {
                            Message.Post(devID, {'openURL': currQuest.url + currQuest.id});
                            return;
                        }
                    }
                    if(Options.Get('skip') && Options.Get('skipNext')) {
                        Message.Post(devID, {'openURL': currQuest.url + currQuest.id});
                        return;
                    }
                }
                if(Options.Get('ougiRefresh') && (json.scenario[i].cmd == 'special' || json.scenario[i].cmd == 'special_npc'))
                {
                    refresh = true;
                }
            }
            if(refresh)
            {
                //Message.Post(devID, {'refresh': true});
                Message.Post(devID, {'openURL': currQuest.url + currQuest.id});
            }
            //setQuestsJQuery();
            //setBattleJQuery(currQuest);

            // if(json.scenario[0].cmd === 'ability') {
            //   var name = scenario[0].name;
            //   for(var i = 0; i < characters.length; i++) {
            //     if(characters[i] !== null) {
            //       for(var j = 0; j < characters[i].skills.length; j++) {
            //         var skill = characters[i].skills[j];
            //         if(skill.name === name) {
            //           var targets = [];
            //           for(var k = 1; k < json.scenario.length; k++) {
            //             if(json.scenario[k].cmd === 'message') {
            //               if(json.scenario[k].to === 'boss') {
            //                 for(var l = 0; l < json.scenario[k].list.length; l++) {
            //                   if(json.scenario[k].list[l].miss === undefined || json.scenario[k].list[l].miss !== -1) {
            //                   }
            //                 }
            //               }
            //             }
            //           }
            //           if(skill.turns !== null) {
            //           }
            //           if(skill.time !== null) {
            //           }
            //         }
            //       }
            //     }
            //   }
            // }
        },
        SetCurrentQuest: function(json) {
            if(json.progress_quest_info !== undefined) {
                var id = json.progress_quest_info[0].raid_id;
                if(quest === null) {
                    quest = createQuest(id, '#raid/');
                } else {
                    quest.id = id;
                    quest.url = '#raid/';
                }
            } else {
                quest = null;
            }
            setQuestsJQuery();
        },
        UseSummon: function(json) {
        },
        Attack: function(json) {
        },
        AbandonQuest: function(payload) {
            var id = '' + payload.raid_id;
            if(quest !== null && quest.id === id) {
                quest = null;
            } else {
                for(var i = 0; i < raids.length; i++) {
                    if(raids[i].id === id) {
                        raids.splice(i, 1);
                        break;
                    }
                }
            }
            setQuestsJQuery();
        },
        CheckJoinedRaids: function(json) {
        },
        SetCoopCode: function(code, devID) {
            Message.Post(devID, {'setClick': {
                'id': '#quest-copy',
                'value': code + ' (Co-Op Room) '
            }});
            Message.Post(devID, {'setTooltip': {
                'id': '#quest-copy',
                'text': code + ' (Co-Op Room) '
            }});
        },
        UpdateInProgress: function(json, devID) {
            var inProgress = json.option.quest.init_list.progress_quest_info;
            if(inProgress !== undefined && inProgress.length > 0) {
                quest = createQuest(inProgress[0].raid_id, '#raid/', devID);
            }
        },
        CopyTweet: function(json) {
            if(Options.Get('copyJapaneseName') && json.tweet_mode === 0 && json.twitter.forced_message !== undefined) {
                var start = json.twitter.forced_message.indexOf('\n');
                var end = json.twitter.forced_message.lastIndexOf('\n');
                if(start !== -1 && end !== -1) {
                    var english = json.twitter.forced_message.substring(start + 1, end);
                    console.log(english);
                    if(tweetHash[english] !== undefined) {
                        copy(tweetHash[english]);
                    }
                }
            }
        }
    };
    // var parseRoomID = function(url) {
    //   return url.substring(url.indexOf('data/') + 5, url.indexOf('/1.json') - 1);
    // }

    var setQuestsJQuery = function() {
        var image;
        var url;
        if(quest !== null) {
            image = quest.image;
            url = quest.url + quest.id;
        } else {
            image = blankIcon;
            url = '';
        }
        Message.PostAll({'setImage': {
            'id': '#quest-image-curr',
            'value': image
        }});
        Message.PostAll({'setClick': {
            'id': '#quest-image-curr',
            'value': url
        }});
        for(var i = 0; i < 4; i++) {
            if(i < raids.length) {
                image = raids[i].image;
                url = raids[i].url + raids[i].id;
            } else {
                image = blankIcon;
                url = '';
            }
            Message.PostAll({'setImage': {
                'id': '#quest-image-' + i,
                'value': image
            }});
            Message.PostAll({'setClick': {
                'id': '#quest-image-' + i,
                'value': url
            }});
        }
    };
    var hideBattleJQuery = function(currQuest, isHidden) {

    };
    var setBattleJQuery = function(currQuest) {
        var devID;
        for(var k = 0; k < currQuest.devIDs.length; k++) {
            devID = currQuest.devIDs[k];
            if(!Message.Post(devID, undefined)) {
                currQuest.devIDs.splice(k, 1);
                k--;
            } else {
                for(var i = 0; i < 4; i++) {
                    if(currQuest.characters[pos] !== null && i < currQuest.formation.length) {
                        var pos = currQuest.formation[i];
                        Message.Post(devID, {'hideObject': {
                            'id': '#quest-character-' + i,
                            'value': false
                        }});
                        Message.Post(devID, {'setImage': {
                            'id': '#quest-character-image-' + i,
                            'value': currQuest.characters[pos].image
                        }});
                        for(var j = 0; j < currQuest.characters[pos].skills.length; j++) {
                            if(currQuest.characters[pos].skills[j] !== null) {
                                Message.Post(devID, {'hideObject': {
                                    'id': '#quest-skill-' + i + '-' + j,
                                    'value': false
                                }});
                                Message.Post(devID, {'setImage': {
                                    'id': '#quest-skill-image-' + i + '-' + j,
                                    'value': currQuest.characters[pos].skills[j].image
                                }});
                                if(currQuest.characters[pos].skills[j].cooldown === 0) {
                                    Message.Post(devID, {'setText': {
                                        'id': '#quest-skill-text-' + i + '-' + j,
                                        'value': ''
                                    }});
                                    Message.Post(devID, {'setOpacity': {
                                        'id': '#quest-skill-image-' + i + '-' + j,
                                        'value': 1
                                    }});
                                } else {
                                    Message.Post(devID, {'setText': {
                                        'id': '#quest-skill-text-' + i + '-' + j,
                                        'value': currQuest.characters[pos].skills[j].cooldown
                                    }});
                                    Message.Post(devID, {'setOpacity': {
                                        'id': '#quest-skill-image-' + i + '-' + j,
                                        'value': .4
                                    }});
                                }
                            } else {
                                Message.Post(devID, {'hideObject': {
                                    'id': '#quest-skill-' + i + '-' + j,
                                    'value': true
                                }});
                            }
                        }
                    } else {
                        Message.Post(devID, {'hideObject': {
                            'id': '#quest-character-' + i,
                            'value': true
                        }});
                    }
                }
                for(var i = 0; i < currQuest.enemies.length; i++) {
                    if(currQuest.enemies[i] !== null) {
                        Message.Post(devID, {'hideObject': {
                            'id': '#quest-enemy-' + i,
                            'value': false
                        }});
                        Message.Post(devID, {'setImage': {
                            'id': '#quest-enemy-image-' + i,
                            'value': currQuest.enemies[i].image
                        }});
                    } else {
                        Message.Post(devID, {'hideObject': {
                            'id': '#quest-enemy-' + i,
                            'value': true
                        }});
                    }
                }
                for(var i = 0; i < currQuest.summons.length; i++) {
                    if(currQuest.summons[i] !== null) {
                        Message.Post(devID, {'setImage': {
                            'id': '#quest-summon-image-' + i,
                            'value': currQuest.summons[i].image
                        }});
                        if(currQuest.summons[i].cooldown === 0) {
                            Message.Post(devID, {'setText': {
                                'id': '#quest-summon-text-' + i,
                                'value': ''
                            }});
                            Message.Post(devID, {'setOpacity': {
                                'id': '#quest-summon-image-' + i,
                                'value': 1
                            }});
                        } else {
                            Message.Post(devID, {'setText': {
                                'id': '#quest-summon-text-' + i,
                                'value': currQuest.summons[i].cooldown
                            }});
                            Message.Post(devID, {'setOpacity': {
                                'id': '#quest-summon-image-' + i,
                                'value': .6
                            }});
                        }
                    } else {
                        Message.Post(devID, {'setImage': {
                            'id': '#quest-summon-image-' + i,
                            'value': blankIcon
                        }});
                        Message.Post(devID, {'setText': {
                            'id': '#quest-summon-text-' + i,
                            'value': ''
                        }});
                    }
                }
            }
        }
    };


    var parseQuestID = function(url) {
        return url.substring(url.indexOf('data/') + 5, url.lastIndexOf('/'));
    };

    var setRemainingRaids = function(id, amount) {
        if(remainingQuests[id] !== undefined) {
            if(amount < 0) {
                amount = 0;
            }
            if(remainingQuests[id] !== amount && amount <= 0) {
                var currIndex = currRaidList.indexOf(id);
                currRaidList.splice(currIndex, 1);
                var found = false;
                for(var i = 0; i < completedRaidList.length; i++) {
                    if(!Options.Get('sortRaidsDifficulty')) {
                        if(raidInfo[id].sequence < raidInfo[completedRaidList[i]].sequence) {
                            completedRaidList.splice(i, 0, id);
                            found = true;
                            break;
                        }
                    } else {
                        if(raidInfo[id].sequence2 < raidInfo[completedRaidList[i]].sequence2) {
                            completedRaidList.splice(i, 0, id);
                            found = true;
                            break;
                        }
                    }
                }
                if(!found) {
                    completedRaidList.push(id);
                }

                // if(newIndex !== completedRaidList.length) {
                //   Message.PostAll({'beforeObject': {
                //     'id': '#daily-raid-' + id,
                //     'target': '#daily-raid-' + completedRaidList[newIndex]
                //   }});
                //   // $completedRaidList.find('#daily-raid-' + completedRaidList[newIndex]).before($dailyRaidList.find('#daily-raid-' + id));

                // } else {
                //   Message.PostAll({'appendObject': {
                //     'id': '#daily-raid-' + id,
                //     'target': '#completed-raid-list'
                //   }});
                //   // $completedRaidList.append($dailyRaidList.find('#daily-raid-' + id));
                //   completedRaidList.push(id);
                // }
            } else if(remainingQuests[id] !== amount && amount > 0 && completedRaidList.indexOf(id) !== -1) {
                var currIndex = completedRaidList.indexOf(id);
                completedRaidList.splice(currIndex, 1);
                var found = false;
                for(var i = 0; i < currRaidList.length; i++) {
                    if(!Options.Get('sortRaidsDifficulty')) {
                        if(raidInfo[id].sequence < raidInfo[currRaidList[i]].sequence) {
                            currRaidList.splice(i, 0, id);
                            found = true;
                            break;
                        }
                    } else {
                        if(raidInfo[id].sequence2 < raidInfo[currRaidList[i]].sequence2) {
                            currRaidList.splice(i, 0, id);
                            found = true;
                            break;
                        }
                    }
                }
                if(!found) {
                    currRaidList.push(id);
                }
                // currRaidList.splice(newIndex, 0, id);
                // currRaidList.push(id);
                // if(options.Get(id)) {
                //   var found = false;
                //   while(newIndex !== currRaidList.length) {
                //     if(Options.Get(raidList[newIndex])) {
                //       Message.PostAll({'beforeObject': {
                //         'id': '#daily-raid-' + id,
                //         'target': '#daily-raid-' + currRaidList[newIndex]
                //       }});
                //       found = true;
                //       break;
                //       }
                //       else  {
                //         newIndex++;
                //       }
                //   }
                //   if(!found) {
                //     Message.PostAll({'appendObject': {
                //       'id': '#daily-raid-' + id,
                //       'target': '#daily-raid-list'
                //     }});
                //     currRaidList.push(id);
                //   }
                // }
            }
            remainingQuests[id] = amount;
            setRemainingJquery(id);


        }
    };

    var setRemainingJquery = function(id) {
        if(!Options.Get('isMagFest')) {
            Message.PostAll({'setText': {
                'id': '#remaining-' + id,
                'value': remainingQuests[id] + '/' + raidInfo[id].max
            }});
        // $raidsPanel.find('#remaining-' + id).first().text(amount + '/' + raidInfo[id].max);
        } else {
            Message.PostAll({'setText': {
                'id': '#remaining-' + id,
                'value': remainingQuests[id] + '/' + (raidInfo[id].max + raidInfo[id].magDelta)
            }});
        // $raidsPanel.find('#remaining-' + id).first().text(amount + '/' + (raidInfo[id].max + raidInfo[id].magDelta));
        }
        if(Options.Get(id)) {
            Message.PostAll({'hideObject': {
                'id': '#daily-raid-' + id,
                'value': false
            }});
        } else {
            Message.PostAll({'hideObject': {
                'id': '#daily-raid-' + id,
                'value': true
            }});
        }
        if(remainingQuests[id] !== 0) {
            for(var i = 0; i < currRaidList.length; i++) {
                if(!Options.Get('sortRaidsDifficulty')) {
                    if(raidInfo[id].sequence < raidInfo[currRaidList[i]].sequence && Options.Get(currRaidList[i])) {
                        Message.PostAll({'beforeObject': {
                            'id': '#daily-raid-' + id,
                            'target': '#daily-raid-' + currRaidList[i]
                        }});
                        return;
                    }
                } else {
                    if(raidInfo[id].sequence2 < raidInfo[currRaidList[i]].sequence2 && Options.Get(currRaidList[i])) {
                        Message.PostAll({'beforeObject': {
                            'id': '#daily-raid-' + id,
                            'target': '#daily-raid-' + currRaidList[i]
                        }});
                        return;
                    }
                }
            }
            Message.PostAll({'appendObject': {
                'id': '#daily-raid-' + id,
                'target': '#daily-raid-list'
            }});
            return;
        } else {
            for(var i = 0; i < completedRaidList.length; i++) {
                if(!Options.Get('sortRaidsDifficulty')) {
                    if(raidInfo[id].sequence < raidInfo[completedRaidList[i]].sequence && Options.Get(completedRaidList[i])) {
                        Message.PostAll({'beforeObject': {
                            'id': '#daily-raid-' + id,
                            'target': '#daily-raid-' + completedRaidList[i]
                        }});
                        return;
                    }
                } else {
                    if(raidInfo[id].sequence2 < raidInfo[completedRaidList[i]].sequence2 && Options.Get(completedRaidList[i])) {
                        Message.PostAll({'beforeObject': {
                            'id': '#daily-raid-' + id,
                            'target': '#daily-raid-' + completedRaidList[i]
                        }});
                        return;
                    }
                }
            }
            Message.PostAll({'appendObject': {
                'id': '#daily-raid-' + id,
                'target': '#completed-raid-list'
            }});
            return;

        }
        // if(Options.Get(id)) {
        //   Message.PostAll({'hideObject': {
        //     'id': '#daily-raid-' + id,
        //     'value': false
        //   }});
        // } else {
        //   Message.PostAll({'hideObject': {
        //     'id': '#daily-raid-' + id,
        //     'value': true
        //   }});
        // }
    };

    //         {
    // 	"300011": 0,
    // 	"300021": 0,
    // 	"300031": 0,
    // 	"300041": 0,
    // 	"300051": 0,
    // 	"300061": 0,
    // 	"300071": 0,
    // 	"300081": 0,
    // 	"300091": 0,
    // 	"300101": 0,
    // 	"300111": 0,
    // 	"300121": 0,
    // 	"300141": 0,
    // 	"300151": 0,
    // 	"300161": 0,
    // 	"300171": 0,
    // 	"300181": 0,
    // 	"300191": 0,
    // 	"300201": 0,
    // 	"300211": 0,
    // 	"300221": 0,
    // 	"300231": 0,
    // 	"300241": 0,
    // 	"300251": 3,
    // 	"300261": 3,
    // 	"300271": 0,
    // 	"300281": 3,
    // 	"300441": 2,
    // 	"300491": 2,
    // 	"300511": 2,
    // 	"300531": 2,
    // 	"300561": 2,
    // 	"300581": 2
    // }

    var saveRemainingRaids = function() {
        Storage.Set('quests', remainingQuests);
    };
    var sortRaids = function(byDifficulty) {
        var sort;
        if(!byDifficulty) {
            sort = sortByElement;
        } else {
            sort = sortByDifficulty;
        }
        raidList.sort(sort);
        currRaidList.sort(sort);
        completedRaidList.sort(sort);
        for(var i = 0; i < raidList.length; i++) {
            Message.PostAll({'hideObject': {
                'id': '#daily-raid-' + raidList[i],
                'value': true
            }});
        }
        for(var i = 0; i < currRaidList.length; i++) {
            var id = currRaidList[i];
            if(Options.Get(id)) {
                Message.PostAll({'hideObject': {
                    'id': '#daily-raid-' + id,
                    'value': false
                }});
                Message.PostAll({'appendObject': {
                    'id': '#daily-raid-' + id,
                    'target': '#daily-raid-list'
                }});
            }
        }
        for(var i = 0; i < completedRaidList.length; i++) {
            var id = completedRaidList[i];
            if(Options.Get(id)) {
                Message.PostAll({'hideObject': {
                    'id': '#daily-raid-' + id,
                    'value': false
                }});
                Message.PostAll({'appendObject': {
                    'id': '#daily-raid-' + id,
                    'target': '#completed-raid-list'
                }});
            }
        }

    };

    var copy =  function(str) {
        var input = document.createElement('textarea');
        document.body.appendChild(input);
        input.value = str;
        input.focus();
        input.select();
        document.execCommand('Copy');
        input.remove();
    };

})();
