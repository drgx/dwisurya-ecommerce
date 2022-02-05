
var opencart_responsive_current_width = window.innerWidth;
var opencart_responsive_min_width = 992;
var opencart_responsive_mobile = opencart_responsive_current_width < opencart_responsive_min_width;
var header_link_default = $('#_desktop_link_menu').html();

$(document).ready(() => {

    $('#siteloader').fadeOut();
    $('#spin-wrapper').fadeOut();

     $('.dropdown').on('show.bs.dropdown', function(e){
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown(600);
    });
    $('.dropdown').on('hide.bs.dropdown', function(e){
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp(600);
    });

    $('.search-widget .search-logo').click(function() {
        $(this).toggleClass('active').parents('.search-widget').find('form').stop(true,true).slideToggle('medium');
    });

    $(document).on('click','.btn-block',function() {
        $(this).siblings('.cart-dropdown').stop(true,true).slideToggle();
    });

    /* SlideTop*/
    $(window).scroll(function() {
        if ($(this).scrollTop() > 500) {
            $('#slidetop').fadeIn(500);
        } else {
            $('#slidetop').fadeOut(500);
        }
    });

    $('#slidetop').click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 800);
    });

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    if(!isMobile) {
    	if($(".parallax").length) {
    		$(".parallax").sitManParallex({  invert: false });
    	};
    } else {
    	$(".parallax").sitManParallex({  invert: true });
    }

    if($('.ishiparallaxbannerblock .parallax').data('deal') == '1') {
       var time = $('.ishiparallaxbannerblock .parallax').data('counter');
        var container = $('.ishiparallaxbannerblock .parallax').find('#parallaxcountdown');

        $(container).countdown(time, function(event) {
            $(this).find(".countdown-days .data").html(event.strftime('%D'));
            $(this).find(".countdown-hours .data").html(event.strftime('%H'));
            $(this).find(".countdown-minutes .data").html(event.strftime('%M'));
            $(this).find(".countdown-seconds .data").html(event.strftime('%S'));
            ;
        });
    }

    $(".banner-subtitle").html(function () { var t = $(this).text().trim().split(" "), i = t.shift(); return (t.length > 0 ? "<span>" + i + "</span> " : i) + t.join(" ") });

    $('#menu-icon').on('click', function () {
        $("#mobile_top_menu_wrapper").animate({
            width: "toggle"
        });
        $('#menu_wrapper').toggleClass('active');
    });

    $('#top_menu_closer i').on('click', function () {
        $("#mobile_top_menu_wrapper").animate({
            width: "toggle"
        });
        $('#menu_wrapper').toggleClass('active');
    });

    $('#menu_wrapper').on('click', function () {
        $("#mobile_top_menu_wrapper").animate({
            width: "toggle"
        });
        $('#menu_wrapper').toggleClass('active');
    });

    $('body').on('click', function () {
        $('.ajaxishi-search').hide();
    });

    $('.top_level_category > a.dropdown-item').on('click', function(){
        console.log('i got you');
        console.log($(this))
        if ($(this).siblings().length===2) {
            $(".sub-menu").removeClass("active-sub-menu");
            $($(this).siblings()[1]).toggleClass("active-sub-menu");
        }
    });

    $('body').on('click',function(event){
        if(!$(event.target).is('.top_level_category')){
          $(".sub-menu").removeClass("active-sub-menu");
        }
     });


    if (opencart_responsive_mobile) {
        toggleMobileStyles();
    }

    adjustTopMenu();
    adjustFixedHeader();

    $(window).resize(function() {
        adjustTopMenu();
        adjustFixedHeader();
    });

    //fixed header
    // $(window).scroll(function(){
    //      adjustFixedHeader();
    // });

    $('.video').magnificPopup({
        type: 'iframe',
        closeOnBgClick: false,
        iframe: {
            markup: '<div class="mfp-iframe-scaler">'+
            '<div class="mfp-close"></div>'+
            '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
            '<div class="mfp-title">Some caption</div>'+
            '</div>'
        },
        callbacks: {
            markupParse: function(template, values, item) {
                values.title = item.el.attr('title');
            }
        },
        // Delay in milliseconds before popup is removed
        removalDelay: 300,

        // Class that is added to popup wrapper and background
        // make it unique to apply your CSS animations just to this exact popup
        mainClass: 'mfp-fade'
    });

    jQuery(".product-list-js .product-layout .image,.product-list-js .product-layout .caption,.ishispecialblock .product-layout,.ishiproductsblock .item,.related-product .item").each(function() {
        var ishicategorytime = $(this).data('countdowntime');
        var ishicategorycontainer = $(this).find('.countdown-container');
         $(ishicategorycontainer).countdown(ishicategorytime, function (event) {
             $(this).find(".countdown-days .data").html(event.strftime('%D'));
            $(this).find(".countdown-hours .data").html(event.strftime('%H'));
            $(this).find(".countdown-minutes .data").html(event.strftime('%M'));
            $(this).find(".countdown-seconds .data").html(event.strftime('%S'));
        });
    });
});


$(window).on('resize', function() {
    var _cw = opencart_responsive_current_width;
    var _mw = opencart_responsive_min_width;
    var _w = window.innerWidth;
    var _toggle = (_cw >= _mw && _w < _mw) || (_cw < _mw && _w >= _mw);
    opencart_responsive_current_width= _w;
    opencart_responsive_mobile = opencart_responsive_current_width < opencart_responsive_min_width;
    if (_toggle) {
        toggleMobileStyles();
    }
});

function adjustFixedHeader() {
    // var headerHeight = $('#header').height();
    // var navHeight = $('#header').height();
    // if ($(window).scrollTop() > headerHeight) {
    //     $('.header-top').addClass('fixed-header');
    // }
    // else {
    //     $('.header-top').removeClass('fixed-header');
    // }
}

function adjustTopMenu() {
    if (window.matchMedia('(min-width: 1200px)').matches) {
        $( "#_desktop_top_menu #top-menu .top_level_category" ).each(function( index ) {
          var subdiv = $(this).find('.sub-menu .category_dropdownmenu').length;
          var submenu = $(this).find('.sub-menu');
          if (subdiv == 1){
                submenu.css('width','230px');
            }
            else{
                submenu.css('width',subdiv*200+30+'px');
            }
        });
    }
    else if (window.matchMedia('(min-width: 991px)').matches) {
        $( "#_desktop_top_menu #top-menu .top_level_category" ).each(function( index ) {
          var subdiv = $(this).find('.sub-menu .category_dropdownmenu').length;
          var submenu = $(this).find('.sub-menu');
          if (subdiv == 1){
                submenu.css('width','230px');
            } else if(subdiv < 4) {
                submenu.css('width',subdiv*200+30+'px');
            }
            else{
                submenu.css('width','830px');
            }
        });
    }
    else if (window.matchMedia('(max-width: 991px)').matches) {
        $( "#_mobile_top_menu #top-menu .top_level_category" ).each(function( index ) {
          var subdiv = $(this).find('.sub-menu .category_dropdownmenu').length;
          var submenu = $(this).find('.sub-menu');
          if (subdiv == 1){
                submenu.css('width','auto');
            }
            else{
                submenu.css('width','auto');
            }
        });
    }

}


function swapChildren(obj1, obj2)
{
    var temp = obj2.children().detach();
    obj2.empty().append(obj1.children().detach());
    obj1.append(temp);
}



function toggleMobileStyles()
{
    if (opencart_responsive_mobile) {
        $("*[id^='_desktop_']").each(function(idx, el) {
            var target = $('#' + el.id.replace('_desktop_', '_mobile_'));
            if (target.length) {
                swapChildren($(el), target);
            }
        });
    } else {
        $("*[id^='_mobile_']").each(function(idx, el) {
            var target = $('#' + el.id.replace('_mobile_', '_desktop_'));
            if (target.length) {
                swapChildren($(el), target);
            }
        });
    }
}
