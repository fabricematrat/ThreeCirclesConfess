var threecirclesconfess = threecirclesconfess || {};

threecirclesconfess.loadcomment = (function () {
    threecirclesconfess.configuration.domain.push({
        name: 'comment',
        view: {
            'list': $('#section-list-comment'),
            'save': $('#submit-comment'),
            'add': $('#add-comment'),
            'show': $('a[id^="comment-list-"]'),
            'remove': $('#delete-comment')
        },
        hasOneRelations: [ {type: 'user', name: 'user'} ],
        options: {
            offline: true,
            eventPush: true
        }

    });
}());
