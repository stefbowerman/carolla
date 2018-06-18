/**
 * Hero Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace - hero
 */

theme.Hero = (function($) {

  var $window = $(window);

  var selectors = {
    hero: '[data-hero]',
    pencilBanner: '[data-pencil-banner]',
    header: '[data-header]',
    slideshowWrapper: '[data-slideshow-wrapper]',
    slide: '[data-slideshow-slide]'
  };

  var classes = {

  };

  function Hero(container) {

    this.$container = $(container);

    this.name = 'hero';
    this.namespace = '.'+this.name;
    this.$hero = $(selectors.hero, this.$container);

    var events = {
      RESIZE: 'resize' + this.namespace
    };

    this.fullscreenBehavior = this.$container.data('fullscreen-behavior') || false;

    if(this.fullscreenBehavior) {
      $window.on(events.RESIZE, $.throttle(20, this.onResize.bind(this)) );
      this.onResize();
    }

    var settings = {
      dots: ($(selectors.slide, this.$container).length > 1 ? true : false),
      arrows: false,
      autoplay: true
    };

    this.slideshow = new slate.models.Slideshow( $(selectors.slideshowWrapper, this.$container), settings);
  };

  Hero.prototype = $.extend({}, Hero.prototype, {
    onResize: function() {
      if(!this.fullscreenBehavior) return;

      if($window.width() < slate.breakpoints.getBreakpointMinWidth('sm')) {
        this.$hero.css('height', 'auto');
        return;
      }

      // @todo - make this a little better.. can we do it without checking pencilbanner and header heights?
      var $pencilBanner = $(selectors.pencilBanner);
      var $header = $(selectors.header);
      var pageOffsetHeight = $header.outerHeight() + ($pencilBanner.length ? $pencilBanner.outerHeight() : 0);
      var windowHeight = $window.height();
      
      this.$hero.css('height', $window.height() - pageOffsetHeight);
    },

    /**
     * Theme Editor section events below
     */
    onBlockSelect: function(evt) {
      this.slideshow.goToSlideByBlockId( evt.detail.blockId );
      this.slideshow.pause();
    }
  });

  return Hero;
})(jQuery);