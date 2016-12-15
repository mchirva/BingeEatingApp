jQuery(document).ready(function($){
	$("input[type=text]").val('');

	$("#signin-username").on('change', function(){
		document.getElementById('submitError').innerHTML ="";
	});

	$("#signin-password").on('change', function(){
		document.getElementById('submitError').innerHTML ="";
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
		//passwordField.putCursorAtEnd();
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
		if($('#signin-username').val() == ""){
			document.getElementById('submitError').innerHTML="Username can't be empty!";
		}

		else if($('#signin-password').val() == ""){
			document.getElementById('submitError').innerHTML="Password can't be empty!";
		}
		
		else{
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
	            	sessionStorage.setItem('token',data.token);
	            	sessionStorage.setItem('role',data.data.role);
	            	if(data.token){
	            		var users=[];
		            	var length=data.data.users.length;
		            	for(var i=0;i<length;i++){
		            		users.push(data.data.users[i]);
		            	}
		            	sessionStorage.setItem('users',JSON.stringify(users));
		            	window.location.href = '/pages/timeline.html';
	            	}
	            	else{
	            		document.getElementById('submitError').innerHTML=data.data.message;
	            	}
	            },
	            error:function (data) {
	            	document.getElementById('submitError').innerHTML=data.statusText;
	            }
	        });
        }
    });

});
