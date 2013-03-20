package threecircles

class Checkin {
    String description
    //String address
    Date when
    Place place
    User owner
    static hasMany = [friends:User, comments:Comment]

    static mapping = {
        friends lazy: false
        comments lazy: false
        place fetch: 'join'
    }

    static constraints = {
    }
}
