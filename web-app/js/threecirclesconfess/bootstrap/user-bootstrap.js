var threecirclesconfess = threecirclesconfess || {};

threecirclesconfess.loaduser = (function () {
    threecirclesconfess.configuration.domain.push({
        name: 'user',
        view: {
            'list': $('#section-list-user'),
            'save': $('#submit-user'),
            'add': $('#add-user'),
            'show': $('a[id^="user-list-"]'),
            'remove': $('#delete-user')
        },
        oneToManyRelations: [ {type: 'user', name: 'friends'} ] ,
        options: {
            offline: true,
            eventPush: true
        }

    });
}());
