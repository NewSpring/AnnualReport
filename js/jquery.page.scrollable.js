/*
 * jQuery Scrollable
 * http://newspring.cc/
 *
 * Copyright 2012 NewSpring Church
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Written By: Drew Delianides (@delianides)
 */

;
(function($) {

    $.Scrollable = function(el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var scroller = $(el),
            vars = $.extend({}, $.Scrollable.defaults, options),
            methods = {};


        // Add a reverse reference to the DOM object
        $.data(el, "Scrollable", scroller);

        methods = {
            init: function() {
                scroller.currentPage = vars.startsAt;
                scroller.scrollingTo = scroller.currentPage;
                scroller.pages = $(vars.selector, scroller);
                scroller.touch = ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch;
                scroller.startHash = "#" + scroller.pages.first().attr('id');
                scroller.count = scroller.pages.length;
                scroller.isEnd = (scroller.currentPage === 0 && scroller.currentPage === scroller.count);
                scroller.scrollChange = false;
                scroller.haltCheck = true; // Possible solution for making the interval function run one more time.
                scroller.checkHash = true;
                scroller.middle = Math.round($(window).height() / 2);
                if(!scroller.touch){
                  scroller.setup("init");
                  scroller.resize();
                  scroller.scrolling();
                  scroller.app();
                }else{
                  scroller.setup("mobile");
                }
            },
            setBackground: function() {
                scroller.removeClass().addClass(vars.bgClass + scroller.scrollingTo);
                return false;
            },
            showContent: function(direction) {
                if (vars.hideContent == true) {
                    $(scroller.pages.eq(scroller.scrollingTo)).addClass('active').find(vars.contentElement).animate({
                        opacity: 1
                    }, vars.duration, vars.easing, vars.scrollIn(scroller.pages.eq(scroller.scrollingTo)));
                } else {
                    $(scroller.pages.eq(scroller.scrollingTo)).addClass('active');
                    vars.scrollIn(scroller.pages.eq(scroller.scrollingTo));
                }
                methods.setHash();

                if (scroller.scrollingTo == scroller.count - 1) {
                    //console.log('end');
                    scroller.isEnd = true;
                    scroller.css('padding-bottom', '');
                } else {
                    scroller.isEnd = false;
                    scroller.css('padding-bottom', vars.scrollOffset);
                }

                if (vars.hideContent == true && vars.hideMethod == 'both') {
                    $(scroller.pages.eq(scroller.currentPage)).removeClass('active').find(vars.contentElement).animate({
                        opacity: 0
                    }, vars.duration, vars.easing, vars.scrollOut(scroller.pages.eq(scroller.currentPage)));
                } else {
                    $(scroller.pages.eq(scroller.currentPage)).removeClass('active');
                    vars.scrollOut(scroller.pages.eq(scroller.currentPage));
                }

                scroller.currentPage = scroller.scrollingTo;
                return false;
            },
            findActive: function(middle) {
                //if(scroller.currentPage == 0) return false;
                scroller.pages.each(function() {
                    var top = $(this).offset().top;
                    //if top is > middle but less middle + offset activate one before
                    if (top > middle && top < middle + vars.scrollOffset) {
                        scroller.scrollingTo = $(this).prev(vars.selector).index();
                        return false;
                        //if top < middle but greater than middle - offset activate this one
                    } else if (top < middle && top > middle - vars.scrollOffset) {
                        scroller.scrollingTo = $(this).index();
                        return false;
                    }

                    if (scroller.currentPage != scroller.scrollingTo) {
                        //Only run if something is actually different
                        methods.setBackground();
                        methods.showContent();
                    }
                });
            },
            setHash: function() {
               window.location.hash = 'page-'+scroller.pages.eq(scroller.scrollingTo).attr('id');
            }
        };

        scroller.scrolling = function() {
            $(window).on('scroll', function(event) {
                scroller.scrollChange = true;
                scroller.haltCheck = true;
            });
        }

        scroller.resize = function() {
            $(window).resize( function() {
                scroller.middle = Math.round($(this).height() / 2);
            });
        }

        scroller.load = function() {
            if (scroller.checkHash == true) {
                var hash = window.location.hash;
                hash = hash.replace(/page-/, '');
                if (hash == '' || hash == scroller.startHash) {
                    $(window).one('scroll', function(){
                        $(this).scrollTop(0);
                    });
                } else {
                    scroller.scrollingTo = $(hash).index();
                    $(document).on('ready', function(){
                      $(window).scrollTop($(hash).offset().top);                    
                    });
                }
                scroller.checkHash = false;
            }
        }

        scroller.app = function() {
            setInterval(function() {
                if (scroller.scrollChange) {
                    var position = $(this).scrollTop();
                    var scrollingMiddle = position + scroller.middle;
                    methods.findActive(scrollingMiddle);
                    scroller.scrollChange = false;
                } else if (scroller.haltCheck == true) {
                    var position = $(this).scrollTop();
                    var scrollingMiddle = position + scroller.middle;
                    methods.findActive(scrollingMiddle);
                    scroller.haltCheck == false;
                }
            }, 50);
        }

        scroller.setup = function(type) {
            //Setup the intial scroll with the wrapper container at the start  
            if (type == "init") {
                scroller.pages.eq(scroller.currentPage).addClass('active');
                scroller.addClass(vars.bgClass + scroller.currentPage).css('padding-bottom', vars.scrollOffset);
                scroller.pages.each(function(e) {
                    $(this).css('padding-top', vars.scrollOffset).css('padding-bottom', vars.scrollOffset);
                    if (vars.hideContent && e != 0) {
                        $(this).find(vars.contentElement).css('opacity', 0);
                    }
                });
                scroller.load();
            }else if(type == "mobile"){
                scroller.pages.each(function(e) {
                    $(this).addClass(vars.bgClass + e).css('padding-top', 50).css('padding-bottom', 50);
                })
            }
        }

        methods.init();
    }

    $.Scrollable.defaults = {
        scrollOffset: 200,
        opacityoffset: 5,
        opacity: 1,
        selector: "#scrollable li",
        container: "#scrollable",
        bgClass: "bg-",
        duration: 750,
        easing: "linear",
        hideContent: true,
        //true|false|in
        hideMethod: 'in',
        //both|in
        contentElement: '.container',
        startsAt: 0,
        //Zero Based
        scrollIn: function() {},
        scrollOut: function() {}
    };

    $.fn.scrollable = function(options) {
        if (options === undefined) options = {};

        if (typeof options === "object") {
            return this.each(function() {
                var $this = $(this),
                    selector = (options.selector) ? options.selector : "#scrollable li",
                    $pages = $this.find(selector);
                //console.log($pages);
                if ($this.data('Scrollable') == undefined) {
                    new $.Scrollable(this, options);
                }
            });
        }
    };

    // This function breaks the chain, but returns
    // the Scrollable if it has been attached to the object.
    $.fn.getScrollable = function() {
        this.data("Scrollable");
    };

})(jQuery);

//console.log("To: "+scroller.scrollingTo+" Current: "+scroller.currentPage+" Count: "+scroller.count);              
//console.log("Position: " + position + " Margin: " + margin + " NEXT: " + next.offset().top);
