twitter = {
	// opens popup
	add : function() {
	    $('#twitter-id').val('');
		resetForm($('#twitter-form'));
		showPopup($('#twitter-form'));
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
					closePopup($('#twitter-form'));
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
		resetForm($('#twitter-form'));
		$('#twitter-id').val(id);

		$.ajax( {
			url : SERVICES_URL + id,
			type : "GET",
			contentType : 'application/json',
			success : function(res) {
				date_start = res.date_start.replace('T', DATE_SEPARATOR).replace('+00:00', '');
				date_end = res.date_end.replace('T', DATE_SEPARATOR).replace('+00:00', '');
	
				$('#twitter-date_start').val(date_start);
				$('#twitter-date_end').val(date_end);
			
				title = $('#twitter-title').val(res.title);
				login = $('#twitter-email').val(res.login);
				twitter_keyword = $('#twitter-keyword').val(res.twitter_keyword);
				twitter_hashtag = $('#twitter-hashtag').val(res.twitter_hashtag);
				twitter_username = $('#twitter-username').val(res.twitter_username);
				password = $('#twitter-password').val(res.password);
				if (res.twitter_include_followers == '1') {
					$('#twitter-include_followers').attr('checked');
				}
				include_followers = $('#twitter-include_followers').checked ? '1' : 0;
				
				showPopup($('#twitter-form'));
			}
		});
	},

	// saves service's new data
	update : function() {
		if (data = this.getFormData()) {
			$.ajax( {
				url : SERVICES_URL + $('#twitter-id').val(),
				type : "PUT",
				contentType : 'application/json',
				data : JSON.stringify(this.getFormData()),
				success : function(res) {
					closePopup($('#twitter-form'));
					services.menuList();
				},
				error : function() {
					alert('err');
				}
			});
		}
	},

	save : function() {
		if ($('#twitter-id').val() != '') {
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

	// loads services list
	list : function() {
		timeline_id = $('#page-timeline-id').val();
		$.ajax( {
			url : SERVICES_URL + '?timline=' + timeline_id,
			type : "GET",
			dataType : "json",
			success : function(res) {
				$('#twitter-list').html('');
				objects = res.objects;

				$.each(objects, function (index, item) {

				});
			}
		});
	},

	getFormData : function() {
		title = $('#twitter-title').val();
		twitter_keyword = $('#twitter-keyword').val();
		twitter_hashtag = $('#twitter-hashtag').val();
		twitter_username = $('#twitter-username').val();
		password = $('#twitter-password').val();
		login = $('#twitter-email').val();
		include_followers = $('#twitter-include_followers').checked ? '1' : 0;
		type = 'TWITTER';
		timeline_id = $('#page-timeline-id').val();
		sdate = $('#twitter-date_start').val().replace(DATE_SEPARATOR, ' ');
		edate = $('#twitter-date_end').val().replace(DATE_SEPARATOR, ' ');
		
		return {
			'title' : title,
			'type' : type,
			'login' : login,
			'password' : password,
			'twitter_keyword' : twitter_keyword,
			'twitter_hashtag' : twitter_hashtag,
			'twitter_username' : twitter_username,
			'twitter_include_followers' : include_followers,
			'timeline': TIMELINES_URL + timeline_id + '/',
			'date_start' : sdate,
			'date_end' : edate
		};
	},
	
	confirmDel : function(id) {
		dialog = $('#confirmation');
		$('#btnYes', dialog).unbind();
		$('#btnNo', dialog).unbind();
		showPopup(dialog);

	    $('#btnYes', dialog).click(function() {
	        closePopup(dialog);
	        twitter.remove(id);
	    });
	    $('#btnNo', dialog).click(function() {
	    	closePopup(dialog);
	    });
	}
}

$(function() {
	$('.twitter-add').on('click', function() {
		twitter.add();
	});

	$(document).on('click', '.twitter-edit', function() {
		twitter.edit($(this).attr('item-id'));
	});

	$(document).on('click', '.twitter-delete', function() {
		twitter.confirmDel($(this).attr('item-id'));
	});

	$('#twitter-form .btn-submit').on('click', function() {
		twitter.save();
		return false;
	});
});