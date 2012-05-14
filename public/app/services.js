//TODO move to the module startup
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


//this is a simple service module for the github API v3
angular.module('github.service.v3', ['ngResource'])

    .factory('Repository', function($resource) {
        var Repository = $resource(
            'https://api.github.com/user/repos',
            { access_token: api_token },
            {
            }
        );
        
        return Repository;
    })
    
    .factory('Issue', function($resource) {
        var Issue = $resource(
            'https://api.github.com/repos/:user/:repo/issues/:number',
            { access_token: api_token },
            {
                'update':   {method:'PATCH'},
            }
        );
        
        return Issue;
    })
    
    .factory('Milestone', function($resource) {
        var Milestone = $resource(
            'https://api.github.com/repos/:user/:repo/milestones/:number',
            { access_token: api_token },
            {
                'update':   {method:'PATCH'},
            }
        );
        
        return Milestone;
    })
    
    .factory('Label', function($resource) {
        var Label = $resource(
            'https://api.github.com/repos/:user/:repo/labels/:name',
            { access_token: api_token },
            {
                'save':   {method:'POST'},
            }
        );
        
        return Label;
    })

    .factory('Comment', function($resource) {
        var Comment = $resource(
            'https://api.github.com/repos/:user/:repo/issues/comments/:id',
            { access_token: api_token },
            {
            }
        );
        
        return Comment;
    })
    
    .factory('IssueComments', function($resource) {
        var IssueComments = $resource(
            'https://api.github.com/repos/:user/:repo/issues/:number/comments',
            { access_token: api_token },
            {
            }
        );
        
        return IssueComments;
    })

    .factory('LoggedInUser', function($resource) {
        var LoggedInUser = $resource(
            'https://api.github.com/user',
            { access_token: api_token },
            {
            }
        );
        
        return LoggedInUser;
    });





