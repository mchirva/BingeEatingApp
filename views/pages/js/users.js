jQuery(document).ready(function($){
	document.getElementById('monthly-1').checked = true;
	$("input[type=text]").val('');
	$("input[type=password]").val('');
	$('select').val('');
	$('select').on('change', function() {
	  if(this.value == 'Participant'){
	  	document.getElementById('supporterId').style.display = "block";
	  	document.getElementById('options').style.display = "block";
	  }
	  else{
	  	document.getElementById('supporterId').style.display = "none";
	  	document.getElementById('options').style.display = "none";
	  }
	})
	var data = {};
    	data.token = sessionStorage.getItem('token');

	$.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:8080/getUsers',
        success: function (response) {
        	var participants=[];
        	var supporters=[];
        	var length=response.data.users.length;
        	for(var i=0;i<length;i++){
        		if(response.data.users[i].Role == "Supporter"){
        			supporters.push(response.data.users[i]);
        		}
        		if(response.data.users[i].Role == "Participant"){
        			participants.push(response.data.users[i]);
        		}
        		
        	}
        	sessionStorage.setItem('supporters',JSON.stringify(supporters));
        	sessionStorage.setItem('participants',JSON.stringify(participants));
        },
        error:function (data) {
        	if(data.responseText.includes('TokenExpiredError')){
				location.href = 'home.html';
			}
        }
    });

	$('#viewParticipants').click(function(e) {
		location.href="timeline.html";
	});

	$('#signout').click(function(e) {
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

	$('td[contenteditable=true]').blur(function () {
	    $(this).parent('tr').find('button').removeAttr('disabled');
	 });

	//hide the subtle gradient layer (.cd-pricing-list > li::after) when pricing table has been scrolled to the end (mobile version only)
	checkScrolling($('.cd-pricing-body'));
	$(window).on('resize', function(){
		window.requestAnimationFrame(function(){checkScrolling($('.cd-pricing-body'))});
	});
	$('.cd-pricing-body').on('scroll', function(){ 
		var selected = $(this);
		window.requestAnimationFrame(function(){checkScrolling(selected)});
	});

	function checkScrolling(tables){
		tables.each(function(){
			var table= $(this),
				totalTableWidth = parseInt(table.children('.cd-pricing-features').width()),
		 		tableViewport = parseInt(table.width());
			if( table.scrollLeft() >= totalTableWidth - tableViewport -1 ) {
				table.parent('li').addClass('is-ended');
			} else {
				table.parent('li').removeClass('is-ended');
			}
		});
	}

	//switch from monthly to annual pricing tables
	bouncy_filter($('.cd-pricing-container'));

	function bouncy_filter(container) {
		container.each(function(){
			var pricing_table = $(this);
			var filter_list_container = pricing_table.children('.cd-pricing-switcher'),
				filter_radios = filter_list_container.find('input[type="radio"]'),
				pricing_table_wrapper = pricing_table.find('.cd-pricing-wrapper');

			//store pricing table items
			var table_elements = {};
			filter_radios.each(function(){
				var filter_type = $(this).val();
				table_elements[filter_type] = pricing_table_wrapper.find('li[data-type="'+filter_type+'"]');
			});

			//detect input change event
			filter_radios.on('change', function(event){
				event.preventDefault();
				//detect which radio input item was checked
				var selected_filter = $(event.target).val();

				//give higher z-index to the pricing table items selected by the radio input
				show_selected_items(table_elements[selected_filter]);

				//rotate each cd-pricing-wrapper 
				//at the end of the animation hide the not-selected pricing tables and rotate back the .cd-pricing-wrapper
				
				if( !Modernizr.cssanimations ) {
					hide_not_selected_items(table_elements, selected_filter);
					pricing_table_wrapper.removeClass('is-switched');
				} else {
					pricing_table_wrapper.addClass('is-switched').eq(0).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {		
						hide_not_selected_items(table_elements, selected_filter);
						pricing_table_wrapper.removeClass('is-switched');
						//change rotation direction if .cd-pricing-list has the .cd-bounce-invert class
						if(pricing_table.find('.cd-pricing-list').hasClass('cd-bounce-invert')) pricing_table_wrapper.toggleClass('reverse-animation');
					});
				}
			});
		});
	}
	function show_selected_items(selected_elements) {
		selected_elements.addClass('is-selected');
	}

	function hide_not_selected_items(table_containers, filter) {
		$.each(table_containers, function(key, value){
	  		if ( key != filter ) {	
				$(this).removeClass('is-visible is-selected').addClass('is-hidden');

			} else {
				$(this).addClass('is-visible').removeClass('is-hidden is-selected');
			}
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

	// Popup
	//open popup
	$('.cd-popup-trigger').on('click', function(event){
		event.preventDefault();
		//document.getElementById("userDiv").style.display = "none";
		$('.cd-popup').addClass('is-visible');
	});
	
	//close popup
	$('.cd-popup').on('click', function(event){
		if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup') ) {
			event.preventDefault();
			$(this).removeClass('is-visible');
			//document.getElementById("userDiv").style.display = "block";
		}
	});
	//close popup when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		$('.cd-popup').removeClass('is-visible');
    		//document.getElementById("userDiv").style.display = "block";
	    }
    });


    var formModal = $('.cd-user-modal'),
		formLogin = formModal.find('#cd-login'),
		formModalTab = $('.cd-switcher'),
		tabLogin = formModalTab.children('li').eq(0).children('a'),
		mainNav = $('.main-nav');

	//open modal
	mainNav.on('click', function(event){
		document.getElementById("userDiv").style.display = "none";
		$(event.target).is(mainNav) && mainNav.children('ul').toggleClass('is-visible');
	});

	
	//open login-form form
	mainNav.on('click', '#createUser', create_user);

	//close modal
	formModal.on('click', function(event){
		if( $(event.target).is(formModal) || $(event.target).is('.cd-close-form') ) {
			formModal.removeClass('is-visible');
			document.getElementById("userDiv").style.display = "block";
		}	
	});
	//close modal when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		formModal.removeClass('is-visible');
    		document.getElementById("userDiv").style.display = "block";
	    }
    });

    //hide or show password
	$('.hide-password').on('click', function(){
		var togglePass= $(this),
			passwordField = togglePass.prev('input');
		
		( 'password' == passwordField.attr('type') ) ? passwordField.attr('type', 'text') : passwordField.attr('type', 'password');
		( 'Hide' == togglePass.text() ) ? togglePass.text('Show') : togglePass.text('Hide');
		//focus and move cursor to the end of input field
		//passwordField.putCursorAtEnd();
	});

	function create_user(){
		mainNav.children('ul').removeClass('is-visible');
		formModal.addClass('is-visible');
		formLogin.addClass('is-selected');
		tabLogin.addClass('selected');
		document.getElementById('submitError').innerHTML="";
	}

	formLogin.find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
		if($('#create-username').val() == "" || $('#create-password').val() == "" || $('#create-role').val() == ""){
			document.getElementById('submitError').innerHTML="Invalid data!";
		}
		else{
			var data = {};
		    	data.token = sessionStorage.getItem('token');
		    	data.username = $('#create-username').val();
		        data.password = $('#create-password').val();
		        data.role = $('#create-role').val();
		        data.supporterId = $('#create-supporter').val();
		        data.messages = $('#messages').is(':checked')?1:0;
		        data.images = $('#images').is(':checked')?1:0;
		        console.log(data);
			$.ajax({
		        type: 'POST',
		        data: JSON.stringify(data),
		        contentType: 'application/json',
		        url: 'http://localhost:8080/createUser',
		        success: function (response) {
		        	console.log(response)
		        	if(response.data.message){
		        		document.getElementById('submitError').innerHTML="Invalid data!";
		        	}
		        	else{
			        	$("input[type=text]").val('');
			        	$("input[type=password]").val('');
						$('select').val('');
						document.getElementById('messages').checked=false;
						document.getElementById('images').checked=false;
						document.getElementById('submitError').innerHTML="User created!";
		        	}
		        },
		        error:function (data) {
		        }
		    });
		}
    });
});