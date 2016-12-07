var bingeApp = angular.module('bingeApp', []);
    bingeApp.controller('timelineController', function($scope) {
        $scope.activities = JSON.parse(sessionStorage.getItem('activities'));
    });