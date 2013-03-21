var threecirclesconfess = threecirclesconfess || {};
threecirclesconfess.view = threecirclesconfess.view || {};

threecirclesconfess.view.checkinview = function (model, elements) {

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
                $('#login').replaceWith('<a id="login" class="ui-btn-right" href="#section-show-user">Logout</a>');
            } else {
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
        $('#list-checkin-parent').empty();
        var key, items = model.getItems();
        var timeline = threecirclesconfess.view.timeline();
        $.each(items, function(key, value) {
            var whenInfo = timeline.getWhenInformation(value.when)
            renderElementCustom(value, whenInfo);
        });
        $('#list-checkin-parent').trigger("create");
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
            renderElementCustom(data.item);
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
    that.model.listedDependentItems.attach(function (data) {
        if (data.relationType === 'many-to-one') {
            renderDependentList(data.dependentName, data.items);
        }
        if (data.relationType === 'one-to-many') {
            renderMultiChoiceDependentList(data.dependentName, data.items);
        }
    });

    // user interface actions
    that.elements.list.live('pageinit', function (e) {
        that.listButtonClicked.notify();
    });

    that.elements.save.live('click tap', function (event) {
        event.stopPropagation();
        $('#form-update-checkin').validationEngine('hide');
        if($('#form-update-checkin').validationEngine('validate')) {
            var obj = grails.mobile.helper.toObject($('#form-update-checkin').find('input, select'));
            obj.when = new Date();
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
        that.editButtonClicked.notify();
        createElement();
    });

    that.elements.show.live('click tap', function (event) {
        event.stopPropagation();
        $('#form-update-checkin').validationEngine('hide');
        $('#form-update-checkin').validationEngine({promptPosition: 'bottomLeft'});
        that.editButtonClicked.notify();
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
        var value = element['owner.id'];
        if (!value) {
            value = element['owner'];
        }
        if (!value || (value === Object(value))) {
            value = element.owner.id;
        }
        $('select[data-gorm-relation="many-to-one"][name="owner"]').val(value).trigger("change");

        var value = element['place.id'];
        if (!value) {
            value = element['place'];
        }
        if (!value || (value === Object(value))) {
            value = element.place.id;
        }
        $('select[data-gorm-relation="many-to-one"][name="place"]').val(value).trigger("change");

        var commentsSelected = element.comments;
        $.each(commentsSelected, function (key, value) {
            var selector;
            if (value === Object(value)) {
                selector= '#checkbox-comments-' + value.id;
            } else {
                selector= '#checkbox-comments-' + value;
            }
            $(selector).attr('checked','checked').checkboxradio('refresh');
        });
        var friendsSelected = element.friends;
        $.each(friendsSelected, function (key, value) {
            var selector;
            if (value === Object(value)) {
                selector= '#checkbox-friends-' + value.id;
            } else {
                selector= '#checkbox-friends-' + value;
            }
            $(selector).attr('checked','checked').checkboxradio('refresh');
        });
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


    var refreshSelectDropDown = function (select, newOptions) {
        var options = null;
        if(select.prop) {
            options = select.prop('options');
        } else {
            options = select.attr('options');
        }
        $('option', select).remove();
        $.each(newOptions, function(val, text) {
            options[options.length] = new Option(text, val);
        });
        select.val(options[0]);
    };

    var renderDependentList = function (dependentName, items) {
        var manyToOneSelectForDependent = $('select[data-gorm-relation="many-to-one"][name=' + dependentName + ']');
        var options = {};
        $.each(items, function() {
            var key = this.id;
            var value = getText(this);
            options[key] = value;
        });
        refreshSelectDropDown(manyToOneSelectForDependent, options);
    };

    var refreshMultiChoices = function (oneToMany, dependentName, newOptions) {
        oneToMany.empty();
        $.each(newOptions, function(key, val) {
            oneToMany.append('<input type="checkbox" data-gorm-relation="one-to-many" name="'+ dependentName +'" id="checkbox-'+ dependentName +'-' + key + '"/><label for="checkbox-'+ dependentName +'-'+key+'">'+val+'</label>');
        });
        oneToMany.parent().trigger('create');
    };

    var renderMultiChoiceDependentList = function (dependentName, items) {
        var oneToMany = $('#multichoice-' + dependentName);
        var options = {};
        $.each(items, function() {
            var key = this.id;
            var value = getText(this);
            options[key] = value;
        });
        refreshMultiChoices(oneToMany, dependentName, options);
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

    var createListItemCustom = function (element, timelineDate) {
        var html = '<div class="fs-object"><div class="header"><span class="ownerimage" ><img src="http://placehold.it/100x150/8e8"/></span>' +
            '<span class="placeimage" ><img src="http://placehold.it/80x150/e88"/></span>' +
            '<span class="description">' +
            '<span class="name">' + element.owner.firstname + ' ' + element.owner.lastname  + '</span> at <span class="place">' +
            element.description + '</span>' +
            '<span class="address">' + element.place.address + '</span>' +
            '</span></div>';
        $.each(element.friends, function(key, value) {
            html += '<div class="comment">With <span class="name">' + value.firstname +
                '</span></div>';

        });
        html += '<img class="mainimage" src="http://placehold.it/640x480/88e" />';

        html +='<span class="date">' + timelineDate + '</span><a class="commentbutton"><img src="img/comments.png"/></a><a class="likebutton"><img src="img/like.png"/></a>' +
        '</div>';

        html += '<ul class="fs-list">' +
                '<li><img src="img/ico-fire.png" />Back here after 5 months.</li>' +
                '<li><img src="img/ico-fire.png" />First Bar in 2 months!</li></ul>';
        return html;
    };

    var renderElementCustom = function (element, timelineDate) {
        $('#list-checkin-parent').append(createListItemCustom(element, timelineDate)).trigger("create");
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