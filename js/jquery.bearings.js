/**
 * bearings.js - jQuery plugin to create a breadcrumb-style navigation bar for hierarchical data structures
 * @requires jQuery v1.7
 *
 * Copyright (c) 2007 Huddle (huddle.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.1 alpha
 */

(function($) {
	var $name = 'bearings';

	$.fn[$name] = function(opts, methodData) {
		var parentElement,
			listElement,
			navElement,
			navElementRootButton,
			navElementClone,
			navElementArrows,
			navElementCloneArrows,
			listElementWidth,
			parentElementWidth,
			navElementWidth,
			rootNavLinkHasHref = false;

		parentElement = this.eq(0).addClass('bearings');

		if (typeof opts === 'string') {

			if(methodData instanceof Array){
				methodData = {items:methodData};
			}

			parentElement.trigger($name +'.'+opts, methodData);
			return;
		}

		opts = $.extend({
			items: [],
			listClass: 'breadcrumb',
			navClass: 'pagination crumb-nav',
			rootLinkClass: 'tip-top crumb-home',
			scrollLeftLinkClass: 'left-nudge',
			scrollRightLinkClass: 'right-nudge',
			firstItemListClass: 'first-crumb',
			listContainerClass: 'list-container',
			maxScroll: 100,
			rightPadding: 30,
			isLastItemClickable: true,
			onRootMouseEnter: '',
			onRootMouseLeave: ''
		}, opts);

		listElement = $('<ul class="' + opts.listClass + '"></ul>');

		navElement = $('<div class="'+ opts.navClass + '">'+
			'<ul>'+
				'<li>'+
					'<a href="#" class="bear-root '+ opts.rootLinkClass +'">'+
						'<span class="ie7fix">&nbsp;</span><i class="icon-briefcase"/>' +
					'</a>'+
				'</li>'+
				'<li>'+
					'<a href="#" style="display:none" class="bear-left bear-nav-arrow '+ opts.scrollLeftLinkClass +'">'+
						'<span class="ie7fix">&nbsp;</span><i class="icon-caret-left" />' +
					'</a>'+
				'</li>'+
				'<li>'+
					'<a href="#" style="display:none" class="bear-right bear-nav-arrow '+ opts.scrollRightLinkClass +'">'+
						'<span class="ie7fix">&nbsp;</span><i class="icon-caret-right" />' +
					'</a>'+
				'</li>'+
			'</ul>'+
		'</div>');

		navElement.appendTo(parentElement);
		navElementClone = navElement.clone();
		navElementClone.css('visibility', 'hidden').appendTo(parentElement);
		navElementArrows = navElement.find('.bear-nav-arrow');
		navElementCloneArrows = navElementClone.find('.bear-nav-arrow');
		navElementRootButton = navElement.find('.bear-root');
		
		parentElementWidth = parentElement.innerWidth();

		navElement.on('click', '.bear-root', function (e) {
			parentElement.trigger($name + '.itemSelected', [ opts.items[0] ]);
			
			if (!rootNavLinkHasHref) {
				return false;
			}
		});

		navElement.on('click', '.bear-left', function (e) {
			var amountToScroll = Math.min(opts.maxScroll, navElementWidth - listElement.position().left);
			listElement.stop().animate({ left : '+=' + amountToScroll }, 250, 'swing');
			return false;
		});

		navElement.on('click', '.bear-right', function (e) {
			var amountToScroll = Math.min(opts.maxScroll, (listElement.position().left + listElementWidth) - parentElementWidth);
			if (amountToScroll < opts.maxScroll) {
				amountToScroll += opts.rightPadding;
			}
			listElement.stop().animate({ left : '-=' + amountToScroll }, 250, 'swing');
			return false;
		});

		if (typeof opts.onRootMouseEnter === 'function') {
			navElement.on('mouseenter', '.bear-root', function(e) {
				opts.onRootMouseEnter(e, $(this), opts.items[0]);
			});
		}

		if (typeof opts.onRootMouseLeave === 'function') {
			navElement.on('mouseleave', '.bear-root', opts.onRootMouseLeave);
		}

		function createAncestryList() {
			var listItemsHTML = '',
				previousLen = listElement.children().length,
				len = opts.items.length - 1;

			listElement.empty();

			$.each(opts.items, function (index, item) {
				var listItemElement = $('<li></li>'),
					listItemLink,
					title = $('<span/>').text(item.title).get(0).innerHTML; // is there a better way?

				if (index !== len || (opts.isLastItemClickable && index === len)) {
					listItemLink = $('<a href="'+(item.url || '#')+'">' + title + '</a>');
					listItemLink.click(function(e) {
						listItemLink.trigger($name + '.itemSelected', [ item ]);
						if(!item.url) {
							e.preventDefault();
						}
					});
				} else {
					listItemLink = $('<span class="active">'+ title + '</span>');
				}

				listItemLink.appendTo(listItemElement);

				if (index !== len) {
					$('<i class="icon-caret-right divider"></i>').appendTo(listItemElement);
				} else if (index === len && previousLen < opts.items.length) {
					listItemElement.addClass("justAdded");
				}

				if (index === 0) {
					if(item.url){
						parentElement.find('.bear-root').get(0).href = item.url;
						rootNavLinkHasHref = true;
					} else {
						parentElement.find('.bear-root').get(0).href = '#';
						rootNavLinkHasHref = false;
					}
					
					listItemElement.addClass(opts.firstItemListClass);
				}
				
				listElement.append(listItemElement);
			});
		}

		createAncestryList();

		listElement.appendTo($('<div class="' + opts.listContainerClass + '"/>').appendTo(parentElement));

		function showHideNav(animate) {
			var listElementLeftPosition,
				finalListItemWidth = listElement.children('li').last().outerWidth();

			// Now set the widths
			listElementWidth = listElement.width();

			navElementCloneArrows.hide();

			navElementWidth = navElementClone.outerWidth();
			listElementLeftPosition = navElementWidth;

			if (listElementWidth > (parentElementWidth - navElementWidth)) {
				navElementCloneArrows.show();
				navElementWidth = navElementClone.outerWidth();

				if (animate) {
					navElementArrows.fadeIn();
				} else {
					navElementArrows.show();
				}

				listElementLeftPosition = (parentElementWidth - listElementWidth) - opts.rightPadding;
			} else {
				navElementCloneArrows.hide();
				navElementWidth = navElementClone.outerWidth();

				if(animate) {
					navElementArrows.fadeOut();
				} else {
					navElementArrows.hide();
				}
			}

			if (animate) {
				listElement.animate({ left : listElementLeftPosition });
				listElement.children("li").last().removeClass("justAdded");
			} else {
				listElement.css('left', listElementLeftPosition);
			}

			if (typeof opts.onRootButtonReady === 'function' && opts.items.length > 0) {
				opts.onRootButtonReady(navElementRootButton, opts.items[0]);
			}
		}

		showHideNav();

		parentElement.bind($name +'.update', function (e, data) {
			opts.items = data.items;
			createAncestryList();
			showHideNav(true);
		});

		parentElement.bind($name +'.updateList', function (e, data) {
			opts.items = data.items;
			createAncestryList();
			showHideNav(true);
		});

		parentElement.bind($name +'.push', function (e, data) {
			opts.items.push(data);
			createAncestryList();
			showHideNav(true);
		});

		parentElement.bind($name +'.pop', function (e) {
			opts.items.pop();
			createAncestryList();
			showHideNav(true);
		});

		return parentElement;
	};
})(jQuery);