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
                controller: 'MainCtrl',
                resolve: {
                    platPromise: ['plats', function(plats){
                        return plats.getAll();
                    }]
                }
            })
            .state('plats',{
                url:'/plats/{id}',
                templateUrl: '/plats.html',
                controller: 'PlatCtrl',
                resolve: {
                    plat: ['$stateParams', 'plats', function($stateParams, plats) {
                        return plats.get($stateParams.id);
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

