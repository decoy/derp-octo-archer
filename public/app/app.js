//get the URL paremeters on startup
var urlParams = {};
(function () {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
       urlParams[d(e[1])] = d(e[2]);
})();

var api_token = urlParams.token;



var app = angular.module('app', ['ngResource'], function($routeProvider) {

  $routeProvider.when('/repo/:owner/:repoName', {
    template   : 'partials/repo.html',
    controller : RepoController  
  });
  
  $routeProvider.when('/', {
    template   : 'partials/welcome.html',
    controller : WelcomeController  
  });
  
  $routeProvider.otherwise({ 
    redirectTo : '/'
  });
  
});
