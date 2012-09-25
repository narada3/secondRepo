DATE_SEPARATOR = '                               ';

$(function() {
	$('html').on('click', function() {$('.panel-edit').hide();});
	$('.stroke').height($('.events-next').height());
	$('.pannel-close .btn').live('click', function() {
		$(this).parent().removeClass('pannel-close');
		$(this).parent().addClass('pannel-open');
	});
	$('.pannel-open .btn').live('click', function() {
		$(this).parent().removeClass('pannel-open');
		$(this).parent().addClass('pannel-close');
	});

	$('.wrap-admin .event .icon').live('click', function() {
		$pos_top = $(this).offset().top - 67;
		$('.panel-edit').css('top', $pos_top);
		$('.panel-edit').show();
		$('.panel-edit ul').attr('event-id', $(this).attr('event-id'));
	});
	
	$(document).on('click', '.dropdown-menu a', function() {
		$('button.btn-small', $(this).closest('.btn-group')).first().text($(this).text());
		$('button.btn-small', $(this).closest('.btn-group')).first().attr('item-id', $(this).attr('item-id'));
	});

	$('.close-popup').live('click', function() {
		closePopup($(this).parent());
	});

	$('.btn-date').datetimepicker( {
		dateFormat : 'yy-mm-dd',
		timeFormat : 'hh:mm:ss',
		addSliderAccess : true,
		showSecond : true,
		sliderAccessArgs : {
			touchonly : false
		},
		separator : DATE_SEPARATOR,
		showOn : "button",
		buttonImage : "images/calendar.gif",
		buttonImageOnly : false
	});

	$(".btn-date").focus(function() {
		$(this).blur();
	});
	
	$('.radio-choose').on('click', function() {
		$('.radio-choose input').each(  function() { 
				if( $(this).is(':checked')){
					 $(this).next().hide();
					 $(this).hide();
				} else {
					$(this).next().show();
					$(this).show();
				}
		});
	});

//	$(".item").draggable( {
//		revert : true
//	});
//	$(".timeline").droppable( {
//		over : function() {
//			$(this).css('backgroundColor', '#cedae3');
//		},
//		out : function() {
//			$(this).css('backgroundColor', '#a6bcce');
//		},
//		drop : function() {
//			var answer = confirm('Permantly delete this item?');
//			$(this).removeClass('over').addClass('out');
//		}
//	});
});

function showOverlay() {
	$('.overlay').height($(document).height());
	$('.overlay').show();
}

function showPopup(el) {
	showOverlay();
	el.css('margin-left', -el.width() / 2);
	el.css('margin-top', -el.height() / 2);
	el.show();
}

function closePopup(el) {
	el.hide();
	$('.overlay').hide();
}

function resetForm($form) {
	$form.find('input:text, input:password, input:file, select, textarea').val(
			'');
	$form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr(
			'selected');
}

function clearDate(date) {
	return date.replace('T', ' ').replace('+00:00', '');
}

function getTime(date) {
	date = clearDate(date);
	date_arr = date.split(' ');
	time_arr = date_arr[1].split(':');
	return time_arr[0] + ':' + time_arr[1];
}

function getCurrentDate() {
	var d = new Date();
	month = d.getMonth() + 1;
	day = d.getDate();
	hour = d.getHours();
	minute = d.getMinutes();
	second = d.getSeconds();
	if (month < 10) {month = '0' + month;}
	if (day < 10) {day = '0' + day;}
	if (hour < 10) {hour = '0' + hour;}
	if (minute < 10) {minute = '0' + minute;}
	if (second < 10) {second = '0' + second;}
	return d.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

// Global AJAX error handler
// $(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
// alert('Ajax erorr\n\n' + 'event: ' + event.toSource() + '\n\n' +
// 'jqXHR: ' + jqXHR.toSource() + '\n\n' +
// 'ajaxSettings: ' + ajaxSettings.toSource() + '\n\n' +
// 'thrownError: ' + thrownError.toSource() + '\n---------' );
// });
