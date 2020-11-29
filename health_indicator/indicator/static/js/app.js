var app = angular.module('app', ['ui.bootstrap']);

app.controller('TabCtrl', function($scope) {
  
$scope.tabs = [{active: true}, {active: false}, {active: false}];
$scope.go_tab1 = function() {
    $scope.tabs[1].active = true;
};
$scope.go_tab2 = function() {
    $scope.tabs[2].active = true;
};

});
