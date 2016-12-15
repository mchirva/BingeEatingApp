jQuery(document).ready(function($){
	var role=sessionStorage.getItem('role');
	$("input[type=text]").val('');
	if(role == 'Admin'){
		document.getElementById('viewUsers').style.visibility = "visible";
	}
	document.getElementById("appointmentTime").disabled = true;
	
	var index = sessionStorage.getItem('participantIndex');
	var users = JSON.parse(sessionStorage.getItem('users'));

    var data = {};
	    data.token = sessionStorage.getItem('token');
	    data.userId = users[index].UserId;
	    data.date = $('#appointmentDate').val();

    for(var i=0;i<12;i++){
		$("#stepList ol").append('<li class="visited"><a id="' + (i+1) + '" href="#0"></a></li>');
	}

	
	if(users[index].Messages)
		$('#messages').prop("checked", true);
	else
		$('#messages').prop("checked", false);
	if(users[index].ImageTagging)
		$('#imageTagging').prop("checked", true);
	else
		$('#imageTagging').prop("checked", false);

    $('#messages').click(function(){ 
	    console.log( $(this).is(':checked'));
	    var data = {};
	    	data.token = sessionStorage.getItem('token');
	    	data.userId = users[index].UserId;
	    	data.username = users[index].Username;
	        data.password = users[index].Password;
	        data.role = "Participant";
	        data.level = users[index].Level;
	        data.supporterId = users[index].SupporterId;
	        data.messages = $('#messages').is(':checked')?1:0;
	        data.imageTagging = users[index].imageTagging;

		$.ajax({
	        type: 'POST',
	        data: JSON.stringify(data),
	        contentType: 'application/json',
	        url: 'http://52.89.68.106:8080/editUser',
	        success: function (response) {
	        	console.log(response);
	        	if(response.data.user == 1){
	        		$('.cd-popup').addClass('is-visible');
    				document.getElementById('alert').innerHTML = "The participant details have been updated!";
	        	}
	        },
	        error:function (data) {
	        	$('.cd-popup').addClass('is-visible');
    			document.getElementById('alert').innerHTML = data.data.message;
	        }
	    });
	});

	$('#imageTagging').click(function(){ 
	    console.log( $(this).is(':checked'));
	    var data = {};
	    	data.token = sessionStorage.getItem('token');
	    	data.userId = users[index].UserId;
	    	data.username = users[index].Username;
	        data.password = users[index].Password;
	        data.role = "Participant";
	        data.level = users[index].Level;
	        data.supporterId = users[index].SupporterId;
	        data.messages = users[index].Messages; 
	        data.imageTagging = $('#imageTagging').is(':checked')?1:0;

		$.ajax({
	        type: 'POST',
	        data: JSON.stringify(data),
	        contentType: 'application/json',
	        url: 'http://52.89.68.106:8080/editUser',
	        success: function (response) {
	        	console.log(response);
	        	if(response.data.user == 1){
	        		$('.cd-popup').addClass('is-visible');
    				document.getElementById('alert').innerHTML = "The participant details have been updated!";
	        	}
	        },
	        error:function (data) {
	        	$('.cd-popup').addClass('is-visible');
    			document.getElementById('alert').innerHTML = data.data.message;
	        }
	    });
	});

	// ----------------
    // Progress
    // ----------------

	$.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://52.89.68.106:8080/getProgress',
        success: function (response) {	
        	sessionStorage.setItem('progress',response.data.progress);
        	$('.knob').val(response.data.progress).trigger('change');
        },
        error:function (data) {
        	if(data.responseText.includes('TokenExpiredError')){
				location.href = 'home.html';
			}
        }
    });

    $('.knob').each(function () {
       var $this = $(this);
       $this.val(Math.ceil(sessionStorage.getItem('progress'))).trigger('change');
       $this.knob({
       	change : function (value) {
            //console.log("change : " + value);
        },
        release : function (value) {
            //console.log(this.$.attr('value'));
            sessionStorage.setItem('progress',value);
        },
        cancel : function () {
            //console.log("cancel : ", this);
        }
       }).children().off('mousewheel DOMMouseScroll');
       // $({
       //     value: 0
       // }).animate({
       //     value: sessionStorage.getItem('progress')
       // }, {
       //     duration: 450,
       //     easing: 'swing',
       //     step: function () {
       //         $this.val(Math.ceil(this.value)).trigger('change');

       //     }
       // })
    });

    $('#updateProgress').click(function(e) {
    	var index = sessionStorage.getItem('participantIndex');
		var users = JSON.parse(sessionStorage.getItem('users'));
	
	    var data = {};
	    data.token = sessionStorage.getItem('token');
	    data.userId = users[index].UserId;
	    data.level=sessionStorage.getItem('progress');

	    $.ajax({
	        type: 'POST',
	        data: JSON.stringify(data),
	        contentType: 'application/json',
	        url: 'http://52.89.68.106:8080/setProgress',
	        success: function (response) {	
	        	$('.knob').val(data.level).trigger('change');
	        	$('.cd-popup').addClass('is-visible');
	        	document.getElementById('alert').innerHTML = "Progress updated!";
	        },
	        error:function (data) {
	        	$('.cd-popup').addClass('is-visible');
	        	document.getElementById('alert').innerHTML = data.data.message;
	        }
	    });
    });

    // ----------------
    // Daily
    // ----------------

    $( '#dailyLogDate' ).dateDropper({
	  animate: true,
	  init_animation: "fadein",
	  format: "Y-m-d",
	  lang: "en",
	  lock: false,
	  maxYear: 2020,
	  minYear: 1970,
	  yearsRange: 10,
	  dropPrimaryColor: "#01CEFF",
	  dropTextColor: "#333333",
	  dropBackgroundColor: "#FFFFFF",
	  dropBorder: "1px solid #08C",
	  dropBorderRadius: 8,
	  dropShadow: "0 0 10px 0 rgba(0, 136, 204, 0.45)",
	  dropWidth: 124,
	  dropTextWeight: 'bold'
	});

	// var date = new Date();

	// var day = date.getDate();
	// var month = date.getMonth() + 1;
	// var year = date.getFullYear();

	// if (month < 10) month = "0" + month;
	// if (day < 10) day = "0" + day;

	// var today = year + "-" +  month + "-" + day;       
	// document.getElementById("appointmentDate").value = today;

	$("#dailyLogDate").on('change', function(){
		var selectedDate = $('#dailyLogDate').val().split("-");
		var date=$('#dailyLogDate').val();

      	var data = {};
      	var index = sessionStorage.getItem('participantIndex');
		var users = JSON.parse(sessionStorage.getItem('users'));
	    data.token = sessionStorage.getItem('token');
	    data.userId = users[index].UserId;
	    data.date = date;

		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: 'http://52.89.68.106:8080/getDailyLog',
			success: function (response) {
            	var data=response.data.dailyLogs;
            	if(data.length > 0){
            		document.getElementById('submitDaily').innerHTML="";
            		document.getElementById("dailyLogTable").style.display = "table";
            		document.getElementById("printDailyDiv").style.display = "block";
            	
	            	for(var i=0;i<data.length;i++){
        				var date = data[i].Time.split('T')[0];
	        			var time = data[i].Time.split('T')[1].substring(0,8);

						$('#dailyLogTable > tbody:last-child').append('<tr><td>' + date + " " + time + '</td><td>'
							+ data[i].FoodOrDrinkConsumed + '</td><td>' + data[i].Binge + '</td><td>' + data[i].ContextOrSetting + '</td><td>' 
							+ data[i].Feelings + '</td><td>' + data[i].VomitingOrLaxative + '</td></tr>');

	            	}
            	}
            	else{
            		document.getElementById("dailyLogTable").style.display = "none";
            		document.getElementById("printDailyDiv").style.display = "none";
            		$('.cd-popup').addClass('is-visible');
	        		document.getElementById('alert').innerHTML = "No logs to display!";
            	}
			},
			error:function (data) {
				// $('.cd-popup').addClass('is-visible');
	   //      	document.getElementById('alert').innerHTML = data.data.message;
	   			console.log(data);
			}
		});
	});

	$('#printDailyLog').click(function(){ 
	    var divToPrint=document.getElementById("dailyLog");
		newWin= window.open("");
		newWin.document.write(divToPrint.outerHTML);
		newWin.print();
		newWin.close();
	});

	// ----------------
    // Weekly
    // ----------------

	$('ol.cd-multi-steps a').click(function() {
	    var week = $(this).attr('id');
	    var data = {};
		    data.token = sessionStorage.getItem('token');
		    data.userId = users[index].UserId;
		    data.week = week;
	    $.ajax({
	        type: 'POST',
	        data: JSON.stringify(data),
	        contentType: 'application/json',
	        url: 'http://52.89.68.106:8080/getWeeklyLog',
	        success: function (response) {	
	        	var data=response.data.weeklyLog;
            	if(data.length > 0){
            		document.getElementById('submitWeekly').innerHTML="";
            		document.getElementById("weeklyLogTable").style.display = "table";
            		document.getElementById("printWeeklyDiv").style.display = "block";

            		if(data[0].CreatedDateTime.includes('T')){
	            		createdDate = data[0].CreatedDateTime.split('T')[0];
	        			createdTime = data[0].CreatedDateTime.split('T')[1].substring(0,8);
        			}
        			else{
    					createdDate = data[0].CreatedDateTime;
	        			createdTime = "";
        			}
            	
            		if(data[0].UpdatedDateTime.includes('T')){
	            		updatedDate = data[0].UpdatedDateTime.split('T')[0];
	        			updatedTime = data[0].UpdatedDateTime.split('T')[1].substring(0,8);
        			}
        			else{
        				updatedDate = data[0].UpdatedDateTime;
	        			updatedTime = "";
        			}
            	
					$('#weeklyLogTable > tbody:last-child').append('<tr><td>' + data[0].Week + '</td><td>'
						+ createdDate + " " + createdTime + '</td><td>' + updatedDate + " " + updatedTime + '</td><td>' + 
						data[0].Binges + '</td><td>' + data[0].Events + '</td><td>' + data[0].FruitVegetableServings 
						+ '</td><td>' + data[0].PhysicalActivity + '</td><td>' + data[0].VLD  + '</td></tr>');

	            	
            	}
            	else{
            		$('.cd-popup').addClass('is-visible');
	        		document.getElementById('alert').innerHTML = "No logs to display";
            	}
	        },
	        error:function (data) {
	        	$('.cd-popup').addClass('is-visible');
	        	document.getElementById('alert').innerHTML = data.statusText;
	        }
	    });
	});


	$('#printWeeklyLog').click(function(){ 
	    var divToPrint=document.getElementById("weeklyLog");
		newWin= window.open("");
		newWin.document.write(divToPrint.outerHTML);
		newWin.print();
		newWin.close();
	});

	// ----------------
    // Schedule
    // ----------------

	$( '#appointmentDate' ).dateDropper({
	  animate: true,
	  init_animation: "fadein",
	  format: "Y-m-d",
	  lang: "en",
	  lock: false,
	  maxYear: 2020,
	  minYear: 1970,
	  yearsRange: 10,
	  dropPrimaryColor: "#01CEFF",
	  dropTextColor: "#333333",
	  dropBackgroundColor: "#FFFFFF",
	  dropBorder: "1px solid #08C",
	  dropBorderRadius: 8,
	  dropShadow: "0 0 10px 0 rgba(0, 136, 204, 0.45)",
	  dropWidth: 124,
	  dropTextWeight: 'bold'
	});

	$("#appointmentDate").on('change', function(){
		document.getElementById('submitAppointment').innerHTML="";
      	var data = {};
      	var index = sessionStorage.getItem('participantIndex');
		var users = JSON.parse(sessionStorage.getItem('users'));
	    data.token = sessionStorage.getItem('token');
	    data.userId = users[index].UserId;
	    data.date = $('#appointmentDate').val();

		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: 'http://52.89.68.106:8080/getOccupiedTimes',
			success: function (response) {	
				var disableTimeRanges=[];
				for(var i=0;i<response.data.appointments.length;i++){
					var time=[];
					var time24 = response.data.appointments[i].AppointmentTime.split('T')[1];
					var hour24 = time24.split(':')[0];
					var min24 = time24.split(':')[1];

					var hour12 = hour24 == 0 ? "12" : hour24 > 12 ? hour24 - 12 : hour24 < 10 ? hour24[1] : hour24;
				    var ampm = hour24 < 12 ? "am" : "pm";
				    var time12 = hour12 + ":" + min24 + ampm;
			    	var endTime = time12 == "11:30am" ? "12:00pm" : min24 == 00 ? hour12 + ":30"  + ampm : (hour12 + 1) + ":00"  + ampm;
				    time.push(time12);
				    time.push(endTime);
				    disableTimeRanges.push(time);
				}
				document.getElementById("appointmentTime").disabled = false;
				$('#appointmentTime').timepicker({ 
					'orientation' : 'br',
					'disableTextInput':true,
					'closeOnWindowScroll':true,
					'disableTimeRanges': disableTimeRanges 
				});
			},
			error:function (data) {
				$('.cd-popup').addClass('is-visible');
	        	document.getElementById('alert').innerHTML = data.data.message;
			}
		});
	});

	$('#scheduleAppointment').click(function(e) {
    	if($('#appointmentDate').val() == "" || $('#appointmentTime').val()==""){
    		document.getElementById('submitAppointment').innerHTML="Please select appointment date and time!";
    		// $('.cd-popup').addClass('is-visible');
      //   	document.getElementById('alert').innerHTML = "Please select appointment date and time!";
    	}
    	else{
    		document.getElementById('submitAppointment').innerHTML="";
	    	var date = $('#appointmentDate').val();
	    	var time = convertTo24Hour($("#appointmentTime").val());

	    	var index = sessionStorage.getItem('participantIndex');
			var users = JSON.parse(sessionStorage.getItem('users'));
		
		    var data = {};
		    data.token = sessionStorage.getItem('token');
		    data.userId = users[index].UserId;
		    data.dateTime = date + " " + time;

		    $.ajax({
		        type: 'POST',
		        data: JSON.stringify(data),
		        contentType: 'application/json',
		        url: 'http://52.89.68.106:8080/setAppointment',
		        success: function (response) {	
		        	$('.cd-popup').addClass('is-visible');
	        		document.getElementById('alert').innerHTML = "Appointment scheduled!";
		        },
		        error:function (data) {
					$('.cd-popup').addClass('is-visible');
	        		document.getElementById('alert').innerHTML = data.data.message;
		        }
		    });
        }
    });

    function convertTo24Hour(time) {
	    var hours = parseInt(time.substr(0, 2));
	    if(time.indexOf('am') != -1 && hours == 12) {
	        time = time.replace('12', '0');
	    }
	    if(time.indexOf('pm')  != -1 && hours < 12) {
	        time = time.replace(hours, (hours + 12));
	    }
	    return time.replace(/(am|pm)/, '');
	}
	
	// ----------------
    // Notes
    // ----------------

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://52.89.68.106:8080/viewNotes',
        success: function (response) {
        	if(response.data.notes.length > 0){
	        	for(var i=0;i<response.data.notes.length;i++){
	        		document.getElementById('notes').innerHTML = document.getElementById('notes').innerHTML + "<br/>" + response.data.notes[i].Notes;
	        	}
        	}
        	else{
        		document.getElementById('submitNotes').innerHTML="No notes to display!";
        	}
        },
        error:function (data) {
        	//$('.cd-popup').addClass('is-visible');
        	//document.getElementById('alert').innerHTML =data.data.message;
        }
    });

    $('#signout').click(function(e) {
		var data = {};
	    	data.token = sessionStorage.getItem('token');

		$.ajax({
	        type: 'POST',
	        data: JSON.stringify(data),
	        contentType: 'application/json',
	        url: 'http://52.89.68.106:8080/logout',
	        success: function (response) {
	        },
	        error:function (data) {
	        }
	    });

	    sessionStorage.clear();
	    location.href = 'home.html';
	});

	$('#viewUsers').click(function(e) {
	    location.href = 'users.html';
	});

    // ----------------
    // UI
    // ----------------

	var	scrolling = false;
	var contentSections = $('.cd-section'),
		verticalNavigation = $('.cd-vertical-nav'),
		navigationItems = verticalNavigation.find('a'),
		navTrigger = $('.cd-nav-trigger'),
		scrollArrow = $('.cd-scroll-down');

	$(window).on('scroll', checkScroll);

	//smooth scroll to the selected section
	verticalNavigation.on('click', 'a', function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
        verticalNavigation.removeClass('open');
    });

    //smooth scroll to the second section
    scrollArrow.on('click', function(event){
    	event.preventDefault();
        smoothScroll($(this.hash));
    });

	// open navigation if user clicks the .cd-nav-trigger - small devices only
    navTrigger.on('click', function(event){
    	event.preventDefault();
    	verticalNavigation.toggleClass('open');
    });

	function checkScroll() {
		if( !scrolling ) {
			scrolling = true;
			(!window.requestAnimationFrame) ? setTimeout(updateSections, 300) : window.requestAnimationFrame(updateSections);
		}
	}

	function updateSections() {
		var halfWindowHeight = $(window).height()/2,
			scrollTop = $(window).scrollTop();
		contentSections.each(function(){
			var section = $(this),
				sectionId = section.attr('id'),
				navigationItem = navigationItems.filter('[href^="#'+ sectionId +'"]');
			( (section.offset().top - halfWindowHeight < scrollTop ) && ( section.offset().top + section.height() - halfWindowHeight > scrollTop) )
				? navigationItem.addClass('active')
				: navigationItem.removeClass('active');
		});
		scrolling = false;
	}

	function smoothScroll(target) {
        $('body,html').animate(
        	{'scrollTop':target.offset().top},
        	300
        );
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
		$('.cd-popup').addClass('is-visible');
	});
	
	//close popup
	$('.cd-popup').on('click', function(event){
		if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup') ) {
			event.preventDefault();
			$(this).removeClass('is-visible');
		}
	});
	//close popup when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		$('.cd-popup').removeClass('is-visible');
	    }
    });
});