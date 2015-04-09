/*! bigSlide - v0.7.0 - 2015-03-27
* http://ascott1.github.io/bigSlide.js/
* Copyright (c) 2015 Adam D. Scott; Licensed MIT */
(function($) {
  'use strict';

  $.fn.bigSlide = function(options) {
    // store the menuLink in a way that is globally accessible
    var menuLink = this;

    // plugin settings
    var settings = $.extend({
      'menu': ('#menu'),
      'push': ('.push'),
      'side': 'left',
      'menuWidth': '15.625em',
      'speed': '300',
      'state': 'closed',
      'activeBtn': 'active',
      'easyClose': false
    }, options);

    // store the menu's state in the model
    var model = {
      'state': settings.state
    };

    // talk back and forth between the view and state
    var controller = {
      init: function(){
        view.init();
      },
      // update the menu's state
      changeState: function(){
        if (model.state === 'closed') {
          model.state = 'open'
          $('nav#menu').removeClass('closed');
          $('nav#menu').addClass('open');
          
        } else {
          model.state = 'closed'
          $('nav#menu').removeClass('open');
          $('nav#menu').addClass('closed');
            
        }
      },
      // check the menu's state
      getState: function(){
        return model.state;
      }
    };

    // the view contains all of the visual interactions
    var view = {
      init: function(){
        // cache DOM values
        this.$menu = $(settings.menu);
        this.$push = $(settings.push);
        this.width = settings.menuWidth;

        // CSS for how the menu will be positioned off screen
        var positionOffScreen = {
          'position': 'fixed',
          'top': '0',
          'bottom': '0',
          'height': '100%'
        };

        // manually add the settings values
        positionOffScreen[settings.side] = '-' + settings.menuWidth;
        positionOffScreen.width = settings.menuWidth;

        // add the css values to position things offscreen
        if (settings.state === 'closed') {
          this.$menu.css(positionOffScreen);
        //***  this.$push.css(settings.side, '0');
        var temp = this.$push;
        $.each(this.$push,function(index,value){
            if($(value).hasClass("right")  && settings.side.toLowerCase() != "right"){
               
               $(value).css("right",  '0');
            } else {
                
               $(value).css(settings.side, '0');
            }
        

        });
            
            
            
            
            
        }

        // css for the sliding animation
        var animateSlide = {
          '-webkit-transition': settings.side + ' ' + settings.speed + 'ms ease',
          '-moz-transition': settings.side + ' ' + settings.speed + 'ms ease',
          '-ms-transition': settings.side + ' ' + settings.speed + 'ms ease',
          '-o-transition': settings.side + ' ' + settings.speed + 'ms ease',
          'transition': settings.side + ' ' + settings.speed + 'ms ease'
        };
        
        var animateSlideRight = {
          '-webkit-transition':  'width ' + settings.speed + 'ms ease',
          '-moz-transition': 'width ' + settings.speed + 'ms ease',
          '-ms-transition': 'width ' + settings.speed + 'ms ease',
          '-o-transition': 'width ' + settings.speed + 'ms ease',
          'transition': 'width ' + settings.speed + 'ms ease'
        };

        // add the animation css
        this.$menu.css(animateSlide);
        
          
//        this.$push.css(animateSlideRight);

          var temp = this.$push;
        $.each(this.$push,function(index,value){
            if($(value).hasClass("right") && settings.side.toLowerCase() != "right"){
               
               $(value).css(animateSlideRight);
            } else {
                
               $(value).css(animateSlide);
            }
        
          
        });
          
          
          
          
        // register a click listener for desktop & touchstart for mobile
        menuLink.on('click.bigSlide touchstart.bigSlide', function(e) {
          e.preventDefault();
          if (controller.getState() === 'open') {
            view.toggleClose();
          } else {
            view.toggleOpen();
          }
        });

        // this makes my eyes blead, but adding it back in as it's a highly requested feature
        if (settings.easyClose) {
          $('body').on('click.bigSlide', function(e) {
           if (!$(e.target).parents().andSelf().is(menuLink) && controller.getState() === 'open')  {
             view.toggleClose();
           }
          });
        }
      },

      // toggle the menu open
      toggleOpen: function() {
        controller.changeState();
        this.$menu.css(settings.side, '0');
        var temp = this;
        $.each(this.$push,function(index,value){
            if($(value).hasClass("right") && settings.side.toLowerCase() != "right"){
               
               $(value).css("right",  '0');
            } else {
                
               $(value).css(settings.side, temp.width);
            }
        
            
        });
       
         // this.$push.css(settings.side, this.width);
          
        menuLink.addClass(settings.activeBtn);
      },

      // toggle the menu closed
      toggleClose: function() {
        controller.changeState();
        this.$menu.css(settings.side, '-' + this.width);
       // this.$push.css(settings.side, '0');
          
       var temp = this;
        $.each(this.$push,function(index,value){
            if($(value).hasClass("right") && settings.side.toLowerCase() != "right"){
               
               $(value).css("right",  '0');
            } else {
                
               $(value).css(settings.side, '0');
            }
        
           
        });   
          
          
          
        menuLink.removeClass(settings.activeBtn);
      }

    }

    controller.init();

  };

}(jQuery));
