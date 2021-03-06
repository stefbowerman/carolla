/**
 * Article Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace - article
 */

theme.Article = (function($) {

  var selectors = {
    articleContent: '[data-article-content]'
  };

  var classes = {
    galleryImageLink: 'gallery-image'
  };

  function Article(container) {

    this.$container = $(container);

    this.name = 'article';
    this.namespace = '.'+this.name;

    this.articleType = this.$container.data('article-type');

    if(this.articleType == "podcast") {
      this.$container.find(selectors.articleContent).find('img').each(function() {
        var $link = $('<a>');
        var $img = $(this);
        var src  = $img.attr('src');

        var size = slate.Image.imageSize(src);
            size += '.'; // make sure we get the size right before the '.'

        if(size) {
          src = src.replace(size, '1000x.');
        }

        $link.attr('href', src);
        $link.addClass(classes.galleryImageLink);

        $img.wrap($link);
      });
    }

    $('.' + classes.galleryImageLink).simpleLightbox({
      captionSelector: 'img',
      captionType: 'attr',
      captionsData: 'alt'
    });

  }

  Article.prototype = $.extend({}, Article.prototype, {

  });

  return Article;
})(jQuery);
