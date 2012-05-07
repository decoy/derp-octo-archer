#derp-octo-archer

A github issues viewer written using angularjs, twitter bootstrap, jquery and github.

This project is very much a hack-in-progress.  Please feel free to help make it better!


##Installation

* clone the repository to a folder.
* "npm install" to get the node bits.
* edit the config.js with your settings.  (To get a github api key, go to your github account settings > applications)
* node serverex.js

Node is only used to handle the github authentication.  All other queries are handled with clientside javascript.



##Details

###Planner

Drag and drop stories/issues into milestones.

###Tasks

Create tasks attached to stories/issues and drag and drop them through statuses.

Tasks are made from github issue comments using the syntax [TASK STATUS @ASSIGNEE].  Valid statuses are NEW, WORKING, DONE.


## Copyright

Copyright � 2012 8labs.com
