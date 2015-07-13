var app = angular.module("social-news", ['ngTagsInput']);

app.controller("SearchCtrl", function ($scope, $http) {
    $scope.tags = [];
    $scope.loadTags = function(query) {
        return $http.get('cities.json');
    };
    $scope.added = function(){
        console.log($scope.tags);
    };
});