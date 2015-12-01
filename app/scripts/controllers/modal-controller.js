/**
 * Created by mshahzad on 07/11/2015.
 */

//modal controller to display add new sticker form
angular.module('photoStickerApp').controller('modalCtrl', function ($scope, $uibModalInstance) {
  $scope.file={};

  //hook for submit button
  $scope.submit = function () {
    if($scope.file.title && $scope.file.src)
      $uibModalInstance.close($scope.file);
  };

  //hook for cancel button
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  //fetch file using file reader
  $scope.getFile=function(file){
    if (file.type.match('image.*')) {
      var reader = new FileReader();
      reader.onload = (function (theFile) {
        return function (e) {
          $scope.file.dataURL=e.target.result;
        };
      })(file);
      reader.readAsDataURL(file);
    }
  };
});
