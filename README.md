#derp-octo-archer

<p>
An agile github issues editor created with the help of 
    <a href="http://angularjs.org">AngularJS</a>,
    <a href="https://github.com">GitHub</a>,
    <a href="https://jquery.com">jQuery</a>,
    <a href="http://twitter.github.com/bootstrap/">Twitter Bootstrap</a>,
    <a href="http://nodejs.org/">node.js</a>,
    <a href="https://github.com/pksunkara/octonode">octonode</a>,
    <a href="http://touchpunch.furf.com/">Touch Punch</a>.
</p>



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

* Estimates are labels with the syntax "~ 1".  The character after the tilde can be used as a 'sort order', "~1 Small".

> <img src="https://github.com/decoy/derp-octo-archer/raw/master/public/img/planner.png" height="250"/>

###Tasks

Create tasks attached to issues and drag and drop them through statuses.

* Tasks are made from github issue comments using the syntax [TASK STATUS @ASSIGNEE]. 

* The two github statuses of open and closed are always the first and last, respectively.  
* Custom statuses can be defined with the syntax "#1 InProgress" or "# InProgress" and will appear in order between the open and closed statuses.
* Currently all statuses must be one word (No spaces) for the TASK parsing to work correctly.

> <img src="https://github.com/decoy/derp-octo-archer/raw/master/public/img/tasks.png" height="250"/>

##Roadmap

Checkout the issues list on the project for the current "roadmap". The project, of course, uses itself to plan itself.



## Copyright

Copyright � 2012 8labs.com
