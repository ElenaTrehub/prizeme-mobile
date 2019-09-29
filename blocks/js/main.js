$(function(){

        $('.minimized').click(function(event) {
            var i_path = $(this).attr('src');
            $('body').append('<div id="overlay"></div><div id="magnify"><img src="'+i_path+'"><div id="close-popup"><i></i></div></div>');
            $('#magnify').css({
                left: ($(document).width() - $('#magnify').outerWidth())/6,
                // top: ($(document).height() - $('#magnify').outerHeight())/2 upd: 24.10.2016
                top: ($(window).height() - $('#magnify').outerHeight())/4
            });
            $('#overlay, #magnify').fadeIn('fast');
        });

        $('body').on('click', '#close-popup, #overlay', function(event) {
            event.preventDefault();

            $('#overlay, #magnify').fadeOut('fast', function() {
                $('#close-popup, #magnify, #overlay').remove();
            });
        });

        $('.slide').click(function(event) {
            var i_path = $(this).attr('src');
            $('body').append('<div id="overlay"></div><div id="magnify" class="slider"><div><img src="'+i_path+'"><div id="close-popup"><i></i></div></div><div><img src="images/patent-add2.jpg"></div></div>');
            $('#magnify').css({
                left: ($(document).width() - $('#magnify').outerWidth())/6,
                // top: ($(document).height() - $('#magnify').outerHeight())/2 upd: 24.10.2016
                top: ($(window).height() - $('#magnify').outerHeight())/4
            });
            $('#overlay, #magnify').fadeIn('fast');

            $('.slider').slick({
                nextArrow:'<button type="button" class="slick-btn slick-next"></button>',
                prevArrow:'<button type="button" class="slick-btn slick-prev"></button>',
                infinite: false
            });
        });


    $('select, input, textarea').styler();

});