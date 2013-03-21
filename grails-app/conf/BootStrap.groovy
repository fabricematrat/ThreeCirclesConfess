import threecircles.User
import threecircles.Role
import threecircles.UserRole
import threecircles.Place
import threecircles.Checkin
import threecircles.Comment

class BootStrap {

    def springSecurityService


    def init = { servletContext ->

        def userRole = new Role(authority: 'ROLE_USER').save(flush: true)

        def testUser = new User(firstname: "Corinne", lastname: "Krych", username: 'me', enabled: true, password: 'password')
        testUser.save(flush: true)
        UserRole.create testUser, userRole, true

        User fabrice = new User(firstname: "Fabrice", lastname: "Matrat", username: "fabricematrat", password: "password", enabled: true);
        fabrice.save()
        UserRole.create fabrice, userRole, true

        User sebastien = new User(firstname: "Sebastien", lastname: "Blanc", username: "sebastienblanc", password: "password", enabled: true);
        sebastien.save()
        UserRole.create sebastien, userRole, true

        User mathieu = new User(firstname: "Mathieu", lastname: "Bruyen", username: "mathieubruyen", password: "password", enabled: true);
        mathieu.save()
        UserRole.create mathieu, userRole, true

        Place nice = new Place(name: "Nice", latitude:43.7, longitude: 7.2, address: "town center" )
        nice.save()

        Place paris = new Place(name: "Paris", latitude:48.8, longitude: 2.3, address:  "13 rue richard lenoir" )
        paris.save()

        testUser.addToFriends(fabrice)
        testUser.addToFriends(sebastien)
        testUser.save()

        Comment comment = new Comment(text: """brrrrrr""", user: testUser)
        comment.save()
        Comment comment2 = new Comment(text: """great conference.
            Cool to meet female speaker""", user: testUser)
        comment2.save()

        Checkin confess = new Checkin(description: "confess", when: new Date(), place: nice, owner: testUser)
        confess.save()
        confess.addToFriends(fabrice)
        confess.save()


        Checkin devfestw = new Checkin(description: "devfestw", when: new Date() - 25, place: paris, owner: testUser)
        devfestw.save()
        devfestw.addToFriends(fabrice)
        devfestw.addToComments(comment)
        devfestw.addToComments(comment2)

        devfestw.save()

        Checkin greach = new Checkin(description: "greach", when: new Date() - 69, place: paris, owner: testUser)
        greach.save()
        greach.addToFriends(fabrice)
        greach.addToComments(comment)
        greach.addToComments(comment2)

        greach.save()

    }

    def destroy = {
    }
}
