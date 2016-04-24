/**
 * Created by rumeili on 16/3/15.
 */
var app= angular.module('SPCserver',['ui.router','SPCserver.controllers']);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider,$urlRouterProvider)
    {
        $stateProvider.state('home',{
                url:'/home',
                templateUrl: '/home.html',
                controller: 'HomeCtrl',
                resolve: {
                    precmdPromise: ['precmds', function(precmds){
                        return precmds.count();
                    }]
                }
            })
            .state('plats',{
                url:'/plats',
                templateUrl: '/plats.html',
                controller: 'MainCtrl',
                resolve: {
                    platPromise: ['plats', function(plats){
                        return plats.getAll();
                    }]
                }
            })
            .state('plat',{
                url:'/plats/{id}',
                templateUrl: '/plat.html',
                controller: 'PlatCtrl',
                resolve: {
                    plat: ['$stateParams', 'plats', function($stateParams, plats) {
                        return plats.get($stateParams.id);
                    }]
                }
            })
            .state('precmds',{
                url:'/precmds',
                templateUrl: '/precmds.html',
                controller: 'PrecmdCtrl',
                resolve: {
                    platPromise: ['precmds', function(precmds){
                        return precmds.getAll();
                    }]
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            });

        $urlRouterProvider.otherwise('home');

    }]
);

