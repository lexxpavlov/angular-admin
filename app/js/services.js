'use strict';

angular.module('admin.services', ['ngResource'])
	.factory('Items', function($resource){
		return $resource('back/questions/:id/:action', {}, {
			create: {method:'PUT'},
			saveData: {method:'POST'},
			toggle: {method:'GET', params:{action:'toggle'}}
		});
	})
	.factory('Data', function($resource){
		var load = $resource('back/list/:name', {});
		var loadList = ['answerers','categories'];
		var data = {};
		for (var i=0; i<loadList.length; i++)
			data[loadList[i]] = load.get({name:loadList[i]});
		return function(key){ return data[key]; };
	});