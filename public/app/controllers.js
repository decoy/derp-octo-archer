'use strict';
/* App Controllers */




WelcomeController.$inject = ['$scope', '$location', 'UserRepos'];
function WelcomeController($scope, $location, UserRepos) {
    $scope.apikey = urlParams.token;  //code woo
    
    $scope.repos = UserRepos.query();

};


RepoController.$inject = ['$scope', '$routeParams', 'RepoIssues'];
function RepoController($scope, $routeParams, RepoIssues) {
    
    $scope.repoName = $routeParams.repoName;
    $scope.owner = $routeParams.owner;
    
    $scope.issues = RepoIssues.query({user:$scope.owner, repo: $scope.repoName});

};






