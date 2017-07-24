(function($){
  /**
   * @plugin $.fn.carousel
   * @param  {Object} options The configuration of the carousel instance
   * @return {Object}         The carousel instance
   */
  $.fn.carousel = function(options){
    return this.each(function(){

      var element = $(this),
          instance = $.data(this, 'carousel'),
          config = $.extend({}, {
            template: ''
          }, options || {});

      if(!instance){
        $.data(this, 'carousel', new Carousel(element, config));
      }

      return element;
    });
  };

  /**
   * @class carousel
   * @param {Element} container The DOM element
   * @param {Object}  config    The configuration of this instance
   */
  var Carousel = function(container, config){
    this.config = config;
    this.container = container;
    this.position = 0;
    this.page = 0;

    if(!config.width){
      config.width = container.parent().width();
    }else{
      container.width(config.width);
    }

    this
      // initialize everything
      .init()
      // bind all listeners
      .listen();
  };

  $.extend(Carousel.prototype, {
    /**
     * Initializes the carousel component and builds the presentation
     * @return {Object} Carousel instance
     */
    init: function(){
      var self = this,
          items = [];

      if(this.config.data){
        // build each item in the carousel from the passed dataset
        $.each(this.config.data, function(item, index){
          items.push(
            $.format(self.config.itemTemplate, item)
          );
        });
      }

      // append carousel template to container element
      var carousel = this.container.append(
        // inject our carousel items into the carousel template
        $.format(this.config.template, {
          items: items.join('')
        })
      );

      this.wrapper = carousel.find('.carousel')
      this.viewport = carousel.find('.carousel-viewport');
      this.content = carousel.find('.carousel-content');
      this.prev = carousel.find('.carousel-prev');
      this.next = carousel.find('.carousel-next');
      this.items = this.content.children();
      this.viewportSize = this.viewport[0].offsetWidth;
      this.itemWidth = Math.abs(this.viewportSize / 4);
      this.maxSize = this.items.length * this.itemWidth;
      this.movement = Math.ceil(this.viewportSize / this.itemWidth) * this.itemWidth;
      this.pages = Math.ceil(this.maxSize / this.movement);
      this.content.children().css('width', this.itemWidth + 'px');

      var heights = [];

      this.content.children().each(function(index, item){
        heights.push($(item).height());
      });

      this.pageHeight = Math.max.apply(null, heights);

      this.content.children().css('height', this.pageHeight + 'px');
      this.content.css('width', this.maxSize + 'px');

      // prevent any flashing
      setTimeout(function(){
        self.wrapper.addClass('show');
      }, 10);

      if(this.viewportSize < this.maxSize){
        this.next.addClass('show');
      }

      return this;
    },
    /**
     * Binds listeners to the prev and next elements for navigation
     * @return {Object} Carousel instance
     */
    listen: function(){
      var self = this;

      this.prev.on('click.prev', function(e){
        self.move('prev');
      });

      this.next.on('click.next', function(e){
        self.move('next');
      });

      return this;
    },
    /**
     * Navigates the carousel
     * @param  {String} direction String containing 'prev' or 'next'
     * @return {Void}
     */
    move: function(direction){
      if(direction === 'prev'){
        this.page--;
        this.next.addClass('show');
        this.position = parseFloat(this.position) + this.movement;

        if(this.page === 0){
          this.prev.removeClass('show');
        }
      }else{
        this.page++;
        this.position = parseFloat(this.position) - this.movement;
        this.prev.addClass('show');

        if((this.page + 1) === this.pages){
          this.next.removeClass('show');
        }
      }

      this.content.css('left', this.position + 'px');
    }
  });
})(Eleven.query)
