var threecirclesconfess = threecirclesconfess || {};
threecirclesconfess.view = threecirclesconfess.view || {};

threecirclesconfess.view.commentview = function (model, elements) {

    var that = grails.mobile.mvc.view(model, elements);

    // Register events
    that.model.listedItems.attach(function (data) {
        $('#list-comment').empty();
        var key, items = model.getItems();
        $.each(items, function(key, value) {
            renderElement(value);
        });
        $('#list-comment').listview('refresh');
    });

    that.model.createdItem.attach(function (data, event) {
        if (data.item.errors) {
            $.each(data.item.errors, function(index, error) {
                $('#input-comment-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            renderElement(data.item);
            $('#list-comment').listview('refresh');
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-comment'));
            }
		}
    });

    that.model.updatedItem.attach(function (data, event) {
        if (data.item.errors) {
            $.each(data.item.errors, function(index, error) {
                $('#input-comment-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            updateElement(data.item);
            $('#list-comment').listview('refresh');
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-comment'));
            }
        }
    });

    that.model.deletedItem.attach(function (data, event) {
        if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            if (data.item.offlineStatus === 'NOT-SYNC') {
                $('#comment-list-' + data.item.id).parents('li').replaceWith(createListItem(data.item));
            } else {
                $('#comment-list-' + data.item.id).parents('li').remove();
            }
            $('#list-comment').listview('refresh');
            if (!data.item.NOTIFIED) {
                $.mobile.changePage($('#section-list-comment'));
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
    that.elements.list.on('pageinit', function (e) {
        that.listButtonClicked.notify();
    });

    that.elements.save.on('click', function (event) {
        event.stopPropagation();
        $('#form-update-comment').validationEngine('hide');
        if($('#form-update-comment').validationEngine('validate')) {
            var obj = grails.mobile.helper.toObject($('#form-update-comment').find('input, select'));
            var newElement = {
                comment: JSON.stringify(obj)
            };
            if (obj.id === '') {
                that.createButtonClicked.notify(newElement, event);
            } else {
                that.updateButtonClicked.notify(newElement, event);
            }
        }
    });

    that.elements.remove.on('click', function (event) {
        event.stopPropagation();
        that.deleteButtonClicked.notify({ id: $('#input-comment-id').val() }, event);
    });

    that.elements.add.on('click', function (event) {
        event.stopPropagation();
        $('#form-update-comment').validationEngine('hide');
        $('#form-update-comment').validationEngine({promptPosition: 'bottomLeft'});
        that.editButtonClicked.notify();
        createElement();
    });

    var show = function(dataId, event) {
        event.stopPropagation();
        $('#form-update-comment').validationEngine('hide');
        $('#form-update-comment').validationEngine({promptPosition: 'bottomLeft'});
        that.editButtonClicked.notify();
        showElement(dataId);
    };

    var createElement = function () {
        resetForm('form-update-comment');
        $.mobile.changePage($('#section-show-comment'));
        $('#delete-comment').css('display', 'none');
    };


    var encode = function (data) {
        var str = "";
        for (var i = 0; i < data.length; i++)
            str += String.fromCharCode(data[i]);
        return str;
    };

    var showElement = function (id) {
        resetForm('form-update-comment');
        var element = that.model.items[id];
        var value = element['user.id'];
        if (!value) {
            value = element['user'];
        }
        if (!value || (value === Object(value))) {
           value = element.user.id;
        }
        $('select[data-gorm-relation="many-to-one"][name="user"]').val(value).trigger("change");
        
        $.each(element, function (name, value) {
            var input = $('#input-comment-' + name);
            if (input.attr('type') != 'file') {
                input.val(value);
            } else {
                var img = encode(value);
                input.parent().css('background-image', 'url("' + img + '")');
            }
            if (input.attr('data-type') == 'date') {
                input.scroller('setDate', (value === '') ? '' : new Date(value), true);
            }
        });
        $('#delete-comment').show();
        $.mobile.changePage($('#section-show-comment'));
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
        if(div) {
            div[0].reset();
            $.each(div.find('input:hidden'), function(id, input) {
                if ($(input).attr('type') != 'file') {
                    $(input).val('');
                } else {
                    $(input).parent().css('background-image', 'url("images/camera.png")');
                }
            });
        }
    };
    

    var refreshSelectDropDown = function (select, newOptions) {
        var options = null;
        if(select.prop) {
            options = select.prop('options');
        } else {
            options = select.attr('options');
        }
        if (options) {
            $('option', select).remove();
            $.each(newOptions, function(val, text) {
                options[options.length] = new Option(text, val);
            });
            select.val(options[0]);
        }
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
            id : 'comment-list-' + element.id,
            'data-id' : element.id,
            'data-transition': 'fade'
        });
        a.text(getText(element));
        a.on('click', function(event) {
            show(element.id, event);
        });
        
        if (element.offlineStatus === 'NOT-SYNC') {
            li =  $('<li>').attr({'data-theme': 'e'});
            li.append(a);
        } else {
            li = $('<li>').append(a);
        }
        return li;
    };

    var renderElement = function (element) {
        $('#list-comment').append(createListItem(element));
    };

    var updateElement = function (element) {
        $('#comment-list-' + element.id).parents('li').replaceWith(createListItem(element));
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