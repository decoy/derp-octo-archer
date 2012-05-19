'use strict';
/* App Controllers */


//quick sorter for different types of labels... there has got to be a better way to handle this...
function SplitLabels(labels) {
    var results = {};
    results.estimates = [];
    results.labels = [];
    results.statuses = [];

    //sort our labels prior to doing anything with them for now...
    labels.sort(function (a, b) {
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0 //default return value (no sorting)
    });

    //sort the labels into the different buckets
    for (var x in labels) {
        var l = labels[x];

        if (l.name.slice(0, 3).toLowerCase() == "est") {
            l.friendlyName = l.name.slice(4).trim();
            results.estimates.push(l);

        } else if (l.name.slice(0, 6).toLowerCase() == "status") {
            l.friendlyName = l.name.slice(7).trim();
            results.statuses.push(l);

        } else {
            results.labels.push(l);
        }
    }

    return results;
}


//WelcomeController.$inject = ['$scope', '$location', 'Repository'];
function WelcomeController($scope, $location, Repository) {
    $scope.apikey = urlParams.token;  //code woo
    $scope.repos = Repository.query();

}
;


//regex to match [TASK STATUS @USER]
//var bettertask = /\[TASK[\s]+?(?:([^\s]+)[\s]+)?@?([^\s]+?)\]/;
var bettertask = /\[TASK[\s+]?(?:([^\s^@]+)?[\s+]?)?(?:@([\S]+))?\]/;

//TasksController.$inject = ['$scope', '$routeParams', 'RepoIssues', 'Milestones', 'Labels', 'IssueComments', 'Comment', 'GhUsers'];
function TasksController($scope, $routeParams, Issue, Milestone, Label, IssueComments, Comment, LoggedInUser) {
    $scope.repoName = $routeParams.repoName;
    $scope.owner = $routeParams.owner;


    $scope.user = LoggedInUser.get();

    $scope.milestone = "";
    $scope.milestones = Milestone.query({owner:$scope.owner, repo:$scope.repoName}, function () {

        for (var ms in $scope.milestones) {
            if ($routeParams.milestone != null && $scope.milestones[ms].number == $routeParams.milestone) {
                $scope.milestone = $scope.milestones[ms];
            }
        }
    });

    //watch for changes in the milestone
    $scope.$watch('milestone', function (newValue, oldValue) {
        $scope.refreshIssues();
    });

    $scope.refreshIssues = function () {
        //no milestone selected
        if ($scope.milestone == null || $scope.milestone == '') {
            $scope.issues = null;
            return;
        }

        //refresh the milestone
        $scope.issues = Issue.query({owner:$scope.owner, repo:$scope.repoName, milestone:$scope.milestone.number});
    };

    $scope.getIssueComments = function (issue) {
        alert(issue.number);
        //return IssueComments.query({user:$scope.owner, repo: $scope.repoName, number: issue.number});
    };
}
;

//TaskIssueCtrl.$inject = ['$scope', 'RepoIssues', 'IssueComments', 'Comment'];
function TaskIssueCtrl($scope, Issue, IssueComments, Comment) {
    var self = this;

    $scope.description = '';

    $scope.addTask = function () {
        //create the task update object
        var newTask = new IssueComments({body:"[TASK NEW] " + $scope.description});
        newTask.$save({owner:$scope.owner, repo:$scope.repoName, number:$scope.i.number}, function () {
            self.refreshIssueComments($scope.i);
            $scope.description = '';
        });
    };

    self.refreshIssueComments = function (issue) {
        $scope.comments = IssueComments.query({owner:$scope.owner, repo:$scope.repoName, number:issue.number});
    };

    self.refreshIssueComments($scope.i);

    $scope.taskWorking = function (task) {
        self.setTaskStatus(task, 'WORKING');
    };

    $scope.taskNew = function (task) {
        self.setTaskStatus(task, 'NEW');
    };

    $scope.taskDone = function (task) {
        self.setTaskStatus(task, 'DONE');
    };

    self.setTaskStatus = function (task, status) {

        //set the new body
        var body = task.body.replace(bettertask, '');
        body = "[TASK " + status + " @" + $scope.user.login + "] " + body.trim();

        //create the task update object
        var newTask = new Comment({body:body});
        newTask.$save({owner:$scope.owner, repo:$scope.repoName, id:task.id}, function () {
            //if successful, update the existing task body to avoid re-downloading to re-parse
            task.body = body;
            //self.refreshIssueComments($scope.i);
        });

    };
}
;

//TaskCtrl.$inject = ['$scope', 'Comment'];
function TaskCtrl($scope, Comment) {
    //pattern matching for comment types    
    var matches = $scope.c.body.match(bettertask);

    $scope.isTask = matches.length >= 1;

    $scope.assigned = matches[2];

    $scope.status = matches[1];

    $scope.text = $scope.c.body.replace(matches[0], '');

}
;


//RepoController.$inject = ['$scope', '$routeParams', 'RepoIssues', 'Milestones', 'Labels'];
function RepoController($scope, $routeParams, Issue, Milestone, Label) {
    var self = this;

    $scope.repoName = $routeParams.repoName;
    $scope.owner = $routeParams.owner;

    $scope.backlogFilter = '';

    $scope.showMilestone = true; //start off expanded...


    $scope.filterBacklog = function (issue) {
        if ((issue == null || issue.milestone == null) && issue.title.toLowerCase().indexOf($scope.backlogFilter.toLowerCase()) >= 0) return true;
    };

    $scope.refreshMilestones = function () {
        Milestone.query({owner:$scope.owner, repo:$scope.repoName}, function (data) {
            $scope.milestones = data;
        });
    };

    $scope.refreshIssues = function () {
        Issue.getIssues({owner:$scope.owner, repo:$scope.repoName}, function (data) {
            $scope.issues = data;
        });
    };

    $scope.saveLabel = function (label) {
        label.$save({owner:$scope.owner, repo:$scope.repoName, name:label.name});
    };

    $scope.delLabel = function (label) {
        label.$delete({owner:$scope.owner, repo:$scope.repoName, name:label.name}, function () {
            self.refreshLabels();
        });

    };

    $scope.getMilestoneIssues = function (milestone) {
        return RepoIssues.query({owner:$scope.owner, repo:$scope.repoName, milestone:milestone.number});
    };


    $scope.hasNoMilestone = function (issue) {
        return (issue == null || issue.milestone == null);
    };

    $scope.removeIssueMilestone = function (issue) {

        //already belongs to milestone
        if (issue.milestone == null) return;

        //create a new object with only the milestone set
        var data = new Issue;
        data.milestone = null;

        //save the new issue to the number (patches), then refresh the issue
        data.$save({owner:$scope.owner, repo:$scope.repoName, number:issue.number}, function () {
            issue.$get({owner:$scope.owner, repo:$scope.repoName, number:issue.number});
        });

    }

    this.refreshLabels = function () {
        var allLabels = Label.query({owner:$scope.owner, repo:$scope.repoName}, function () {
            $scope.labels = SplitLabels(allLabels);
        });


    };

    $scope.refreshMilestones();
    $scope.refreshIssues();
    self.refreshLabels();


}
;

//LabelCtrl.$inject = ['$scope', 'Labels'];
function LabelCtrl($scope, Label) {
    $scope.name = "";
    $scope.color = "";

    $scope.addLabel = function () {
        var newLabel = new Label({name:$scope.name, color:$scope.color});
        newLabel.$save({owner:$scope.$parent.owner, repo:$scope.$parent.repoName});
        $scope.parent.refreshLabels();
    }
}
;


//MilestoneCtrl.$inject = ['$scope', 'Milestones', 'RepoIssues'];
function MilestoneCtrl($scope, Milestone, Issue) {

    $scope.title = "";
    $scope.dueon = "";

    $scope.isBelonging = function (issue) {
        return (issue.milestone.number != null && $scope.m.number == issue.milestone.number);
    };

    $scope.add = function () {
        var newM = new Milestone({title:$scope.title, due_on:$scope.dueon});
        newM.$save({owner:$scope.$parent.owner, repo:$scope.$parent.repoName}, function () {
            $scope.$parent.refreshMilestones();
            $scope.title = "";
            $scope.dueon = "";
        });


    };

    $scope.addIssueToMilestone = function (issue) {
        //var data = { milestone: milestone.id };
        var milestone = $scope.m;
        //already belongs to milestone
        if (issue.milestone != null && issue.milestone.number == milestone.number) return;

        //create a new object with only the milestone set
        var data = new Issue;
        data.milestone = milestone.number;

        //save the new issue to the number (patches), then refresh the issue
        data.$save({owner:$scope.$parent.owner, repo:$scope.$parent.repoName, number:issue.number}, function () {
            issue.$get({owner:$scope.$parent.owner, repo:$scope.$parent.repoName, number:issue.number});
        });


    }
}
;

//IssueCtrl.$inject = ['$scope', 'RepoIssues'];
function IssueCtrl($scope, Issue) {

    $scope.title = "";
    $scope.description = "";

    $scope.selectedLabel;
    $scope.selectedEstimate;


    $scope.add = function () {
        var selectedLabels = [];
        if ($scope.selectedLabel) {
            selectedLabels.push($scope.selectedLabel.name);
        }
        if ($scope.selectedEstimate) {
            selectedLabels.push($scope.selectedEstimate.name);
        }
        var stuff = new Issue({title:$scope.title, labels:selectedLabels, body:$scope.description});
        stuff.$save({owner:$scope.$parent.owner, repo:$scope.$parent.repoName}, function () {
            $scope.$parent.refreshIssues();
            $scope.title = "";
            $scope.description = "";
        });


    };
}
;

