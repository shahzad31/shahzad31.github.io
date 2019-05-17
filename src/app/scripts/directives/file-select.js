/**
 * Created by mshahzad on 06/11/2015.
 */
angular.module('photoStickerApp')
  .directive('ngFileSelect', function() {
    return {
      link: function($scope,el){
        el.bind("change", function(e){
          $scope.imageFile=(e.srcElement || e.target).files[0];
          $scope.file.src = $scope.imageFile.name;
          $scope.$apply();
          $scope.getFile($scope.imageFile);
        });
      }
    };
  });
