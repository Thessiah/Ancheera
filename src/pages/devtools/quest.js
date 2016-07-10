(function() {
  var nextQuest;
  var currQuest;
  window.Quest = {
    InitializeQuest: function(json) {
      nextQuest = json.chapter_name;
    },
    StartQuest: function(json) {
      startQuest(json.raid_id);
    },
  }

  var startQuest = function(id) {
    currQuest = nextQuest;
    $('#active-quest').text(currQuest);
  }
})();