(function() {
  var profile = {
    lupi: 0,
    level: 0,
    level_percent: 0,
    level_next_exp: 0,
    job: 0,
    job_percent: 0,
    job_next_exp: 0,
    zenith: 0,
    zenith_percent: 0,
    zenith_next_exp: 0,
    renown: 0,
    renown_weekly: 0,
    renown_r: 0,
    renown_sr: 0,
    prestige: 0,
    prestige_weekly: 0
  }
  var profileNames = [];
  window.Profile = {
    Initialize: function() {
    },
    SetPendants: function(json) {
    },
    CompleteQuest: function(json) {
      Message.ConsoleLog('profile.js', 'why does');
      profile.lupi += json.rewards.lupi.sum;
      profile.level = json.values.pc.param.new.level;
      profile.level_percent = json.values.pc.param.new.exp_width;
      profile.level_next_exp = json.values.pc.param.remain_next_exp - (json.values.get_exp.exp + json.values.get_exp.exp_bonus);
      if(profile.level_next_exp <= 0) {
        profile.level_next_exp = 0;
      }
      profile.job_level = json.values.pc.job.new.level;
      profile.job_percent = json.values.pc.job.new.exp_width;
      profile.job_next_exp = json.values.pc.job.remain_next_exp - (json.values.get_exp.job_exp + json.values.get_exp.job_exp_bonus);
      if(profile.job_next_exp <= 0) {
        profile.job_next_exp = 0;
      }
      profile.zenith = json.values.pc.job.zenith.after_lp;
      profile.zenith_percent = json.values.pc.job.zenith.after_exp_guage;
      profile.zenith_next_exp -= (json.values.get_exp.job_exp + json.values.get_exp.job_exp_bonus);
      if(profile.zenith_next_exp <= 0) {
        profile.zenith_next_exp = 0;
      }
      Message.ConsoleLog('profile.js', 'this work');
    },
    CompleteRaid: function(json) {
      Message.ConsoleLog('profile.js', 'test0');
      var path;
      if(!Array.isArray(json.mbp_info) && json.mbp_info !== undefined) {
              Message.ConsoleLog('profile.js', 'test 0.5');
        if(json.mbp_info.add_result["10100"] !== undefined) {
          Message.ConsoleLog('profile.js', 'test 0.6');
          path = json.mbp_info.add_result["10100"];
          profile.renown += path.add_point;
          profile.renown_weekly += path.add_point;
          Message.ConsoleLog('profile.js', 'test 0.7');
          path = json.mbp_info.add_result["20100"];
          profile.renown += path.add_point;
          profile.renown_r += path.add_point;
          Message.ConsoleLog('profile.js', 'test 0.8');
          path = json.mbp_info.add_result["20200"];
          profile.renown += path.add_point;
          profile.renown_sr += path.add_point;
        }
      }
      Message.ConsoleLog('profile.js', 'test1');
      Profile.CompleteQuest(json);
      Message.ConsoleLog('profile.js', 'test2');
    }
  }
})();