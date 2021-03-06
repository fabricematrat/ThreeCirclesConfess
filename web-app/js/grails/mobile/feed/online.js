/*
 * Copyright 2012 3musket33rs
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 */
var grails = grails || {};
grails.mobile = grails.mobile || {};
grails.mobile.feed = grails.mobile.feed || {};

grails.mobile.feed.online = function (url, store) {
    var that = {};
    var store = store;

    that.listItems = function (listed) {
        send(null, "list", "GET", function (data) {
            listed(data);
            if (store) {
                store.storeList(data);
            }
        });
    };

    that.login = function (data, created) {
        var callback=  function (response) {
            if (created(response)) {
                var success = true;
            }  else {
                //error
                var error = false;
            }
        };
        if (grails.mobile.helper.getCookie("grails_remember_me")) {
          sendLogout(data, "auth", "POST", callback);
        } else {
          sendLogin(data, "auth", "POST", callback);
        }
    };


    that.createItem = function (data, created) {
        send(data, "save", "POST", function (response) {
            if (created(response)) {
                if (store) {
                    store.store(response);
                }
            }
        });
    };

    that.updateItem = function (data, updated) {
        send(data, "update", "POST", function (response) {
            if(updated(response)) {
                if (store) {
                    store.store(response);
                }
            }
        });
    };

    that.deleteItem = function (data, deleted) {
        send(data, "delete", "POST", function (response) {
            deleted(response);
            if (store) {
                store.remove(response);
            }
        });
    };

    // Asynchronous Ajax call to server
    var send = function (item, action, type, callback) {
        $.ajax(cfg(url, type, action, item, callback));
    };


    var cfg = function (url, type, action, dataToSend, successCallback) {
        return {
            beforeSend: function() {
                $.mobile.showPageLoadingMsg();
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg()
            },
            cache: false,
            type: type,
            async: true,
            data: dataToSend,
            dataType: "json",
            url: url + action,
            success: function (data) {
                successCallback(data, action, dataToSend);
            },
            error: function (xhr) {
                var data = [];
                data['message'] = xhr.responseText;
                successCallback(data, action, dataToSend);
            }
        };
    };

    return that;
};
