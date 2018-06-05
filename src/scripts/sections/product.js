/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 * Uses slate.productDetailForm to handle core product form functionality.
 *
 * - Attaches the `Product` constructor to window.theme.Product.
 *
 * Requires:
 *  - jQuery
 *  - jQuery.fn.zoom - http://www.jacklmoore.com/zoom/
 *  - Slate
 *
 * See:
 * - product.liquid
 * - product-detail-form.liquid
 *
 * @namespace product
 */

theme.Product = (function($, slate) {

  var selectors = {

  };
  
  var $window   = $(window);
  var $document = $(document);

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    this.settings = {};
    this.name = 'product';
    this.namespace = '.'+this.name;

    this.events = {
      RESIZE: 'resize'  + this.namespace,
      CLICK: 'click'   + this.namespace,
      SCROLL: 'scroll' + this.namespace
    };

    var productDetailForm = new slate.ProductDetailForm({
      $el: this.$container,
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      enableZoom: this.$container.data('zoom-enabled') || false
    });

    productDetailForm.initialize();

  }

  Product.prototype = $.extend({}, Product.prototype, {
    
  });

  return Product;
})(jQuery, slate);
