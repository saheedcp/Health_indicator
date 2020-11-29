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
// ###############
// $scope.Monthly = true
$scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'datepicker-mode':"'month'",
    'min-mode':"month"   };
// ##################
// alert(JSON.stringify($scope.dateOptions))
// alert($scope.reportParams.date)
$scope.startDate = new Date()
$scope.new1 = new Date()


$scope.reportParams["date"] = $scope.startDate 
// alert(JSON.stringify(new Date()))

// alert(JSON.stringify($scope.reportParams))
  $scope.SubmenuChooser = function(submenu){
    // alert(JSON.stringify($scope.submenu))
    $scope.submenu = submenu
    
    if (!$scope.submenu){
      $scope.load() 
      // $scope.init()
    }
  
  }

  $scope.paramsChange=function(){
  // alert($scope.new1.getMonth()+1)
  // alert($scope.new1.getFullYear())
  alert(JSON.stringify(typeof($scope.new1)))
  $scope.reportParams["month"]=$scope.new1.getMonth()+1
  $scope.reportParams["year"]=$scope.new1.getFullYear()
  // alert(JSON.stringify($scope.reportParams))
  
  $scope.GetGraph()

}
// ##########################
$scope.GetMachinesList = function(){
alert("sdfsdf")
// alert(JSON.stringify($scope.reportParams))
$http.get('api/home/GetMachinesList/', {

        }).success(function (jsonData) {
         
        $scope.machinesList = jsonData.machines;
        alert(JSON.stringify(jsonData.machines))

});

// ###################################

}
$scope.GetMachinesList()


$scope.GetMachines = function(){
// alert("sdfsdf")
// alert(JSON.stringify($scope.reportParams))
$http.get('api/home/GetMachines/', {
        params: {
        
        }
        }).success(function (jsonData) {
         
        $scope.machines = jsonData.machines;
        // alert(JSON.stringify($scope.machines ))
        var removedCards = [];
        $scope.reportParams["machine"]  = $scope.machines[0]["machine"]
         
         $scope.cards = Array.prototype.slice.call($scope.machines, 0, 0);
          $scope.cardSwiped = function(index) {
          $scope.addCard();
        };
        $scope.cardDestroyed = function(index) {
          removedCards.push($scope.cards[index]);
          $scope.cards.splice(index, 1);
        };
      

        $scope.undoSwipe = function() {
          if(removedCards==""){
            alert("No more cards to swipe")
          }
          else{
          $scope.cards.splice(0, 1);
          $scope.cards.push(angular.extend({}, removedCards[removedCards.length-1]));
          // console.log(removedCards);
          removedCards.splice(removedCards.length-1, 1);
          // console.log(removedCards);
          }
        };
        $scope.addCard = function() {
          var newCard = $scope.machines[cardIndex];
          // var newCard = $scope.machines[Math.floor(Math.random() * $scope.machines.length)];

          newCard.id = Math.random();
          $scope.cards.push(angular.extend({}, newCard));
          console.log($scope.newCard);
          cardIndex++;
        }   
        $scope.GetGraph()
         
        }).error(function (data, status, headers, config) {
       });   

//

}
 $scope.GetMachines()

$scope.GetGraph = function(){
// alert(JSON.stringify(reportParams))
// alert($scope.reportParams)i
// alert(JSON.stringify($scope.reportParams))

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
            zeroline: true}
            
          };
        // alert(JSON.stringify($scope.reportParams))  
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
        
        }
        }).success(function (jsonData) {
          $scope.tableData = jsonData.tData;

          
         console.log($scope.tableData)
        }).error(function (data, status, headers, config) {
       });   


}
 $scope.GetTable();


$scope.goAway = function() {
    var card = $ionicSwipeCardDelegate.getSwipeableCard($scope);
    card.swipe();
  };

$scope.submenuChooser = function(val){
  // if (val == 'healthInput'){
  // }
  
  $scope.submenu = val
}  


// $scope.test = function(card,value){
// // alert(card,value)
// }
$scope.SubmitforMobile = function(card,value){
  
 alert("ssssssssssssssssssssssssssssssssss")
  // if ($scope.actual=='') {
  //   alert("plaaaaaaaaa")
  // };




    $scope.cardDestroyed()
    $scope.addCard()
  console.log($scope.cardDestroyed);  
  for (i=0;i < $scope.machines.length ; i++){
  if ($scope.machines[i].machine == card.machine ){
    var index = $scope.machines.indexOf( $scope.machines[i]);
    $scope.machines[index]["normal"] = value
  }
    if ('normal' in $scope.machines[i] ){
      // alert(JSON.stringify($scope.machines))

      $scope.machineUpdate = $scope.machines[i]
      var tmpDict = {}
      tmpDict["machine"] = $scope.machines[index]["machine"]
      tmpDict["target"] = $scope.machines[index]["actual"]
      tmpDict["actual"] = $scope.machines[index]["normal"]
      // alert(JSON.stringify(tmpDict))
            
      $http.get('api/home/SetProductionEvent/', {
        params: {
        'pEvent':JSON.stringify(tmpDict)
        }
        // alert(JSON.stringify(pEvent))

        }).success(function (jsonData) {
           if (index > -1) {
         $scope.machines.splice(index, 1);
          }
        }).error(function (data, status, headers, config) {
       });   
    }
  }
}
   
$scope.submit = function(){
// $scope.cardDestroyed()
    // $scope.addCard()
  // alert(JSON.stringify($scope.machines))
  // alert(JSON.stringify($scope.machines))

  for (i=0;i < $scope.machines.length ; i++){
  
    if ('normal' in $scope.machines[i] ){
      // alert(JSON.stringify($scope.machines))

      $scope.machineUpdate = $scope.machines[i]
      var index = $scope.machines.indexOf( $scope.machines[i]);
      var tmpDict = {}
      tmpDict["machine"] = $scope.machines[index]["machine"]
      tmpDict["target"] = $scope.machines[index]["actual"]
      tmpDict["actual"] = $scope.machines[index]["normal"]
      // alert(JSON.stringify(tmpDict))
      alert("lkahdfkjgajsgfjagjfgjzgj")  
            
      $http.get('api/home/SetProductionEvent/', {
        params: {
        'pEvent':JSON.stringify(tmpDict)
        }
        // alert(JSON.stringify(pEvent))

        }).success(function (jsonData) {
           if (index > -1) {
         $scope.machines.splice(index, 1);
          }
        }).error(function (data, status, headers, config) {
       });   
    }
  }
}




});




dashboardApp.controller('shiftManagementController', function ($scope, $log, $http ,$filter){
    
  $scope.hstep = 1;
    $scope.mstep = 1;
    $scope.ismeridian = false;
    $scope.shiftList = []
    $scope.sBtn = true
    $scope.GetShift = function(){
    $('#loadingdiv').show().html('<h3 style="color: white;">Loading</h3><i class="fa fa-circle-o-notch fa-5x fa-spin"></i>');
    $http.get('api/home/GetShifts/', {
      params: {
      
      }
    }).success(function (jsonData) {
      $('#loadingdiv').hide().html('');
      if(!jsonData.length){
        
        $scope.shiftList = [{"shift":"","startTime":new Date(),"endTime":new Date()}]
        return
      }
      $scope.shiftList = jsonData
      
    }).error(function (data, status, headers, config) {
      console.log("Error in get shift api call...");
      $('#loadingdiv').hide().html('');
    });
  }
  $scope.GetShift()

  $scope.Changed = function () {
      $scope.sBtn = true
    };
    $scope.AddShift = function(){
      $scope.shiftList.push({"shift":"","startTime":new Date(),"endTime":new Date()})
    }
    $scope.Submit = function(){
      $('#loadingdiv').show().html('<h3 style="color: white;">Loading</h3><i class="fa fa-circle-o-notch fa-5x fa-spin"></i>');
    for (i=0;i< $scope.shiftList.length;i++){
      if($scope.shiftList[i].shift == ""){
        $scope.alertMessage("please select shift")
        return
      }
        $scope.shiftList[i].startTime = $filter('date')($scope.shiftList[i].startTime,'HH:mm')
        $scope.shiftList[i].endTime = $filter('date')($scope.shiftList[i].endTime,'HH:mm')
        // $scope.shiftList[i].lockTime = $filter('date')($scope.shiftList[i].lockTime,'HH:mm')
        if($scope.shiftList[i].startTime > $scope.shiftList[i].endTime){
          $scope.alertMessage("end time should greater than start time")
        return
        }
      }

      $http.get('api/home/SetShift/', {
      params: {
      'sList': [$scope.shiftList],
      }
    }).success(function (jsonData) {
      $scope.sBtn = false
      $('#loadingdiv').hide().html('');
    }).error(function (data, status, headers, config) {
      console.log("Error in SetShift api....");
             $('#loadingdiv').hide().html('');
    });

    }
    $scope.DeleteShift =function(i){
   
    var index = $scope.shiftList.indexOf(i); 

      if (index !== -1) 
          {

          $scope.shiftList.splice(index, 1);
          }
    $scope.Submit()
      }
  // alert("shift contriller")
   
});