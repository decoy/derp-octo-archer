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
        return function(scope, element, attrs) {
            $(element).css({ position: 'relative'});
            $(element).css({ transition: 'all 0.6s ease'});
            $(element).css({ '-webkit-transition': 'all 0.6s ease'});

    
    
            scope.$watch(attrs.coolFade, function(value){
            
                if (value) {
                    $(element).css({ visibility: 'visible' });
                    $(element).css({ height: 'auto' });
                    
                    //$(element).show('blind', 'fast');
                } else {
                    //$(element).hide('blind', 'fast');
                    $(element).css({ visibility: 'hidden' });
                    $(element).css({ height: '0' });
                }
                //element.css('display', value ? '' : 'none');
            });
      
        };
    });