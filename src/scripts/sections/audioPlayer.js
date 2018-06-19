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
    audioPlayerTrackTrigger: '[data-audio-player-track-trigger]',
    audioPlayerPrev: '[data-audio-player-prev]',
    audioPlayerNext: '[data-audio-player-next]'
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

    this.$audioTab          = $(selectors.audioTab, this.$container);
    this.$audioTabToggle    = $(selectors.audioTabToggle, this.$container);
    this.$playerTrackAudio  = $(selectors.audioPlayerTrackAudio, this.$container);
    this.$playerTrackTitle  = $(selectors.audioPlayerTrackTitle, this.$container);
    this.$playerPrevControl = $(selectors.audioPlayerPrev, this.$container);
    this.$playerNextControl = $(selectors.audioPlayerNext, this.$container);

    this.cookies = {};
    this.cookies.playing   = slate.user.generateCookie('playerPlaying');
    this.cookies.audioFile = slate.user.generateCookie('playerAudioFile');
    this.cookies.position  = slate.user.generateCookie('playerPosition');

    this.player = new Plyr(this.$playerTrackAudio, {
      controls: ['play', 'progress', 'current-time']
    });

    if(this.playlist.length) {
      this.setTrack(this.playlist[this.playlistPlayingIndex]);
    }

    if(this.playlist.length <= 1) {
      this.hidePlayListControls();
    }

    this.player.on('ready', this.onPlayerReady.bind(this));
    this.player.on('playing', this.onPlayerPlaying.bind(this));
    this.player.on('pause', this.onPlayerPause.bind(this));
    this.player.on('timeupdate', this.onPlayerTimeUpdate.bind(this));
    this.player.on('ended', this.onPlayerEnded.bind(this));
    this.$container.on('click', selectors.audioTabToggle, this.onAudioTabToggleClick.bind(this));
    this.$container.on('click', selectors.audioPlayerPrev, this.onAudioPlayerPrevClick.bind(this));
    this.$container.on('click', selectors.audioPlayerNext, this.onAudioPlayerNextClick.bind(this));

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

    goToPreviousTrack: function() {
      var playlistLength = this.playlist.length;
      var previousTrackIndex = this.playlistPlayingIndex - 1;

      if (previousTrackIndex < 0) {
        previousTrackIndex = this.playlist.length - 1; // Make it cyclical
      }

      this.goToTrackByPlaylistIndex(previousTrackIndex);
    },

    goToNextTrack: function() {
      var playlistLength = this.playlist.length;
      var nextTrackIndex = this.playlistPlayingIndex + 1;

      if (nextTrackIndex === this.playlist.length) {
        nextTrackIndex = 0;
      }

      this.goToTrackByPlaylistIndex(nextTrackIndex);
    },

    goToTrackByPlaylistIndex: function(index) {
      if(index >= this.playlist.length || index < 0) return;

      if(index != this.playlistPlayingIndex) {
        this.playlistPlayingIndex = index;
        this.setTrack( this.playlist[this.playlistPlayingIndex] );
      }
    },

    playTrackByPlaylistIndex: function(index) {
      if(index == this.playlistPlayingIndex) {
        this.open();
      }
      else {
        this.goToTrackByPlaylistIndex(index);
        this.player.currentTime = 0;
      }

      this.player.play();  
    },

    addTrackToPlaylist: function(track) {
      if(!track.link || !track.title || !track.src) {
        console.warn('['+this.name+'] - A valid track is required to add to the playlist');
        return;
      }

      this.playlist.push(track);
      this.$audioTab.addClass(classes.audioTabReady);
      this.showPlayListControls();
    },

    setTrack: function(track) {
      if (!track || this.$playerTrackAudio.find('source').attr('src') == track.src) return;

      var $trackLink = $('<a>').attr('href', track.link).text('Now Playing: ' + track.title);
      this.$playerTrackTitle.html($trackLink);

      this.player.stop();

      this.player.source = {
          type: 'audio',
          title: track.title,
          sources: [
            {
              src: track.src,
              type: 'audio/mp3',
            }
          ]
        };
    },

    onPlayerReady: function() {
      if(this.playlist.length) {
        this.$audioTab.addClass(classes.audioTabReady);
      }
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
      this.goToNextTrack();
      this.player.play();
    },

    showPlayListControls: function() {
      this.$playerPrevControl.removeClass('hidden');
      this.$playerNextControl.removeClass('hidden');
    },

    hidePlayListControls: function() {
      this.$playerPrevControl.addClass('hidden');
      this.$playerNextControl.addClass('hidden');
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

    onAudioPlayerPrevClick: function(e) {
      e.preventDefault();
      var playing = this.player.playing;
      this.goToPreviousTrack();
      if(playing) {
        this.player.play();
      }
    },

    onAudioPlayerNextClick: function(e) {
      e.preventDefault();
      var playing = this.player.playing;
      this.goToNextTrack();
      if(playing) {
        this.player.play();
      }
    },

    onAudioPlayerTrackTrigger: function(e) {
      var data = $(e.currentTarget).data('audio-player-track-trigger');

      if(!Array.isArray(data)) {
        data = [data];
      }

      if(!data.length) {
        return;
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
            if(firstAlreadyInPlaylistIndex == undefined) {
              firstAlreadyInPlaylistIndex = j;
            }
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
