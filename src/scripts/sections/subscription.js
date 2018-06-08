/**
 * Subscription Section Script
 * ------------------------------------------------------------------------------
 *
 * Requires:
 *  - slate.utils
 *  - slate.user
 *
 * Details are dependent on:
 *  - Mailing list provider (See settings_schema.json)
 *  - 3rd party ajax / validation scripts
 *
 * @namespace - subscription
 */

theme.Subscription = (function($, slate) {

  var selectors = {
    formContent: '[data-subscription-form-content]',
    formMessage: '[data-subscription-form-message]'
  };

  var classes = {
    showMessage: 'show-message'
  };

  /**
   * Subscription section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   *
   * @param {string} container - selector for the section container DOM element
   */
  function Subscription(container) {
    this.$container = $(container);

    this.name = 'subscription';
    this.namespace = '.'+this.name;

    // DOM elements we'll need
    this.$formContent = $(selectors.formContent, this.$container);
    this.$formMessage = $(selectors.formMessage, this.$container);
    this.$form = this.$formContent.find('form');
    
    var ajaxForm = new slate.AjaxMailChimpForm(this.$form, {
      onSubmitFail: this.onSubmitFail.bind(this),
      onSubscribeSuccess: this.onSubscribeSuccess.bind(this),
      onSubscribeFail: this.onSubscribeSuccess.bind(this)
    });

  }

  Subscription.prototype = $.extend({}, Subscription.prototype, {

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

    onSubmitFail: function() {
      this.$formMessage.html( this.$formMessage.data('message-fail') );     
      this.$formContent.addClass(classes.showMessage);
      setTimeout(function(){
        this.$formContent.removeClass(classes.showMessage);
      }.bind(this), 5000);
    },

    /**
     * Theme Editor section events below
     */
    onSelect: function() {

    },

    onDeselect: function() {

    }
  });

  return Subscription;
})(jQuery, slate);
