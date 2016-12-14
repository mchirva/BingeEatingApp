jQuery(document).ready(function($){
	var role=sessionStorage.getItem('role');
	if(role == 'Admin'){
		document.getElementById('viewUsers').style.visibility = "visible";
	}

	if (typeof history.pushState === "function") { 
        history.pushState("back", null, null);          
        window.onpopstate = function () { 
            history.pushState('back', null, null);  

            var data = {};
	    	data.token = sessionStorage.getItem('token');

			$.ajax({
		        type: 'POST',
		        data: JSON.stringify(data),
		        contentType: 'application/json',
		        url: 'http://localhost:8080/logout',
		        success: function (response) {
		        },
		        error:function (data) {
		        }
		    });

		    sessionStorage.clear();
		    location.href = 'home.html';
         } 
     }

 	$('#signout').click(function(e) {
		console.log("logout");
		var data = {};
	    	data.token = sessionStorage.getItem('token');

		$.ajax({
	        type: 'POST',
	        data: JSON.stringify(data),
	        contentType: 'application/json',
	        url: 'http://localhost:8080/logout',
	        success: function (response) {
	        },
	        error:function (data) {
	        }
	    });

	    sessionStorage.clear();
	    location.href = 'home.html';
	});

	$('#viewUsers').click(function(e) {
		// var data = {};
	 //    	data.token = sessionStorage.getItem('token');

		// $.ajax({
	 //        type: 'POST',
	 //        data: JSON.stringify(data),
	 //        contentType: 'application/json',
	 //        url: 'http://localhost:8080/logout',
	 //        success: function (response) {
	 //        },
	 //        error:function (data) {
	 //        }
	 //    });

	 //    sessionStorage.clear();
	    location.href = 'users.html';
	});

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

	// browser window scroll (in pixels) after which the "back to top" link is shown
	var offset = 300,
		//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
		offset_opacity = 1200,
		//duration of the top scrolling animation (in ms)
		scroll_top_duration = 700,
		//grab the "back to top" link
		$back_to_top = $('.cd-top');

	//hide or show the "back to top" link
	$(window).scroll(function(){
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
		if( $(this).scrollTop() > offset_opacity ) { 
			$back_to_top.addClass('cd-fade-out');
		}
	});

	//smooth scroll to top
	$back_to_top.on('click', function(event){
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0 ,
		 	}, scroll_top_duration
		);
	});

});