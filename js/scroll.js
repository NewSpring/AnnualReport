//@delianides is awesome and so good at his job!! I would buy you a pizza for helping with this project! oh wait... 
$(document).ready(function() {
    $('#wrap').scrollable({
        selector: ".page",
        container: "#wrap",
        bgClass: "bg-",
        scrollIn: function(s) {
            //Animate Bargraphs when container loads
            s.find('.container ul.bargraph li').addClass('zero').delay(1000).each(function(i) {
                var graph = $(this);
                var count = i;

                setTimeout(function() {
                    graph.addClass('transition');
                    graph.removeClass('zero');
                }, i * 500);
            });

            //Fade in .faded objects
            s.find('.faded').delay(1000).each(function(i) {
                $(this).delay(i * 250).fadeIn();
            });

            //Hides the first time popup after 10 sections (hides after 5s due to delay)
            s.find('.firsttime').delay(10000).queue(function(next) {
                $(this).removeClass("bounceInUp delay5").addClass("delay2 bounceOutDown");
                next();
            });

            return false;

        },
        scrollOut: function(s) {
            s.find('.container ul.bargraph li').removeClass('transition').removeClass('zero');
            //s.find('.faded').fadeOut();
        }
    });

    //Makes all external links open up in a new window
    $('a:not([href^="http://newspring"]):not([href^="http://dev.newspring"])').each(function() {
        $(this).attr('target', '_blank');
    })

    $("#fpfp .pieright").tooltip({
        relative: true,
        effect: 'slide',
        position: 'bottom center',
        offset: [-100, -29],
        opacity: 1
    });

    $("#fpfp .pieleft").tooltip({
        relative: true,
        effect: 'slide',
        position: 'bottom center',
        offset: [40, -95],
        opacity: 1
    });

    $("#spsp .pieleft").tooltip({
        relative: true,
        effect: 'slide',
        position: 'bottom center',
        offset: [-110, 5],
        opacity: 1
    });

    $("#gpc .pieright").tooltip({
        relative: true,
        effect: 'slide',
        position: 'bottom center',
        offset: [-175, 0],
        opacity: 1
    });

    $("#kidspring .pieright").tooltip({
        relative: true,
        effect: 'slide',
        position: 'bottom center',
        offset: [-125, 0],
        opacity: 1
    });

    $("#fuse .pies").tooltip({
        relative: true,
        effect: 'slide',
        position: 'bottom center',
        offset: [40, -95],
        opacity: 1
    });

    $("#financials .pieright").tooltip({
        relative: true,
        effect: 'slide',
        position: 'bottom center',
        offset: [-125, 0],
        opacity: 1
    });

    $(".allcampuses a").on('click', function() {
        $("ul.tabs").tabs("div.campuses > div");
        return false;
    });

    $(".allcampuses a").trigger('click');

    //This will add tooltips to the campus map markers, but it needs some style and positioning love
    //$(".tabs a[title]").tooltip();

    //fades in anything with this class.  
    //Used on pie charts to prevent FOUT (flash of unstyled text)
    /*
    $(".faded").delay(1000).each(function(i) {
        $(this).delay(i * 250).fadeIn();
    });
    */
    if (!Modernizr.cssAnimations) {
        $('.firsttime').fadeIn().delay(10000).queue(function(next) {
            $(this).fadeOut();
            next();
        });
    }


});