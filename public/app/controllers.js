'use strict';
/* App Controllers */

//WelcomeController.$inject = ['$scope', '$location', 'Repository'];
function WelcomeController($scope, $location, Repository) {
    $scope.apikey = urlParams.token;
    //code woo
    $scope.repos = Repository.query();

};

//TasksController.$inject = ['$scope', '$routeParams', 'RepoIssues', 'Milestones', 'Labels', 'IssueComments', 'Comment', 'GhUsers'];
function TasksController($scope, $routeParams, Issue, Milestone, Label, IssueComments, LoggedInUser, Comment) {
    $scope.repoName = $routeParams.repoName;
    $scope.owner = $routeParams.owner;

    $scope.user = LoggedInUser.get();

    $scope.showIssueTasks = true;
    //start expanded...

    Label.getLabels({
        owner : $scope.owner,
        repo : $scope.repoName
    }, function(data) {

        $scope.states = data.statuses;
    });

    $scope.states = ['open', 'working', 'closed'];

    $scope.milestone = "";
    $scope.milestones = Milestone.query({
        owner : $scope.owner,
        repo : $scope.repoName
    }, function() {

        //sort the milestones
        $scope.milestones.sort(function(a, b) {
            if (a.due_on < b.due_on)
                return -1
            if (a.due_on > b.due_on)
                return 1
            return 0 //default return value (no sorting)
        });

        //use the first as the default...
        $scope.milestone = $scope.milestones[0];

        //see if the route param overrides...
        for (var ms in $scope.milestones) {
            if ($routeParams.milestone != null && $scope.milestones[ms].number == $routeParams.milestone) {
                $scope.milestone = $scope.milestones[ms];
            }
        }
    });

    $scope.changeIssueStatus = function(issue, status) {
        //make sure it's a new status...
        if (issue.status.name != status.name) {

            var assignee = null;
            if (status != $scope.states[0]) {
                assignee = $scope.user.login;
            }
            issue.setState(status, assignee);

        }
        //var bob = issue;
    };

    $scope.changeTaskStatus = function(task, status) {

        if (task.status == status.friendlyName)
            return;
        //already set.

        //set the new body
        var body = task.body.replace(TASK_PATTERN, '');

        if (status == $scope.states[0]) {
            body = "[TASK " + status.friendlyName + "] " + body.trim();
        } else {
            body = "[TASK " + status.friendlyName + " @" + $scope.user.login + "] " + body.trim();
        }

        //create the task update object
        var newTask = new Comment({
            body : body
        });
        newTask.$save({
            owner : $scope.owner,
            repo : $scope.repoName,
            id : task.id
        }, function(data) {
            //task = data;
            //if successful, update the existing task body to avoid re-downloading to re-parse
            task.body = body;
            task.status = status.friendlyName;
            if (status != $scope.states[0]) {
                task.assigned = $scope.user.login;
            } else {
                task.assigned = null;
            }
            //self.refreshIssueComments($scope.i);
        });
    };

    //watch for changes in the milestone
    $scope.$watch('milestone', function(newValue, oldValue) {
        $scope.refreshIssues();
    });

    $scope.refreshIssues = function() {
        $scope.issues = [];

        //no milestone selected
        if ($scope.milestone == null || $scope.milestone == '') {
            $scope.issues = null;
            return;
        }

        //refresh the milestone
        Issue.getIssues({
            owner : $scope.owner,
            repo : $scope.repoName,
            milestone : $scope.milestone.number
        }, function(data) {
            angular.forEach(data, function(value, key) {
                value.comments && value.getComments();
                //only get comments if the ticket lists some...
            });
            $scope.issues.push.apply($scope.issues, data);
        });

        Issue.getIssues({
            owner : $scope.owner,
            repo : $scope.repoName,
            milestone : $scope.milestone.number,
            state : 'closed'
        }, function(data) {
            angular.forEach(data, function(value, key) {
                value.comments && value.getComments();
                //only get comments if the ticket lists some...
            });
            $scope.issues.push.apply($scope.issues, data);
        });

    };

    $scope.filterIssuesWithTasks = function(issue, test) {
        if (issue.task_details && issue.task_details.length > 0)
            return true;
    };

    //there's got to be a better way....
    $scope.filterIssuesWithNoTasks = function(issue, test) {
        if (!issue.task_details || issue.task_details.length <= 0)
            return true;
    };
}

;

function TaskCtrl($scope, IssueComments) {

    $scope.description = '';

    $scope.addTask = function(issue) {

        //set the new body
        var body = "[TASK " + $scope.states[0].friendlyName + "] " + $scope.description.trim();

        //create the task update object
        var newTask = new IssueComments({
            body : body
        });
        newTask.$save({
            owner : $scope.owner,
            repo : $scope.repoName,
            number : issue.number
        }, function(data) {
            //task = data;
            //if successful, update the existing task body to avoid re-downloading to re-parse
            //task.body = body;
            //task.status = status;
            //task.assignee = $scope.user.login;
            //self.refreshIssueComments($scope.i);

            $scope.description = '';
            issue.getComments();
            //refresh

        });

    };
};

//RepoController.$inject = ['$scope', '$routeParams', 'RepoIssues', 'Milestones', 'Labels'];
function RepoController($scope, $routeParams, Issue, Milestone, Label) {
    var self = this;

    $scope.repoName = $routeParams.repoName;
    $scope.owner = $routeParams.owner;

    $scope.backlogFilter = '';

    $scope.showMilestone = true;
    //start off expanded...

    $scope.filterBacklog = function(issue) {
        if ((issue == null || issue.milestone == null) && issue.title.toLowerCase().indexOf($scope.backlogFilter.toLowerCase()) >= 0)
            return true;
    };

    $scope.refreshMilestones = function() {
        Milestone.query({
            owner : $scope.owner,
            repo : $scope.repoName
        }, function(data) {
            $scope.milestones = data;
        });
    };

    $scope.refreshIssues = function() {
        Issue.getIssues({
            owner : $scope.owner,
            repo : $scope.repoName
        }, function(data) {
            $scope.issues = data;
        });
    };

    $scope.refreshLabels = function() {
        Label.getLabels({
            owner : $scope.owner,
            repo : $scope.repoName
        }, function(data) {
            $scope.labels = data;
        });
    };

    $scope.saveLabel = function(label) {
        label.$save({
            owner : $scope.owner,
            repo : $scope.repoName,
            name : label.name
        });
    };

    $scope.delLabel = function(label) {
        label.$delete({
            owner : $scope.owner,
            repo : $scope.repoName,
            name : label.name
        }, function() {
            self.refreshLabels();
        });

    };

    $scope.getMilestoneIssues = function(milestone) {
        return RepoIssues.query({
            owner : $scope.owner,
            repo : $scope.repoName,
            milestone : milestone.number
        });
    };

    $scope.hasNoMilestone = function(issue) {
        return (issue == null || issue.milestone == null);
    };

    $scope.removeIssueMilestone = function(issue) {

        //already belongs to milestone
        if (issue.milestone == null)
            return;

        //create a new object with only the milestone set
        var data = new Issue;
        data.milestone = null;

        //save the new issue to the number (patches), then refresh the issue
        data.$save({
            owner : $scope.owner,
            repo : $scope.repoName,
            number : issue.number
        }, function() {
            issue.$get({
                owner : $scope.owner,
                repo : $scope.repoName,
                number : issue.number
            });
        });

    }

    $scope.refreshLabels();
    $scope.refreshMilestones();
    $scope.refreshIssues();

}

;

//LabelCtrl.$inject = ['$scope', 'Labels'];
function LabelCtrl($scope, Label) {
    $scope.name = "";
    $scope.color = "";

    $scope.addLabel = function() {
        var newLabel = new Label({
            name : $scope.name,
            color : $scope.color
        });
        newLabel.$save({
            owner : $scope.$parent.owner,
            repo : $scope.$parent.repoName
        });
        $scope.parent.refreshLabels();
    }
}

;

//MilestoneCtrl.$inject = ['$scope', 'Milestones', 'RepoIssues'];
function MilestoneCtrl($scope, Milestone, Issue) {

    $scope.title = "";
    $scope.dueon = "";

    $scope.isBelonging = function(issue) {
        return (issue.milestone.number != null && $scope.m.number == issue.milestone.number);
    };

    $scope.add = function() {
        var newM = new Milestone({
            title : $scope.title,
            due_on : $scope.dueon
        });
        newM.$save({
            owner : $scope.$parent.owner,
            repo : $scope.$parent.repoName
        }, function() {
            $scope.$parent.refreshMilestones();
            $scope.title = "";
            $scope.dueon = "";
        });

    };

    $scope.addIssueToMilestone = function(issue) {
        //var data = { milestone: milestone.id };
        var milestone = $scope.m;
        //already belongs to milestone
        if (issue.milestone != null && issue.milestone.number == milestone.number)
            return;

        //create a new object with only the milestone set
        var data = new Issue;
        data.milestone = milestone.number;

        //save the new issue to the number (patches), then refresh the issue
        data.$save({
            owner : $scope.$parent.owner,
            repo : $scope.$parent.repoName,
            number : issue.number
        }, function() {
            issue.$get({
                owner : $scope.$parent.owner,
                repo : $scope.$parent.repoName,
                number : issue.number
            });
        });

    }
}

;

//IssueCtrl.$inject = ['$scope', 'RepoIssues'];
function IssueCtrl($scope, Issue) {

    $scope.title = "";
    $scope.description = "";

    $scope.selectedLabel
    $scope.selectedEstimate

    $scope.add = function() {
        var selectedLabels = [];
        if ($scope.selectedLabel) {
            selectedLabels.push($scope.selectedLabel.name);
        }
        if ($scope.selectedEstimate) {
            selectedLabels.push($scope.selectedEstimate.name);
        }
        var stuff = new Issue({
            title : $scope.title,
            labels : selectedLabels,
            body : $scope.description
        });
        stuff.$save({
            owner : $scope.$parent.owner,
            repo : $scope.$parent.repoName
        }, function() {
            $scope.$parent.refreshIssues();
            $scope.title = "";
            $scope.description = "";
        });

    };
}

;

function ToolsController($scope) {

};
