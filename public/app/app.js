//default app module
var app = angular.module('derpoa', ['ngResource', 'github.service.v3', 'derpoa.directive']).config(function($routeProvider) {

    $routeProvider.when('/repo/:owner/:repoName', {
        templateUrl : 'partials/repo.html',
        controller : RepoController
    });

    $routeProvider.when('/tasks/:owner/:repoName/:milestone', {
        templateUrl : 'partials/tasks.html',
        controller : TasksController
    });

    $routeProvider.when('/tasks/:owner/:repoName', {
        templateUrl : 'partials/tasks.html',
        controller : TasksController
    });

    $routeProvider.when('/tools/:owner/:repoName', {
        templateUrl : 'partials/tools.html',
        controller : ToolsController
    });

    $routeProvider.when('/', {
        templateUrl : 'partials/welcome.html',
        controller : WelcomeController
    });

    $routeProvider.otherwise({
        redirectTo : '/'
    });

});
