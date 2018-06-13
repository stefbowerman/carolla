window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
// =require slate/a11y.js
// =require slate/utils.js
// =require slate/rte.js
// =require slate/sections.js
// =require slate/currency.js
// =require slate/images.js
// =require slate/variants.js
// =require slate/ajaxCart.js
// =require slate/ajaxMailChimpForm.js
// =require slate/ajaxKlaviyoForm.js
// =require slate/animations.js
// =require slate/user.js
// =require slate/breakpoints.js
// =require slate/productCard.js
// =require slate/productDetailForm.js
// =require slate/quickView.js

// =require slate/models/dropdown.js
// =require slate/models/dropdownManager.js
// =require slate/models/drawer.js
// =require slate/models/slideshow.js
// =require slate/models/slideup.js
// =require slate/models/slideupAlert.js
// =require slate/models/overlay.js
// =require slate/models/quickView.js
// =require slate/models/collectionFilters.js
// =require slate/models/collectionSort.js

/*================ Sections ================*/
// =require sections/product.js
// =require sections/collection.js
// =require sections/pencilBanner.js
// =require sections/subscriptionModal.js
// =require sections/subscriptionSlideup.js
// =require sections/subscription.js
// =require sections/instagramFeed.js
// =require sections/slideshow.js
// =require sections/header.js
// =require sections/footer.js
// =require sections/ajaxCart.js
// =require sections/cart.js
// =require sections/mobileMenu.js
// =require sections/blog.js
// =require sections/hero.js
// =require sections/audioPlayer.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js
// =require templates/page-styles.js
// =require templates/page-components.js

(function($) {

  var $window       = $(window);
  var $document     = $(document);
  var $body         = $(document.body);

  $(document).ready(function() {
    var sections = new slate.Sections();
    sections.register('product', theme.Product);
    sections.register('collection', theme.Collection);
    sections.register('pencil-banner', theme.PencilBanner);
    sections.register('subscription-modal', theme.SubscriptionModal);
    sections.register('subscription-slideup', theme.SubscriptionSlideup);
    sections.register('subscription', theme.Subscription);
    sections.register('instagram-feed', theme.InstagramFeed);
    sections.register('slideshow', theme.Slideshow);
    sections.register('header', theme.Header);
    sections.register('footer', theme.Footer);
    sections.register('ajax-cart', theme.AjaxCart);
    sections.register('cart', theme.Cart);
    sections.register('mobile-menu', theme.MobileMenu);
    sections.register('blog', theme.Blog);
    sections.register('hero', theme.Hero);
    sections.register('audio-player', theme.AudioPlayer);

    $('.in-page-link').on('click', function(evt) {
      slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
    });

    // Common a11y fixes
    slate.a11y.pageLinkFocus($(window.location.hash));    

    // Target tables to make them scrollable
    slate.rte.wrapTables({
      $tables: $('.rte table'),
      tableWrapperClass: 'table-responsive'
    });

    // Target iframes to make them responsive
    var iframeSelectors =
      '.rte iframe[src*="youtube.com/embed"],' +
      '.rte iframe[src*="player.vimeo"]';

    slate.rte.wrapIframe({
      $iframes: $(iframeSelectors),
      iframeWrapperClass: 'rte__video-wrapper'
    });

    // Apply UA classes to the document
    slate.utils.userAgentBodyClass();    

    // Apply a specific class to the html element for browser support of cookies.
    if (slate.utils.cookiesEnabled()) {
      document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
    }

    // Chosen JS plugin for select boxes
    slate.utils.chosenSelects();

    // Global handler for form inputs that come back with errors applied
    $('.form-group.has-error').on('change keydown', '.form-control', function() {
      $(this).parents('.has-error').removeClass('has-error');
    });

    // START - Global handler for collapse plugin to add state class for open panels
    var panelIsOpenClass = 'is-open';

    $document.on('show.bs.collapse', '.collapse', function(e) {
      $(e.currentTarget).parents('.panel').addClass(panelIsOpenClass);
    });

    $document.on('hide.bs.collapse', '.collapse', function(e) {
      $(e.currentTarget).parents('.panel').removeClass(panelIsOpenClass);
    });    

    $('.collapse.in').each(function() {
      $(this).parents('.panel').addClass(panelIsOpenClass);
    });
    // END - Global handler for collapse plugin to add state class for open panels

    // If we have the search overlay, make sure we focus the input when it opens
    var $searchOverlay = $('#search-overlay');
    if($searchOverlay.length) {
      $searchOverlay.on('shown.overlay', function() {
        // Due to CSS animations, this timeout is requirec
        setTimeout(function(){
          $searchOverlay.find('input[type="search"]').focus();
        }, 10);
      });
    }

    // Open external links in a new window
    $(document.links).filter(function() {
      return this.hostname != window.location.hostname;
    }).attr('target', '_blank');

  });

}(jQuery));
