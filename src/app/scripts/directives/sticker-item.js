/**
 * Created by mshahzad on 06/11/2015.
 */
angular.module('photoStickerApp')
  .directive('stickerItem', function($document) {
    return {
      templateUrl: 'views/directives/sticker-item.html',
      restrict: 'E',
      scope: false,
      link: function(scope, element, attr) {
        scope.removeSticker=function(sticker){
          //remove from it from template array
          var index=scope.stickersCache.indexOf(sticker);
          if(index>-1)
          scope.stickersCache.splice(index, 1);

          //remove it from local storage
          var localCache=angular.fromJson(localStorage.stickersCache);
          var ind=localCache.indexOf(sticker);
          localCache.splice(ind,1);
          localStorage.stickersCache=angular.toJson(localCache);
        }
      }
    };
  });
