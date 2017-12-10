(function ($) {

  $( document ).ready( function() {

    /* API CALLS />
      https://phiffer.org/youarehere/yah.php?get=stories
      https://phiffer.org/youarehere/yah.php?get=responses&story=[story ID]
      https://phiffer.org/youarehere/yah.php?get=mp3s
      https://phiffer.org/youarehere/yah.php?twilio=1 (Twilio POST endpoint)
    */

    // ME:
    //var myUrlGet = "https://phiffer.org/youarehere/yah.php?get=stories";
    //var myUrlResp = "https://phiffer.org/youarehere/yah.php?get=responses&story=[story ID]";

    /* * * *
     * Handlebar Helpers
     */
    // Handlebars.registerHelper('getPark', function() {
    //   return PARK;
    // });

    // Handlebars.registerHelper('getRandomNumber', function() {
    //   var min = 0
    //       ,max = 14
    //       ,num = Math.floor(Math.random() * (max - min + 1)) + min
    //       ,padded;

    //   num < 10 ? padded = "0"+num : padded = String(num);

    //   return padded;
    // });

    // Handlebars.getTemplate = function(name) {
    //   if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
    //       $.ajax({
    //           url : 'tmpl/' + name + '.handlebars',
    //           success : function(data) {
    //               if (Handlebars.templates === undefined) {
    //                   Handlebars.templates = {};
    //               }
    //               Handlebars.templates[name] = Handlebars.compile(data);
    //           },
    //           async : false
    //       });
    //   }
    //   return Handlebars.templates[name];
    // };
    /* * * * */

    /* * * *
     * Variables
     */
    var PH_NUM
        ,PARK="ts" // default to tompkins sq (not good, i know.. just for now)
        ,currentAudio = {}
        ,$viewButton = $('#viewButton');


    /* * * *
     * Callbacks
     */
    // buttons
    $viewButton.on('click', function() {
      var href = $(this).data('href');
      triggerView( href );

      window.location.hash = href;
      
    });

    // story audio + call button assigned in renderStory function

    // window
    $(window).on('hashchange', function(){
      show(decodeURI(window.location.hash));
    });

    /* * * *
     * Load Config file
     */
    // function loadConfig() {
    //   $.ajax({
    //       type: "GET",
    //       dataType: "json",
    //       url: "/config.json"
    //   })
    //   .done(function( data ) {

    //     PH_NUM = data["number"];
    //     PARK = data["park"];

    //     // now fetch the correct story
    //     fetchStory();

    //   })
    //   .fail( function(xhr, textStatus, errorThrown) {
    //     console.log("config xhr responseText: " + xhr.responseText);
    //     console.log("config textStatus: " + textStatus);
    //   });
    // }

    /* * * *
     * Fetch + Render
     */

    // ME: change this to use new urls at top: 
    // url: "/server/yah.php?get=stories"
    // url: "/server/yah.php?get=responses&story="+story.id
    // function fetchStory() {
    //   $.ajax({
    //       type: "GET",
    //       dataType: "json",
    //       url: myUrlGet
    //   })
    //   .done(function( data ) {

    //     story = data.stories[PH_NUM];
    //     renderStory(story);

    //     // now get people's responses
    //     fetchResponses(story);

    //   })
    //   .fail( function(xhr, textStatus, errorThrown) {
    //     console.log("get stories textStatus: " + textStatus);
    //     console.log("get stories errorThrown: " + errorThrown);
    //   });
    // }

    // function fetchResponses(story) {
    //   $.ajax({
    //       type: "GET",
    //       dataType: "json",
    //       url: myUrlResp+story.id
    //   })
    //   .done(function( data ) {

    //     // Call a function that will turn that data into HTML.
    //     renderResponses(data.responses);

    //     // Trigger a hashchange depending on where we are in the app
    //     triggerView(window.location.hash);

    //     // Manually trigger a hashchange to start the app.
    //     $(window).trigger('hashchange');
    //   })
    //   .fail( function(xhr, textStatus, errorThrown) {
    //     console.log("get responses xhr responseText: " + xhr.responseText);
    //     console.log("get responses textStatus: " + textStatus);
    //   });
    // }

    // function renderStory(data){

    //   var $story = $('.story');
    //   var tmpl = Handlebars.getTemplate('story');
    //   HandlebarsIntl.registerWith(Handlebars);
    //   $story.append( tmpl(data) );

    //   $story.find('.btn-audio').on('click', function (e) {
    //     e.preventDefault();

    //     toggleAudio( $story.find('audio').get(0), $(this) );

    //   });

    //   $story.find('.btn-call').on('click', function(e) {
    //     e.preventDefault();
        
    //     window.location.href="tel://" + $(this).data('tel');

    //   });

    // }

    // function renderResponses(data){
    //   // Uses Handlebars to create a list of responses using the provided data.
    //   // This function is called only once on page load.
    //   var list = $('.responses .responses-list');
    //   var tmpl = Handlebars.getTemplate('responses');
    //   HandlebarsIntl.registerWith(Handlebars);
    //   list.append( tmpl(data) );

    //   // click to toggle audio
    //   list.find('.tn').on('click', function (e) {

    //     e.preventDefault();

    //     toggleAudio( $(this).find('audio').get(0), $(this).find('.btn-audio') );

    //   });

    //   // hide loading message
    //   $('.loading').removeClass('visible');
    //   $('.responses').addClass('current visible');

    //   // kick off tracking!
    //   loadTracking();
    // }

    // set up tracking
    // function loadTracking() {
    //   var interactions = new Interactor({
    //       interactions        : true,
    //       interactionElement  : 'interaction',
    //       interactionEvents   : ['mouseup', 'touchend'],
    //       conversions         : false,
    //       conversionElement   : 'conversion',
    //       conversionEvents    : ['mouseup', 'touchend'],
    //       endpoint            : 'http://youarehere.com/cgi/stats.py',
    //       async               : true,
    //       debug               : false
    //   });
    // }

    /* * * *
     * Helper Functions
     */
    function triggerView(href) {
      //strip out hash, if it's there
      href = href.replace(/^.*#/, '');
      switch(href) {
        case 'about':
          $viewButton.data('href', '');
          $viewButton.html('HOME');
          break;
        case '':
          $viewButton.data('href', 'about');
          $viewButton.html('ABOUT');
          break;
      }
    }

    function show(url) {

      var view = url.split('/')[0];

      // Hide current page
      $('.current').removeClass('current visible');

      switch( view ) {
        // Homepage.
        case '': 
          $('.story').addClass('current visible');
          $('.responses').addClass('current visible');
          break;

        // About
        case '#about':
          $('.about').addClass('current visible');
          break;

        // 404 Not Found / Error
        default:
          $('.error').addClass('current visible');
      }

    }

    /* * * *
     * Audio Controls
     */
    function toggleAudio(audio, btn) {

      // first, stop any currently playing audio
      if( currentAudio.audio && currentAudio.audio != audio) {
        onAudioEnd(currentAudio);
      }

      // update currentAudio
      currentAudio.audio = audio;
      currentAudio.btn = btn;

      // then toggle audio state
      if (currentAudio.audio.paused) {

        currentAudio.audio.addEventListener('ended', function() {
          onAudioEnd(currentAudio);
        });

        currentAudio.audio.play();

        $(currentAudio.btn).removeClass('play')
              .addClass('pause');
      } 
      else { 
        onAudioEnd(currentAudio);
        currentAudio = {};
      }
    }

    function onAudioEnd(obj) {
      obj.audio.removeEventListener('ended', onAudioEnd);
      obj.audio.pause();
      obj.audio.currentTime = 0;
      $(obj.btn).removeClass('pause')
                .addClass('play');
    }

    /* * * *
     * Ready to go, load the config
     */
    //loadConfig();
    // $story.find('.btn-audio').on('click', function (e) {
    $('.story').find('.btn-audio').on('click', function (e) {
      e.preventDefault();
      toggleAudio( $('.story').find('audio').get(0), $(this) );
    });

  });

}($));