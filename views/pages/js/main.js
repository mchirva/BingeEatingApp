jQuery(document).ready(function($){
	$(function(){
	    $('#submit').click(function(e) {
	        e.preventDefault();
	        var data = {};
	        data.username = $('#signin-username').val();
	        data.password = $('#signin-password').val();

	        $.ajax({
	            type: 'POST',
	            data: JSON.stringify(data),
	            contentType: 'application/json',
	            url: 'http://localhost:8080/login',
	            success: function (data) {
	            	console.log(data);
	            	if(data.token != 'undefined' || data.token != ''){
	            		var activities=[];
		            	var length=data.data.activities.length;
		            	for(var i=0;i<length;i++){
		            		activities.push(data.data.activities[i]);
		            	}
		            	sessionStorage.setItem('token',data.token);
		            	sessionStorage.setItem('activities',JSON.stringify(activities));
		            	window.location.href = './timeline.html';
	            	}
	            },
	            error:function (data) {
	            	console.log(data.data.message);
	            }
	        });
	    });
	});
	
	var formModal = $('.cd-user-modal'),
		formLogin = formModal.find('#cd-login'),
		formForgotPassword = formModal.find('#cd-reset-password'),
		formModalTab = $('.cd-switcher'),
		tabLogin = formModalTab.children('li').eq(0).children('a')
		forgotPasswordLink = formLogin.find('.cd-form-bottom-message a'),
		backToLoginLink = formForgotPassword.find('.cd-form-bottom-message a'),
		mainNav = $('.main-nav');

	//open modal
	mainNav.on('click', function(event){
		$(event.target).is(mainNav) && mainNav.children('ul').toggleClass('is-visible');
	});

	
	//open login-form form
	mainNav.on('click', '.cd-signin', login_selected);

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

	//hide or show password
	$('.hide-password').on('click', function(){
		var togglePass= $(this),
			passwordField = togglePass.prev('input');
		
		( 'password' == passwordField.attr('type') ) ? passwordField.attr('type', 'text') : passwordField.attr('type', 'password');
		( 'Hide' == togglePass.text() ) ? togglePass.text('Show') : togglePass.text('Hide');
		//focus and move cursor to the end of input field
		passwordField.putCursorAtEnd();
	});

	//show forgot-password form 
	forgotPasswordLink.on('click', function(event){
		event.preventDefault();
		forgot_password_selected();
	});

	//back to login from the forgot-password form
	backToLoginLink.on('click', function(event){
		event.preventDefault();
		login_selected();
	});

	function login_selected(){
		mainNav.children('ul').removeClass('is-visible');
		formModal.addClass('is-visible');
		formLogin.addClass('is-selected');
		formForgotPassword.removeClass('is-selected');
		tabLogin.addClass('selected');
	}


	function forgot_password_selected(){
		formLogin.removeClass('is-selected');
		formForgotPassword.addClass('is-selected');
	}

	//REMOVE THIS - it's just to show error messages 
	formLogin.find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
		formLogin.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
	});
});


