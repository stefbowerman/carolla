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
    config: '[data-player-json]',
    audioTab: '[data-audio-tab]',
    audioTabToggle: '[data-audio-tab-toggle]',
    audioPlayerTrackAudio: '[data-audio-player-track-audio]',
    audioPlayerTrackTitle: '[data-audio-player-track-title]',
    audioPlayerTrackTrigger: '[data-audio-player-track-trigger]'
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

    this.playlist = [];
    this.playlistPlayingIndex = 0;

    if ($(selectors.config, this.$container).length) {
      var config    = JSON.parse($(selectors.config, this.$container).html());
      this.playlist = config.playlist;
    }

    console.log(this.playlist);

    this.$audioTab         = $(selectors.audioTab, this.$container);
    this.$audioTabToggle   = $(selectors.audioTabToggle, this.$container);
    this.$playerTrackAudio = $(selectors.audioPlayerTrackAudio, this.$container);
    this.$playerTrackTitle = $(selectors.audioPlayerTrackTitle, this.$container);

    this.cookies = {};
    this.cookies.playing   = slate.user.generateCookie('playerPlaying');
    this.cookies.audioFile = slate.user.generateCookie('playerAudioFile');
    this.cookies.position  = slate.user.generateCookie('playerPosition');

    if(this.playlist.length) {
      this.setTrack(this.playlist[this.playlistPlayingIndex]);
    }

    this.player = new Plyr(this.$playerTrackAudio, {
      controls: ['play', 'progress', 'current-time']
    });

    this.player.on('ready', this.onPlayerReady.bind(this));
    this.player.on('playing', this.onPlayerPlaying.bind(this));
    this.player.on('pause', this.onPlayerPause.bind(this));
    this.player.on('timeupdate', this.onPlayerTimeUpdate.bind(this));
    this.player.on('ended', this.onPlayerEnded.bind(this));
    this.$container.on('click', selectors.audioTabToggle, this.onAudioTabToggleClick.bind(this));

    // These can come from anywhere on the site
    $(document).on('click', selectors.audioPlayerTrackTrigger, this.onAudioPlayerTrackTrigger.bind(this));
  }

  AudioPlayer.prototype = $.extend({}, AudioPlayer.prototype, {

    _cookieCheck: function() {
      if(slate.user.hasCookie(this.cookies.playing.name)) {
        this.open();
        this.player.play();
      }
      if(slate.user.hasCookie(this.cookies.position.name)) {
        this.player.currentTime = parseInt(slate.user.getCookieValue(this.cookies.position.name));
      }
    },

    playNextTrack: function() {
      var playlistLength = this.playlist.length;
      var nextTrackIndex = this.playlistPlayingIndex + 1;

      if (nextTrackIndex === this.playlist.length) {
        nextTrackIndex = 0;
      }

      this.playTrackByPlaylistIndex(nextTrackIndex);
    },

    playTrackByPlaylistIndex: function(index) {
      if(index >= this.playlist.length || index < 0) return;

      if(index != this.playlistPlayingIndex) {
        this.playlistPlayingIndex = index;
        this.setTrack( this.playlist[this.playlistPlayingIndex] );
      }

      this.player.currentTime = 0;
      this.player.play();  
    },

    addTrackToPlaylist: function(track) {
      if(!track.link || !track.title || !track.src) {
        console.warn('['+this.name+'] - A valid track is required to add to the playlist');
        return;
      }

      this.playlist.push(track);
    },

    setTrack: function(track) {
      if (!track) return;

      var $trackLink = $('<a>').attr('href', track.link).text('Now Playing: ' + track.title);

      this.$playerTrackTitle.html($trackLink);
      this.$playerTrackAudio.find('source').attr('src', track.src);
    },

    onPlayerReady: function() {
      this.$audioTab.addClass(classes.audioTabReady);
      this._cookieCheck();
    },

    onPlayerPlaying: function() {
      this.open();
      this.$audioTab.addClass(classes.audioTabPlaying);
      slate.user.setCookie(this.cookies.playing);
    },

    onPlayerPause: function() {
      this.$audioTab.removeClass(classes.audioTabPlaying);
      slate.user.removeCookie(this.cookies.playing.name);
    },

    onPlayerTimeUpdate: function(e) {
      this.cookies.position.value = Math.round(e.detail.plyr.currentTime);
      slate.user.setCookie(this.cookies.position);
    },

    onPlayerEnded: function() {
      this.playNextTrack();
    },

    open: function() {
      this.$audioTab.addClass(classes.audioTabOpen);
    },

    close: function() {
      this.$audioTab.removeClass(classes.audioTabOpen);
    },

    toggle: function() {
      this.$audioTab.hasClass(classes.audioTabOpen) ? this.close() : this.open();
    },

    onAudioTabToggleClick: function(e) {
      e.preventDefault();
      this.toggle();
    },

    onAudioPlayerTrackTrigger: function(e) {
      var data = JSON.parse($(e.currentTarget).data('audio-player-track-trigger'));

      if(!Array.isArray(data)) {
        data = [data];
      }

      var firstAddedTrackIndex; // If the data has multiple entries, save the index of the *first* entry that we add to the playlist
      var firstAlreadyInPlaylistIndex; // If the playlist already has the track in it, save the index of that track so we can play it.

      for (var i = 0; i < data.length; i++) {
        var track = data[i];
        var trackAlreadyInPlayList = false;

        for (var j = this.playlist.length - 1; j >= 0; j--) {
          var playlistTrack = this.playlist[j];
          if(playlistTrack.src == track.src) {
            trackAlreadyInPlayList = true;
            firstAlreadyInPlaylistIndex = j;
          }
        }

        if(!trackAlreadyInPlayList) {
          this.addTrackToPlaylist(track);

          if(!firstAddedTrackIndex) {
            firstAddedTrackIndex = this.playlist.length - 1;
          }
        }
        else {

        }
      }

      if(firstAddedTrackIndex != undefined) {
        e.preventDefault();
        this.playTrackByPlaylistIndex(firstAddedTrackIndex);
      }
      else if(firstAlreadyInPlaylistIndex != undefined) {
        e.preventDefault();
        this.playTrackByPlaylistIndex(firstAlreadyInPlaylistIndex);
      }
      else {
        // let it link normally
      }
    }

  });

  return AudioPlayer;
})(jQuery, slate, Plyr);
