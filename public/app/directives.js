//quick and dirty directives...
angular.module('derpoa.directive', [])

    .directive('issue', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/issue_template.html',
            replace: true
        };

    })

    .directive('task', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/task_template.html',
            replace: true
        };
    })

    .directive('draggable', function() {
        return {
            link: function(scope, element, attrs) {
                $(element).addClass('draggable');
                $(element).draggable({
                    revert: true
                });
            }
        };
    })

    .directive('droppable', function() {
        return {
            link: function(scope, element, attrs) {
               
               $(element).droppable({
                   tolerance: 'pointer',
                    over: function() {
                            $(this).addClass('over');
                    },
                    out: function() {
                            $(this).removeClass('over');
                    },
                    drop: function(event, ui) {
                        var test = ui.draggable.scope().$eval(ui.draggable.attr('ng-model'));
                        var bob = scope.$eval(attrs.droppable, {draggable: test, scope: scope});
                        $(this).removeClass('over');
                    }
                });
                
            }
        };
    })

    .directive('datepicker', function() {
        return {
            link: function(scope, element, attrs) {
                $(element).datepicker();
                $(element).datepicker( "option", "dateFormat", "yy-mm-dd");
                $(element).change(function() {
                    alert ('changed');
                    scope.$apply();
                });
            }
        };
    })
    
    .directive('coolFade', function() {
        return {
            compile: function(elm) {
                //console.log('compiling');
                $(elm).css('opacity', 0);
                return function(scope, elm, attrs) {
                    // console.log('animating');
                    $(elm).animate({ opacity : 1.0 }, 1000 );
                };
            }
        };
    });