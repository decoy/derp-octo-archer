'use strict';
/* App Controllers */




WelcomeController.$inject = ['$scope', '$location', 'UserRepos'];
function WelcomeController($scope, $location, UserRepos) {
    $scope.apikey = urlParams.token;  //code woo
    $scope.repos = UserRepos.query();

};


TasksController.$inject = ['$scope', '$routeParams', 'RepoIssues', 'Milestones', 'Labels', 'IssueComments', 'Comment'];
function TasksController($scope, $routeParams, RepoIssues, Milestones, Labels, IssueComments, Comment) {
    $scope.repoName = $routeParams.repoName;
    $scope.owner = $routeParams.owner;
    
    
    $scope.milestone = "";
    $scope.milestones = Milestones.query({user:$scope.owner, repo: $scope.repoName}, function() {
        if ($scope.milestones.length > 0)  { $scope.milestone = $scope.milestones[0]; }
    });
    
    //watch for changes in the milestone
    $scope.$watch('milestone', function(newValue, oldValue) { 
        $scope.refreshIssues();
    });
   
    $scope.refreshIssues = function() {
        //no milestone selected
        if ($scope.milestone == null || $scope.milestone == '') {
            $scope.issues = null;
            return;
        }
        
        //refresh the milestone
        $scope.issues = RepoIssues.query({user:$scope.owner, repo: $scope.repoName, milestone: $scope.milestone.number});
    };
    
    $scope.getIssueComments = function(issue) {
        alert(issue.number);
        //return IssueComments.query({user:$scope.owner, repo: $scope.repoName, number: issue.number});
    };
};

TaskIssueCtrl.$inject = ['$scope', 'RepoIssues', 'IssueComments', 'Comment'];
function TaskIssueCtrl($scope, RepoIssues, IssueComments, Comment) {
    var self = this;
    
    $scope.comments;

    self.refreshIssueComments = function(issue) {
        $scope.comments = IssueComments.query({user:$scope.owner, repo: $scope.repoName, number: issue.number});
    };
    
    self.refreshIssueComments($scope.i);
};



TaskCtrl.$inject = ['$scope', 'Comment'];
function TaskCtrl($scope, Comment) {
    //pattern matching for comment types
    var bettertask = /\[TASK\s([^\s]+)\s\@([^\s]+)\]/
    var taskregex = /\[TASK.*?\]/;
    var assignedregex = /\[ASSIGNED.*?\]/;
    var statusregex = /\[STATUS.*?\]/;
    
    var matches = $scope.c.body.match(bettertask);
    
    $scope.isTask = matches.length >= 1;
    
    $scope.assigned = matches[2];
    
    $scope.status = matches[1];
    
    $scope.text = $scope.c.body.replace(matches[0], '');

};


RepoController.$inject = ['$scope', '$routeParams', 'RepoIssues', 'Milestones', 'Labels'];
function RepoController($scope, $routeParams, RepoIssues, Milestones, Labels) {
    var self = this;
    
    $scope.repoName = $routeParams.repoName;
    $scope.owner = $routeParams.owner;
    
    $scope.issues = RepoIssues.query({user:$scope.owner, repo: $scope.repoName});
    
    
    $scope.refreshMilestones = function() {
        $scope.milestones = Milestones.query({user:$scope.owner, repo: $scope.repoName});
    };
    
    $scope.refreshIssues = function() {
        $scope.issues = RepoIssues.query({user:$scope.owner, repo: $scope.repoName});
    };

    $scope.saveLabel = function(label) {
        label.$save({user:$scope.owner, repo: $scope.repoName, name: label.name});
    };
    
    $scope.delLabel = function(label) {
        label.$delete({user:$scope.owner, repo: $scope.repoName, name: label.name}, function(){
            self.refreshLabels();
        });
        
    };
    
    $scope.getMilestoneIssues = function(milestone) {
        return RepoIssues.query({user:$scope.owner, repo: $scope.repoName, milestone: milestone.number});
    };
    
    
    $scope.hasNoMilestone = function(issue) {
        if (issue == null || issue.milestone == null) return true;

        return false;
    };
    
    $scope.removeIssueMilestone = function(milestone, issue) {      
       
        //already belongs to milestone
        if (issue.milestone ==null) return;
        
        //create a new object with only the milestone set
        var data = new RepoIssues;
        data.milestone = null; 
        
        //save the new issue to the number (patches), then refresh the issue
        data.$save({user:$scope.owner, repo: $scope.repoName, number: issue.number}, function(){
            issue.$get({user:$scope.owner, repo: $scope.repoName, number: issue.number});
        });
        
        
        
    }
    
    this.refreshLabels = function() {
        $scope.labels = Labels.query({user:$scope.owner, repo: $scope.repoName});
    };
    
    $scope.refreshMilestones();
    
    self.refreshLabels();
    
    
};

LabelCtrl.$inject = ['$scope', 'Labels'];
function LabelCtrl($scope, Labels) {
    $scope.name = "";
    $scope.color = "";
    
    $scope.addLabel = function() {
        var newLabel = new Labels({name: $scope.name, color: $scope.color});
        newLabel.$save({user:$scope.$parent.owner, repo: $scope.$parent.repoName});
        $scope.parent.refreshLabels();
    }
};


MilestoneCtrl.$inject = ['$scope', 'Milestones', 'RepoIssues'];
function MilestoneCtrl($scope, Milestones, RepoIssues) {
      
    $scope.title = "";
    $scope.dueon = "";
  
    $scope.isBelonging = function (issue) {
        return (issue.milestone.number !=null && $scope.m.number == issue.milestone.number);
    };
    
    $scope.add = function () {
        var newM = new Milestones({title: $scope.title, due_on: $scope.dueon});
        newM.$save({user:$scope.$parent.owner, repo: $scope.$parent.repoName}, function() {
            $scope.$parent.refreshMilestones();
            $scope.title = "";
            $scope.dueon = "";
        });
        

    };
        
    $scope.addIssueToMilestone = function(milestone, issue) {      
        //var data = { milestone: milestone.id };
        
        //already belongs to milestone
        if (issue.milestone !=null && issue.milestone.number == milestone.number) return;
        
        //create a new object with only the milestone set
        var data = new RepoIssues;
        data.milestone = milestone.number; 
        
        //save the new issue to the number (patches), then refresh the issue
        data.$save({user:$scope.$parent.owner, repo: $scope.$parent.repoName, number: issue.number}, function(){
            issue.$get({user:$scope.$parent.owner, repo: $scope.$parent.repoName, number: issue.number});
        });
        
        
        
    }
};

IssueCtrl.$inject = ['$scope', 'RepoIssues'];
function IssueCtrl($scope, RepoIssues) {
      
    $scope.title = "";
   
    $scope.add = function () {
        var stuff = new RepoIssues({title: $scope.title});
        stuff.$save({user:$scope.$parent.owner, repo: $scope.$parent.repoName}, function() {
            $scope.$parent.refreshIssues();
            $scope.title = "";
        });
        

    };

};

