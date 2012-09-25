facebook = {
	// opens popup
	add : function() {
	    $('#facebook-id').val('');
		resetForm($('#facebook-form'));
		showPopup($('#facebook-form'));
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
					closePopup($('#flickr-form'));
					//twitter.list();
				},
				error : function() {
					alert('err');
				}
			});
		}
	},

	// opens popup and load service's data
	edit : function(id) {
		resetForm($('#flickr-form'));
		$('#flickr-id').val(id);

		$.ajax( {
			url : SERVICES_URL + id,
			type : "GET",
			contentType : 'application/json',
			success : function(res) {
				date_start = res.date_start.replace('T', DATE_SEPARATOR).replace('+00:00', '');
				date_end = res.date_end.replace('T', DATE_SEPARATOR).replace('+00:00', '');

				$('#twitter-title').val(res.title);
				$('#twitter-date_start').val(date_start);
				$('#twitter-date_end').val(date_end);
				$('#twitter-type').text(res.type);

				showPopup($('#twitter-form'));
			}
		});
	},

	// saves service's new data
	update : function() {
		if (data = this.getFormData()) {
			$.ajax( {
				url : SERVICES_URL + $('#flickr-id').val(),
				type : "PUT",
				contentType : 'application/json',
				data : JSON.stringify(this.getFormData()),
				success : function(res) {
					closePopup($('#flickr-form'));
					//twitter.list();
				},
				error : function() {
					alert('err');
				}
			});
		}
	},

	save : function() {
		if ($('#flickr-id').val() != '') {
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
			twitter.list();
			}
		});
	},

	// loads services list
	list : function() {
		timeline_id = $('#page-timeline-id').val();
		$.ajax( {
			url : SERVICES_URL + '?timline=' + timeline_id,
			type : "GET",
			dataType : "json",
			success : function(res) {
				$('#flickr-list').html('');
				objects = res.objects;

				$.each(objects, function (index, item) {

				});
			}
		});
	},

	getFormData : function() {
		type = 'FLICKR';
		timeline_id = $('#page-timeline-id').val();
		sdate = $('#flickr-date_start').val().replace(DATE_SEPARATOR, ' ');
		edate = $('#flickr-date_end').val().replace(DATE_SEPARATOR, ' ');
		
		title = $('#flickr-title').val();
		password = $('#flickr-password').val();
		username = $('#flickr-password').val();
		
		if (sdate == '' || edate == '' || title == '') {
			alert('Title, start date and end date are required');
			return false;
		}
		if (sdate > edate) {
			alert('End date should be greater than start date');
			return false;
		} else {
			//flickr_photoset_id - ?
			return {
				'title' : title,
				'type' : type,
				'password' : password,
				'timeline': TIMELINES_URL + timeline_id + '/',
				'flickr_user_id' : username,
				'date_start' : sdate,
				'date_end' : edate		
			};
		}
	}
}

$(function() {
	$('.facebook-add').on('click', function() {
		facebook.add();
	});

	$(document).on('click', '.facebook-edit', function() {
		facebook.edit($(this).attr('facebook-id'));
	});

	$(document).on('click', '.facebook-delete', function() {
		facebook.remove($(this).attr('facebook-id'));
	});

	$('#facebook-form .btn-submit').on('click', function() {
		facebook.save();
		return false;
	});
});