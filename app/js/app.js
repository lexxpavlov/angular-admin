'use strict';

angular.module('admin', ['admin.services','admin.filters'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
			.when('/list', {template: 'views/list.html', controller: ListCtrl})
			.when('/new', {template: 'views/edit.html', controller: NewCtrl})
			.when('/edit/:id', {template: 'views/edit.html', controller: EditCtrl})
			.otherwise({redirectTo: '/list'});
  },
]);