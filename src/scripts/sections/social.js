/**
 * Social Section Script
 * ------------------------------------------------------------------------------
 * 
 * Uses Instafeed.js to interact with Instagram API
 *   - See instafeedjs.com for documentation
 *   - See scripts/vendor directory for source file
 *
 * @namespace - social
 */

theme.Social = (function($, Instafeed) {

  var selectors = {
    instagramTarget: '[data-instagram-feed-target]',
    facebookTarget: '[data-facebook-target]',
    twitterTarget: '[data-twitter-target]',
    template: 'script[data-instagram-media-template]'
  };

  var classes = {

  };

  var facebookEmbed = '<div class="fb-page" data-href="https://www.facebook.com/adamcarolla" data-tabs="timeline" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="false"><blockquote cite="https://www.facebook.com/adamcarolla" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/adamcarolla">Adam Carolla</a></blockquote></div>';
  var twitterEmbed = '<a class="twitter-timeline" data-theme="dark" href="https://twitter.com/adamcarolla?ref_src=twsrc%5Etfw">Tweets by adamcarolla</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';

  /**
   * Social section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   *
   * @param {string} container - selector for the section container DOM element
   */
  function Social(container) {
    this.$container = $(container);

    this.name = 'social';
    this.namespace = '.'+this.name;

    this.$instagramTarget = $(selectors.instagramTarget, this.$container);
    this.$facebookTarget = $(selectors.facebookTarget);
    this.$twitterTarget = $(selectors.twitterTarget);

    // Compile this once during initialization
    this.template = Handlebars.compile($(selectors.template).html());    

    this.settings = {
      accessToken: this.$container.data('access-token'),
      get: 'user',
      mock: true,
      success: this.onInstafeedMockSuccess.bind(this),
      limit: 6
    };

    if(!this.settings.accessToken) {
      console.warn('[InstagramFeed] - An access token is required to interact with the Instagram API');
      return;
    }

    this.init();
  }

  Social.prototype = $.extend({}, Social.prototype, {

    /**
     * Kick off the network requests.  Retrieve the user profile from the API and then fire up the feed.
     *
     */
    init: function() {

      // Instagram stuff
      $.ajax({
        type: 'GET',
        url: 'https://api.instagram.com/v1/users/self?access_token=' + this.settings.accessToken,
        dataType: 'jsonp'
      })
      .then(function(response){
        
        // Handle invalid response
        if(response.meta.hasOwnProperty('error_message')){
          console.warn('['+this.name+'] - ' + response.meta.error_message);
          return;
        }

        this.settings.userId = response.data.id;

        /*
         *  Use this space to make any adjustments to the section now that you have access to the user profile object
         */

        this.feed = new Instafeed(this.settings);
        this.feed.run();
      }.bind(this));

      // Other social
      this.$facebookTarget.html(facebookEmbed);
      this.$twitterTarget.html(twitterEmbed);

    },

  /**
   * Callback that runs after Instafeed.run() if the 'mock' setting is set to true
   * Use this function to sort through images, select proper resolution, and construct a gallery of images to insert into the DOM
   *
   * @param {Object} feed - object returned from Instagram API
   * @param {Array} feed.data - Array of feed data objects containing images + info
   */
    onInstafeedMockSuccess: function(feed) {
      
      var self = this;

      feed.data.forEach(function(photo){

        var data = {
          url: photo.link,
          src: photo.images && photo.images.standard_resolution && photo.images.standard_resolution.url,
          caption: photo.caption && photo.caption.text || ''
        };

        self.$instagramTarget.append(self.template(data));
      });

    },

    /**
     * Theme Editor section events below
     */
    onSelect: function() {
      console.log('['+this.name+'] - section:select');
    },

    onShow: function() {
      console.log('['+this.name+'] - section:show');
    },

    onLoad: function() {
      console.log('['+this.name+'] - section::load');
    },

    onUnload: function() {
      console.log('['+this.name+'] - section::unload');
    }
  });

  return Social;
})(jQuery, Instafeed);
