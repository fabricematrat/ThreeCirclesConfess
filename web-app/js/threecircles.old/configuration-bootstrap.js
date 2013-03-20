var threecircles = threecircles || {};

threecircles.loadConfiguration = (function () {
    threecircles.configuration = {
        baseURL: "http://localhost:8080/ThreeCirclesConfess/",
        //Uncomment before pushing to cloudfoundry
        //baseURL: "http://ThreeCirclesConfess.cloudfoundry.com/",
        namespace: "threecircles",
        domain:[]
    };
})();

