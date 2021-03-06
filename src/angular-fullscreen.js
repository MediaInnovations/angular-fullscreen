(function(window) {
   var createModule = function(angular) {
      var module = angular.module('FBAngular', []);

      module.factory('Fullscreen', ['$document', function ($document) {
         var document = $document[0];

         var serviceInstance = {
            all: function() {
               serviceInstance.enable( document.documentElement );
            },
            enable: function(element) {
               if (element.requestFullscreen) {
                  element.requestFullscreen();
               } else if (element.webkitRequestFullscreen) {
                  element.webkitRequestFullscreen();
               } else if (element.mozRequestFullScreen) {
                  element.mozRequestFullScreen();
               } else if (element.msRequestFullscreen) {
                  element.msRequestFullscreen();
               }
            },
            cancel: function() {
               if (document.exitFullscreen) {
                   document.exitFullscreen();
               } else if (document.webkitExitFullscreen) {
                   document.webkitExitFullscreen();
               } else if (document.mozCancelFullScreen) {
                   document.mozCancelFullScreen();
               } else if (document.msExitFullscreen) {
                   document.msExitFullscreen();
               }
            },
            isEnabled: function(){
               var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
               return fullscreenElement;
            },
            toggleAll: function(){
                serviceInstance.isEnabled() ? serviceInstance.cancel() : serviceInstance.all();
            },
            isSupported: function(){
                var docElm = document.documentElement;
                return docElm.requestFullScreen || docElm.mozRequestFullScreen || docElm.webkitRequestFullScreen || docElm.msRequestFullscreen;
            }
         };
         
         return serviceInstance;
      }]);

      module.directive('fullscreen', ['Fullscreen',  function(Fullscreen) {
         return {
            link : function ($scope, $element, $attrs) {
               // Watch for changes on scope if model is provided
               if ($attrs.fullscreen) {
                 //Mozilla behaves differently, when user presses ESC key in full screen mode.
                 //Same code as in $element.on('fullscreenchange...
                  document.addEventListener("mozfullscreenchange",function() {
                     if(!Fullscreen.isEnabled()){
                        $scope.$evalAsync(function(){
                           $scope[$attrs.fullscreen] = false
                           $element.removeClass('isInFullScreen');
                        })
                     }
                  });
                  document.addEventListener("MSFullscreenChange",function() {
                     if(!Fullscreen.isEnabled()){
                        $scope.$evalAsync(function(){
                           $scope[$attrs.fullscreen] = false
                           $element.removeClass('isInFullScreen');
                        })
                     }
                  });                  
                  $scope.$watch($attrs.fullscreen, function(value) {
                     var isEnabled = Fullscreen.isEnabled();
                     if (value && !isEnabled) {
                        Fullscreen.enable($element[0]);
                        $element.addClass('isInFullScreen');
                     } else if (!value && isEnabled) {
                        Fullscreen.cancel();
                        $element.removeClass('isInFullScreen');
                     }
                  });
                  $element.on('fullscreenchange webkitfullscreenchange mozfullscreenchange', function(){
                     if(!Fullscreen.isEnabled()){
                        $scope.$evalAsync(function(){
                           $scope[$attrs.fullscreen] = false
                           $element.removeClass('isInFullScreen');
                        })
                     }
                  })
               } else {
                  $element.on('click', function (ev) {
                     Fullscreen.enable(  $element[0] );
                  });

                  if ($attrs.onlyWatchedProperty !== undefined) {
                     return;
                  }
               }
            }
         };
      }]);
      return module;
   };

   if (typeof define === "function" && define.amd) {
      define("FBAngular", ['angular'], function (angular) { return createModule(angular); } );
   } else {
      createModule(window.angular);
   }
})(window);
