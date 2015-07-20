var app = angular.module("social-news", ['ngTagsInput', 'ui.bootstrap']);

app.directive("loadingGif", function () {
    return {
        restrict: "AEC",
        scope: {
            loading_show: "=show"
        },
        link: function(scope, attrs, value){
            scope.$watch('loading_show', function () {
                if(scope.loading_show)
                {
                    $('.overlay').height($(window).height());
                    $('.overlay').width($(window).width());

                    $('.loading_img').css({
                        left: ($(window).width() - $('.loading_img').width())/2,
                        top: ($(window).height() - $('.loading_img').height())/2,
                    });
                }
                else
                {

                }
            });
        },
        template: '<div class="overlay" ng-show="loading_show"></div><img class="loading_img" src="img/loading.gif" ng-show="loading_show" />'
    }
});

app.controller("SearchCtrl", function ($scope, $http) {
    $scope.tags = [];
    $scope.loading = false;
    $scope.loadTags = function(query) {
        return $http.get('cities.json');
    };
    $scope.added = function(){
        $scope.loading = true;
        setTimeout(function () {
            $http.get('posts.json')
                .success(function (data, status, error) {
                    $scope.posts = data;
                    $scope.loading = false;
                })
                .error(function () {
                    $scope.loading = false;
                });
        }, 3000);
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

    $scope.posts = [];

    $scope.$watch("posts", function () {
        if($scope.posts.length > 0)
        {
            $('.search_box_wrapper').animate({
                "marginTop": "15px"
            }, 500);
        }
    });
});

$(function () {
    var page_container =  $('.search_box_wrapper');
    $(window).resize(function () {
        page_container.css("marginTop", ($(window).height() - page_container.height())/2 + "px");
    }).resize();
});