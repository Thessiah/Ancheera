(function() {
  var jQuery = {};
  var initialized = false;
  var url;
  $('#contents').find('.open-url').each(function() {
    $(this).click(function() {
      Message.OpenURL(url + $(this).data('url'));
    });
  });

  window.Default = {
    // Initialize: function(newUrl) {
    //   if(!initialized) {
    //     initialized = true;
    //     url = newUrl.substring(0, newUrl.indexOf('#mypage'));
    //     Message.Post({initialize: true}) {
    //       for(var i = 0; i < response.length; i++) {
    //         if(response[i].setText) {
    //           setText(response[i].setText.id, response[i].setText.value);
    //         }
    //       }
    //       $('#wait').hide();
    //       $('#contents').show();
    //     });
    //   }
    // },
    // IsInitialized: function() {
    //   return initialized;
    // },
  }

})();