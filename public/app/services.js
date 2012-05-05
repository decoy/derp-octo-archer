//repos users have access to
var UserRepos = function($resource) {
    return $resource(
        'https://api.github.com/user/repos',
        { access_token: api_token },
        {
        }
    );
};
app.factory('UserRepos', ['$resource', UserRepos]);

//git hub issues
var RepoIssues = function($resource) {
    return $resource(
        'https://api.github.com/repos/:user/:repo/issues/:number',
        { access_token: api_token },
        {        }
    );
};
app.factory('RepoIssues', ['$resource', RepoIssues]);


//git hub issue milestones
var Milestones = function($resource) {
    return $resource(
        'https://api.github.com/repos/:user/:repo/milestones/:number',
        { access_token: api_token },
        {
        }
    );
};
app.factory('Milestones', ['$resource', Milestones]);


//git hub issue labels
var Labels = function($resource) {
    return $resource(
        'https://api.github.com/repos/:user/:repo/labels/:name',
        { access_token: api_token, name: '@id' },
        {
            'save':   {method:'POST'},
        }
    );
};
app.factory('Labels', ['$resource', Labels]);



