'use strict';

/**
 * @ngdoc function
 * @name photoStickerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photoStickerApp
 */
angular.module('photoStickerApp')
  .controller('MainCtrl', function ($scope,$uibModal, $log) {
    $('#mainHeader').show();
    //check if browser support file reader
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }

    //at start Start Over button will be hidden
    $scope.showStartOver=false;

    //calculate local storage size in kb
    var localStorageSpace = function(){
      var allStrings = '';
      for(var key in window.localStorage){
        if(window.localStorage.hasOwnProperty(key)){
          allStrings += window.localStorage[key];
        }
      }
      return allStrings ? 3 + ((allStrings.length*16)/(8*1024*1024)) : 0;
    };


    //show warning because most browsers have limit on local storage upto 5MB
    if(Math.round(localStorageSpace())>4999){
      alert('Local Storage is exceeding 5MB limit');
    }

    $scope.stickersCache =[];
    //Get stickers from local storage and publish them to sticker-item directive
    if(typeof(Storage) !== "undefined") {
      if(localStorage.stickersCache){
        $scope.stickersCache=JSON.parse(localStorage.getItem("stickersCache"));
      }else{
        $scope.stickersCache=[];
      }
    }

    // This collection will be used to render sticker directives, preload some stickers from images folder
    var stickers = [{title:'yeoman',dataURL:'images/stickers/yeoman.png'}];

    //abandon above array approach because i need dataURL in svg to export image, loading direct url was causing problem
    getImageFromFiles('images/stickers/well-done.png','well done');
    getImageFromFiles('images/stickers/yeoman.png','yeoman');
    //this function code i got  from stackoverflow , did modification according to my needs
    function getImageFromFiles(url,title) {
      var img=new Image();
      img.src=url;
      img.onload=function(){
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");

        $scope.stickersCache.push({dataURL: dataURL,title:title});
        if(!$scope.$$phase)
          $scope.$apply();
      };

    }



    //open form to fill new sticker attributes
    $scope.open = function () {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/directives/modal-view.html',
        controller: 'modalCtrl',
        resolve: {
          file:$scope.file
        }
      });

      //push newly added to local storage and sticker-item directive
      modalInstance.result.then(function (file) {
        $scope.file = file;
        file.id=$scope.stickersCache.length+1+file.title;
        $scope.stickersCache.push(file);
        if(localStorage.stickersCache)
          var localStickers=angular.fromJson(localStorage.stickersCache);
        else
          localStickers=[];
        localStickers.push(file);
        localStorage.setItem("stickersCache",JSON.stringify(localStickers));
      }, function () {
      });
    };

  })
  .controller('HeaderController',function($scope, $location) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  });
