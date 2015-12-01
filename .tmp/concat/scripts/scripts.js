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
  .config(["$routeProvider", function ($routeProvider) {
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
        templateUrl: 'views/work.html',
        controller: 'WorkCtrl'
      }).
      when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      }).otherwise({
        redirectTo: '/resume'
      });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name photoStickerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photoStickerApp
 */
angular.module('photoStickerApp')
  .controller('MainCtrl', ["$scope", "$uibModal", "$log", function ($scope,$uibModal, $log) {
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

  }])
  .controller('HeaderController',["$scope", "$location", function($scope, $location) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name photoStickerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoStickerApp
 */
angular.module('photoStickerApp')
  .controller('AboutCtrl', ["$scope", function ($scope) {
    $('#mainHeader').show();
  }]);

/**
 * Created by mshahzad on 09/11/2015.
 */
'use strict';

/**
 * @ngdoc function
 * @name photoStickerApp.controller:AboutCtrl
 * @description
 * # ContactCtrl
 * Controller of the photoStickerApp
 */
angular.module('photoStickerApp')
  .controller('ContactCtrl', ["$scope", function ($scope) {
    $('#mainHeader').show();
  }]);

/**
 * Created by mshahzad on 07/11/2015.
 */

//modal controller to display add new sticker form
angular.module('photoStickerApp').controller('modalCtrl', ["$scope", "$uibModalInstance", function ($scope, $uibModalInstance) {
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
}]);

/**
 * Created by mshahzad on 23/11/2015.
 */
angular.module('photoStickerApp').controller('ResumeCtrl',  function () {
$('#mainHeader').hide();
} );

/**
 * Created by mshahzad on 25/11/2015.
 */
angular.module('photoStickerApp')
  .controller('WorkCtrl', ["$scope", "$uibModal", "$log", function ($scope,$uibModal, $log) {
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

  }]);

/*! svg.draggable.js - v2.1.3 - 2015-09-27
* https://github.com/wout/svg.draggable.js
* Copyright (c) 2015 Wout Fierens; Licensed MIT */
;(function() {

  // creates handler, saves it
  function DragHandler(el){
    el.remember('_draggable', this)
    this.el = el
  }


  // Sets new parameter, starts dragging
  DragHandler.prototype.init = function(constraint, val){
    var _this = this
    this.constraint = constraint
    this.value = val
    this.el.on('mousedown.drag', function(e){ _this.start(e) })
    this.el.on('touchstart.drag', function(e){ _this.start(e) })
  }

  // transforms one point from screen to user coords
  DragHandler.prototype.transformPoint = function(event, offset){
      event = event || window.event
      var touches = event.changedTouches && event.changedTouches[0] || event
      this.p.x = touches.pageX - (offset || 0)
      this.p.y = touches.pageY
      return this.p.matrixTransform(this.m)
  }
  
  // gets elements bounding box with special handling of groups, nested and use
  DragHandler.prototype.getBBox = function(){

    var box = this.el.bbox()

    if(this.el instanceof SVG.Nested) box = this.el.rbox()
    
    if (this.el instanceof SVG.G || this.el instanceof SVG.Use || this.el instanceof SVG.Nested) {
      box.x = this.el.x()
      box.y = this.el.y()
    }

    return box
  }

  // start dragging
  DragHandler.prototype.start = function(e){

    // check for left button
    if(e.type == 'click'|| e.type == 'mousedown' || e.type == 'mousemove'){
      if((e.which || e.buttons) != 1){
          return
      }
    }
  
    var _this = this

    // fire beforedrag event
    this.el.fire('beforedrag', { event: e, handler: this })

    // search for parent on the fly to make sure we can call
    // draggable() even when element is not in the dom currently
    this.parent = this.parent || this.el.parent(SVG.Nested) || this.el.parent(SVG.Doc)
    this.p = this.parent.node.createSVGPoint()

    // save current transformation matrix
    this.m = this.el.node.getScreenCTM().inverse()

    var box = this.getBBox()
    
    var anchorOffset;
    
    // fix text-anchor in text-element (#37)
    if(this.el instanceof SVG.Text){
      anchorOffset = this.el.node.getComputedTextLength();
        
      switch(this.el.attr('text-anchor')){
        case 'middle':
          anchorOffset /= 2;
          break
        case 'start':
          anchorOffset = 0;
          break;
      }
    }
    
    this.startPoints = {
      // We take absolute coordinates since we are just using a delta here
      point: this.transformPoint(e, anchorOffset),
      box:   box
    }
    
    // add drag and end events to window
    SVG.on(window, 'mousemove.drag', function(e){ _this.drag(e) })
    SVG.on(window, 'touchmove.drag', function(e){ _this.drag(e) })
    SVG.on(window, 'mouseup.drag', function(e){ _this.end(e) })
    SVG.on(window, 'touchend.drag', function(e){ _this.end(e) })

    // fire dragstart event
    this.el.fire('dragstart', {event: e, p: this.p, m: this.m, handler: this})

    // prevent browser drag behavior
    e.preventDefault()

    // prevent propagation to a parent that might also have dragging enabled
    e.stopPropagation();
  }

  // while dragging
  DragHandler.prototype.drag = function(e){

    var box = this.getBBox()
      , p   = this.transformPoint(e)
      , x   = this.startPoints.box.x + p.x - this.startPoints.point.x
      , y   = this.startPoints.box.y + p.y - this.startPoints.point.y
      , c   = this.constraint

    this.el.fire('dragmove', { event: e, p: this.p, m: this.m, handler: this })

    // move the element to its new position, if possible by constraint
    if (typeof c == 'function') {

      var coord = c.call(this.el, x, y, this.m)

      // bool, just show us if movement is allowed or not
      if (typeof coord == 'boolean') {
        coord = {
          x: coord,
          y: coord
        }
      }

      // if true, we just move. If !false its a number and we move it there
      if (coord.x === true) {
        this.el.x(x)
      } else if (coord.x !== false) {
        this.el.x(coord.x)
      }

      if (coord.y === true) {
        this.el.y(y)
      } else if (coord.y !== false) {
        this.el.y(coord.y)
      }

    } else if (typeof c == 'object') {

      // keep element within constrained box
      if (c.minX != null && x < c.minX)
        x = c.minX
      else if (c.maxX != null && x > c.maxX - box.width){
        x = c.maxX - box.width
      }if (c.minY != null && y < c.minY)
        y = c.minY
      else if (c.maxY != null && y > c.maxY - box.height)
        y = c.maxY - box.height

      this.el.move(x, y)
    }
  }

  DragHandler.prototype.end = function(e){

    // final drag
    this.drag(e);

    // fire dragend event
    this.el.fire('dragend', { event: e, p: this.p, m: this.m, handler: this })

    // unbind events
    SVG.off(window, 'mousemove.drag')
    SVG.off(window, 'touchmove.drag')
    SVG.off(window, 'mouseup.drag')
    SVG.off(window, 'touchend.drag')

  }

  SVG.extend(SVG.Element, {
    // Make element draggable
    // Constraint might be an object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or an object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    draggable: function(value, constraint) {

      // Check the parameters and reassign if needed
      if (typeof value == 'function' || typeof value == 'object') {
        constraint = value
        value = true
      }

      var dragHandler = this.remember('_draggable') || new DragHandler(this)

      // When no parameter is given, value is true
      value = typeof value === 'undefined' ? true : value

      if(value) dragHandler.init(constraint || {}, value)
      else {
        this.off('mousedown.drag')
        this.off('touchstart.drag')
      }

      return this
    }

  })

}).call(this);
/**
 * Created by mshahzad on 05/11/2015.
 */
'use strict';

//directive for photo area , to handle svg operations , photo  selection etc
angular.module('photoStickerApp')
  .directive('imageSvg',  function() {
    return {
      link: function(scope, element, attr) {
        var svgContainer = element.find("svg")[0];
        var draw=SVG('mainSvg'),mainImage,imagesList=[];
        scope.clearSvg=true;
        //draw hint for drag and drop photo
        var text = draw.text('Drop photo here').move($(draw.node).width()/2, $(draw.node).height()/2);
        text.font({
          size: 20,
          anchor: 'middle',
          leading: 1
        });
        function drawStickerOnSvg(img){
          if(scope.clearSvg){
            draw.clear();
            scope.clearSvg=false;
          }
          var image = draw.image(img.dataURL,img.width,img.height).x(img.posX).y(img.posY);
          image.draggable();
          imagesList.push(image);
          if(img.selected){
            image.select().resize();
            image.selected=true;
          }
          image.click(function(){
            imagesList.forEach(function(item,index){
              item.resize('stop');
              item.select(false);
              item.selected=false;
            });
            image.select().resize();
            image.selected=true;
          });
        }

        //function to draw main photo , on which use will be able to place stickers
        function drawMainImage(dataURL){
          draw.clear();
          scope.clearSvg=false;
          mainImage = draw.image(dataURL);

          mainImage.click(function () {
            imagesList.forEach(function (item, index) {
              item.resize('stop');
              item.select(false);
            });
          });
          mainImage.size("100%", "100%");

          //show startover button using ng-show defined in main.html
          scope.showStartOver=true;
          if(!scope.$$phase)
            scope.$apply();
        }

        //restore app state from local storage
        if(localStorage.getItem('dataToPersist')){
          var svgData=angular.fromJson(localStorage.getItem('dataToPersist'));
          svgData.mainImageDataURL && drawMainImage(svgData.mainImageDataURL);
          if(svgData.stickersList){
            svgData.stickersList.forEach(function(img,index){
              drawStickerOnSvg(img);
            });
          }
        }

        var svg = element.find("svg")[0],
          fileBtn = element.find("#fileBtn");

        //make svg div doppable for stickers using juqery
        $(svg).droppable({
          drop: function (event, ui) {
            var img = ui.draggable[0];
            img.posX= ui.offset.left - $(this).offset().left;
            img.posY= ui.offset.top - $(this).offset().top;
            img.dataURL=img.src;
            drawStickerOnSvg(img);
          }
        });

        //add events to drag and drop main photo
        svg.addEventListener('dragover', handleDragOver, false);
        svg.addEventListener('drop', handleImageSelectOrDrop, false);
        fileBtn.on('change', handleImageSelectOrDrop);

        function handleImageSelectOrDrop(evt) {
          evt.stopPropagation();
          evt.preventDefault();
          var files = evt.target.files || evt.dataTransfer.files;
          for (var i = 0, f; f = files[i]; i++) {
            if (!f.type.match('image.*')) {
              continue;
            }
            var reader = new FileReader();
            if (mainImage) {
              mainImage.remove();
            }
            reader.onload = (function (theFile) {
              return function (e) {
                imagesList=[];
                e.target.result && drawMainImage(e.target.result);
              };
            })(f);
            reader.readAsDataURL(f);
          }
        }
        function handleDragOver(evt) {
          evt.stopPropagation();
          evt.preventDefault();
          evt.dataTransfer.dropEffect = 'drop Image'; // Explicitly show this is a copy.
        }


        //start over function to reset state of image/stickers
        scope.startOver= function () {
          localStorage.removeItem('dataToPersist');
          imagesList=[];
          mainImage=null;
          draw.clear();
          var text = draw.text('Drop photo here').move($(svg.node).width()/2, $(svg.node).height()/2);
          text.font({
            size: 20,
            anchor: 'middle',
            leading: 1
          });
          scope.clearSvg=true;
        };

        //export as svg
        scope.exportSvg= function () {
          imagesList.forEach(function (item, index) {
            item.resize('stop');
            item.select(false);
          });
          var svg = document.querySelector( "svg" );
          svg.setAttribute('width',$(svg).width());
          svg.setAttribute('height',$(svg).height());
          var svgData = new XMLSerializer().serializeToString( svg );
          var a = $("<a>")
            .attr("href", "data:image/svg+xml;base64," + btoa( svgData ))
            .attr("download", "file.svg")
            .appendTo("body");
          a[0].click();

          a.remove();
        };

        //export as png image
        scope.exportImage= function () {
          imagesList.forEach(function (item, index) {
            item.resize('stop');
            item.select(false);
          });
          var svg = document.querySelector( "svg" );
          svg.setAttribute('width',$(svg).width());
          svg.setAttribute('height',$(svg).height());
          var svgData = new XMLSerializer().serializeToString( svg );

          var canvas = document.createElement( "canvas" );
          var ctx = canvas.getContext( "2d" );
          canvas.width=svg.width.animVal.value;
          canvas.height=svg.height.animVal.value;

          var img = document.createElement( "img" );
          img.setAttribute( "src", "data:image/svg+xml;base64," + btoa( svgData ) );
          img.width=canvas.width;
          img.height=canvas.height;
          img.onload = function() {
            ctx.drawImage( img, 0, 0,img.width,img.height );

            // Now is done
            var dataURL= canvas.toDataURL( "image/png" );
            var a = $("<a>")
              .attr("href", dataURL)
              .attr("download", "img.png")
              .appendTo("body");

            a[0].click();

            a.remove();
          };
        };


        //save application state in local storage of browser
        window.addEventListener('beforeunload', function() {
          //this is the data object that will be used once user leave application persist it's stat
          // once user come back for application
          var dataToPersist={};
          if(mainImage)
          {
            dataToPersist.mainImageDataURL=mainImage.src;
          }
          var stickersList=[];
          imagesList.forEach(function(item,index){
            stickersList.push({
              dataURL: item.src,
              selected: item.selected || false,
              posX: item.x(),
              posY: item.y()
            });
          });
          dataToPersist.stickersList=stickersList;
          localStorage.setItem("dataToPersist",angular.toJson(dataToPersist));
        });
      }
    };
  });

/**
 * Created by mshahzad on 06/11/2015.
 */
angular.module('photoStickerApp')
  .directive('draggableImg', ["$document", function($document) {
    return {
      link: function(scope, element, attr) {
        var startX = 0, startY = 0, x = 0, y = 0;

        //to make  item draggable
        element.draggable({
          revert: true,
          refreshPositions: true,
          revertDuration:0,
          helper: 'clone',
          appendTo: 'body',
          containment: 'window',
          scroll: false,
          drag: function (event, ui) {
            ui.helper.addClass("draggable");
          },
          stop: function (event, ui) {
           // ui.helper.removeClass("draggable");
          }
        });
      }
    };
  }]);

// svg.export.js 0.1.1 - Copyright (c) 2014 Wout Fierens - Licensed under the MIT license

;(function() {

  // Add export method to SVG.Element 
  SVG.extend(SVG.Element, {
    // Build node string
    exportSvg: function(options, level) {
      var i, il, width, height, well, clone
        , name = this.node.nodeName
        , node = ''
      
      /* ensure options */
      options = options || {}
      
      if (options.exclude == null || !options.exclude.call(this)) {
        /* ensure defaults */
        options = options || {}
        level = level || 0
        
        /* set context */
        if (this instanceof SVG.Doc) {
          /* define doctype */
          node += whitespaced('<?xml version="1.0" encoding="UTF-8"?>', options.whitespace, level)
          
          /* store current width and height */
          width  = this.attr('width')
          height = this.attr('height')
          
          /* set required size */
          if (options.width)
            this.attr('width', options.width)
          if (options.height)
            this.attr('height', options.height)
        }
          
        /* open node */
        node += whitespaced('<' + name + this.attrToString() + '>', options.whitespace, level)
        
        /* reset size and add description */
        if (this instanceof SVG.Doc) {
          this.attr({
            width:  width
          , height: height
          })
          
          node += whitespaced('<desc>Created with svg.js [http://svgjs.com]</desc>', options.whitespace, level + 1)
          /* Add defs... */
					node += this.defs().exportSvg(options, level + 1);
        }
        
        /* add children */
        if (this instanceof SVG.Parent) {
          for (i = 0, il = this.children().length; i < il; i++) {
            if (SVG.Absorbee && this.children()[i] instanceof SVG.Absorbee) {
              clone = this.children()[i].node.cloneNode(true)
              well  = document.createElement('div')
              well.appendChild(clone)
              node += well.innerHTML
            } else {
              node += this.children()[i].exportSvg(options, level + 1)
            }
          }

        } else if (this instanceof SVG.Text || this instanceof SVG.TSpan) {
          for (i = 0, il = this.node.childNodes.length; i < il; i++)
            if (this.node.childNodes[i].instance instanceof SVG.TSpan)
              node += this.node.childNodes[i].instance.exportSvg(options, level + 1)
            else
              node += this.node.childNodes[i].nodeValue.replace(/&/g,'&amp;')

        } else if (SVG.ComponentTransferEffect && this instanceof SVG.ComponentTransferEffect) {
          this.rgb.each(function() {
            node += this.exportSvg(options, level + 1)
          })

        }
        
        /* close node */
        node += whitespaced('</' + name + '>', options.whitespace, level)
      }
      
      return node
    }
    // Set specific export attibutes
  , exportAttr: function(attr) {
      /* acts as getter */
      if (arguments.length == 0)
        return this.data('svg-export-attr')
      
      /* acts as setter */
      return this.data('svg-export-attr', attr)
    }
    // Convert attributes to string
  , attrToString: function() {
      var i, key, value
        , attr = []
        , data = this.exportAttr()
        , exportAttrs = this.attr()
      
      /* ensure data */
      if (typeof data == 'object')
        for (key in data)
          if (key != 'data-svg-export-attr')
            exportAttrs[key] = data[key]
      
      /* build list */
      for (key in exportAttrs) {
        value = exportAttrs[key]
        
        /* enfoce explicit xlink namespace */
        if (key == 'xlink') {
          key = 'xmlns:xlink'
        } else if (key == 'href') {
          if (!exportAttrs['xlink:href'])
            key = 'xlink:href'
        }

        /* normailse value */
        if (typeof value === 'string')
          value = value.replace(/"/g,"'")
        
        /* build value */
        if (key != 'data-svg-export-attr' && key != 'href') {
          if (key != 'stroke' || parseFloat(exportAttrs['stroke-width']) > 0)
            attr.push(key + '="' + value + '"')
        }
        
      }

      return attr.length ? ' ' + attr.join(' ') : ''
    }
    
  })
  
  /////////////
  // helpers
  /////////////

  // Whitespaced string
  function whitespaced(value, add, level) {
    if (add) {
      var whitespace = ''
        , space = add === true ? '  ' : add || ''
      
      /* build indentation */
      for (i = level - 1; i >= 0; i--)
        whitespace += space
      
      /* add whitespace */
      value = whitespace + value + '\n'
    }
    
    return value;
  }

}).call(this);

/*! svg.select.js - v1.0.5 - 2015-06-26
* https://github.com/Fuzzyma/svg.select.js
* Copyright (c) 2015 Ulrich-Matthias Schäfer; Licensed MIT */
/*jshint -W083*/
;(function (undefined) {

    function SelectHandler(el) {

        this.el = el;
        this.parent = el.parent(SVG.Nested) || el.parent(SVG.Doc);
        el.remember('_selectHandler', this);
        this.pointSelection = {isSelected: false};
        this.rectSelection = {isSelected: false};

    }

    SelectHandler.prototype.init = function (value, options) {

        var bbox = this.el.bbox();
        this.options = {};

        // Merging the defaults and the options-object together
        for (var i in this.el.select.defaults) {
            this.options[i] = this.el.select.defaults[i];
            if (options[i] !== undefined) {
                this.options[i] = options[i];
            }
        }

        this.nested = (this.nested || this.parent.nested()).size(bbox.width || 1, bbox.height || 1).transform(this.el.ctm()).move(bbox.x, bbox.y);

        // When deepSelect is enabled and the element is a line/polyline/polygon, draw only points for moving
        if (this.options.deepSelect && ['line', 'polyline', 'polygon'].indexOf(this.el.type) !== -1) {
            this.selectPoints(value);
        } else {
            this.selectRect(value);
        }

        this.observe();
        this.cleanup();

    };

    SelectHandler.prototype.selectPoints = function (value) {

        this.pointSelection.isSelected = value;

        // When set is already there we dont have to create one
        if (this.pointSelection.set) {
            return this;
        }

        // Create our set of elements
        this.pointSelection.set = this.parent.set();
        // draw the circles and mark the element as selected
        this.drawCircles();

        return this;

    };

    // create the point-array which contains the 2 points of a line or simply the points-array of polyline/polygon
    SelectHandler.prototype.getPointArray = function () {
        var bbox = this.el.bbox();

        return this.el.array().valueOf().map(function (el) {
            return [el[0] - bbox.x, el[1] - bbox.y];
        });
    };

    // The function to draw the circles
    SelectHandler.prototype.drawCircles = function () {

        var _this = this, array = this.getPointArray();

        // go through the array of points
        for (var i = 0, len = array.length; i < len; ++i) {

            // add every point to the set
            this.pointSelection.set.add(

                // a circle with our css-classes and a mousedown-event which fires our event for moving points
                this.nested.circle(this.options.radius)
                    .center(array[i][0], array[i][1])
                    .addClass(this.options.classPoints)
                    .addClass(this.options.classPoints + '_point')
                    .mousedown(
                        (function (k) {
                            return function (ev) {
                                ev = ev || window.event;
                                ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                                _this.el.fire('point', {x: ev.pageX, y: ev.pageY, i: k, event: ev});
                            };
                        })(i)
                    )
            );
        }

    };

    // every time a circle is moved, we have to update the positions of our circle
    SelectHandler.prototype.updatePointSelection = function () {
        var array = this.getPointArray();

        this.pointSelection.set.each(function (i) {
            if (this.cx() === array[i][0] && this.cy() === array[i][1]) {
                return;
            }
            this.center(array[i][0], array[i][1]);
        });
    };

    SelectHandler.prototype.updateRectSelection = function () {
        var bbox = this.el.bbox();

        this.rectSelection.set.get(0).attr({
            width: bbox.width,
            height: bbox.height
        });

        // set.get(1) is always in the upper left corner. no need to move it
        if (this.options.points) {
            this.rectSelection.set.get(2).center(bbox.width, 0);
            this.rectSelection.set.get(3).center(bbox.width, bbox.height);
            this.rectSelection.set.get(4).center(0, bbox.height);

            this.rectSelection.set.get(5).center(bbox.width / 2, 0);
            this.rectSelection.set.get(6).center(bbox.width, bbox.height / 2);
            this.rectSelection.set.get(7).center(bbox.width / 2, bbox.height);
            this.rectSelection.set.get(8).center(0, bbox.height / 2);
        }

        if (this.options.rotationPoint) {
            this.rectSelection.set.get(9).center(bbox.width / 2, 20);
        }
    };

    SelectHandler.prototype.selectRect = function (value) {

        var _this = this, bbox = this.el.bbox();

        this.rectSelection.isSelected = value;

        // when set is already p
        this.rectSelection.set = this.rectSelection.set || this.parent.set();

        // helperFunction to create a mouse-down function which triggers the event specified in `eventName`
        function getMoseDownFunc(eventName) {
            return function (ev) {
                ev = ev || window.event;
                ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                _this.el.fire(eventName, {x: ev.pageX, y: ev.pageY, event: ev});
            };
        }

        // create the selection-rectangle and add the css-class
        if (!this.rectSelection.set.get(0)) {
            this.rectSelection.set.add(this.nested.rect(bbox.width, bbox.height).addClass(this.options.classRect));
        }

        // Draw Points at the edges, if enabled
        if (this.options.points && !this.rectSelection.set.get(1)) {
            this.rectSelection.set.add(this.nested.circle(this.options.radius).center(0, 0).attr('class', this.options.classPoints + '_lt').mousedown(getMoseDownFunc('lt')));
            this.rectSelection.set.add(this.nested.circle(this.options.radius).center(bbox.width, 0).attr('class', this.options.classPoints + '_rt').mousedown(getMoseDownFunc('rt')));
            this.rectSelection.set.add(this.nested.circle(this.options.radius).center(bbox.width, bbox.height).attr('class', this.options.classPoints + '_rb').mousedown(getMoseDownFunc('rb')));
            this.rectSelection.set.add(this.nested.circle(this.options.radius).center(0, bbox.height).attr('class', this.options.classPoints + '_lb').mousedown(getMoseDownFunc('lb')));

            this.rectSelection.set.add(this.nested.circle(this.options.radius).center(bbox.width / 2, 0).attr('class', this.options.classPoints + '_t').mousedown(getMoseDownFunc('t')));
            this.rectSelection.set.add(this.nested.circle(this.options.radius).center(bbox.width, bbox.height / 2).attr('class', this.options.classPoints + '_r').mousedown(getMoseDownFunc('r')));
            this.rectSelection.set.add(this.nested.circle(this.options.radius).center(bbox.width / 2, bbox.height).attr('class', this.options.classPoints + '_b').mousedown(getMoseDownFunc('b')));
            this.rectSelection.set.add(this.nested.circle(this.options.radius).center(0, bbox.height / 2).attr('class', this.options.classPoints + '_l').mousedown(getMoseDownFunc('l')));

            this.rectSelection.set.each(function () {
                this.addClass(_this.options.classPoints);
            });
        }

        // draw rotationPint, if enabled
        if (this.options.rotationPoint && !this.rectSelection.set.get(9)) {

            this.rectSelection.set.add(this.nested.circle(this.options.radius).center(bbox.width / 2, 20).attr('class', this.options.classPoints + '_rot')
                .mousedown(function (ev) {
                    ev = ev || window.event;
                    ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                    _this.el.fire('rot', {x: ev.pageX, y: ev.pageY, event: ev});
                }));

        }

    };

    SelectHandler.prototype.handler = function () {

        var bbox = this.el.bbox();
        this.nested.size(bbox.width || 1, bbox.height || 1).transform(this.el.ctm()).move(bbox.x, bbox.y);

        if (this.rectSelection.isSelected) {
            this.updateRectSelection();
        }

        if (this.pointSelection.isSelected) {
            this.updatePointSelection();
        }

    };

    SelectHandler.prototype.observe = function () {
        var _this = this;

        if (MutationObserver) {
            if (this.rectSelection.isSelected || this.pointSelection.isSelected) {
                this.observerInst = this.observerInst || new MutationObserver(function () {
                    _this.handler();
                });
                this.observerInst.observe(this.el.node, {attributes: true});
            } else {
                try {
                    this.observerInst.disconnect();
                    delete this.observerInst;
                } catch (e) {
                }
            }
        } else {
            this.el.off('DOMAttrModified.select');

            if (this.rectSelection.isSelected || this.pointSelection.isSelected) {
                this.el.on('DOMAttrModified.select', function () {
                    _this.handler();
                });
            }
        }
    };

    SelectHandler.prototype.cleanup = function () {

        //var _this = this;

        if (!this.rectSelection.isSelected && this.rectSelection.set) {
            // stop watching the element, remove the selection
            this.rectSelection.set.each(function () {
                this.remove();
            });

            this.rectSelection.set.clear();
            delete this.rectSelection.set;
        }

        if (!this.pointSelection.isSelected && this.pointSelection.set) {
            // Remove all points, clear the set, stop watching the element
            this.pointSelection.set.each(function () {
                this.remove();
            });

            this.pointSelection.set.clear();
            delete this.pointSelection.set;
        }

        if (!this.pointSelection.isSelected && !this.rectSelection.isSelected) {
            this.nested.remove();
            delete this.nested;

            /*try{
             this.observerInst.disconnect();
             delete this.observerInst;
             }catch(e){}

             this.el.off('DOMAttrModified.select');

             }else{

             if(MutationObserver){
             this.observerInst = this.observerInst || new MutationObserver(function(){ _this.handler(); });
             this.observerInst.observe(this.el.node, {attributes: true});
             }else{
             this.el.on('DOMAttrModified.select', function(){ _this.handler(); } )
             }
             */
        }
    };


    SVG.extend(SVG.Element, {
        // Select element with mouse
        select: function (value, options) {

            // Check the parameters and reassign if needed
            if (typeof value === 'object') {
                options = value;
                value = true;
            }

            var selectHandler = this.remember('_selectHandler') || new SelectHandler(this);

            selectHandler.init(value === undefined ? true : value, options || {});

            return this;

        }
    });

    SVG.Element.prototype.select.defaults = {
        points: true,                            // If true, points at the edges are drawn. Needed for resize!
        classRect: 'svg_select_boundingRect',    // Css-class added to the rect
        classPoints: 'svg_select_points',        // Css-class added to the points
        radius: 7,                               // radius of the points
        rotationPoint: true,                     // If true, rotation point is drawn. Needed for rotation!
        deepSelect: false                        // If true, moving of single points is possible (only line, polyline, polyon)
    };

}).call(this);
/*! svg.resize.js - v1.1.0 - 2015-06-22
* https://github.com/Fuzzyma/svg.resize.js
* Copyright (c) 2015 Ulrich-Matthias Schäfer; Licensed MIT */
;(function () {

    function ResizeHandler(el) {

        el.remember('_resizeHandler', this);

        this.el = el;
        this.parameters = {};
        this.lastUpdateCall = null;
        this.p = el.doc().node.createSVGPoint();
    }

    ResizeHandler.prototype.transformPoint = function(x, y, m){

        this.p.x = x - (this.offset.x - window.pageXOffset);
        this.p.y = y - (this.offset.y - window.pageYOffset);

        return this.p.matrixTransform(m || this.m);

    };

    ResizeHandler.prototype.init = function (options) {

        var _this = this;

        this.stop();

        if (options === 'stop') {
            return;
        }

        this.options = {};

        // Merge options and defaults
        for (var i in this.el.resize.defaults) {
            this.options[i] = this.el.resize.defaults[i];
            if (typeof options[i] !== 'undefined') {
                this.options[i] = options[i];
            }
        }

        // We listen to all these events which are specifying different edges
        this.el.on('lt.resize', function(e){ _this.resize(e || window.event); });  // Left-Top
        this.el.on('rt.resize', function(e){ _this.resize(e || window.event); });  // Right-Top
        this.el.on('rb.resize', function(e){ _this.resize(e || window.event); });  // Right-Bottom
        this.el.on('lb.resize', function(e){ _this.resize(e || window.event); });  // Left-Bottom

        this.el.on('t.resize', function(e){ _this.resize(e || window.event); });   // Top
        this.el.on('r.resize', function(e){ _this.resize(e || window.event); });   // Right
        this.el.on('b.resize', function(e){ _this.resize(e || window.event); });   // Bottom
        this.el.on('l.resize', function(e){ _this.resize(e || window.event); });   // Left

        this.el.on('rot.resize', function(e){ _this.resize(e || window.event); }); // Rotation

        this.el.on('point.resize', function(e){ _this.resize(e || window.event); }); // Point-Moving

        // This call ensures, that the plugin reacts to a change of snapToGrid immediately
        this.update();

    };

    ResizeHandler.prototype.stop = function(){
        this.el.off('lt.resize');
        this.el.off('rt.resize');
        this.el.off('rb.resize');
        this.el.off('lb.resize');

        this.el.off('t.resize');
        this.el.off('r.resize');
        this.el.off('b.resize');
        this.el.off('l.resize');

        this.el.off('rot.resize');

        this.el.off('point.resize');

        return this;
    };

    ResizeHandler.prototype.resize = function (event) {

        var _this = this;

        this.m = this.el.node.getScreenCTM().inverse();
        this.offset = { x: window.pageXOffset, y: window.pageYOffset };

        this.parameters = {
            p: this.transformPoint(event.detail.event.clientX,event.detail.event.clientY),
            x: event.detail.x,      // x-position of the mouse when resizing started
            y: event.detail.y,      // y-position of the mouse when resizing started
            box: this.el.bbox(),    // The bounding-box of the element
            rotation: this.el.transform().rotation  // The current rotation of the element
        };

        // the i-param in the event holds the index of the point which is moved, when using `deepSelect`
        if (event.detail.i !== undefined) {

            // get the point array
            var array = this.el.array().valueOf();

            // Save the index and the point which is moved
            this.parameters.i = event.detail.i;
            this.parameters.pointCoords = [array[event.detail.i][0], array[event.detail.i][1]];
        }

        // Lets check which edge of the bounding-box was clicked and resize the this.el according to this
        switch (event.type) {

            // Left-Top-Edge
            case 'lt':
                // We build a calculating function for every case which gives us the new position of the this.el
                this.calc = function (diffX, diffY) {
                    // The procedure is always the same
                    // First we snap the edge to the given grid (snapping to 1px grid is normal resizing)
                    var snap = this.snapToGrid(diffX, diffY);

                    // Now we check if the new height and width still valid (> 0)
                    if (this.parameters.box.width - snap[0] > 0 && this.parameters.box.height - snap[1] > 0) {
                        // ...if valid, we resize the this.el (which can include moving because the coord-system starts at the left-top and this edge is moving sometimes when resized)
                        this.el.move(this.parameters.box.x + snap[0], this.parameters.box.y + snap[1]).size(this.parameters.box.width - snap[0], this.parameters.box.height - snap[1]);
                    }
                };
                break;

            // Right-Top
            case 'rt':
                // s.a.
                this.calc = function (diffX, diffY) {
                    var snap = this.snapToGrid(diffX, diffY, 1 << 1);
                    if (this.parameters.box.width + snap[0] > 0 && this.parameters.box.height - snap[1] > 0) {
                        this.el.move(this.parameters.box.x, this.parameters.box.y + snap[1]).size(this.parameters.box.width + snap[0], this.parameters.box.height - snap[1]);
                    }
                };
                break;

            // Right-Bottom
            case 'rb':
                // s.a.
                this.calc = function (diffX, diffY) {
                    var snap = this.snapToGrid(diffX, diffY, 0);
                    if (this.parameters.box.width + snap[0] > 0 && this.parameters.box.height + snap[1] > 0) {
                        this.el.move(this.parameters.box.x, this.parameters.box.y).size(this.parameters.box.width + snap[0], this.parameters.box.height + snap[1]);
                    }
                };
                break;

            // Left-Bottom
            case 'lb':
                // s.a.
                this.calc = function (diffX, diffY) {
                    var snap = this.snapToGrid(diffX, diffY, 1);
                    if (this.parameters.box.width - snap[0] > 0 && this.parameters.box.height + snap[1] > 0) {
                        this.el.move(this.parameters.box.x + snap[0], this.parameters.box.y).size(this.parameters.box.width - snap[0], this.parameters.box.height + snap[1]);
                    }
                };
                break;

            // Top
            case 't':
                // s.a.
                this.calc = function (diffX, diffY) {
                    var snap = this.snapToGrid(diffX, diffY, 1 << 1);
                    if (this.parameters.box.height - snap[1] > 0) {
                        this.el.move(this.parameters.box.x, this.parameters.box.y + snap[1]).height(this.parameters.box.height - snap[1]);
                    }
                };
                break;

            // Right
            case 'r':
                // s.a.
                this.calc = function (diffX, diffY) {
                    var snap = this.snapToGrid(diffX, diffY, 0);
                    if (this.parameters.box.width + snap[0] > 0) {
                        this.el.move(this.parameters.box.x, this.parameters.box.y).width(this.parameters.box.width + snap[0]);
                    }
                };
                break;

            // Bottom
            case 'b':
                // s.a.
                this.calc = function (diffX, diffY) {
                    var snap = this.snapToGrid(diffX, diffY, 0);
                    if (this.parameters.box.height + snap[1] > 0) {
                        this.el.move(this.parameters.box.x, this.parameters.box.y).height(this.parameters.box.height + snap[1]);
                    }
                };
                break;

            // Left
            case 'l':
                // s.a.
                this.calc = function (diffX, diffY) {
                    var snap = this.snapToGrid(diffX, diffY, 1);
                    if (this.parameters.box.width - snap[0] > 0) {
                        this.el.move(this.parameters.box.x + snap[0], this.parameters.box.y).width(this.parameters.box.width - snap[0]);
                    }
                };
                break;

            // Rotation
            case 'rot':
                // s.a.
                this.calc = function (diffX, diffY) {

                    // yes this is kinda stupid but we need the mouse coords back...
                    var current = {x: diffX + this.parameters.p.x, y: diffY + this.parameters.p.y};

                    // start minus middle
                    var sAngle = Math.atan2((this.parameters.p.y - this.parameters.box.y - this.parameters.box.height / 2), (this.parameters.p.x - this.parameters.box.x - this.parameters.box.width / 2));
                    
                    // end minus middle
                    var pAngle = Math.atan2((current.y - this.parameters.box.y - this.parameters.box.height / 2), (current.x - this.parameters.box.x - this.parameters.box.width / 2));

                    var angle = (pAngle - sAngle) * 180 / Math.PI;

                    // We have to move the element to the center of the box first and change the rotation afterwards
                    // because rotation always works around a rotation-center, which is changed when moving the element
                    // We also set the new rotation center to the center of the box.
                    this.el.center(this.parameters.box.cx, this.parameters.box.cy).rotate(this.parameters.rotation + angle - angle % this.options.snapToAngle, this.parameters.box.cx, this.parameters.box.cy);
                };
                break;

            // Moving one single Point (needed when an element is deepSelected which means you can move every single point of the object)
            case 'point':
                this.calc = function (diffX, diffY) {

                    // Snapping the point to the grid
                    var snap = this.snapToGrid(diffX, diffY, this.parameters.pointCoords[0], this.parameters.pointCoords[1]);

                    // Get the point array
                    var array = this.el.array().valueOf();

                    // Changing the moved point in the array
                    array[this.parameters.i][0] = this.parameters.pointCoords[0] + snap[0];
                    array[this.parameters.i][1] = this.parameters.pointCoords[1] + snap[1];

                    // And plot the new this.el
                    this.el.plot(array);
                };
        }

        // When resizing started, we have to register events for...
        SVG.on(window, 'mousemove.resize', function (e) {
            _this.update(e || window.event);
        });    // mousemove to keep track of the changes and...
        SVG.on(window, 'mouseup.resize', function () {
            _this.done();
        });        // mouseup to know when resizing stops

    };

    // The update-function redraws the element every time the mouse is moving
    ResizeHandler.prototype.update = function (event) {

        if (!event) {
            if (this.lastUpdateCall) {
                this.calc(this.lastUpdateCall[0], this.lastUpdateCall[1]);
            }
            return;
        }

        // Calculate the difference between the mouseposition at start and now
        var p = this.transformPoint(event.clientX, event.clientY);
        var diffX = p.x - this.parameters.p.x,
            diffY = p.y - this.parameters.p.y;

        this.lastUpdateCall = [diffX, diffY];

        // Calculate the new position and height / width of the element
        this.calc(diffX, diffY);
    };

    // Is called on mouseup.
    // Removes the update-function from the mousemove event
    ResizeHandler.prototype.done = function () {
        this.lastUpdateCall = null;
        SVG.off(window, 'mousemove.resize');
        SVG.off(window, 'mouseup.resize');
        this.el.fire('resizedone');
    };

    // The flag is used to determine whether the resizing is used with a left-Point (first bit) and top-point (second bit)
    // In this cases the temp-values are calculated differently
    ResizeHandler.prototype.snapToGrid = function (diffX, diffY, flag, pointCoordsY) {

        var temp;

        // If `pointCoordsY` is given, a single Point has to be snapped (deepSelect). That's why we need a different temp-value
        if (pointCoordsY) {
            // Note that flag = pointCoordsX in this case
            temp = [(flag + diffX) % this.options.snapToGrid, (pointCoordsY + diffY) % this.options.snapToGrid];
        } else {
            // We check if the flag is set and if not we set a default-value (both bits set - which means upper-left-edge)
            flag = flag == null ? 1 | 1 << 1 : flag;
            temp = [(this.parameters.box.x + diffX + (flag & 1 ? 0 : this.parameters.box.width)) % this.options.snapToGrid, (this.parameters.box.y + diffY + (flag & (1 << 1) ? 0 : this.parameters.box.height)) % this.options.snapToGrid];
        }

        diffX -= (Math.abs(temp[0]) < this.options.snapToGrid / 2 ? temp[0] : temp[0] - this.options.snapToGrid) + (temp[0] < 0 ? this.options.snapToGrid : 0);
        diffY -= (Math.abs(temp[1]) < this.options.snapToGrid / 2 ? temp[1] : temp[1] - this.options.snapToGrid) + (temp[1] < 0 ? this.options.snapToGrid : 0);
        return [diffX, diffY];

    };

    SVG.extend(SVG.Element, {
        // Resize element with mouse
        resize: function (options) {

            (this.remember('_resizeHandler') || new ResizeHandler(this)).init(options || {});

            return this;

        }

    });

    SVG.Element.prototype.resize.defaults = {
        snapToAngle: 0.1,    // Specifies the speed the rotation is happening when moving the mouse
        snapToGrid: 1        // Snaps to a grid of `snapToGrid` Pixels
    };

}).call(this);
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

/**
 * Created by mshahzad on 06/11/2015.
 */
angular.module('photoStickerApp')
  .directive('stickerItem', ["$document", function($document) {
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
  }]);

angular.module('photoStickerApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/about.html',
    "<p>This is photo sticker application built in angular js .</p> <p>Following other libraries have been used <uo> <li>Jquery</li> <li>Svg.js</li> </uo> </p> <p>github Repositery for this project is <a href=\"https://github.com/shahzad31/PhotoStickerApp\">https://github.com/shahzad31/PhotoStickerApp</a></p>"
  );


  $templateCache.put('views/contact.html',
    "<div class=\"container\"> <section> <span class=\"contactText\" style=\"font-size: large\">I am currently available for contract or full time work and would love to hear from you, <br> contact me at</span> <div><a href=\"mailto:me@mshahzad.com?Subject=Hello%20Shahzad\" target=\"_blank\">me@mshahzad.com</a></div> <div>Phone No: +92-333-5388078</div> </section> </div>"
  );


  $templateCache.put('views/directives/image-svg.html',
    ""
  );


  $templateCache.put('views/directives/modal-view.html',
    "<div class=\"modal-header\"> <h3 class=\"modal-title\">Upload New Sticker</h3> </div> <div class=\"modal-body\"> <form class=\"form-horizontal\"> <div class=\"form-group\"> <label for=\"inputSticker\" class=\"col-sm-3 control-label\">Sticker Name</label> <div class=\"col-sm-6\"> <input type=\"text\" class=\"form-control\" ng-model=\"file.title\" id=\"inputSticker\" placeholder=\"Sticker Name\" autofocus required> </div> </div> <div class=\"form-group\"> <label for=\"inputSticker\" class=\"col-sm-3 control-label\">File Source</label> <div class=\"col-sm-6\"> <input type=\"text\" class=\"form-control\" ng-model=\"file.src\" id=\"fileName\" placeholder=\"File Name\" required ng-readonly=\"true\"> </div> <form action=\"\" method=\"post\" enctype=\"multipart/form-data\"> <div class=\"upload col-sm-4\"> <input type=\"file\" name=\"upload\" ng-file-select> </div> </form> </div> </form> </div> <div class=\"modal-footer\"> <button class=\"btn btn-primary\" type=\"submit\" ng-click=\"submit()\">Submit</button> <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button> </div>"
  );


  $templateCache.put('views/directives/sticker-item.html',
    "<!--Layout of a sticker item--> <div class=\"col-xs-6 col-centered col-min sticker-main\"> <div class=\"sticker-item\" ng-mouseover=\"mouseOver=true\" ng-mouseleave=\"mouseOver=false\"> <span class=\"glyphicon glyphicon-remove\" title=\"Remove this sticker\" ng-click=\"removeSticker(sticker)\" ng-show=\"mouseOver\" aria-hidden=\"true\"></span> <h4 class=\"headline\"> {{sticker.title}} </h4> <image class=\"sticker-image\" ng-src=\"{{sticker.dataURL}}\" draggable-img></image> </div> </div>"
  );


  $templateCache.put('views/main.html',
    "<div class=\"container\" image-svg> <div class=\"row\"> <div class=\"col-lg-8\"> <div class=\"jumbotron svg-area\"> <!--using ng-class instead of ng-show because it was disturbing layout--> <button ng-class=\"{'hideStartOverClass': !showStartOver}\" class=\"start-over-button btn btn-danger col-xs-2 pull-right\" ng-click=\"startOver()\">Start Over</button> <div class=\"svgContainer\"> <svg id=\"mainSvg\"></svg> </div> <div class=\"btnArea\"> <input type=\"file\" class=\"col-xs-10\" id=\"fileBtn\" name=\"img\" accept=\"image/*\"> <div> <div class=\"btn-group\" uib-dropdown is-open=\"status.isopen\"> <button id=\"single-button\" type=\"button\" class=\"btn btn-success\" uib-dropdown-toggle ng-disabled=\"disabled\"> Export As <span class=\"caret\"></span> </button> <ul class=\"uib-dropdown-menu\" role=\"menu\" aria-labelledby=\"single-button\"> <li role=\"menuitem\"><a ng-click=\"exportImage()\">image/png</a></li> <li role=\"menuitem\"><a ng-click=\"exportSvg()\">svg+xml</a></li> </ul> </div> </div> </div> </div> </div> <div class=\"col-lg-4\"> <div class=\"jumbotron sticker-area\"> <button class=\"btn btn-md btn-primary\" ng-click=\"open()\" type=\"submit\">Upload new sticker</button> <div class=\"stickers\"> <sticker-item ng-repeat=\"(index, sticker) in stickersCache\"></sticker-item> </div> </div> </div> </div> </div>"
  );


  $templateCache.put('views/resume.html',
    "<header class=\"resumeHeader\" style=\"left: 0px\"> <nav> <div class=\"navbar\"> <button> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> </button> </div> <ul class=\"collapsed\"> <li> <a class=\"ajax about\" href=\"#/about\"> <h3>About</h3> <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"120px\" height=\"15px\" viewbox=\"-52.5 0 120 15\" enable-background=\"new -52.5 0 120 15\" xml:space=\"preserve\" style=\"fill: rgb(0, 0, 0)\"> <path d=\"M13.79,5.677c0.763-0.763,0.996-1.854,0.703-2.818l-1.515,1.514L11.5,3.977L11.104,2.5l1.517-1.516\n" +
    "\t\t\t\t\t\tc-0.966-0.293-2.056-0.06-2.819,0.704C9.038,2.452,8.925,3.423,9.295,4.314L7.718,5.888c-0.023-0.06-0.057-0.117-0.106-0.165\n" +
    "\t\t\t\t\t\tL7.19,5.301c-0.182-0.181-0.474-0.181-0.655,0l-0.36,0.372L3.817,3.314L3.689,2.856L3.688,2.857\n" +
    "\t\t\t\t\t\tc-0.013-0.096-0.056-0.188-0.13-0.262L1.493,1.093c-0.18-0.181-0.418-0.236-0.531-0.124l-0.52,0.52\n" +
    "\t\t\t\t\t\tC0.331,1.602,0.386,1.839,0.566,2.02l1.502,2.064c0.074,0.073,0.167,0.117,0.262,0.13l0,0l0.452,0.082L5.16,6.674L4.775,7.062\n" +
    "\t\t\t\t\t\tc-0.181,0.181-0.181,0.474,0,0.653l0.422,0.424c0.048,0.049,0.105,0.082,0.164,0.103l-3.587,3.583\n" +
    "\t\t\t\t\t\tc-0.006,0.007-0.01,0.014-0.016,0.021l0,0c-0.521,0.521-0.521,1.363,0,1.885c0.519,0.519,1.358,0.52,1.878,0.004\n" +
    "\t\t\t\t\t\tc0.01-0.008,0.019-0.014,0.028-0.021l3.249-3.263l3.351,3.354c0.448,0.445,1.172,0.445,1.62-0.002l1.384-1.383\n" +
    "\t\t\t\t\t\tc0.445-0.447,0.445-1.173,0-1.619L9.91,7.443l1.254-1.259C12.055,6.553,13.025,6.441,13.79,5.677z M2.792,13.3\n" +
    "\t\t\t\t\t\tc-0.227,0.087-0.479-0.028-0.564-0.258c-0.085-0.226,0.03-0.479,0.256-0.563c0.227-0.086,0.48,0.028,0.564,0.256\n" +
    "\t\t\t\t\t\tC3.134,12.961,3.02,13.215,2.792,13.3z M5.675,5.917c-0.085,0.084-0.224,0.084-0.309,0l-4.317-4.32l0.14-0.14\n" +
    "\t\t\t\t\t\tc0.057-0.059,0.179-0.03,0.273,0.063l1.814,1.525C3.314,3.084,3.336,3.13,3.343,3.18h0.001c0.007,0.063,0.033,0.122,0.075,0.173\n" +
    "\t\t\t\t\t\tl2.254,2.253C5.76,5.693,5.76,5.832,5.675,5.917z M7.187,6.354L6.471,7.07L6.027,6.624l0.715-0.715c0.105-0.105,0.274-0.105,0.379,0\n" +
    "\t\t\t\t\t\tl0.066,0.065C7.292,6.079,7.292,6.249,7.187,6.354z M12.867,11.27c0.203,0.205,0.203,0.539,0,0.744l-0.701,0.7L7.291,7.839\n" +
    "\t\t\t\t\t\tC7.508,7.595,7.896,7.616,8.146,7.87l2.863,2.86c0.065,0.065,0.172,0.065,0.238,0c0.064-0.064,0.064-0.172,0-0.236L8.387,7.633\n" +
    "\t\t\t\t\t\tC8.131,7.376,8.109,6.981,8.363,6.766L12.867,11.27z\"></path> <line fill=\"none\" stroke=\"#000000\" x1=\"-42.5\" y1=\"7.25\" x2=\"-4.5\" y2=\"7.25\" style=\"stroke: rgb(0, 0, 0)\"></line> <line fill=\"none\" stroke=\"#000000\" x1=\"19.5\" y1=\"7.25\" x2=\"57.5\" y2=\"7.25\" style=\"stroke: rgb(0, 0, 0)\"></line> </svg> <span class=\"subtitle\">The One And Only</span> </a> </li> <li> <a class=\"ajax work\" href=\"#/work\"> <h3>Work</h3> <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"120px\" height=\"15px\" viewbox=\"-52.5 0 120 15\" enable-background=\"new -52.5 0 120 15\" xml:space=\"preserve\" style=\"fill: rgb(0, 0, 0)\"> <g><polygon points=\"4.182,13.166 4.182,13.35 4.182,13.604 10.818,13.604 10.818,13.35 10.818,13.166 10.818,12.91 4.182,12.91\"></polygon><path d=\"M13.559,1.396H1.516c-0.45,0-0.816,0.326-0.816,0.776v8.777c0,0.449,0.366,0.918,0.816,0.918h3.609 c0.247,0.14,0.414,0.402,0.414,0.705c0,0.003-0.001,0.007-0.001,0.009h3.999c0-0.002-0.001-0.006-0.001-0.009 c0-0.303,0.167-0.565,0.413-0.705h3.609c0.449,0,0.742-0.469,0.742-0.918V2.172C14.301,1.722,14.008,1.396,13.559,1.396z M13.252,10.508h-0.514c-0.171,0-0.309-0.102-0.309-0.272c0-0.17,0.138-0.271,0.309-0.271h0.514c0.17,0,0.308,0.102,0.308,0.271 C13.56,10.406,13.422,10.508,13.252,10.508z M1.379,9.011V2.075h12.179l0.001,6.936H1.379z\"></path></g> <line fill=\"none\" stroke=\"#000000\" x1=\"-42.5\" y1=\"7.25\" x2=\"-4.5\" y2=\"7.25\" style=\"stroke: rgb(0, 0, 0)\"></line> <line fill=\"none\" stroke=\"#000000\" x1=\"19.5\" y1=\"7.25\" x2=\"57.5\" y2=\"7.25\" style=\"stroke: rgb(0, 0, 0)\"></line> </svg> <span class=\"subtitle\">View Case Studies</span> </a> </li> <li> <a class=\"ajax contact\" href=\"#/contact\"> <h3>Contact</h3> <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"120px\" height=\"15px\" viewbox=\"-52.5 0 120 15\" enable-background=\"new -52.5 0 120 15\" xml:space=\"preserve\" style=\"fill: rgb(0, 0, 0)\"> <g class=\"phone\"> <path d=\"M1.758,2.944c0.002,0,3.081-0.771,5.741-0.771c2.659,0,5.74,0.771,5.743,0.771c1.134,0.261,1.84,1.392,1.578,2.525\n" +
    "\t\t\t\t\t\t\t\tC14.629,6.3,13.972,6.9,13.188,7.06l-2.494-1.704c-0.048-0.269-0.042-0.551,0.023-0.834c0.038-0.165,0.095-0.321,0.167-0.467\n" +
    "\t\t\t\t\t\t\t\tC9.944,3.955,8.741,3.862,7.5,3.862c-1.24,0-2.443,0.092-3.383,0.193c0.072,0.146,0.13,0.302,0.168,0.467\n" +
    "\t\t\t\t\t\t\t\tc0.065,0.283,0.07,0.565,0.023,0.834L0.524,6.229c-0.16-0.221-0.279-0.477-0.344-0.76C-0.082,4.336,0.625,3.206,1.758,2.944z\n" +
    "\t\t\t\t\t\t\t\t M10.031,4.206c0.523,2.1,1.761,3.917,3.44,5.177v3.444H1.529V9.383c1.679-1.261,2.916-3.078,3.439-5.177\n" +
    "\t\t\t\t\t\t\t\tc0.271-0.023,0.554-0.043,0.847-0.061v0.877h3.37V4.146C9.478,4.162,9.761,4.183,10.031,4.206z M10.102,8.49\n" +
    "\t\t\t\t\t\t\t\tc0-1.436-1.164-2.601-2.602-2.601c-1.437,0-2.601,1.166-2.601,2.601c0,1.437,1.164,2.603,2.601,2.603\n" +
    "\t\t\t\t\t\t\t\tC8.938,11.093,10.102,9.927,10.102,8.49z M9.185,8.49c0,0.931-0.754,1.686-1.685,1.686c-0.93,0-1.685-0.755-1.685-1.686\n" +
    "\t\t\t\t\t\t\t\tc0-0.93,0.754-1.685,1.685-1.685C8.431,6.806,9.185,7.561,9.185,8.49z\"></path> </g> <line fill=\"none\" stroke=\"#000000\" x1=\"-42.5\" y1=\"7.25\" x2=\"-4.5\" y2=\"7.25\" style=\"stroke: rgb(0, 0, 0)\"></line> <line fill=\"none\" stroke=\"#000000\" x1=\"19.5\" y1=\"7.25\" x2=\"57.5\" y2=\"7.25\" style=\"stroke: rgb(0, 0, 0)\"></line> </svg> <span class=\"subtitle\">Let's get in touch</span> </a> </li> </ul> </nav> <div class=\"progress-bar\"></div> </header> <div id=\"main\" class=\"resume\"> <div class=\"wrapper\" data-title=\"Resume | Michael Ngo | Front-end Developer\"> <div class=\"content\"> <div class=\"resumeContainer\"> <h1 class=\"heading\"> <span>M Shahzad</span> <span class=\"subtitle\">me@mshahzad.com • +92-333-5388078</span> <span class=\"subtitle\">Lahore, Punjab, Pakistan</span> </h1> <section class=\"row\"> <div class=\"col-xs-3\"> <h3>Profile</h3> </div> <div class=\"col-xs-8 border\"> <p>Though I've pretty diverse skill set, my expertise lies in front-end development. I have a passion for solving problems, constantly perfecting my craft, and producing work that I can be proud of. I'm currently open to any sort of opportunities, so if you're interested in hiring me, check out <a class=\"ajax\" href=\"#/work\">my work</a>, and let's <a class=\"ajax\" href=\"#/contact\">get in touch</a>. </p> </div> </section> <section class=\"row\"> <div class=\"col-xs-3\"> <h3>Work <br>Experience</h3> </div> <div class=\"col-xs-8 border\"> <div class=\"position\"> <h4>Gallery Systems <span class=\"subtitle\">Front-End Developer | Aug 2014 - Present</span></h4> <p>Working on enterprise single page application, responsibilities included , creating flexible views, widgets, handling security and internationalization in application. Using html templates integrated with js to develop data entry form and modals. Working on advanced museum web applications , particularly large scale single page application using dojo toolkit,javascript,html,css. Following client side Model View Controller integrated to back-end with REST API's built in Java. Project http://www.gallerysystems.com/products-and-services/conservation-studio/ Technology Stack: JavaScript, html, css, Java, Sql Server, Webstorm, Eclipse</p> </div> <div class=\"position\"> <h4>Id Technologies<span class=\"subtitle\">Web Developer | Jun 2013 - Jul 2014</span></h4> <p>Developed Enterprise web applications while working in idtechnologies working at front end as well as developed back end REST API's in php, projects include 1. Enterprise Resource Planning web application 2. Fleet Management System 3 GIS Asset Management System 4. ESDN Android Map Viewer/Editor/Uploader Languages i worked on while working in idtechnolgies Javascript, html, css, c# , Android, php, postgresql Tools i used PhpEd, Visual Studio, phpmyadmin, ArcGis Server, Linux(ubuntu + Redhat) Worked on latest web technologies Including Enterprise resource planning Geographic information system using google maps and open street maps server with ESRI software and tools in languages javascript ,php,c#,andriod, dojo</p> </div> <div class=\"position\"> <h4>MIEMS Labs <span class=\"subtitle\">Computer Programmer | Jan 2012 - May 2013</span></h4> <p>Responsible for designing and developing the splash page of Futureshop.ca on a weekly basis. With over 300,000 daily hits, abided by a strict and thorough proofing process. Worked at length with art directors, business managers, and marketers to ensure peak sales of online products.</p> </div> <div class=\"position\"> <h4>Freelance + Consultancy Services <span class=\"subtitle\">Wordpress Developer | Feb 2008 - Present</span></h4> <p>Worked on software module of MIEMS Lab’s project on Robocup Small Size League  Designed and developed an intelligent software agent to autonomously control multiple Omni-directional robots in a small size soccer field  Integrated software and hardware modules using Vision software provided by Robocup SSL federation and x-bee communication modules  Qualified and participated in Small Size League in Robocup 2013 Netherlands as a part of team Emenents</p> </div> </div> </section> <section class=\"row\"> <div class=\"col-xs-3\"> <h3>Education</h3> </div> <div class=\"col-xs-8 border\"> <div class=\"position\"> <h4>NUST Islamabad<span class=\"subtitle\">B.E - Computer Engineering 2009 - 2013</span></h4> <p>Thorough understanding of computer programming/Operating systems with focus on algorithms implementation &amp; research in AI</p> </div> <div class=\"position\"> <h4>LUMS Lahore<span class=\"subtitle\">MS - Computer Science 2013 - </span></h4> <p>Advance Operating Systems, Computer System Architecture</p> </div> </div> </section> <section class=\"technical row\"> <div class=\"col-xs-3\"> <h3>Technical <br>Expertise</h3> </div> <div class=\"col-xs-8\"> <div class=\"row border\"> <div class=\"col-xs-5 alpha\"> <h4>Professional Skillset</h4> <ul> <li>Modular Javascript</li> <li>W3C Validated HTML5</li> <li>CSS3 via SASS &amp; Compass, LESS</li> <li>Angular JS, Dojo Toolkit</li> <li>jQuery, ajax, modernizr</li> <li>Website optimization + cross browser capabilities</li> </ul> </div> <div class=\"col-xs-4 working-knowledge\"> <h4>Working Knowledge</h4> <ul> <li>Grunt &amp; Gulp</li> <li>Core PHP</li> </ul> </div> <div class=\"col-xs-3 omega\"> <h4>Tools</h4> <ul> <li>Web Storm IDE</li> <li>SublimeText 2</li> <li>Github</li> <li>Eclipse &amp; Netbeans</li> <li>Stack Overflow</li> </ul> </div> </div> </div> </section> <section class=\"awards row\"> <div class=\"col-xs-3\"> <h3>Awards &amp; Recognition</h3> </div> <div class=\"col-xs-9\"> <ul> <li>Rector NUST Gold Medalist In Final Year Engineering Project(B.E)</li> <li>Participated in RoboCup International Small size league 2013,Netherland (Part of First ever team from South Asia) as Software Developer of Artificial Intelligent Server.</li> <li>Got Third Position in All Pakistan Computer Project Exhibition and Competition 2013 held at CEME NUST.</li> <li>Qualified for RoboCup Iran Open SSL 2013.</li> </ul> </div> </section> </div> </div> </div> </div> <div class=\"cover\" style=\"display: none\"></div>"
  );


  $templateCache.put('views/work.html',
    "<div class=\"container\" image-svg> <div class=\"row\"> <div class=\"col-lg-8\"> <div class=\"jumbotron svg-area\"> <!--using ng-class instead of ng-show because it was disturbing layout--> <button ng-class=\"{'hideStartOverClass': !showStartOver}\" class=\"start-over-button btn btn-danger col-xs-2 pull-right\" ng-click=\"startOver()\">Start Over</button> <div class=\"svgContainer\"> <svg id=\"mainSvg\"></svg> </div> <div class=\"btnArea\"> <input type=\"file\" class=\"col-xs-10\" id=\"fileBtn\" name=\"img\" accept=\"image/*\"> <div> <div class=\"btn-group\" uib-dropdown is-open=\"status.isopen\"> <button id=\"single-button\" type=\"button\" class=\"btn btn-success\" uib-dropdown-toggle ng-disabled=\"disabled\"> Export As <span class=\"caret\"></span> </button> <ul class=\"uib-dropdown-menu\" role=\"menu\" aria-labelledby=\"single-button\"> <li role=\"menuitem\"><a ng-click=\"exportImage()\">image/png</a></li> <li role=\"menuitem\"><a ng-click=\"exportSvg()\">svg+xml</a></li> </ul> </div> </div> </div> </div> </div> <div class=\"col-lg-4\"> <div class=\"jumbotron sticker-area\"> <button class=\"btn btn-md btn-primary\" ng-click=\"open()\" type=\"submit\">Upload new sticker</button> <div class=\"stickers\"> <sticker-item ng-repeat=\"(index, sticker) in stickersCache\"></sticker-item> </div> </div> </div> </div> <div>Photo Sticker Application is present at GitHub <div class=\"emailMe gitIcon\"><a href=\"https://github.com/shahzad31/PhotoStickerApp\" target=\"_blank\"></a></div> </div> </div>"
  );

}]);
