var threecircles = threecircles || {};
threecircles.view = threecircles.view || {};

threecircles.view.checkinview = function (model, elements) {

    var that = grails.mobile.mvc.view(model, elements);

    that.model.logged.attach(function (data, event) {
        if (data.item.errors) {
            $.each(data.item.errors, function(index, error) {
                $('#input-user-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            if (grails.mobile.helper.getCookie("grails_remember_me")) {//)$.cookie('grails_remember_me')) {
                //$('#login').text('Logout');
                $('#login').replaceWith('<a id="login" class="ui-btn-right" href="#section-show-user">Logout</a>');
            } else {
                //$('#login').text('Login');
                $('#login').replaceWith('<a id="login" class="ui-btn-right" href="#section-show-user">Login</a>');
            }
            $('#login').button();
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-checkin'));
            }
        }
    });

    $('#submit-user').live('click tap', function (event) {
        event.stopPropagation();
        $('#form-update-user').validationEngine('hide');
        if($('#form-update-user').validationEngine('validate')) {
            var obj = grails.mobile.helper.toObject($('#form-update-user').find('input, select'));
            var newElement = obj;
            that.loginButtonClicked.notify(newElement, event);

        }
    });

    // Register events
    that.model.listedItems.attach(function (data) {
        $('#list-checkin').empty();
        var key, items = model.getItems();
        $.each(items, function(key, value) {
            renderElement(value);
        });
        $('#list-checkin').listview('refresh');
    });

    that.model.createdItem.attach(function (data, event) {
        if (data.item.errors) {
            $.each(data.item.errors, function(index, error) {
                $('#input-checkin-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            renderElement(data.item);
            $('#list-checkin').listview('refresh');
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-checkin'));
            }
		}
    });

    that.model.updatedItem.attach(function (data, event) {
        if (data.item.errors) {
            $.each(data.item.errors, function(index, error) {
                $('#input-checkin-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            updateElement(data.item);
            $('#list-checkin').listview('refresh');
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-checkin'));
            }
        }
    });

    that.model.deletedItem.attach(function (data, event) {
        if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            if (data.item.offlineStatus === 'NOT-SYNC') {
                $('#checkin-list-' + data.item.id).parents('li').replaceWith(createListItem(data.item));
            } else {
                $('#checkin-list-' + data.item.id).parents('li').remove();
            }
            $('#list-checkin').listview('refresh');
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-checkin'));
            }
        }
    });

    // user interface actions
    that.elements.list.live('pageinit', function (e) {
        that.listButtonClicked.notify();
        if (grails.mobile.helper.getCookie("grails_remember_me")) {//)$.cookie('grails_remember_me')) {
            //$('#login').text('Logout');
            $('#login').replaceWith('<a id="login" class="ui-btn-right" href="#section-show-user">Logout</a>');
        } else {
            //$('#login').text('Login');
            $('#login').replaceWith('<a id="login" class="ui-btn-right" href="#section-show-user">Login</a>');
        }
        $('#login').button();



    });

    that.elements.save.live('click tap', function (event) {
        event.stopPropagation();
        $('#form-update-checkin').validationEngine('hide');
        if($('#form-update-checkin').validationEngine('validate')) {
            var obj = grails.mobile.helper.toObject($('#form-update-checkin').find('input, select'));
            var newElement = {
                checkin: JSON.stringify(obj)
            };
            if (obj.id === '') {
                that.createButtonClicked.notify(newElement, event);
            } else {
                that.updateButtonClicked.notify(newElement, event);
            }
        }
    });

    that.elements.remove.live('click tap', function (event) {
        event.stopPropagation();
        that.deleteButtonClicked.notify({ id: $('#input-checkin-id').val() }, event);
    });

    that.elements.add.live('click tap', function (event) {
        event.stopPropagation();
        $('#form-update-checkin').validationEngine('hide');
        $('#form-update-checkin').validationEngine({promptPosition: 'bottomLeft'});
        createElement();
    });

    that.elements.show.live('click tap', function (event) {
        event.stopPropagation();
        $('#form-update-checkin').validationEngine('hide');
        $('#form-update-checkin').validationEngine({promptPosition: 'bottomLeft'});
        showElement($(event.currentTarget).attr("data-id"));
    });

    var createElement = function () {
        resetForm('form-update-checkin');
        $.mobile.changePage($('#section-show-checkin'));
        $('#delete-checkin').css('display', 'none');
    };

    var showElement = function (id) {
        resetForm('form-update-checkin');
        var element = that.model.items[id];
        $.each(element, function (name, value) {
            var input = $('#input-checkin-' + name);
            if (input.attr('type') != 'file') {
                input.val(value);
            }
            if (input.attr('data-type') == 'date') {
                input.scroller('setDate', (value === '') ? '' : new Date(value), true);
            }
        });
        $('#delete-checkin').show();
        $.mobile.changePage($('#section-show-checkin'));
    };

    var resetForm = function (form) {
        $('input[data-type="date"]').each(function() {
            $(this).scroller('destroy').scroller({
                preset: 'date',
                theme: 'default',
                display: 'modal',
                mode: 'scroller',
                dateOrder: 'mmD ddyy'
            });
        });
        var div = $("#" + form);
        $("#" + form)[0].reset();
        $.each(div.find('input:hidden'), function(id, input) {
            if ($(input).attr('type') != 'file') {
                $(input).val('');
            }
        });
    };
    
    var createListItem = function (element) {
        var li, a = $('<a>');
        a.attr({
            id : 'checkin-list-' + element.id,
            'data-id' : element.id,
            'data-transition': 'fade'
        });
        a.text(getText(element));
        if (element.offlineStatus === 'NOT-SYNC') {
            li =  $('<li>').attr({'data-theme': 'e'});
            li.append(a);
        } else {
            li = $('<li>').append(a);
        }
        return li;
    };

    var renderElement = function (element) {
        $('#list-checkin').append(createListItem(element));
    };

    var updateElement = function (element) {
        $('#checkin-list-' + element.id).parents('li').replaceWith(createListItem(element));
    };

    var getText = function (data) {
        var textDisplay = '';
        $.each(data, function (name, value) {
            if (name !== 'class' && name !== 'id' && name !== 'offlineAction' && name !== 'offlineStatus'
                && name !== 'status' && name !== 'version' && name != 'longitude' && name != 'latitude'
                && name != 'NOTIFIED') {
                if (typeof value !== 'object') {   // do not display relation in list view
                    textDisplay += value + ' - ';
                }
            }
        });
        return textDisplay.substring(0, textDisplay.length - 2);
    };

    var showGeneralMessage = function(data, event) {
        $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data.item.message, true );
        setTimeout( $.mobile.hidePageLoadingMsg, 3000 );
        event.stopPropagation();
    };

    return that;
};