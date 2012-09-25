flickr = {
	// opens popup
	add : function() {
	    $('#flickr-id').val('');
		resetForm($('#flickr-form'));
		showPopup($('#flickr-form'));
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
					services.menuList();
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

				$('#flickr-date_start').val(date_start);
				$('#flickr-date_end').val(date_end);
				$('#flickr-title').val(res.title);
				$('#flickr-password').val(res.password);
				$('#flickr-user_id').val(res.flickr_user_id);

				showPopup($('#flickr-form'));
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
					services.menuList();
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
				services.menuList();
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
		username = $('#flickr-user_id').val();
		
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
	},
	
	confirmDel : function(id) {
		dialog = $('#confirmation');
		$('#btnYes', dialog).unbind();
		$('#btnNo', dialog).unbind();
		
		showPopup(dialog);

	    $('#btnYes', dialog).click(function() {
	        closePopup(dialog);
	        flickr.remove(id);
	    });
	    $('#btnNo', dialog).click(function() {
	    	closePopup(dialog);
	    });
	}
}


$(function() {
	$('.flickr-add').on('click', function() {
		flickr.add();
	});

	$(document).on('click', '.flickr-edit', function() {
		flickr.edit($(this).attr('item-id'));
	});

	$(document).on('click', '.flickr-delete', function() {
		flickr.confirmDel($(this).attr('item-id'));
	});

	$('#flickr-form .btn-submit').on('click', function() {
		flickr.save();
		return false;
	});
});
