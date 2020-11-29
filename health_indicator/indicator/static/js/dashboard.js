var dashboardApp = angular.module('dashboard-app', ['ui.bootstrap','ionic','ngTouch', 'ionic.contrib.ui.cards'])
.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(event) {
        event.preventDefault();
      });
    }
  }
})


dashboardApp.config(function($interpolateProvider) {
   $interpolateProvider.startSymbol('{[{');
   $interpolateProvider.endSymbol('}]}');
 });

dashboardApp.controller('dashboardController', function($scope,$http,$ionicSwipeCardDelegate) {
var cardIndex = 0;
$scope.submenu = false
$scope.reportParams = {}
$scope.monthDate = new Date()
$scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'datepicker-mode':"'month'",
    'min-mode':"month"};

$scope.formats = ['MM/yyyy'];
// $scope.format = $scope.formats[0];
$scope.reportParams["from"] = '1' + '/' + ($scope.monthDate.getMonth()+1)  + '/' + $scope.monthDate.getFullYear()
if($scope.monthDate.getMonth() + 2 > 12){
	$scope.reportParams["to"] ="1" + '/' + "1" + '/' +  ($scope.monthDate.getFullYear() +1)
}
else{
  	$scope.reportParams["to"] ='1' + '/' + ($scope.monthDate.getMonth()+2)  + '/' + $scope.monthDate.getFullYear()
}
$scope.paramsChange=function(){
   
  $scope.reportParams["from"] = '1' + '/' + ($scope.monthDate.getMonth()+1)  + '/' + $scope.monthDate.getFullYear()
  if($scope.monthDate.getMonth() + 2 > 12){
    $scope.reportParams["to"] =$scope.monthDate .getDate() + '/' + "1" + '/' +  ($scope.monthDate.getFullYear() +1)
  }
  else{
    $scope.reportParams["to"] =$scope.monthDate .getDate() + '/' + ($scope.monthDate.getMonth()+2)  + '/' + $scope.monthDate.getFullYear()
  }


  
  $scope.GetGraph()
$scope.GetTable()
}


$scope.reportParams["date"] = $scope.startDate 

  $scope.SubmenuChooser = function(submenu){
    $scope.submenu = submenu
    
    if (!$scope.submenu){
      $scope.load() 
      // $scope.init()
    }
  
  }

  
$scope.GetMachinesList = function(){
	$http.get('api/home/GetMachinesList/', {

        }).success(function (jsonData) {
         
        $scope.machinesList = jsonData.machines;
        // alert(JSON.stringify(jsonData.machines))

	});


}
$scope.GetMachinesList()


$scope.GetMachines = function(){
	$http.get('api/home/GetMachines/', {
        	params: {
        
        	}
        	}).success(function (jsonData) {
         
        	$scope.machines = jsonData.machines;
        	var removedCards = [];
        	$scope.reportParams["machine"]  = $scope.machinesList[0]["machine"]
        	if ($scope.machines == null){
			 $scope.machines = $scope.machinesList
			} 
         	$scope.cards = Array.prototype.slice.call($scope.machines, 0, 0);
          
      

        
       
        $scope.GetGraph()
         
        }).error(function (data, status, headers, config) {
       });   

//

}
 $scope.GetMachines()

$scope.GetGraph = function(){

  if ("machine" in $scope.reportParams){

  $http.get('api/home/GetTrend/', {
        params: {
            "reportParams": $scope.reportParams
        }
        }).success(function (jsonData) {
          data = jsonData.gData
          var layout1 = {
          yaxis: {rangemode: 'tozero',
            showline: true,
            zeroline: true},
            margin:{l:80,b:90,r:0,t:20,pad:4},
            height:400,
            
          };
        Plotly.newPlot('div1', data, layout1);

        //Plotly.newPlot('div2', tdata, layout2);
       
         
        }).error(function (data, status, headers, config) {
       });   

// var data = [trace1, trace2];

}
}
// $scope.graph()
$scope.GetTable = function(){

  $http.get('api/home/GetTable/', {
        params: {
            "reportParams": $scope.reportParams
        }
        }).success(function (jsonData) {
          $scope.tableData = jsonData.tData;

         console.log($scope.tableData)
        }).error(function (data, status, headers, config) {
       });   


}
// $scope.GetTable();




$scope.submenuChooser = function(val){

  
  $scope.submenu = val
}  





});




dashboardApp.controller('videoController', function ($scope, $log, $http ,$filter){
    
  $scope.GetFrame = function(){

    $http.get('api/home/GetFrame/', {
     params: {
      }
    }).success(function (jsonData) {
      // console.log(JSON.stringify(jsonData))
      // $scope.res = jsonData.im
      // $scope.records = jsonData.table
      $scope.GetFrame()
      }).error(function (data, status, headers, config) {
           $scope.GetFrame()
    });
  }


  // alert("shift contriller")
   
});
