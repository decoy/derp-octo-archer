
app.directive('issue', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/issue_template.html',
        replace: true
    };

});

app.directive('draggable', function() {
    return {
        link: function(scope, element, attrs) {
           $(element).draggable({
                revert: true
            });
        }
    };
});


app.directive('droppable', function() {
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
                    //var test = ui.draggable.scope();
                    var test = ui.draggable.scope().$eval(ui.draggable.attr('ng-model'));
                    var bob = scope.$eval(attrs.droppable);
                    var lkdf = scope.$eval(attrs.ngModel);
                    bob(lkdf, test);

                    $(this).removeClass('over');
                }
            });
            
        }
    };
});

app.directive('datepicker', function() {
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
});