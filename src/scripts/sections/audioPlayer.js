/**
 * Audio Player Section Script
 * ------------------------------------------------------------------------------
 *
 * Requires:
 *  - Plyr
 *
 * @namespace - audioPlayer
 */

theme.AudioPlayer = (function($, slate, Plyr) {

  var selectors = {
    audioPlayerAudio: '[data-audio-player-audio]',
    audioTab: '[data-audio-tab]',
    audioTabToggle: '[data-audio-tab-toggle]'
  };

  var classes = {
    audioTabReady: 'is-ready',
    audioTabOpen: 'is-open',
    audioTabPlaying: 'is-playing'
  };

  /**
   * AudioPlayer section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   *
   * @param {string} container - selector for the section container DOM element
   */
  function AudioPlayer(container) {
    this.$container = $(container);

    this.name = 'audioPlayer';
    this.namespace = '.'+this.name;

    var mp3Url = this.$container.data('mp3-url');

    var $el = $(selectors.audioPlayerAudio, this.$container);

    this.$audioTab = $(selectors.audioTab, this.$container);
    this.player = new Plyr($el);

    this.player.on('ready', function() {
      this.$audioTab.addClass(classes.audioTabReady);
    }.bind(this));

    this.player.on('playing', function() {
      this.$audioTab.addClass(classes.audioTabPlaying);
    }.bind(this));

    this.player.on('pause', function() {
      this.$audioTab.removeClass(classes.audioTabPlaying);
    }.bind(this));

    this.$container.on('click', selectors.audioTabToggle, this.onAudioTabToggleClick.bind(this));


  }

  AudioPlayer.prototype = $.extend({}, AudioPlayer.prototype, {

    onAudioTabToggleClick: function(e) {
      e.preventDefault();
      var $toggle = $(e.currentTarget);

      if(this.$audioTab.hasClass(classes.audioTabOpen)) {
        this.$audioTab.removeClass(classes.audioTabOpen);

        if(this.player.playing) {
          $toggle.text('Now Playing');  
        }
        else {
          $toggle.text('Listen Now');  
        }
      }
      else {
        this.$audioTab.addClass(classes.audioTabOpen);
        $toggle.text('Hide Player');
      }
    } 

  });

  return AudioPlayer;
})(jQuery, slate, Plyr);
