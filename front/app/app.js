var app = angular.module("social-news", ['ngTagsInput', 'ui.bootstrap']);

app.controller("SearchCtrl", function ($scope, $http) {
    $scope.tags = [];
    $scope.loadTags = function(query) {
        return $http.get('cities.json');
    };
    $scope.added = function(){
        console.log($scope.tags);
    };

    $scope.maxDate = new Date();
    $scope.search_date = {
        from: {
            opened: false,
            date: new Date()
        },
        to: {
            opened: false,
            date: new Date()
        }
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.search_date.from.opened = true;
        $scope.search_date.to.opened = true;
    };
});

$(function () {
    $(window).resize(function () {
        $('.container').css("marginTop", ($(window).height() - $('.container').height())/2 + "px");
    }).resize();
});