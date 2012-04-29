var UserRepos = function($resource) {
    return $resource(
        'https://api.github.com/user/repos',
        { access_token: api_token },
        {
        }
    );
};
app.factory('UserRepos', ['$resource', UserRepos]);

var RepoIssues = function($resource) {
    return $resource(
        'https://api.github.com/repos/:user/:repo/issues/:number',
        { access_token: api_token },
        {
        }
    );
};
app.factory('RepoIssues', ['$resource', RepoIssues]);




