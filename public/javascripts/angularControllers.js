/**
 * Created by rumeili on 16/3/17.
 */
var app= angular.module('SPCserver.controllers',['ui.router']);

app.factory('plats',['$http','auth',
    function($http, auth)
    {
        var platFactory=
        {
            plats:[]

        };
        //retrieve plats
        platFactory.getAll = function() {
            return $http.get('/plats').success(function(data){
                angular.copy(data, platFactory.plats);
            });
        };

        //create new plats
        platFactory.create = function(plat) {
            return $http.post('/plats', plat,{headers: {
                Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                platFactory.plats.push(data);
            });
        };

        //upvoting plat
        platFactory.upvote = function(plat) {
            return $http.put('/plats/' + plat._id + '/upvote', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                plat.upvotes += 1;
            });
        };

        //get plat by id
        platFactory.get = function(id) {
            return $http.get('/plats/' + id).then(function(res){
                return res.data;
            });
        };

        //delete plat by id
        platFactory.delete = function(id) {
            return $http.delete('/plats/' + id).then(function(res){
                return res.data;
            });
        };

        //add dispo
        platFactory.addDispo = function(id, dispo) {
            return $http.post('/plats/' + id + '/dispos', dispo,
                {headers: {Authorization: 'Bearer '+auth.getToken()}});
        };

        return platFactory;

    }]);

//Create authentication factory
app.factory('auth', ['$http', '$window', function($http, $window){
        var auth = {};

        auth.saveToken = function (token){
            $window.localStorage['spc-token'] = token;
        };

        auth.getToken = function (){
            return $window.localStorage['spc-token'];
        }

        auth.isLoggedIn = function(){
            var token = auth.getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.currentUser = function(){
            if(auth.isLoggedIn()){
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.register = function(user){
            return $http.post('/register', user).success(function(data){
                auth.saveToken(data.token);
            });
        };

        auth.logIn = function(user){
            return $http.post('/login', user).success(function(data){
                auth.saveToken(data.token);
            });
        };

        auth.logOut = function(){
            $window.localStorage.removeItem('spc-token');
        };

        return auth;
    }]
);

//controller for login & register
app.controller('AuthCtrl', ['$scope', '$state','auth',
    function($scope, $state, auth){
        $scope.user = {};

        $scope.register = function(){
            auth.register($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };

        $scope.logIn = function(){
            auth.logIn($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };
    }]
);

//controller for navigation
app.controller('NavCtrl', ['$scope', 'auth',
    function($scope, auth){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;

    }]);

app.controller ('MainCtrl',['$scope','plats','auth','$stateParams',
    function($scope,plats,auth,$stateParams)
    {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.plats=plats.plats;

        $scope.addPlat = function ()
        {
            if(!$scope.title || $scope.title ===''){return;}
            plats.create({
                title: $scope.title,
                description: $scope.description,
                image: $scope.image,
                type: $scope.type
            });
            $scope.title='';
            $scope.description='';
            $scope.image='';
            $scope.type='';
        };

        $scope.incrementUpvotes=function(plat)
        {
            plats.upvote(plat);
        };

        $scope.delete = function(id){
            plats.delete(id);
        };

    }]);

//We can use $stateParams to retrieve the id from the URL and load the appropriate post.
app.controller('PlatCtrl',['$scope','plats','plat','auth',
    function($scope,plats,plat,auth)
    {
        $scope.plat=plat;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.addDispo = function(){
            if($scope.dispo === '') { return; }
            plats.addDispo(plat._id, $scope.dispo)
                .success(function(dispo) {
                    $scope.plat.dispos.push(dispo);
                });
            $scope.dispo = '';
        };
    }]
);
