'use strict';

/**
 * @ngdoc overview
 * @name photoStickerApp
 * @description
 * # photoStickerApp
 *
 * Main module of the application.
 */


//some of the code help i got from following links
//https://gist.github.com/gustavohenke/9073132*/
//http://www.html5rocks.com/en/tutorials/file/dndfiles/

angular.module('photoStickerApp', [
  'ngAnimate',
  'ngResource',
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/resume.html',
      controller: 'ResumeCtrl'
    })
      .when('/home', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).
      when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      }).
      when('/resume', {
        templateUrl: 'views/resume.html',
        controller: 'ResumeCtrl'
      }).
      when('/work', {
        templateUrl: 'views/work-samples.html',
        controller: 'WorkCtrl'
      }).
    when('/photosticker', {
        templateUrl: 'views/photo-sticker.html',
        controller: 'PhotoStickCtrl'
      }).
      when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      }).otherwise({
        redirectTo: '/resume'
      });
  });
