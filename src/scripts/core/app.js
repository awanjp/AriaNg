(function () {
    'use strict';

    var ariaNg = angular.module('ariaNg', [
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ngMessages',
        'ngCookies',
        'ngAnimate',
        'pascalprecht.translate',
        'angularMoment',
        'ngWebSocket',
        'base64',
        'LocalStorageModule',
        'cgBusy',
        'angularPromiseButtons',
        'oitozero.ngSweetAlert',
        angularDragula(angular)
    ]);
})();