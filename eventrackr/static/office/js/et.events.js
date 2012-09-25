EVENTS_URL = '/office/api/v1/events/';
PARENT_EVENTS_URL = '/office/api/v1/parent_events/';
CURRENT_EVENTS_URL = '/office/api/v1/current_events/?timeline=';

events = {
	current_event: undefined,
	next_event: undefined,
		
	// opens popup
	add : function() {
		resetForm($('#event-form'));
		this.fillParentEvents();
		showPopup($('#event-form'));
	},

	// saves new timeline
	create : function() {
		if (data = this.getFormData()) {
			$.ajax( {
				url : EVENTS_URL,
				type : "POST",
				contentType : 'application/json',
				data : JSON.stringify(this.getFormData()),
				success : function() {
					closePopup($('#event-form'));
					//document.location = document.URL;
					events.list();
				},
				error : function() {
					alert('err');
				}
			});
		}
	},

	// opens popup and load event's data
	edit : function(id) {
		resetForm($('#event-form'));
		$('#event-id').val(id);

		$.ajax( {
			url : EVENTS_URL + id,
			type : "GET",
			contentType : 'application/json',
			success : function(res) {
				date_start = res.date_start.replace('T', DATE_SEPARATOR).replace('+00:00', '');
				date_end = res.date_end.replace('T', DATE_SEPARATOR).replace('+00:00', '');

				$('#event-title').val(res.title);
				$('#event-date_start').val(date_start);
				$('#event-date_end').val(date_end);
				$('#event-message').val(res.content_text);
				events.fillParentEvents();
				
				$.ajax( {
					url : res.parent,
					type : "GET",
					contentType : 'application/json',
					success : function(res) {
						if (res) {
							$('#event-parent_event').text(res.title);
							$('#event-parent_event').attr('item-id', res.id);
						}
					}
				});
				showPopup($('#event-form'));
			}
		});
	},

	// saves event's new data
	update : function() {
		if (data = this.getFormData()) {
			$.ajax( {
				url : EVENTS_URL + $('#event-id').val(),
				type : "PUT",
				contentType : 'application/json',
				data : JSON.stringify(this.getFormData()),
				success : function(res) {
					closePopup($('#event-form'));
					events.list();
				},
				error : function() {
					alert('err');
				}
			});
		}
	},

	save : function() {
		if ($('#event-id').val() != '') {
			this.update();
		} else {
			this.create();
		}
	},

	// removes event's new data
	remove : function(id) {
		$.ajax( {
			url : EVENTS_URL + id,
			type : "DELETE",
			success : function() {
				events.list();
			}
		});
	},

	// loads events list
	list : function() {
		start_simple_height = $('#events-simple').height();
		start_future_height = $('#events-future').height();
		$('#events-simple').css('min-height', start_simple_height);
		$('#events-future').css('min-height', start_future_height);
		
		$('.panel-edit').hide();
		$.ajax( {
			url : EVENTS_URL + '?timeline=' + $('#page-timeline-id').val(),
			type : "GET",
			dataType : "json",
			success : function(res) {
				$('#events-future').html('');
				$('#events-simple').html('');
				$('#events-page-number').val(res.meta.next);
				
				objects = res.objects;
				var pimp = 'event-right';
				var current_date = getCurrentDate();
				show_last = true;
				next_item_exists = false;
				isset_current_event = false;
				objects_count = objects.length;
				
				$.ajax({
					url : CURRENT_EVENTS_URL + $('#page-timeline-id').val(),
					type : "GET",
					dataType : "json",
					success : function(ev_res) {
						ev_objects = ev_res.objects;
						ev_objects_count = ev_objects.length;

						$.each(ev_objects, function (ev_index, ev_item) {
							events.buildFutureBlock(ev_item, current_date);
							ev_objects_count--;
							if (ev_objects_count == 0) {
								
								events.buildCurrentBlock();
								$.each(objects, function (index, item) {
									objects_count--;

									if (item.type != 'EVENT') {
										events.buildPastBlock(item, current_date);
									}
									
									if (objects_count == 0) {
										events.fixCorners('#events-future');
										events.fixCorners('#events-simple');
										events.buildActiveTimeline();
									}
								});
							}
						});
					}
				});
			}
		});
	},
	
	loadNewEvents : function() {
		$.ajax( {
			url : EVENTS_URL + '?timeline=' + $('#page-timeline-id').val(),
			type : "GET",
			dataType : "json",
			success : function(res) {
				objects = res.objects;
				
				var current_date = getCurrentDate();
				var last_event_id = $('#events-simple li').first().find('.icon').attr('event-id');
				var stop_build = false;

				$.each(objects, function (index, item) {
					if (clearDate(item.date_end) < current_date) {
						if (item.id == last_event_id) {
							stop_build = true;
	
							events.buildCurrentBlock();
							events.fixCorners('#events-simple');
							events.buildActiveTimeline();
						}
						if (!stop_build) {
							events.buildNewBlock(item);
						}
					}
				});
			}
		});
	},
	
	loadPage : function(callback) {
		$.ajax( {
			url : $('#events-page-number').val(),
			type : "GET",
			dataType : "json",
			success : function(res) {
				var objects = res.objects;
				var objects_count = objects.length;
				var current_date = getCurrentDate();
				
				$('.event-start').remove();
				$('#events-page-number').val(res.meta.next);
				
				$.each(objects, function (index, item) {
					events.buildFutureBlock(item, current_date);
					events.buildPastBlock(item, current_date);
					objects_count--;
					if (objects_count == 0) {
						events.fixCorners('#events-simple');
						events.buildActiveTimeline();
						events.setLoadPageInterval();
					}
				});
			}
		});
	},
	
	setLoadPageInterval : function() {
		events_load_interval = setInterval(function() {events.checkLoadPage();}, 1000);
	},
	
	checkLoadPage : function() {
		if ($(".event-start").length != undefined && $(".event-start").length != 0 && $(window).height() > parseInt($(".event-start").offset().top) - parseInt($(window).scrollTop())) {
			clearInterval(events_load_interval);
			events.loadPage();
		}
	},
	
	fillParentEvents : function() {
		timeline_id = $('#page-timeline-id').val();
		$('#event-parents .dropdown-menu').html('');
		$.ajax( {
			url : PARENT_EVENTS_URL + '?timelines=' + timeline_id,
			type : "GET",
			dataType : "json",
			success : function(res) {
				objects = res.objects;
				$('#event-parents .dropdown-menu').append(
						$('<li>').append(
								$('<a>', {'href': '#', 'item-id': ''})
									.text('None')
						)
				);
				$.each(objects, function (index, item) {
					$('#event-parents .dropdown-menu').append(
							$('<li>').append(
									$('<a>', {'href': '#', 'item-id': item.id})
										.text(item.title)
							)
					);
				});
			}
		});
	},
	
	buildFutureBlock : function(item, current_date) {
		if (clearDate(item.date_start) > current_date || clearDate(item.date_end) > current_date) {
			if (clearDate(item.date_start) <= current_date && clearDate(item.date_end) > current_date && !isset_current_event) {
				isset_current_event = true;
				icon_style = 'icon-blue';
				this.current_event = item;
				next_item_exists = true;
			} else {
				icon_style = 'icon-grey';
			}
			fside = events.getSide('#events-future');
			fpimp = fside == 'r' ? 'event-right' : 'event-left';
			$('#events-future').append(
					$('<li>', {'data-side': fside}).append(
							$('<section>', {class: 'event ' + fpimp + ' phone-event-bottom'}).append(
									$('<div>', {class: 'icon ' + icon_style, 'event-id': item.id}),
									$('<div>', {class: 'block'}).append(
											$('<h4>').append(
												$('<time>', {class: 'time-event'}).text(getTime(item.date_start) + ' - ' + getTime(item.date_end)),
												item.title
											)
									)
							)
					)
			);
			if (!next_item_exists) {
				this.next_event = item;
			}
		}
	},
	
	buildCurrentBlock : function() {
		$('#events-center .hidden-phone .left-column').html('');
		$('#events-center .hidden-phone .right-column').html('');
		
		if (this.current_event != undefined) {
			$('#events-center .hidden-phone .left-column').append(
					$('<p>', {class: 'last'}).append(
							$('<a>', {'href': '#'}).text('Right now'),
							$('<time>', {class: 'time-event'}).text(' ' + getTime(this.current_event.date_start) + ' - ' + getTime(this.current_event.date_end)),
							this.current_event.title
					)
			);
		}
		
		if (this.next_event != undefined) {
			$('#events-center .hidden-phone .right-column').append(
					$('<p>', {class: 'last'}).append(
							$('<a>', {'href': '#'}).text('Next'),
							$('<time>', {class: 'time-event'}).text(' ' + getTime(this.next_event.date_start) + ' - ' + getTime(this.next_event.date_end)),
							this.next_event.title
					)
			);
		}
	},
	
	buildNewBlock : function(item) {
		side = 'l';
		pimp = 'event-left';
		$('#events-simple').prepend(
				$('<li>', {'data-side': side}).append(
						events.setBlockContent(item, pimp)
				)
		);
	},
	
	buildPastBlock : function(item, current_date) {
		if (clearDate(item.date_end) < current_date) {
			if (clearDate(this.current_event.date_start) < clearDate(item.date_start) && show_last && this.current_event && item.type == 'EVENT') {
				side = events.getSide('#events-simple');
				pimp = side == 'r' ? 'event-right' : 'event-left';
				$('#events-simple').append(
						$('<li>', {'data-side': side, class: 'event-start'}).append(
							events.setBlockContent(this.current_event, pimp)
						)
				);
				
				$('.event-start .icon').removeClass('icon-grey').addClass('icon-blue');
				
				show_last = false;
			}

			side = events.getSide('#events-simple');
			pimp = side == 'r' ? 'event-right' : 'event-left';
			$('#events-simple').append(
					$('<li>', {'data-side': side}).append(
							events.setBlockContent(item, pimp)
					)
			);
			

			prev_item_id = item.id;
		}
	},
	
	setBlockContent : function(item, pimp) {
		//alert(item.type);
		switch(item.type) {
			case 'EVENT':
			  return $('<section>', {class: 'event ' + pimp + ' phone-event-bottom'}).append(
						$('<div>', {class: 'icon icon-grey', 'event-id': item.id}),
						$('<div>', {class: 'block'}).append(
							$('<h4>').append(
									$('<time>', {class: 'time-event'}).text(getTime(item.date_start) + ' - ' + getTime(item.date_end)),
									item.title + '<br>' + item.content_text
								)
						)
				);
			  break;
			case 'TWITTER':
				//https://twitter.com/yasviridov/status/248750805832839168
				//https://twitter.com/i/#!/search/%23ProgrammesIGrewUpWith
			  return $('<section>', {class: 'event ' + pimp + ' phone-event-bottom'}).append(
						$('<div>', {class: 'icon icon-grey', 'event-id': item.id}),
						$('<header>', {class: 'phone-right-time'}).append(
								$('<h4>', {class: 'title'}).append(
										$('<a>', {'href': '#'}).text('Live text')
								),
								$('<time>', {class: 'time-event'}).text(getTime(item.date_start))
						),
						$('<div>', {class: 'block'}).append(
							$('<div>', {class: 'big'}).append(
									$('<a>', {'href': '#'}).text(item.title),
									$('<p>', {class: 'last'}).text(item.content_text)
								)
						),
						$('<footer>').append(events.getSocialButtons())
				);
			  break;
			case 'FLICKR':
				  return $('<section>', {class: 'event ' + pimp + ' phone-event-bottom'}).append(
							$('<div>', {class: 'icon icon-grey', 'event-id': item.id}),
							$('<header>', {class: 'phone-right-time'}).append(
									$('<h4>', {class: 'title'}).append(
											$('<a>', {'href': '#'}).text('Images')
									),
									$('<time>', {class: 'time-event'}).text(getTime(item.date_start))
							),
							$('<div>', {class: 'block'}).append(
								$('<a>', {'href': '#', class: 'wrap-media'}).append(
										$('<img>', {'src': item.content_media_url}),
										$('<h3>').append($('<a>', {'href': '#'}).text(item.title))
									)
							),
							$('<footer>').append(events.getSocialButtons())
					);
				  break;
		}		
	},
	
	/*
	 *  returns social buttons jQuery object
	 *  
	 */
	getSocialButtons : function() {
		return $('<ul>', {class: 'social-link'}).append(
				$('<li>').append(
						$('<a>', {'href': '', class: 'link-1'}),
						$('<div>', {class: 'counter'}).text('5')
							.append('<span>')
				),
				$('<li>').append(
						$('<a>', {'href': '', class: 'link-2'}),
						$('<div>', {class: 'counter'}).text('100')
							.append('<span>')
				),
				$('<li>').append(
						$('<a>', {'href': '', class: 'link-3'}),
						$('<div>', {class: 'counter'}).text('20')
							.append('<span>')
				),
				$('<li>').append(
						$('<a>', {'href': '', class: 'link-4'}),
						$('<div>', {class: 'counter'}).text('507')
							.append('<span>')
				)
			);
	},
	
	/*
	 *  if there is no start event block
	 *  on timeline creates it and
	 *  set blue line from start to end
	 *  
	 */
	buildActiveTimeline : function() {
		var top_pos = $('#events-future .icon-blue').offset();
		$('.timeline-interval').css('top', top_pos.top + 'px');

		if (show_last && ($(".event-start").length == undefined || $(".event-start").length == 0)) {			side = events.getSide('#events-simple');
			pimp = side == 'r' ? 'event-right' : 'event-left';
			$('#events-simple').append(
					$('<li>', {'data-side': side, class: 'event-start'}).append(
							events.setBlockContent(this.current_event, pimp)
					)
			);
			
			$('.event-start .icon').removeClass('icon-grey').addClass('icon-blue');
		}
		bot_pos = $('#events-simple .event-start').offset();
		$('.timeline-interval').css('height', (bot_pos.top - top_pos.top) + 'px');
		
		setTimeout('events.fixTimelineElemens()', '1500')
	},
	
	fixTimelineElemens : function() {
		left = right = 0;
		$('#events-simple').children('li').each(function() {
			section = $('section.event', $(this));
			
			if (left <= right) {
				$(this).attr('data-side', 'l');
				
				if (section.hasClass('event-right')) {
					section.removeClass('event-right').addClass('event-left');
				}
				
			} else {
				$(this).attr('data-side', 'r');

				if (section.hasClass('event-left')) {
					section.removeClass('event-left').addClass('event-right');
				}
			}

			if ($(this).attr('data-side') == 'l') {
				left += parseInt($(this).height());
			} else {
				right += parseInt($(this).height());
			}
		});
		events.fixCorners();
		events.buildActiveTimeline();
	},
	
	/*
	 *  returns block's side in timeline
	 *  
	 */
	getSide : function(block) {
		left = right = 0;
		$(block).children('li').each(function() {
			if ($(this).attr('data-side') == 'l') {
				left += parseInt($(this).height());
			} else {
				right += parseInt($(this).height());
			}
		});
		if (left > right) {
			return 'r';
		} else {
			return 'l';
		}
	},
	
	fixCorners : function(block) {
		$("ul"+block+" li[data-side='l']").each(function() {
			left_el = $(this).position();
			left_top = left_el.top; 
			$("ul"+block+" [data-side='r']").each(function() {
				right_el = $(this).position();
				right_top = right_el.top;
				if (left_top == right_top) {
					if (parseInt($(this).height()) > 70) {
						$('.icon', $(this)).css('top', '35px');
					} else {
						$(this).css('margin-top', '35px');
					}
				}
			});
		});
	},

	getFormData : function() {
		sdate = $('#event-date_start').val().replace(DATE_SEPARATOR, ' ');
		edate = $('#event-date_end').val().replace(DATE_SEPARATOR, ' ');
		title = $('#event-title').val();
		message = $('#event-message').val();
		timeline_id = $('#page-timeline-id').val();
		parent_id = $('#event-parent_event').attr('item-id');
		parent = parent_id == '' ? '' : PARENT_EVENTS_URL + parent_id + '/';

		if (sdate == '' || edate == '' || title == '') {
			alert('Title, start date and end date are required');
			return false;
		}
		if (sdate > edate) {
			alert('End date should be greater than start date');
			return false;
		} else {
			return {
				'title' : $('#event-title').val(),
				'date_start' : sdate,
				'date_end' : edate,
				'content_text' : message,
				'timeline' : TIMELINES_URL + timeline_id + '/',
				'parent': parent
			};
		}
	},
	
	confirmDel : function(id) {
		dialog = $('#confirmation');
		$('#btnYes', dialog).unbind();
		$('#btnNo', dialog).unbind();
		showPopup(dialog);

	    $('#btnYes', dialog).click(function() {
	        closePopup(dialog);
	        events.remove(id);
	    });
	    $('#btnNo', dialog).click(function() {
	    	closePopup(dialog);
	    });
	}
}

$(function() {
	$('.event-add').on('click', function() {
		events.add();
	});

	$('#event-form .btn-submit').on('click', function() {
		events.save();
		return false;
	});
	
	$(document).on('click', '.panel-action-1', function() {
		events.edit($(this).closest('ul').attr('event-id'));
	});
	
	$(document).on('click', '.panel-action-3', function() {
		events.confirmDel($(this).closest('ul').attr('event-id'));
	});
});