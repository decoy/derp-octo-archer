UserRepos = function($resource) {
    return $resource(
        'https://api.github.com/user/repos',
        { access_token: urlParams.token },
        {
        }
    );
};
app.factory('UserRepos', ['$resource', UserRepos]);


RepoIssues = function($resource) {
    return $resource(
        'https://api.github.com/repos/:user/:repo/issues',
        { access_token: urlParams.token },
        {
        }
    );
};
app.factory('RepoIssues', ['$resource', RepoIssues]);



