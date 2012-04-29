'use strict';
/* App Controllers */



WelcomeController.$inject = ['$scope', '$location', 'UserRepos'];

function WelcomeController($scope, $location, UserRepos) {
    $scope.apikey = urlParams.token;  //code woo
    
    $scope.repos = UserRepos.query();
    
    
    
    
};


function MyCtrl2() {
}
MyCtrl2.$inject = [];



