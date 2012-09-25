TIMELINES_URL = '/office/api/v1/timelines/';

timeline = {
	// opens popup
	add : function() {
		resetForm($('#timeline-form'));
		showPopup($('#timeline-form'));
	},

	// saves new timeline
	create : function() {
		if (data = this.getFormData()) {
			$.ajax( {
				url : TIMELINES_URL,
				type : "POST",
				contentType : 'application/json',
				data : JSON.stringify(this.getFormData()),
				success : function() {
					closePopup($('#timeline-form'));
					document.location = document.URL;
				},
				error : function() {
					alert('err');
				}
			});
		}
	},

	// opens popup and load timeline's data
	edit : function(id) {
		resetForm($('#timeline-form'));
		$('#timeline-id').val(id);

		$.ajax( {
			url : TIMELINES_URL + id,
			type : "GET",
			contentType : 'application/json',
			success : function(res) {
				date_start = res.date_start.replace('T', DATE_SEPARATOR).replace('+00:00', '');
				date_end = res.date_end.replace('T', DATE_SEPARATOR).replace('+00:00', '');

				$('#timeline-title').val(res.title);
				$('#timeline-date_start').val(date_start);
				$('#timeline-date_end').val(date_end);
				$('#timeline-spam_items').val(res.spam_items);
				$('#timeline-spam_time').val(res.spam_time);

				showPopup($('#timeline-form'));
			}
		});
	},

	// saves timeline's new data
	update : function() {
		if (data = this.getFormData()) {
			$.ajax( {
				url : TIMELINES_URL + $('#timeline-id').val(),
				type : "PUT",
				contentType : 'application/json',
				data : JSON.stringify(this.getFormData()),
				success : function(res) {
					closePopup($('#timeline-form'));
					document.location = document.URL;
				},
				error : function() {
					alert('err');
				}
			});
		}
	},

	save : function() {
		if ($('#timeline-id').val() != '') {
			this.update();
		} else {
			this.create();
		}
	},

	// removes timeline's new data
	remove : function(id) {
		$.ajax( {
			url : TIMELINES_URL + id,
			type : "DELETE",
			success : function() {
				document.location = document.URL;
			}
		});
	},

	// loads timelines list
	list : function() {
		$.ajax( {
			url : TIMELINES_URL,
			type : "GET",
			dataType : "json",
			success : function(res) {
				alert(res);
				// closePopup($('#timeline-form'));
			// timeline.list();
		}
		});
	},

	getFormData : function() {
		sdate = $('#timeline-date_start').val().replace(DATE_SEPARATOR, ' ');
		edate = $('#timeline-date_end').val().replace(DATE_SEPARATOR, ' ');
		title = $('#timeline-title').val();
		spam_items = $('#timeline-spam_items').val();
		spam_time = $('#timeline-spam_time').val();
		
		if (sdate == '' || edate == '' || title == '') {
			alert('Title, start date and end date are required');
			return false;
		}
		if (sdate > edate) {
			alert('End date should be greater than start date');
			return false;
		} else {
			return {
				'title' : $('#timeline-title').val(),
				'date_start' : sdate,
				'date_end' : edate,
				'spam_items' : spam_items,
				'spam_time' : spam_time
			};
		}

	}
}

$(function() {
	$('.timeline-add').on('click', function() {
		timeline.add();
	});

	$('.timeline-edit').on('click', function() {
		timeline.edit($(this).attr('timeline-id'));
	});

	$('.timeline-delete').on('click', function() {
		timeline.remove($(this).attr('timeline-id'));
	});

	$('#timeline-form .btn-submit').on('click', function() {
		timeline.save();
		return false;
	});
});