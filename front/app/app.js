var app = angular.module("social-news", ['ngTagsInput', 'ui.bootstrap']);

app.controller("SearchCtrl", function ($scope, $http) {
    $scope.tags = [];
    $scope.loadTags = function(query) {
        return $http.get('cities.json');
    };
    $scope.added = function(){
        $scope.posts = [
            {
                user: {
                    name: "Morrisey Video",
                    url: "https://twitter.com/SethMorrisey",
                    photo: "https://pbs.twimg.com/profile_images/534943592217726977/a90MLfyk_400x400.jpeg"
                },
                content: "Post Content",
                date: "12:52 PM - 22 Jun 2015",
                url: "https://twitter.com/SethMorrisey/status/613072157757706240"
            },
            {
                user: {
                    name: "Morrisey Video",
                    url: "https://twitter.com/SethMorrisey",
                    photo: "https://pbs.twimg.com/profile_images/534943592217726977/a90MLfyk_400x400.jpeg"
                },
                content: "Post Content",
                date: "12:52 PM - 22 Jun 2015",
                url: "https://twitter.com/SethMorrisey/status/613072157757706240"
            }
        ];
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