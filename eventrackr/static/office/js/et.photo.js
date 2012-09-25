photo = {
	// opens popup
	add : function() {
	    $('#photo-id').val('');
		resetForm($('#photo-form'));
		showPopup($('#photo-form'));
	},

	// saves new service
	create : function() {

	},

	edit : function(id) {

	},

	update : function() {

	},

	save : function() {
		if ($('#flickr-id').val() != '') {
			this.update();
		} else {
			this.create();
		}
	},

	remove : function(id) {

	},

	list : function() {

	},

	getFormData : function() {
		return '';
	}
}

$(function() {
	$('.photo-add').on('click', function() {
		photo.add();
	});

	$(document).on('click', '.photo-edit', function() {
		photo.edit($(this).attr('photo-id'));
	});

	$(document).on('click', '.photo-delete', function() {
		photo.remove($(this).attr('photo-id'));
	});

	$('#photo-form .btn-submit').on('click', function() {
		flickr.save();
		return false;
	});
});
