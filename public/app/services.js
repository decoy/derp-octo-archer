//Some variables
//TODO - where do these go in angular??
var TASK_PATTERN = /\[TASK[\s+]?(?:([^\s^@]+)?[\s+]?)?(?:@([\S]+))?\]/;  //matches [TASK STATUS @USER] or [TASK STATUS] or [TASK @USER]
var ESTIMATE_PREFIX = "~"; //first character after the prefix is used for sorting, after that is the actual name
var STATUS_PREFIX = "#"; //first character after the prefix is used for sorting, after that is the actual name

//get the token
//TODO where does this go in angular?
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

//function to split up labels...  TODO where does this go?
function parseLabels(labels) {

    var r = {};
    r.estimates = [];
    r.tags = [];
    r.statuses = [];
    
    //sort our labels prior to doing anything with them for now...
    labels.sort(function(a, b) {
        var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
        if (nameA < nameB) return -1 
        if (nameA > nameB) return 1
        return 0 //default return value (no sorting)
    });

    //sort the labels into the different buckets
    angular.forEach(labels, function(l, key) {
        if (l.name.slice(0, ESTIMATE_PREFIX.length).toLowerCase() == ESTIMATE_PREFIX) {
            l.friendlyName = l.name.slice(ESTIMATE_PREFIX.length + 1).trim();
            r.estimates.push(l);
            
        } else if (l.name.slice(0, STATUS_PREFIX.length).toLowerCase() == STATUS_PREFIX) {
            l.friendlyName = l.name.slice(STATUS_PREFIX.length + 1).trim();
            r.statuses.push(l);
            
        } else {
            r.tags.push(l);
        }
    
    });
    
    return r;
};




//this is a simple service module for the github API v3 issues
angular.module('github.service.v3', ['ngResource'])

    .config(function() {
        
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
    })

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
                    
                    //deal with the labels...
                    var r = parseLabels(value.labels);
                    value.tags = r.tags;
                    //value.estimates = r.estimates;
                    //value.statuses = r.statuses;
                    value.estimate = r.estimates[0];
                    value.status = r.statuses[0];
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
                    var matches = value.body.match(TASK_PATTERN);
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
        
        //wrapper for querying for labels and adding our specific values
        Label.getLabels = function(args, cb, err) {
            return Label.query(args, function(data) {
                angular.forEach(data, function(value, key) {
                    value.owner = args.owner;
                    value.repo = args.repo;
                    //parse them...
                });
                var r = parseLabels(data);
                data.tags = r.tags;
                data.estimates = r.estimates;
                data.statuses = r.statuses;
                cb && cb(data);
            }, err);
        };
        
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





