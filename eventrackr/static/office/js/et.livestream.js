livestream = {
		
		edit : function(id) {
			resetForm($('#timeline-form'));
			$('#timeline-id').val(id);

			$.ajax( {
				url : TIMELINES_URL + id,
				type : "GET",
				contentType : 'application/json',
				success : function(res) {

					$('#livestream-account').val(res.livestream_account);
					if (res.chatroll_active == '1') {
						$('#livestream-chatroll').attr('checked');
					}
					
					if (res.livestream_active == '1') {
						$('#livestream-active div').first().show();
						$('#livestream-active input').first().show();
						
						$('#livestream-active div:eq(1)').hide();
						$('#livestream-active input:eq(1)').hide();
					} else {
						$('#livestream-active div').first().hide();
						$('#livestream-active input').first().hide();
						
						$('#livestream-active div:eq(1)').show();
						$('#livestream-active input:eq(1)').show();
					}

					showPopup($('#livestream-form'));
				}
			});
		},

		// saves timeline's new data
		update : function() {
			if (data = this.getFormData()) {
				$.ajax( {
					url : TIMELINES_URL + $('#page-timeline-id').val(),
					type : "PUT",
					contentType : 'application/json',
					data : JSON.stringify(this.getFormData()),
					success : function(res) {
						closePopup($('#livestream-form'));
					},
					error : function() {
						alert('err');
					}
				});
			}
		},

	getFormData : function() {
		livestream_account = $('#livestream-account').val();
		livestream_active = $('#livestream-active div.radio-item').first().css('display') == 'block' ? 1 : 0;
		chatrol_active = $('#livestream-chatroll').attr('checked') == 'checked' ? 1 : 0;
		
		if (livestream_active == 1) {$('#livestream-content').show();} else {$('#livestream-content').hide();}
		if (chatrol_active == 1) {$('#chatroll-content').show();} else {$('#chatroll-content').hide();}

		return {
			'livestream_account' : livestream_account,
			'livestream_active' : livestream_active,
			'chatrol_active' : chatrol_active
		};
	}
}

$(function() {
	$(document).on('click', '.livestream-edit', function() {
		livestream.edit($('#page-timeline-id').val());
	});

	$('#livestream-form .btn-submit').on('click', function() {
		livestream.update();
		return false;
	});
});