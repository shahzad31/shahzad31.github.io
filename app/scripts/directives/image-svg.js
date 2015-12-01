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
