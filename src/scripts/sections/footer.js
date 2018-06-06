/**
 * Footer Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace - footer
 */

theme.Footer = (function($) {

  var selectors = {

  };

  var classes = {

  };

  function Footer(container) {

    this.$container = $(container);

    this.name = 'footer';
    this.namespace = '.'+this.name;

  }

  Footer.prototype = $.extend({}, Footer.prototype, {

  });

  return Footer;
})(jQuery);
