


//default app module
var app = angular.module('derpoa', ['ngResource', 'github.service.v3', 'derpoa.directive'])

    .config(function($routeProvider) {

        $routeProvider.when('/repo/:owner/:repoName', {
            template   : 'partials/repo.html',
            controller : RepoController  
        });

        $routeProvider.when('/tasks/:owner/:repoName/:milestone', {
            template   : 'partials/tasks.html',
            controller : TasksController  
        });

        $routeProvider.when('/tasks/:owner/:repoName', {
            template   : 'partials/tasks.html',
            controller : TasksController  
        });
        
        $routeProvider.when('/tools/:owner/:repoName', {
            template   : 'partials/tools.html',
            controller : ToolsController  
        });

        $routeProvider.when('/', {
            template   : 'partials/welcome.html',
            controller : WelcomeController  
        });

        $routeProvider.otherwise({ 
            redirectTo : '/'
        });
  
    });
