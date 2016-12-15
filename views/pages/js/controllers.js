var bingeApp = angular.module('bingeApp', []);
	bingeApp.filter('format', function() {
        return function(input) {
        	if(input.includes('T')){
        		var date = input.split('T')[0];
	        	var time = input.split('T')[1].substring(0,8);

	            return date + " " + time;
        	}
        	else
        		return input
        }
    });
    bingeApp.controller('timelineController', function($scope) {

        $scope.users = JSON.parse(sessionStorage.getItem('users'));
   
        if($scope.users.length > 0){
	        $scope.userIndex = 0;
		    $scope.setUserIndex = function(index) {
		        $scope.userIndex = index;
		        sessionStorage.setItem('participantIndex',index);
		        location.href='details.html';
		    }
		}
		else{
			document.getElementById('submitTimeline').innerHTML="No participant data to display!";
		}
    });

    bingeApp.controller('usersController', function($scope) {
        $scope.participants = JSON.parse(sessionStorage.getItem('participants'));
        $scope.supporters = JSON.parse(sessionStorage.getItem('supporters'));

        if($scope.supporters.length == 0){
        	document.getElementById('supporterTable').style.display = "none";
        }

        if($scope.participants.length == 0){
        	document.getElementById('participantTable').style.display = "none";
        }

        if($scope.supporters.length > 0){
        	document.getElementById('supporterTable').style.display = "block";

		    $scope.editSupporter = function(index) {
			    var table = document.getElementById('supporterTable');
	            var data = {};
			    	data.token = sessionStorage.getItem('token');
			    	data.userId = table.rows[index+1].cells[0].innerHTML;
			    	data.username = table.rows[index+1].cells[1].innerHTML;
			        //data.password = table.rows[index+1].cells[2].innerHTML;
			        //data.role = "Supporter";
			        data.level = 0;
			        data.supporterId = table.rows[index+1].cells[3].innerHTML;
			        data.messages = 0;
			        data.imageTagging = 0;

				$.ajax({
			        type: 'POST',
			        data: JSON.stringify(data),
			        contentType: 'application/json',
			        url: 'http://localhost:8080/editUser',
			        success: function (response) {
			        	console.log(response);
			        	if(response.data.user == 1){
			        		$('.cd-popup').addClass('is-visible');
	        				document.getElementById('alert').innerHTML = "The supporter details have been updated!";

	        				$('.editabletable').click(function () {
							    $.ajax({
							        url: $(this).data("url"),
							        type: 'GET',
							        cache: false,
							        success: function (result) {
							            table.html(result);
							        }
							    });
							    return false;
							});
			        	}
			        },
			        error:function (data) {
			        	$('.cd-popup').addClass('is-visible');
	        			document.getElementById('alert').innerHTML = data.statusText;
			        }
			    });
			}

			$scope.delSupporter = function(index) {
				if($scope.supporters.length == 1){
					$('.cd-popup').addClass('is-visible');
        			document.getElementById('alert').innerHTML = "The supporter can't be deleted!";
				}
				else{
				    var table = document.getElementById('supporterTable');
				    var newSupp = table.rows[index+1].insertCell(7);
					newSupp.innerHTML = "<select id="+ (index+1) +"><option>Select a new supporter</option></select>";

		            var data = {};
				    	data.token = sessionStorage.getItem('token');
				    	data.oldSupporterEmail = table.rows[index+1].cells[1].innerHTML;

			    	for(var i=0;i<$scope.supporters.length;i++){
			    		if($scope.supporters[i].SupporterId != data.oldSupporterEmail){
			    			var newSupp = document.getElementById(index+1);
							var option = document.createElement("option");
							option.text = $scope.supporters[i].SupporterId;
							newSupp.add(option);
			    		}
			    	}
			    	
			    	$('#' + (index+1)).on('change', function(){
			    		data.newSupporterEmail = $('#' + (index+1)).val();
			    		console.log(data);
						$.ajax({
					        type: 'POST',
					        data: JSON.stringify(data),
					        contentType: 'application/json',
					        url: 'http://localhost:8080/replaceAndDeleteSupporter',
					        success: function (response) {
					        	console.log(response);
					        	if(response.data.deleted == 1){
					        		document.getElementById(index+1).style.display = "none"
					        		$('.cd-popup').addClass('is-visible');
			        				document.getElementById('alert').innerHTML = "Supporter deleted!";
					        	}
					        },
					        error:function (data) {
					        	$('.cd-popup').addClass('is-visible');
			        			document.getElementById('alert').innerHTML = data.data.message;
					        }
					    });
					});
				}
					
			}
		}
		if($scope.participants.length > 0){
			document.getElementById('participantTable').style.display = "block";

		    $scope.editParticipant = function(index) {
		    	console.log(index);
		        var table = document.getElementById('participantTable');
	            var data = {};
			    	data.token = sessionStorage.getItem('token');
			    	data.userId = table.rows[index+1].cells[0].innerHTML;
			    	data.username = table.rows[index+1].cells[1].innerHTML;
			        //data.password = table.rows[index+1].cells[2].innerHTML;
			        //data.role = "Participant";
			        data.level = table.rows[index+1].cells[4].innerHTML;
			        data.supporterId = table.rows[index+1].cells[3].innerHTML;
			        data.messages = table.rows[index+1].cells[6].innerHTML;
			        data.imageTagging = table.rows[index+1].cells[7].innerHTML;

				$.ajax({
			        type: 'POST',
			        data: JSON.stringify(data),
			        contentType: 'application/json',
			        url: 'http://localhost:8080/editUser',
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
		    }

		    $scope.delParticipant = function(index) {
			    var table = document.getElementById('participantTable');
	            var data = {};
			    	data.token = sessionStorage.getItem('token');
			    	data.userId = table.rows[index+1].cells[0].innerHTML;

				$.ajax({
			        type: 'POST',
			        data: JSON.stringify(data),
			        contentType: 'application/json',
			        url: 'http://localhost:8080/deleteUser',
			        success: function (response) {
			        	if(response.data.deleted == 1){
			        		$('.cd-popup').addClass('is-visible');
	        				document.getElementById('alert').innerHTML = "Participant deleted!";
			        	}
			        },
			        error:function (data) {
			        	$('.cd-popup').addClass('is-visible');
	        			document.getElementById('alert').innerHTML = data.data.message;
			        }
			    });
			}

			$scope.generateQRCode = function(index) {
			    var table = document.getElementById('participantTable');
	            var data = {};
			    	data.token = sessionStorage.getItem('token');
			    	data.userId = table.rows[index+1].cells[0].innerHTML;
			    	data.HashedPassword = table.rows[index+1].cells[2].innerHTML;
			    	data.Salt = table.rows[index+1].cells[8].innerHTML;
				$.ajax({
			        type: 'POST',
			        data: JSON.stringify(data),
			        contentType: 'application/json',
			        url: 'http://localhost:8080/getToken',
			        success: function (response) {
			        	doqr(response.data.token);
			        },
			        error:function (data) {
			        	$('.cd-popup').addClass('is-visible');
	        			document.getElementById('alert').innerHTML = data.responseText;
			        }
			    });
			}
		}
    });
