/**
 * Footer Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace - footer
 */

theme.Footer = (function($) {

  var selectors = {
    formContent: '[data-subscription-form-content]',
    formMessage: '[data-subscription-form-message]'
  };

  var classes = {
    showMessage: 'show-message'
  };

  function Footer(container) {

    this.$container = $(container);

    this.name = 'footer';
    this.namespace = '.'+this.name;

    // DOM elements we'll need
    this.$formContent = $(selectors.formContent, this.$container);
    this.$formMessage = $(selectors.formMessage, this.$container);
    this.$form = this.$formContent.find('form');
    
    var ajaxForm = new slate.AjaxMailChimpForm(this.$form, {
      onSubmitFail: this.onSubmitFail.bind(this),
      onSubscribeSuccess: this.onSubscribeSuccess.bind(this),
      onSubscribeFail: this.onSubmitFail.bind(this)
    });

  }

  Footer.prototype = $.extend({}, Footer.prototype, {
    /**
     * Resets everything to it's initial state.
     */
    reset: function() {
      this.$formContent.find('input[type="email"]').val('');
      this.$formMessage.html('');
      this.$formContent.removeClass(classes.showMessage);
    },

    onSubscribeSuccess: function() {
      this.$formMessage.html( this.$formMessage.data('message-success') );
      this.$formContent.addClass(classes.showMessage);
      setTimeout(this.reset.bind(this), 5000); 
    },

    onSubmitFail: function(message) {
      this.$formMessage.html( message );     
      this.$formContent.addClass(classes.showMessage);
      setTimeout(function(){
        this.$formContent.removeClass(classes.showMessage);
      }.bind(this), 5000);
    }
  });

  return Footer;
})(jQuery);
