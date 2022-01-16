function getURLVar(key) {
	var value = [];

	var query = String(document.location).split('?');

	if (query[1]) {
		var part = query[1].split('&');

		for (i = 0; i < part.length; i++) {
			var data = part[i].split('=');

			if (data[0] && data[1]) {
				value[data[0]] = data[1];
			}
		}

		if (value[key]) {
			return value[key];
		} else {
			return '';
		}
	}
}

$(document).ready(function() {	
	// Highlight any found errors
	$('.text-danger').each(function() {
		var element = $(this).parent().parent();

		if (element.hasClass('form-group')) {
			element.addClass('has-error');
		}
	});

	// Currency
	$('#form-currency .currency-select').on('click', function(e) {
		e.preventDefault();

		$('#form-currency input[name=\'code\']').val($(this).attr('name'));

		$('#form-currency').submit();
	});

	// Language
	$('#form-language .language-select').on('click', function(e) {
		e.preventDefault();

		$('#form-language input[name=\'code\']').val($(this).attr('name'));

		$('#form-language').submit();
	});

	/* Search */
	$('#search input[name=\'search\']').parent().find('button').on('click', function() {
		var url = $('base').attr('href') + 'index.php?route=product/search';

		var value = $('header #search input[name=\'search\']').val();

		if (value) {
			url += '&search=' + encodeURIComponent(value);
		}

		location = url;
	});

	$('#search input[name=\'search\']').on('keydown', function(e) {
		if (e.keyCode == 13) {
			$('header #search input[name=\'search\']').parent().find('button').trigger('click');
		}
	});

	// Menu
	$('#menu .dropdown-menu').each(function() {
		var menu = $('#menu').offset();
		var dropdown = $(this).parent().offset();

		var i = (dropdown.left + $(this).outerWidth()) - (menu.left + $('#menu').outerWidth());

		if (i > 0) {
			$(this).css('margin-left', '-' + (i + 10) + 'px');
		}
	});

	// Product List
	$('#list-view').click(function() {
		$('#content .product-grid > .clearfix').remove();
		$('.product-list-js').fadeOut(500,function() {
			$('#content .row > .product-grid').attr('class', 'product-layout product-list');
			$(this).find('.image').addClass('col-xs-12 col-sm-4 col-md-4 col-lg-4');
			$(this).find('.caption').addClass('col-xs-12 col-sm-8 col-md-8 col-lg-8');
    	});
		$('#grid-view').removeClass('active');
		$('#list-view').addClass('active');
		localStorage.setItem('display', 'list');
		$('.product-list-js').fadeIn(500);

	});

	// Product Grid
	$('#grid-view').click(function() {
		// What a shame bootstrap does not take into account dynamically loaded columns
		var cols = $('#column-right, #column-left').length;

		$('.product-list-js').fadeOut(500,function() {

			$('.image').removeClass('col-xs-12 col-sm-4 col-md-4 col-lg-4');
            $('.caption').removeClass('col-xs-12 col-sm-8 col-md-8 col-lg-8');
			if (cols == 2) {
					$('#content .product-list').attr('class', 'product-layout product-grid col-lg-6 col-md-6 col-sm-6 col-xs-12');
			} else if (cols == 1) {
					$('#content .product-list').attr('class', 'product-layout product-grid col-lg-4 col-md-6 col-sm-6 col-xs-12');
			} else {
					$('#content .product-list').attr('class', 'product-layout product-grid col-lg-4 col-md-4 col-sm-6 col-xs-12');
			}
			$('.image .countdown-container').css('display','inline-block');
			$('.caption .countdown-container').hide();
    	});
		$('#list-view').removeClass('active');
		$('#grid-view').addClass('active');
		localStorage.setItem('display', 'grid');
		$('.product-list-js').fadeIn(500);
	});

	if (localStorage.getItem('display') == 'list') {
		$('#list-view').trigger('click');
		$('#list-view').addClass('active');
	} else {
		$('#grid-view').trigger('click');
		$('#grid-view').addClass('active');
	}

	// Checkout
	$(document).on('keydown', '#collapse-checkout-option input[name=\'email\'], #collapse-checkout-option input[name=\'password\']', function(e) {
		if (e.keyCode == 13) {
			$('#collapse-checkout-option #button-login').trigger('click');
		}
	});

	// tooltips on hover
	$('[data-toggle=\'tooltip\']').tooltip({container: 'body',trigger:'hover'});

	// Makes tooltips work on ajax generated content
	$(document).ajaxStop(function() {
		$('[data-toggle=\'tooltip\']').tooltip({container: 'body',trigger:'hover'});
	});
});

// Cart add remove functions
var cart = {
	'add': function(product_id, quantity) {
		$.ajax({
			url: 'index.php?route=checkout/cart/add',
			type: 'post',
			data: 'product_id=' + product_id + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
			dataType: 'json',
			beforeSend: function() {
			},
			complete: function() {
			},
			success: function(json) {
				$('.alert-dismissible, .text-danger').remove();

				if (json['redirect']) {
					location = json['redirect'];
				}

				if (json['success']) {
					/*$('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
					$('html, body').animate({ scrollTop: 0 }, 'slow');*/
					// Need to set timeout otherwise it wont update the total
					setTimeout(function () {
						
					$('#cart > button').html('<span class="cart-link">      <span class="cart-img hidden-sm hidden-xs">        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">                    <symbol id="shopping-cart" viewBox="0 0 1000 1000"><title>shoppingcart</title>          <path d="M482,181h-31v-45c0-37.026-27.039-67.672-62.366-73.722C382.791,44.2,365.999,31,346,31H166          c-19.999,0-36.791,13.2-42.634,31.278C88.039,68.328,61,98.974,61,136v45H30c-16.569,0-30,13.431-30,30c0,16.567,13.431,30,30,30          h452c16.569,0,30-13.433,30-30C512,194.431,498.569,181,482,181z M421,181H91v-45c0-20.744,14.178-38.077,33.303-43.264          C130.965,109.268,147.109,121,166,121h180c18.891,0,35.035-11.732,41.697-28.264C406.822,97.923,421,115.256,421,136V181z"></path>          <path d="M33.027,271l24.809,170.596C60.648,464.066,79.838,481,102.484,481h307.031c22.647,0,41.837-16.934,44.605-39.111          L478.973,271H33.027z M151,406c0,8.291-6.709,15-15,15s-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M211,406          c0,8.291-6.709,15-15,15s-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M271,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M331,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15c8.291,0,15,6.709,15,15V406z M391,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15c8.291,0,15,6.709,15,15V406z"></path></symbol>         </svg>        <svg class="icon" viewBox="0 0 50 50"><use xlink:href="#shopping-cart" x="25%" y="25%"></use></svg>      </span>       <span class="cart-img hidden-lg hidden-md">        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">             <symbol id="cart1" viewBox="0 0 510 510"><title>cart</title>              <path d="M306.4,313.2l-24-223.6c-0.4-3.6-3.6-6.4-7.2-6.4h-44.4V69.6c0-38.4-31.2-69.6-69.6-69.6c-38.4,0-69.6,31.2-69.6,69.6        v13.6H46c-3.6,0-6.8,2.8-7.2,6.4l-24,223.6c-0.4,2,0.4,4,1.6,5.6c1.2,1.6,3.2,2.4,5.2,2.4h278c2,0,4-0.8,5.2-2.4        C306,317.2,306.8,315.2,306.4,313.2z M223.6,123.6c3.6,0,6.4,2.8,6.4,6.4c0,3.6-2.8,6.4-6.4,6.4c-3.6,0-6.4-2.8-6.4-6.4        C217.2,126.4,220,123.6,223.6,123.6z M106,69.6c0-30.4,24.8-55.2,55.2-55.2c30.4,0,55.2,24.8,55.2,55.2v13.6H106V69.6z         M98.8,123.6c3.6,0,6.4,2.8,6.4,6.4c0,3.6-2.8,6.4-6.4,6.4c-3.6,0-6.4-2.8-6.4-6.4C92.4,126.4,95.2,123.6,98.8,123.6z M30,306.4        L52.4,97.2h39.2v13.2c-8,2.8-13.6,10.4-13.6,19.2c0,11.2,9.2,20.4,20.4,20.4c11.2,0,20.4-9.2,20.4-20.4c0-8.8-5.6-16.4-13.6-19.2        V97.2h110.4v13.2c-8,2.8-13.6,10.4-13.6,19.2c0,11.2,9.2,20.4,20.4,20.4c11.2,0,20.4-9.2,20.4-20.4c0-8.8-5.6-16.4-13.6-19.2V97.2        H270l22.4,209.2H30z"></path>            </symbol>         </svg>        <svg class="icon" viewBox="0 0 40 40"><use xlink:href="#cart1" x="21%" y="15%"></use></svg>      </span>      <span class="cart-content">        <span class="cart-products-count ">' + json['text_items_small'] + '</span>      </span>    </span>');
				}, 100);

					$.notify({message:json.success},{type:"success",offset:0,placement:{from:"top",align:"center"},z_index: 99999999,animate:{enter:"animated fadeInDown",exit:"animated fadeOutUp"},template:'<div data-notify="container" class="col-xs-12 alert alert-{0}" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button><span data-notify="icon"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'});
					$('#cart > ul').load('index.php?route=common/cart/info ul li');
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'update': function(key, quantity) {
		$.ajax({
			url: 'index.php?route=checkout/cart/edit',
			type: 'post',
			data: 'key=' + key + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
			dataType: 'json',
			beforeSend: function() {
				$('#cart > button').button('loading');
			},
			complete: function() {
				$('#cart > button').button('reset');
			},
			success: function(json) {
				// Need to set timeout otherwise it wont update the total
				setTimeout(function () {
					$('#cart > button').html('<span class="cart-link">      <span class="cart-img hidden-sm hidden-xs">        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">                    <symbol id="shopping-cart" viewBox="0 0 1000 1000"><title>shoppingcart</title>          <path d="M482,181h-31v-45c0-37.026-27.039-67.672-62.366-73.722C382.791,44.2,365.999,31,346,31H166          c-19.999,0-36.791,13.2-42.634,31.278C88.039,68.328,61,98.974,61,136v45H30c-16.569,0-30,13.431-30,30c0,16.567,13.431,30,30,30          h452c16.569,0,30-13.433,30-30C512,194.431,498.569,181,482,181z M421,181H91v-45c0-20.744,14.178-38.077,33.303-43.264          C130.965,109.268,147.109,121,166,121h180c18.891,0,35.035-11.732,41.697-28.264C406.822,97.923,421,115.256,421,136V181z"></path>          <path d="M33.027,271l24.809,170.596C60.648,464.066,79.838,481,102.484,481h307.031c22.647,0,41.837-16.934,44.605-39.111          L478.973,271H33.027z M151,406c0,8.291-6.709,15-15,15s-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M211,406          c0,8.291-6.709,15-15,15s-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M271,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M331,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15c8.291,0,15,6.709,15,15V406z M391,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15c8.291,0,15,6.709,15,15V406z"></path></symbol>         </svg>        <svg class="icon" viewBox="0 0 50 50"><use xlink:href="#shopping-cart" x="25%" y="25%"></use></svg>      </span>       <span class="cart-img hidden-lg hidden-md">        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">             <symbol id="cart1" viewBox="0 0 510 510"><title>cart</title>              <path d="M306.4,313.2l-24-223.6c-0.4-3.6-3.6-6.4-7.2-6.4h-44.4V69.6c0-38.4-31.2-69.6-69.6-69.6c-38.4,0-69.6,31.2-69.6,69.6        v13.6H46c-3.6,0-6.8,2.8-7.2,6.4l-24,223.6c-0.4,2,0.4,4,1.6,5.6c1.2,1.6,3.2,2.4,5.2,2.4h278c2,0,4-0.8,5.2-2.4        C306,317.2,306.8,315.2,306.4,313.2z M223.6,123.6c3.6,0,6.4,2.8,6.4,6.4c0,3.6-2.8,6.4-6.4,6.4c-3.6,0-6.4-2.8-6.4-6.4        C217.2,126.4,220,123.6,223.6,123.6z M106,69.6c0-30.4,24.8-55.2,55.2-55.2c30.4,0,55.2,24.8,55.2,55.2v13.6H106V69.6z         M98.8,123.6c3.6,0,6.4,2.8,6.4,6.4c0,3.6-2.8,6.4-6.4,6.4c-3.6,0-6.4-2.8-6.4-6.4C92.4,126.4,95.2,123.6,98.8,123.6z M30,306.4        L52.4,97.2h39.2v13.2c-8,2.8-13.6,10.4-13.6,19.2c0,11.2,9.2,20.4,20.4,20.4c11.2,0,20.4-9.2,20.4-20.4c0-8.8-5.6-16.4-13.6-19.2        V97.2h110.4v13.2c-8,2.8-13.6,10.4-13.6,19.2c0,11.2,9.2,20.4,20.4,20.4c11.2,0,20.4-9.2,20.4-20.4c0-8.8-5.6-16.4-13.6-19.2V97.2        H270l22.4,209.2H30z"></path>            </symbol>         </svg>        <svg class="icon" viewBox="0 0 40 40"><use xlink:href="#cart1" x="21%" y="15%"></use></svg>      </span>      <span class="cart-content">        <span class="cart-products-count ">' + json['text_items_small'] + '</span>      </span>    </span>');
				}, 100);

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					location = 'index.php?route=checkout/cart';
				} else {
					$('#cart > ul').load('index.php?route=common/cart/info ul li');
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'remove': function(key) {
		$.ajax({
			url: 'index.php?route=checkout/cart/remove',
			type: 'post',
			data: 'key=' + key,
			dataType: 'json',
			beforeSend: function() {
				$('#cart > button').button('loading');
			},
			complete: function() {
				$('#cart > button').button('reset');
			},
			success: function(json) {
				// Need to set timeout otherwise it wont update the total
				setTimeout(function () {
					$('#cart > button').html('<span class="cart-link">      <span class="cart-img hidden-sm hidden-xs">        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">                    <symbol id="shopping-cart" viewBox="0 0 1000 1000"><title>shoppingcart</title>          <path d="M482,181h-31v-45c0-37.026-27.039-67.672-62.366-73.722C382.791,44.2,365.999,31,346,31H166          c-19.999,0-36.791,13.2-42.634,31.278C88.039,68.328,61,98.974,61,136v45H30c-16.569,0-30,13.431-30,30c0,16.567,13.431,30,30,30          h452c16.569,0,30-13.433,30-30C512,194.431,498.569,181,482,181z M421,181H91v-45c0-20.744,14.178-38.077,33.303-43.264          C130.965,109.268,147.109,121,166,121h180c18.891,0,35.035-11.732,41.697-28.264C406.822,97.923,421,115.256,421,136V181z"></path>          <path d="M33.027,271l24.809,170.596C60.648,464.066,79.838,481,102.484,481h307.031c22.647,0,41.837-16.934,44.605-39.111          L478.973,271H33.027z M151,406c0,8.291-6.709,15-15,15s-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M211,406          c0,8.291-6.709,15-15,15s-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M271,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M331,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15c8.291,0,15,6.709,15,15V406z M391,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15c8.291,0,15,6.709,15,15V406z"></path></symbol>         </svg>        <svg class="icon" viewBox="0 0 50 50"><use xlink:href="#shopping-cart" x="25%" y="25%"></use></svg>      </span>       <span class="cart-img hidden-lg hidden-md">        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">             <symbol id="cart1" viewBox="0 0 510 510"><title>cart</title>              <path d="M306.4,313.2l-24-223.6c-0.4-3.6-3.6-6.4-7.2-6.4h-44.4V69.6c0-38.4-31.2-69.6-69.6-69.6c-38.4,0-69.6,31.2-69.6,69.6        v13.6H46c-3.6,0-6.8,2.8-7.2,6.4l-24,223.6c-0.4,2,0.4,4,1.6,5.6c1.2,1.6,3.2,2.4,5.2,2.4h278c2,0,4-0.8,5.2-2.4        C306,317.2,306.8,315.2,306.4,313.2z M223.6,123.6c3.6,0,6.4,2.8,6.4,6.4c0,3.6-2.8,6.4-6.4,6.4c-3.6,0-6.4-2.8-6.4-6.4        C217.2,126.4,220,123.6,223.6,123.6z M106,69.6c0-30.4,24.8-55.2,55.2-55.2c30.4,0,55.2,24.8,55.2,55.2v13.6H106V69.6z         M98.8,123.6c3.6,0,6.4,2.8,6.4,6.4c0,3.6-2.8,6.4-6.4,6.4c-3.6,0-6.4-2.8-6.4-6.4C92.4,126.4,95.2,123.6,98.8,123.6z M30,306.4        L52.4,97.2h39.2v13.2c-8,2.8-13.6,10.4-13.6,19.2c0,11.2,9.2,20.4,20.4,20.4c11.2,0,20.4-9.2,20.4-20.4c0-8.8-5.6-16.4-13.6-19.2        V97.2h110.4v13.2c-8,2.8-13.6,10.4-13.6,19.2c0,11.2,9.2,20.4,20.4,20.4c11.2,0,20.4-9.2,20.4-20.4c0-8.8-5.6-16.4-13.6-19.2V97.2        H270l22.4,209.2H30z"></path>            </symbol>         </svg>        <svg class="icon" viewBox="0 0 40 40"><use xlink:href="#cart1" x="21%" y="15%"></use></svg>      </span>      <span class="cart-content">        <span class="cart-products-count ">' + json['text_items_small'] + '</span>      </span>    </span>');
				}, 100);

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					location = 'index.php?route=checkout/cart';
				} else {
					$('#cart > ul').load('index.php?route=common/cart/info ul li');
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	}
}

var voucher = {
	'add': function() {

	},
	'remove': function(key) {
		$.ajax({
			url: 'index.php?route=checkout/cart/remove',
			type: 'post',
			data: 'key=' + key,
			dataType: 'json',
			beforeSend: function() {
				$('#cart > button').button('loading');
			},
			complete: function() {
				$('#cart > button').button('reset');
			},
			success: function(json) {
				// Need to set timeout otherwise it wont update the total
				setTimeout(function () {
					$('#cart > button').html('<span class="cart-link">      <span class="cart-img hidden-sm hidden-xs">        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">                    <symbol id="shopping-cart" viewBox="0 0 1000 1000"><title>shoppingcart</title>          <path d="M482,181h-31v-45c0-37.026-27.039-67.672-62.366-73.722C382.791,44.2,365.999,31,346,31H166          c-19.999,0-36.791,13.2-42.634,31.278C88.039,68.328,61,98.974,61,136v45H30c-16.569,0-30,13.431-30,30c0,16.567,13.431,30,30,30          h452c16.569,0,30-13.433,30-30C512,194.431,498.569,181,482,181z M421,181H91v-45c0-20.744,14.178-38.077,33.303-43.264          C130.965,109.268,147.109,121,166,121h180c18.891,0,35.035-11.732,41.697-28.264C406.822,97.923,421,115.256,421,136V181z"></path>          <path d="M33.027,271l24.809,170.596C60.648,464.066,79.838,481,102.484,481h307.031c22.647,0,41.837-16.934,44.605-39.111          L478.973,271H33.027z M151,406c0,8.291-6.709,15-15,15s-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M211,406          c0,8.291-6.709,15-15,15s-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M271,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15s15,6.709,15,15V406z M331,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15c8.291,0,15,6.709,15,15V406z M391,406c0,8.291-6.709,15-15,15          c-8.291,0-15-6.709-15-15v-90c0-8.291,6.709-15,15-15c8.291,0,15,6.709,15,15V406z"></path></symbol>         </svg>        <svg class="icon" viewBox="0 0 50 50"><use xlink:href="#shopping-cart" x="25%" y="25%"></use></svg>      </span>       <span class="cart-img hidden-lg hidden-md">        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">             <symbol id="cart1" viewBox="0 0 510 510"><title>cart</title>              <path d="M306.4,313.2l-24-223.6c-0.4-3.6-3.6-6.4-7.2-6.4h-44.4V69.6c0-38.4-31.2-69.6-69.6-69.6c-38.4,0-69.6,31.2-69.6,69.6        v13.6H46c-3.6,0-6.8,2.8-7.2,6.4l-24,223.6c-0.4,2,0.4,4,1.6,5.6c1.2,1.6,3.2,2.4,5.2,2.4h278c2,0,4-0.8,5.2-2.4        C306,317.2,306.8,315.2,306.4,313.2z M223.6,123.6c3.6,0,6.4,2.8,6.4,6.4c0,3.6-2.8,6.4-6.4,6.4c-3.6,0-6.4-2.8-6.4-6.4        C217.2,126.4,220,123.6,223.6,123.6z M106,69.6c0-30.4,24.8-55.2,55.2-55.2c30.4,0,55.2,24.8,55.2,55.2v13.6H106V69.6z         M98.8,123.6c3.6,0,6.4,2.8,6.4,6.4c0,3.6-2.8,6.4-6.4,6.4c-3.6,0-6.4-2.8-6.4-6.4C92.4,126.4,95.2,123.6,98.8,123.6z M30,306.4        L52.4,97.2h39.2v13.2c-8,2.8-13.6,10.4-13.6,19.2c0,11.2,9.2,20.4,20.4,20.4c11.2,0,20.4-9.2,20.4-20.4c0-8.8-5.6-16.4-13.6-19.2        V97.2h110.4v13.2c-8,2.8-13.6,10.4-13.6,19.2c0,11.2,9.2,20.4,20.4,20.4c11.2,0,20.4-9.2,20.4-20.4c0-8.8-5.6-16.4-13.6-19.2V97.2        H270l22.4,209.2H30z"></path>            </symbol>         </svg>        <svg class="icon" viewBox="0 0 40 40"><use xlink:href="#cart1" x="21%" y="15%"></use></svg>      </span>      <span class="cart-content">        <span class="cart-products-count ">' + json['text_items_small'] + '</span>      </span>    </span>');
				}, 100);

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					location = 'index.php?route=checkout/cart';
				} else {
					$('#cart > ul').load('index.php?route=common/cart/info ul li');
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	}
}

var wishlist = {
	'add': function(product_id) {
		$.ajax({
			url: 'index.php?route=account/wishlist/add',
			type: 'post',
			data: 'product_id=' + product_id,
			dataType: 'json',
			success: function(json) {
				$('.alert-dismissible').remove();

				if (json['redirect']) {
					location = json['redirect'];
				}
				$('#wishlist-total span').html(json['total']);
				$('#wishlist-total').attr('title', json['total']);
				if (json['success']) {
					if ($(document).find('.quickview-container').length && parent) { 
						parent.$.notify({message:json.success},{type:"success",offset:0,placement:{from:"top",align:"center"},z_index: 9999,animate:{enter:"animated fadeInDown",exit:"animated fadeOutUp"},template:'<div data-notify="container" class="col-xs-12 col-sm-12 alert alert-{0}" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button><span data-notify="icon"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'});
					} else {
						$.notify({message:json.success},{type:"success",offset:0,placement:{from:"top",align:"center"},z_index: 9999,animate:{enter:"animated fadeInDown",exit:"animated fadeOutUp"},template:'<div data-notify="container" class="col-xs-12 col-sm-12 alert alert-{0}" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button><span data-notify="icon"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'});
					}
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'remove': function() {

	}
}

var compare = {
	'add': function(product_id) {
		$.ajax({
			url: 'index.php?route=product/compare/add',
			type: 'post',
			data: 'product_id=' + product_id,
			dataType: 'json',
			success: function(json) {
				$('.alert-dismissible').remove();
				$('#compare-total').html(json['total']);
				if (json['success']) {
					if ($(document).find('.quickview-container').length && parent) {
						parent.$.notify({message:json.success},{type:"success",offset:0,placement:{from:"top",align:"center"},z_index: 9999,animate:{enter:"animated fadeInDown",exit:"animated fadeOutUp"},template:'<div data-notify="container" class="col-xs-12 alert alert-{0}" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button><span data-notify="icon"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'});

			        } else {
						$.notify({message:json.success},{type:"success",offset:0,placement:{from:"top",align:"center"},z_index: 9999,animate:{enter:"animated fadeInDown",exit:"animated fadeOutUp"},template:'<div data-notify="container" class="col-xs-12 alert alert-{0}" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button><span data-notify="icon"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'});
					$('#compare-total').html(json['total']);

			        }
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'remove': function() {

	}
}

/* Agree to Terms */
$(document).delegate('.agree', 'click', function(e) {
	e.preventDefault();

	$('#modal-agree').remove();

	var element = this;

	$.ajax({
		url: $(element).attr('href'),
		type: 'get',
		dataType: 'html',
		success: function(data) {
			html  = '<div id="modal-agree" class="modal">';
			html += '  <div class="modal-dialog">';
			html += '    <div class="modal-content">';
			html += '      <div class="modal-header">';
			html += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
			html += '        <h4 class="modal-title">' + $(element).text() + '</h4>';
			html += '      </div>';
			html += '      <div class="modal-body">' + data + '</div>';
			html += '    </div>';
			html += '  </div>';
			html += '</div>';

			$('body').append(html);

			$('#modal-agree').modal('show');
		}
	});
});

// Autocomplete */
(function($) {
	$.fn.autocomplete = function(option) {
		return this.each(function() {
			this.timer = null;
			this.items = new Array();

			$.extend(this, option);

			$(this).attr('autocomplete', 'off');

			// Focus
			$(this).on('focus', function() {
				this.request();
			});

			// Blur
			$(this).on('blur', function() {
				setTimeout(function(object) {
					object.hide();
				}, 200, this);
			});

			// Keydown
			$(this).on('keydown', function(event) {
				switch(event.keyCode) {
					case 27: // escape
						this.hide();
						break;
					default:
						this.request();
						break;
				}
			});

			// Click
			this.click = function(event) {
				event.preventDefault();

				value = $(event.target).parent().attr('data-value');

				if (value && this.items[value]) {
					this.select(this.items[value]);
				}
			}

			// Show
			this.show = function() {
				var pos = $(this).position();

				$(this).siblings('ul.dropdown-menu').css({
					top: pos.top + $(this).outerHeight(),
					left: pos.left
				});

				$(this).siblings('ul.dropdown-menu').show();
			}

			// Hide
			this.hide = function() {
				$(this).siblings('ul.dropdown-menu').hide();
			}

			// Request
			this.request = function() {
				clearTimeout(this.timer);

				this.timer = setTimeout(function(object) {
					object.source($(object).val(), $.proxy(object.response, object));
				}, 200, this);
			}

			// Response
			this.response = function(json) {
				html = '';

				if (json.length) {
					for (i = 0; i < json.length; i++) {
						this.items[json[i]['value']] = json[i];
					}

					for (i = 0; i < json.length; i++) {
						if (!json[i]['category']) {
							html += '<li data-value="' + json[i]['value'] + '"><a href="#">' + json[i]['label'] + '</a></li>';
						}
					}

					// Get all the ones with a categories
					var category = new Array();

					for (i = 0; i < json.length; i++) {
						if (json[i]['category']) {
							if (!category[json[i]['category']]) {
								category[json[i]['category']] = new Array();
								category[json[i]['category']]['name'] = json[i]['category'];
								category[json[i]['category']]['item'] = new Array();
							}

							category[json[i]['category']]['item'].push(json[i]);
						}
					}

					for (i in category) {
						html += '<li class="dropdown-header">' + category[i]['name'] + '</li>';

						for (j = 0; j < category[i]['item'].length; j++) {
							html += '<li data-value="' + category[i]['item'][j]['value'] + '"><a href="#">&nbsp;&nbsp;&nbsp;' + category[i]['item'][j]['label'] + '</a></li>';
						}
					}
				}

				if (html) {
					this.show();
				} else {
					this.hide();
				}

				$(this).siblings('ul.dropdown-menu').html(html);
			}

			$(this).after('<ul class="dropdown-menu"></ul>');
			$(this).siblings('ul.dropdown-menu').delegate('a', 'click', $.proxy(this.click, this));

		});
	}
})(window.jQuery);
