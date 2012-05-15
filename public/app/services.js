//TODO move to a module or something...
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

    //the repository...
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
            'https://api.github.com/repos/:owner/:repo/issues/:number',
            { access_token: api_token, repo: "@repo", owner: "@owner", number:"@number" },
            {
                'update':   {method:'PATCH'},
            }
        );
        
        //wrapper for querying for issues and adding our specific values
        Issue.getIssues = function(args, cb, err) {
            return Issue.query(args, function(data) {
                angular.forEach(data, function(value, key) {
                    value.owner = args.owner;
                    value.repo = args.repo;
                    value.parseLabels();
                });
                cb && cb(data);
            }, err);
        };
        
        //set the closed/open state
        Issue.prototype.setState = function(state, cb) {
            var self = this;
            var i = new Issue({state: state, number: this.number, repo: this.repo, owner: this.owner});
            i.$save(function(data) {
                self.state = state;
            });
        };
               
        //fill the comments and tasks
        Issue.prototype.getComments = function(args, cb) {
            var self = this;
            if (!args) args = {};
            args.number = this.number;
            args.owner = this.owner;
            args.repo = this.repo;
            
            //if (!this.comments || this.comment_details) return; //already gotten.
            
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
    
    //issues belong to milestones... woo....
    .factory('Milestone', function($resource) {
        var Milestone = $resource(
            'https://api.github.com/repos/:owner/:repo/milestones/:number',
            { access_token: api_token },
            {
                'update':   {method:'PATCH'},
            }
        );
        
        return Milestone;
    })
    
    //labels are multi purpose around here...
    .factory('Label', function($resource) {
        var Label = $resource(
            'https://api.github.com/repos/:owner/:repo/labels/:name',
            { access_token: api_token },
            {
                'save':   {method:'POST'},
            }
        );
        
        return Label;
    })

    //comments are also tasks depending on content...
    .factory('Comment', function($resource) {
        var Comment = $resource(
            'https://api.github.com/repos/:owner/:repo/issues/comments/:id',
            { access_token: api_token },
            {
            }
        );
        
        return Comment;
    })
    
    //github isn't very rest like with this one.
    .factory('IssueComments', function($resource) {
        var IssueComments = $resource(
            'https://api.github.com/repos/:owner/:repo/issues/:number/comments',
            { access_token: api_token },
            {
            }
        );
        
        return IssueComments;
    })

    //quick helper to get the logged in user
    .factory('LoggedInUser', function($resource) {
        var LoggedInUser = $resource(
            'https://api.github.com/user',
            { access_token: api_token },
            {
            }
        );
        
        return LoggedInUser;
    });





