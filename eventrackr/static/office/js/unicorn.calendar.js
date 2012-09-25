$(document).ready(function(){
	
	unicorn.init();
	
	$('#add-event-submit').click(function(){
		unicorn.add_event();
	});
	
	$('#event-name').keypress(function(e){
		if(e.which == 13) {	
			unicorn.add_event();
		}
	});	
});
