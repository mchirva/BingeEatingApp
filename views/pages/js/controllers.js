var bingeApp = angular.module('bingeApp', []);
    bingeApp.controller('timelineController', function($scope) {
        $scope.activities = JSON.parse(sessionStorage.getItem('activities'));
        if($scope.activities.length > 0){
	        $scope.activityIndex = 0;
		    $scope.setActivityIndex = function(index) {
		        $scope.activityIndex = index;
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

        if($scope.supporters.length > 0){
		    $scope.editSupporter = function(index) {
			    var table = document.getElementById('supporterTable');
	            var data = {};
			    	data.token = sessionStorage.getItem('token');
			    	data.userId = table.rows[index+1].cells[0].innerHTML;
			    	data.username = table.rows[index+1].cells[1].innerHTML;
			        data.password = table.rows[index+1].cells[2].innerHTML;
			        data.role = "Supporter";
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
			        	}
			        },
			        error:function (data) {
			        	$('.cd-popup').addClass('is-visible');
			        	console.log(data);
	        			document.getElementById('alert').innerHTML = data.data.message;
			        }
			    });
			}

			$scope.delSupporter = function(index) {
			    var table = document.getElementById('supporterTable');
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
	        				document.getElementById('alert').innerHTML = "Supporter deleted!";
			        	}
			        },
			        error:function (data) {
			        	$('.cd-popup').addClass('is-visible');
	        			document.getElementById('alert').innerHTML = data.data.message;
			        }
			    });
			}
		}
		if($scope.participants.length > 0){
		    $scope.editParticipant = function(index) {
		        var table = document.getElementById('participantTable');
	            var data = {};
			    	data.token = sessionStorage.getItem('token');
			    	data.userId = table.rows[index+1].cells[0].innerHTML;
			    	data.username = table.rows[index+1].cells[1].innerHTML;
			        data.password = table.rows[index+1].cells[2].innerHTML;
			        data.role = "Participant";
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

				$.ajax({
			        type: 'POST',
			        data: JSON.stringify(data),
			        contentType: 'application/json',
			        url: 'http://localhost:8080/getToken',
			        success: function (response) {
			        	console.log(response);
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
