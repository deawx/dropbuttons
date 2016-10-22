/*
 * Dropbuttons v.1.0.0 Jquery Plugin
 * Tested with JQuery 1.12.4 and Bootstrap 3.3.7
 * Copyright (c) 2016 Luis Ig. Bacas Riveiro
 * Licensed under MIT (https://github.com/lbacas/dropbuttons/blob/master/LICENSE)
 * Based on work by Alexandru Boboc to droptabs plugin (https://github.com/pippogsm/droptabs).
 */

(function($) {

    $.fn.dropbuttons = function(o) {

		//Default options
		var s = $.extend({
			dropdownSelector        : "div.dropdown",
			dropdownMenuSelector    : "ul.dropdown-menu",
			dropdownButtonsSelector : "li",
			visibleButtonsSelector  : ">button:not(.dropdown)",
			autoArrangeButtons      : true,
            addToDropdown  : function( elem ) {
                if ( elem.length === 1 ) {
                    var dropdownElem = $('<li></li>');
                    var dropdownLinkElem = $('<a href="#"></a>').html( elem.html() ).appendTo(dropdownElem);
                    dropdownElem.append( elem.addClass('hidden').attr('data-dropbuttons', true) );
                    dropdownElem.addClass( elem.attr('data-dropbuttons-class') );
                    dropdownLinkElem.on('click', function() {
                        elem.trigger('click');
                    });
                    return dropdownElem;
                }
                return elem;

            },
            removeFromDropdown : function( dropdownElem ) {
                if ( dropdownElem.length === 1 ) {
                    var elem = dropdownElem.find('[data-dropbuttons]');
                    elem.insertBefore( dropdownElem );
                    dropdownElem.remove();
                    return elem.removeClass('hidden').removeAttr('data-dropbuttons');
                }
                return dropdownElem;
            }
        }, o);

        return this.each( function() {
			var $container = $(this);
			var dropdown = $(s.dropdownSelector, this);
			var dropdownMenu = $(s.dropdownMenuSelector, dropdown);

			var $dropdownButtons = function () {
				return $(s.dropdownButtonsSelector, dropdownMenu);
			};

			var $visibleButtons = function () {
				return $(s.visibleButtonsSelector, $container);
			};

			function getFirstHiddenElementWidth() {
				var tempElem = $dropdownButtons().first().clone().appendTo($container).css("position","fixed");
				var hiddenElementWidth = $(tempElem).outerWidth(true);
				$(tempElem).remove();
				return hiddenElementWidth;
			}

			function getHiddenElementWidth(elem) {
				var tempElem = $(elem).clone().appendTo($container).css("position","fixed");
				var hiddenElementWidth = $(tempElem).outerWidth(true);
				$(tempElem).remove();
				return hiddenElementWidth;
			}

			var visibleButtonsWidth = function () {
				var visibleButtonsWidth = 0;
				$($visibleButtons()).each(function( index ) {
					visibleButtonsWidth += parseInt($(this).outerWidth(true), 10);
				});
				visibleButtonsWidth = visibleButtonsWidth + parseInt($(dropdown).outerWidth(true), 10);
				return visibleButtonsWidth;
			};

			var availableSpace = function () {
				return $container.outerWidth(true) - visibleButtonsWidth();
			};

			var arrangeButtons = function () {
                var x = availableSpace();

				if (x < 0) {//we will hide buttons here
					$( $visibleButtons().get().reverse() ).each(function( index ){
						if (!($(this).hasClass('always-visible'))){
                                x = x + $(this).outerWidth(true);
								s.addToDropdown( $(this) ).prependTo(dropdownMenu);
						}
						if (x >= 0) {return false;}
					});
				}

                x = availableSpace();
				if (x > getFirstHiddenElementWidth()) { //and here we bring the buttons out
					$($dropdownButtons()).each(function( index ) {
						if (getHiddenElementWidth(this) < x && !($(this).hasClass('always-dropdown'))) {
							x = x - $(this).outerWidth(true);
                            s.removeFromDropdown( $(this) ).appendTo($container);
						} else {return false;}
					 });
				}

				if ($dropdownButtons().length <= 0) {
					dropdown.hide();
				} else {
					dropdown.show();
					$container.append( dropdown );
				}
			};

			//init
			if (s.autoArrangeButtons) {
				var tempTabs = [];
				$($visibleButtons().get().reverse()).each(function( index ){
					if ($(this).hasClass('always-visible')) {
						tempTabs.push($(this));
						$(this).remove();
					}
				});
				for (var i = 0; i < tempTabs.length; i++ ) {
					$container.prepend(tempTabs[i]);
				}
			}

			$(document).ready(function(){
				arrangeButtons();
			});

			$( window ).resize(function() {
				arrangeButtons();
			});
			return this;
        });
    };
}(jQuery));