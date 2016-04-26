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

        //delete dispo by id
        platFactory.deleteDispo = function(platId,dispoId) {
            return $http.delete('/plats/' + platId + '/dispos/' + dispoId).then(function(res){
                return res.data;
            });
        };

        return platFactory;

    }]);

app.factory('precmds',['$http','auth',
    function($http, auth)
    {
        var precmdFactory=
        {
            precmds:[]

        };
        //retrieve precmds
        precmdFactory.getAll = function() {
            return $http.get('/precmds').success(function(data){
                angular.copy(data, precmdFactory.precmds);
            });
        };
        
        //retrieve precmds according to user
        precmdFactory.getMy = function() {
            return $http.get('/myprecmds').success(function(data){
                angular.copy(data, precmdFactory.precmds);
            });
        };
        
        //count precmds à traiter
        precmdFactory.count = function() {
            return $http.get('/home').success(function(count){
                precmdFactory.precmdAPreparer=count.count1;
                precmdFactory.precmdARetraire=count.count2;
            });
        };

        //create new precmds
        precmdFactory.create = function(precmd) {
            return $http.post('/precmds', precmd,{headers: {
                Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                precmdFactory.precmds.push(data);
            });
        };
        
        //distribution
        precmdFactory.distribution = function() {
            return $http.get('/precmds/distribution').success(function(data){
                angular.copy(data, precmdFactory.precmds);
            });
        };

        //retraire precmd
        precmdFactory.retraire = function(precmd) {
            return $http.put('/precmds/' + precmd._id + '/retraire', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                precmd.retrait = true;
            });
        };
        //annuler
        precmdFactory.annuler = function(precmd) {
            return $http.put('/precmds/' + precmd._id + '/annuler', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                precmd.annulation = true;
            });
        };
        //preparer precmd
        precmdFactory.preparer = function(precmd) {
            return $http.put('/precmds/' + precmd._id + '/preparer', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                precmd.preparation = true;
            });
        };

        //get plat by id
        precmdFactory.get = function(id) {
            return $http.get('/precmds/' + id).then(function(res){
                return res.data;
            });
        };

        return precmdFactory;

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

        auth.isAdmin = function(){

             if(auth.isLoggedIn()){
             var token = auth.getToken();
             var payload = JSON.parse($window.atob(token.split('.')[1]));

             return payload.admin;
             }
        };

        auth.isPreparateur = function(){

            if(auth.isLoggedIn()){
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.preparateur;
            }
        };

        auth.isCaissier = function(){

            if(auth.isLoggedIn()){
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.caissier;
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
//controller du page plats
app.controller ('MainCtrl',['$scope','plats','auth',
    function($scope,plats,auth)
    {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.isAdmin = auth.isAdmin;
        //console.log($scope.isAdmin());
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
            for (var i in $scope.plats) {
                if ($scope.plats[i]._id === id) {
                    $scope.plats.splice(i, 1); // remove item from scope
                }
            }
        };

    }]);
//détails de chaque plat
//We can use $stateParams to retrieve the id from the URL and load the appropriate post.
app.controller('PlatCtrl',['$scope','plats','plat','auth',
    function($scope,plats,plat,auth)
    {
        $scope.plat=plat;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.isAdmin = auth.isAdmin;
        $scope.addDispo = function(){
            if($scope.dispo === '') { return; }
            plats.addDispo(plat._id, $scope.dispo)
                .success(function(dispo) {
                    $scope.plat.dispos.push(dispo);
                });
            $scope.dispo = '';
        };
        $scope.deleteDispo = function(id){
            plats.deleteDispo(plat._id,id);
            for (var i in $scope.plat.dispos) {
                if ($scope.plat.dispos[i]._id === id) {
                    $scope.plat.dispos.splice(i, 1); // remove item from scope
                }
            }
        };
    }]
);
//page precmd
app.controller ('PrecmdCtrl',['$scope','precmds','auth',
    function($scope,precmds,auth)
    {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.isAdmin = auth.isAdmin;
        $scope.isPreparateur = auth.isPreparateur;
        $scope.isCaissier = auth.isCaissier;
        $scope.precmds=precmds.precmds;
        $scope.currentUser=auth.currentUser();
        
        $scope.precmdE = [ ];
        $scope.precmdE.restaurant = "Sully";
        $scope.plagehoraire = [
            {id:1,label:'11:30 - 11:40'},
            {id:2,label:'11:40 - 11:50'},
            {id:3,label:'11:50 - 12:00'},
            {id:4,label:'12:00 - 12:10'},
            {id:5,label:'12:10 - 12:20'},
            {id:6,label:'12:20 - 12:30'},
            {id:7,label:'12:30 - 12:40'},
            {id:8,label:'12:40 - 12:50'},
            {id:9,label:'12:50 - 13:00'},
            {id:10,label:'13:00 - 13:10'}
          ];    
         $scope.date = function() {
            var today = new Date();
            var dd = today.getDate();
            if($scope.precmdE.jour == "Demain")
              {dd++;}
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            if(dd<10) {
                dd='0'+dd
            } 
            if(mm<10) {
                mm='0'+mm
            }
            $scope.precmdE.date = dd+'/'+mm+'/'+yyyy;
            //console.log($scope.precmdE.date);
          }
        $scope.typePlat = [
            {id:1,label:'Plat traditionnel'},
            {id:2,label:'Plat végétarien'},
            {id:3,label:'Pâte'},
            {id:4,label:'Pizza'}
          ];
          $scope.peripheriques = [
            {id:1,label:"Salade",type:"Entrée"},
            {id:2,label:"Saumon",type:"Entrée"},
            {id:3,label:"Jambon",type:"Entrée"},
            {id:4,label:"Pomme",type:"Fruit"},
            {id:5,label:"Soupe de carottes",type:"Soupe"},
            {id:6,label:"Eclair",type:"Dessert"},
          ];
          $scope.boissons = [
            {id:1,label:'Non'},
            {id:2,label:'Coca'},
            {id:3,label:'Cristal'}
          ];
          $scope.precmdE.horaire = $scope.plagehoraire[0];
        $scope.precmdE.typePlat = $scope.typePlat[0];
        $scope.precmdE.peri1 = $scope.peripheriques[1];
        $scope.precmdE.peri2 = $scope.peripheriques[1];
        $scope.precmdE.peri3 = $scope.peripheriques[0];
        $scope.precmdE.peri4 = $scope.peripheriques[0];
        $scope.precmdE.boisson = $scope.boissons[0];
       
        $scope.addPrecmd = function(){
            //if(!$scope.date || $scope.date ===''){return;}
            //console.log($scope.precmdE);
            precmds.create({
                date: $scope.precmdE.date,
                restaurant:$scope.precmdE.restaurant,
                horaire: $scope.precmdE.horaire.id,
                typePlat: $scope.precmdE.typePlat.label,
                peri1: $scope.precmdE.peri1.label,
                peri2: $scope.precmdE.peri2.label,
                peri3: $scope.precmdE.peri3.label,
                peri4: $scope.precmdE.peri4.label,
                boisson: $scope.precmdE.boisson.label
            });
            
        };
        $scope.retraire=function(precmd)
        {
            precmds.retraire(precmd);
        };
        $scope.preparer=function(precmd)
        {
            precmds.preparer(precmd);
        };
        $scope.annuler=function(precmd)
        {
            precmds.annuler(precmd);
        };
        $scope.distribution=function()
        {
            precmds.distribution();
        };

    }]);
//page accueil
app.controller ('HomeCtrl',['$scope','precmds','auth',
    function($scope,precmds,auth)
    {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.precmds=precmds.precmds;
        $scope.precmdARetraire = precmds.precmdARetraire;
        $scope.precmdAPreparer = precmds.precmdAPreparer;
        
        console.log($scope.precmdAPreparer,$scope.precmdARetraire);

        $scope.complete=function(precmd)
        {
            precmds.complete(precmd);
        };

        $scope.delete = function(id){
            precmds.delete(id);
        };

    }]);