angular.module('theHive')
  .directive('pwCheck', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('input', function () {
          scope.$apply(function () {
            var v = elem.val()===angular.element( document.querySelector( firstPassword ) ).val();
            ctrl.$setValidity('pwmatch', v);
          });
        }); 
      }
    }
  }]);