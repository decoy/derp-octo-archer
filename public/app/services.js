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

var bettertask = /\[TASK[\s+]?(?:([^\s^@]+)?[\s+]?)?(?:@([\S]+))?\]/;

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
    
    //The issue factory has a lot going on....
    .factory('Issue', function($resource, IssueComments, Comment) {
        var Issue = $resource(
            'https://api.github.com/repos/:user/:repo/issues/:number',
            { access_token: api_token, number:"@number" },
            {
                'update':   {method:'PATCH'},
            }
        );
        
        //set the closed/open state
        Issue.prototype.setState = function(state, args, cb) {
            var self = this;
            var i = new Issue({state: state, number: this.number});
            i.$save(args, function(data) {
                self.state = state;
            });
        };
               
        //fill the comments and tasks
        Issue.prototype.getComments = function(args, cb) {
            var self = this;
            args.number = this.number;
            
            IssueComments.query(args, function(data){
                self.comment_details = [];
                self.task_details = [];
                angular.forEach(data, function(value, key) {
                    var matches = value.body.match(bettertask);
                    if (!matches) self.comment_details.push(value);
                    else {
                        value.status = matches[1];
                        value.assigned = matches[2];
                        value.text = value.body.replace(matches[0], '');
                        self.task_details.push(value);
                    }
                });
            });
        };
        
        //parse the labels vs statuses vs estimates
        Issue.prototype.parseLabels = function() {
            var self = this;
            this.estimates = [];
            this.tags = [];
            this.statuses = [];
            
            //sort our labels prior to doing anything with them for now...
            this.labels.sort(function(a, b) {
                var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
                if (nameA < nameB) return -1 
                if (nameA > nameB) return 1
                return 0 //default return value (no sorting)
            });

            //sort the labels into the different buckets
            angular.forEach(this.labels, function(l, key) {
                if (l.name.slice(0, 3).toLowerCase() == "est") {
                    l.friendlyName = l.name.slice(4).trim();
                    self.estimates.push(l);
                    
                } else if (l.name.slice(0, 6).toLowerCase() == "status") {
                    l.friendlyName = l.name.slice(7).trim();
                    self.statuses.push(l);
                    
                } else {
                    self.tags.push(l);
                }
            
            });
            
            this.estimate = this.estimates[0];
            this.status = this.statuses[0];

        };
        
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





