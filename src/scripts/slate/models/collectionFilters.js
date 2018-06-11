/**
 * Model - Collection Filters - Desktop + Mobile
 * ------------------------------------------------------------------------------
 *
 * @namespace - models.collectionFilters
 */

slate.models = slate.models || {}; 

slate.models.CollectionFilters = (function(){

  var $body = $(document.body);
  
  var selectors = {
    filterSelect: '[data-filter-select]'  
  };

  var classes = {
  };  

  /**
   * CollectionFilters constructor
   *
   * @param {HTMLElement} container - Container element used for scoping any element selection
   * @param {Object} collectionData - see the bottom of `sections/collection.liquid`
   */
  function CollectionFilters(container, collectionData) {
    this.$container = $(container);

    this.name = 'collectionFilters';
    this.namespace = '.'+this.name;

    // Stop parsing if we don't have the collection data
    if (!collectionData) {
      return;
    }

    this.$container.on('change', selectors.filterSelect, this.onFilterSelectChange.bind(this));
  }

  CollectionFilters.prototype = $.extend({}, CollectionFilters.prototype, {  

    /**
     * Redirects the browser to the passed in URL while mainting the query string
     *
     * @param (string) url
     */
    redirect: function(url) {
      window.location.href = url + slate.utils.getQueryString();
    },

    /**
     * Applies the selected filter options
     * Looks for selected options and creates a URL for them, then redirects the browser
     *
     * @param (event) e - click event
     */
    onFilterSelectChange: function(e) {

      var $select = $(e.currentTarget);
      var url = $select.val();

      this.redirect(url);      
    }
   
  });

  return CollectionFilters;
})();