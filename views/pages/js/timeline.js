jQuery(document).ready(function($){
	
	$("#date").datepicker({
  	});

	var formModal = $('.cd-user-modal'),
		formProgress = formModal.find('#progress'),
		formAppointment = formModal.find('#appointment'),
		formModalTab = $('.cd-switcher'),
		tabProgress = formModalTab.children('li').eq(0).children('a'),
		tabAppointment = formModalTab.children('li').eq(1).children('a'),
		participantNav = $('.participant-nav');

	var progress1 = radialIndicator('#progress1', {
	    barColor : '#336699',
	    barWidth : 30,
	    minValue: 0,
	    maxValue: 8,
	    radius: 50
	}); 
	 
	//Default value
	progress1.value(2);

	console.log(tabProgress==tabAppointment);

	//open modal
	participantNav.on('click', function(event){
		$(event.target).is(participantNav) && participantNav.children('ul').toggleClass('is-visible');
	});

	
	//open login-form form
	participantNav.on('click', '.cd-progress', viewProgress);
	participantNav.on('click', '.cd-appointment', scheduleAppointment);

	//close modal
	formModal.on('click', function(event){
		if( $(event.target).is(formModal) || $(event.target).is('.cd-close-form') ) {
			formModal.removeClass('is-visible');
		}	
	});
	//close modal when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		formModal.removeClass('is-visible');
	    }
    });

    //switch from a tab to another
	formModalTab.on('click', function(event) {
		event.preventDefault();
		console.log($(event.target).is( tabProgress ) );
		( $(event.target).is( tabProgress ) ) ? viewProgress() : scheduleAppointment();
	});

	function viewProgress(){
		console.log("progress");
		participantNav.children('ul').removeClass('is-visible');
		formModal.addClass('is-visible');
		formProgress.addClass('is-selected');
		formAppointment.removeClass('is-selected');
		tabProgress.addClass('selected');
		tabAppointment.removeClass('selected');
	}

	function scheduleAppointment(){
		console.log("appointment");
		participantNav.children('ul').removeClass('is-visible');
		formModal.addClass('is-visible');
		formAppointment.addClass('is-selected');
		formProgress.removeClass('is-selected');
		tabAppointment.addClass('selected');
		tabProgress.removeClass('selected');
	}

	//REMOVE THIS - it's just to show error messages 
	formProgress.find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
		//formProgress.find('input[type="text"]').toggleClass('has-error').next('span').toggleClass('is-visible');
		progress1.value(document.getElementById('step').value);
	});

	formAppointment.find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
	});

	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
		  	}
		}).blur(function() {
		 	var input = $(this);
		  	if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.val(input.attr('placeholder'));
		  	}
		}).blur();
		$('[placeholder]').parents('form').submit(function() {
		  	$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
			 		input.val('');
				}
		  	})
		});
	}

	// timeline
	var timelineBlocks = $('.cd-timeline-block'),
		offset = 0.8;

	//hide timeline blocks which are outside the viewport
	hideBlocks(timelineBlocks, offset);

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		(!window.requestAnimationFrame) 
			? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
			: window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
	});

	function hideBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
		});
	}

	function showBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) && $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
		});
	}

	// navigation
	if( $('.cd-stretchy-nav').length > 0 ) {
		var stretchyNavs = $('.cd-stretchy-nav');
		
		stretchyNavs.each(function(){
			var stretchyNav = $(this),
				stretchyNavTrigger = stretchyNav.find('.cd-nav-trigger');
			
			stretchyNavTrigger.on('click', function(event){
				event.preventDefault();
				stretchyNav.toggleClass('nav-is-visible');
			});
		});

		$(document).on('click', function(event){
			( !$(event.target).is('.cd-nav-trigger') && !$(event.target).is('.cd-nav-trigger span') ) && stretchyNavs.removeClass('nav-is-visible');
		});
	}

	
	
});