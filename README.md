#derp-octo-archer

A github issues viewer written using angularjs, twitter bootstrap, jquery and github.

This project is very much a hack-in-progress.  Please feel free to help make it better!


##Installation

1. clone the repository to a folder.
2. "npm install" to get the node bits.
3. edit the config.js with your settings.  (To get a github api key, go to your github account settings > applications)
4. node serverex.js

Node is only used to handle the github authentication.  All other queries are handled with clientside javascript.



##Details

###Planner

Drag and drop stories/issues into milestones.

Create new stories with default label and estimate

* Estimate by creating labels with prefix "est".  First character after "est" is the sort order, but otherwise does not change the estimate value.  For example: Label named "est1 Small" would result in an estimate of "Small" with a sort order of 1.

> <img src="https://github.com/decoy/derp-octo-archer/raw/master/public/img/planner.png" height="250"/>

###Tasks

Create tasks attached to stories/issues and drag and drop them through statuses.

Tasks are made from github issue comments using the syntax [TASK STATUS @ASSIGNEE].  Valid statuses are NEW, WORKING, DONE.

> <img src="https://github.com/decoy/derp-octo-archer/raw/master/public/img/tasks.png" height="250"/>

##Roadmap

Checkout the issues list on the project for the current "roadmap". The project, of course, uses itself to plan itself.


##Screenshots

These will be updated periodically I hope...





## Copyright

Copyright � 2012 8labs.com
