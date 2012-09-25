SERVICES_URL = '/office/api/v1/services/';

services = {
	// opens popup
	add : function() {
	    $('#service-id').val('');
		resetForm($('#service-form'));
		showPopup($('#service-form'));
	},

	// saves new service
	create : function() {
		if (data = this.getFormData()) {
			$.ajax( {
				url : SERVICES_URL,
				type : "POST",
				contentType : 'application/json',
				data : JSON.stringify(this.getFormData()),
				success : function() {
					closePopup($('#service-form'));
					services.list();
				},
				error : function() {
					alert('err');
				}
			});
		}
	},

	// opens popup and load service's data
	edit : function(id) {
		resetForm($('#service-form'));
		$('#service-id').val(id);

		$.ajax( {
			url : SERVICES_URL + id,
			type : "GET",
			contentType : 'application/json',
			success : function(res) {
				date_start = res.date_start.replace('T', DATE_SEPARATOR).replace('+00:00', '');
				date_end = res.date_end.replace('T', DATE_SEPARATOR).replace('+00:00', '');

				$('#service-title').val(res.title);
				$('#service-date_start').val(date_start);
				$('#service-date_end').val(date_end);
				$('#service-type').text(res.type);

				showPopup($('#service-form'));
			}
		});
	},

	// saves service's new data
	update : function() {
		if (data = this.getFormData()) {
			$.ajax( {
				url : SERVICES_URL + $('#service-id').val(),
				type : "PUT",
				contentType : 'application/json',
				data : JSON.stringify(this.getFormData()),
				success : function(res) {
					closePopup($('#service-form'));
					services.list();
				},
				error : function() {
					alert('err');
				}
			});
		}
	},

	save : function() {
		if ($('#service-id').val() != '') {
			this.update();
		} else {
			this.create();
		}
	},

	// removes service's new data
	remove : function(id) {
		$.ajax( {
			url : SERVICES_URL + id,
			type : "DELETE",
			success : function() {
			services.list();
			}
		});
	},

	// loads services list
	list : function() {
		timeline_id = $('#page-timeline-id').val();
		$.ajax( {
			url : SERVICES_URL + '?timeline=' + timeline_id,
			type : "GET",
			dataType : "json",
			success : function(res) {
				$('#services-list').html('');
				objects = res.objects;

				$.each(objects, function (index, item) {
					$('#services-list').append(
							$('<li>').append(
									$('<span>').text(item.title + '(' + item.type + ')'),
									$('<br>'),
									$('<span>').text(clearDate(item.date_start) + ' - ' + clearDate(item.date_end)),
									$('<br>'),
									$('<span>', {class: 'service-edit btn btn-primary btn-mini', 'service-id': item.id}).text('edit'),
									$('<span>', {class: 'service-delete btn btn-btn btn-danger btn-mini btn-mini', 'service-id': item.id}).text('delete'),
									$('<br>'),$('<br>')
							)
					);
				});
			}
		});
	},
	
	// loads services list
	menuList : function() {
		timeline_id = $('#page-timeline-id').val();
		$.ajax( {
			url : SERVICES_URL + '?timeline=' + timeline_id,
			type : "GET",
			dataType : "json",
			success : function(res) {
				$('#services-all').html('');
				objects = res.objects;

				$.each(objects, function (index, item) {
					$('#services-all').append(
							$('<li>').append(
									$('<span>', {class: item.type.toLowerCase() + '-delete', 'item-id': item.id}).text('x'),
									$('<a>', {'href': 'javascript: void(0)', class: item.type.toLowerCase() + '-edit', 'item-id': item.id}).text(item.title + '(' + item.type + ')')
							)
					);
				});
			}
		});
	},

	getFormData : function() {
		sdate = $('#service-date_start').val().replace(DATE_SEPARATOR, ' ');
		edate = $('#service-date_end').val().replace(DATE_SEPARATOR, ' ');
		title = $('#service-title').val();
		type = $('#service-type').text();
		timeline_id = $('#page-timeline-id').val();
		
		if (sdate == '' || edate == '' || title == '') {
			alert('Title, start date and end date are required');
			return false;
		}
		if (sdate > edate) {
			alert('End date should be greater than start date');
			return false;
		} else {
			return {
				'title' : $('#service-title').val(),
				'date_start' : sdate,
				'date_end' : edate,
				'type' : type,
				'timeline': TIMELINES_URL + timeline_id + '/'
			};
		}

	}
}

$(function() {
	$('.service-add').on('click', function() {
		services.add();
	});

	$(document).on('click', '.service-edit', function() {
		services.edit($(this).attr('service-id'));
	});

	$(document).on('click', '.service-delete', function() {
		services.remove($(this).attr('service-id'));
	});

	$('#service-form .btn-submit').on('click', function() {
		services.save();
		return false;
	});
});