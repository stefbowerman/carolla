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
// =require sections/social.js
// =require sections/article.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js
// =require templates/page-styles.js
// =require templates/page-components.js

(function($) {

  var $window       = $(window);
  var $document     = $(document);
  var $body         = $(document.body);
  var sections      = new slate.Sections();

  var panelIsOpenClass = 'is-open';

  function registerGlobalSections() {
    sections.register('mobile-menu', theme.MobileMenu);
    sections.register('audio-player', theme.AudioPlayer);
    sections.register('header', theme.Header);
    sections.register('footer', theme.Footer);
    sections.register('ajax-cart', theme.AjaxCart);
    // sections.register('pencil-banner', theme.PencilBanner);
    // sections.register('subscription-modal', theme.SubscriptionModal);
    // sections.register('subscription-slideup', theme.SubscriptionSlideup);
  }

  function registerContentSections() {
    sections.register('blog', theme.Blog);
    sections.register('hero', theme.Hero);
    sections.register('product', theme.Product);
    sections.register('collection', theme.Collection);
    sections.register('subscription', theme.Subscription);
    sections.register('instagram-feed', theme.InstagramFeed);
    sections.register('slideshow', theme.Slideshow);
    sections.register('cart', theme.Cart);
    sections.register('social', theme.Social);
    sections.register('article', theme.Article);
  }

  function unregisterContentSections() {
    sections.unregister('blog');
    sections.unregister('hero');
    sections.unregister('product');
    sections.unregister('collection');
    sections.unregister('subscription');
    sections.unregister('instagram-feed');
    sections.unregister('slideshow');
    sections.unregister('cart');
    sections.unregister('social');
    sections.unregister('article');
  }

  // Runs everytime pjax completes an AJAX request
  function domReadyContent() {

    unregisterContentSections();
    registerContentSections();

    $('.collapse.in').each(function() {
      $(this).parents('.panel').addClass(panelIsOpenClass);
    });

    // Open external links in a new window
    $(document.links).filter(function() {
      return this.hostname != window.location.hostname;
    }).attr('target', '_blank');

    // Global handler for form inputs that come back with errors applied
    $('.form-group.has-error').on('change keydown', '.form-control', function() {
      $(this).parents('.has-error').removeClass('has-error');
    });

    // Chosen JS plugin for select boxes
    slate.utils.chosenSelects();

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
  }

  // Runs once on initial page load
  function domReadyOnce() {

    registerGlobalSections();

    // Apply UA classes to the document
    slate.utils.userAgentBodyClass();    

    // Apply a specific class to the html element for browser support of cookies.
    if (slate.utils.cookiesEnabled()) {
      document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
    }

    // START - Global handler for collapse plugin to add state class for open panels
    $document.on('show.bs.collapse', '.collapse', function(e) {
      $(e.currentTarget).parents('.panel').addClass(panelIsOpenClass);
    });

    $document.on('hide.bs.collapse', '.collapse', function(e) {
      $(e.currentTarget).parents('.panel').removeClass(panelIsOpenClass);
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

    domReadyContent();

    // AJAX-ify the site
    if(!slate.utils.isThemeEditor()) {

      $document.pjax('a', '#MainContent', { fragment: '#MainContent', timeout: 10000 });

      // $document.on('submit', 'form[data-pjax]', function(event) {
      //   event.preventDefault();
      //   $.pjax.submit(event, '#MainContent', {
      //       'push': true,
      //       'replace': false,
      //       'timeout': 5000,
      //       'scrollTo': 0,
      //       'maxCacheLength': 0
      //   });
      // });
      
      $document.on('pjax:start', function() {
        $body.addClass('pjax-loading');
      });
      
      $document.on('pjax:end', function(event) {
        // console.log('pjax end.  reinit!');
        $body.removeClass('pjax-loading');
        domReadyContent();
      });
    }
    else {
      domReadyContent();
    }
  }

  $(document).ready(function() {

    domReadyOnce();

  });

}(jQuery));
