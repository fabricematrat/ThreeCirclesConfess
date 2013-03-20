var threecircles = threecircles || {};
threecircles.view = threecircles.view || {};

threecircles.view.userview = function (model, elements) {

    var that = grails.mobile.mvc.view(model, elements);


    that.model.logged.attach(function (data, event) {
        if (data.item.errors) {
            $.each(data.item.errors, function(index, error) {
                $('#input-user-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            //showGeneralMessage(data, event);
        } else {
            //renderElement(data.item);
            //$('#list-user').listview('refresh');
            $('#login').value("logout");
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-user'));
            }
		}
    });

     // user interface actions
//    that.elements.list.live('pageinit', function (event) {
//        event.stopPropagation();
//        $('#form-update-user').validationEngine('hide');
//        $('#form-update-user').validationEngine({promptPosition: 'bottomLeft'});
//        createElement();
//    });

    $('#submit-user').live('click tap', function (event) {
        event.stopPropagation();
        $('#form-update-user').validationEngine('hide');
        if($('#form-update-user').validationEngine('validate')) {
            var obj = grails.mobile.helper.toObject($('#form-update-user').find('input, select'));
            var newElement = {
                user: JSON.stringify(obj)
            };
            that.loginButtonClicked.notify(newElement, event);

        }
    });
//    var createElement = function () {
//        resetForm('form-update-user');
//        $.mobile.changePage($('#section-show-user'));
//        $('#delete-user').css('display', 'none');
//    };
//
//    var getText = function (data) {
//        var textDisplay = '';
//        $.each(data, function (name, value) {
//            if (name !== 'class' && name !== 'id' && name !== 'offlineAction' && name !== 'offlineStatus'
//                && name !== 'status' && name !== 'version' && name != 'longitude' && name != 'latitude'
//                && name != 'NOTIFIED') {
//                if (typeof value !== 'object') {   // do not display relation in list view
//                    textDisplay += value + ' - ';
//                }
//            }
//        });
//        return textDisplay.substring(0, textDisplay.length - 2);
//    };

    return that;
};