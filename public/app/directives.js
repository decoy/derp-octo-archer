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