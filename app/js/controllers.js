'use strict';

function ListCtrl($scope, Items, Data) {
	$scope.Math = Math;
	$scope.items = Items.query(function(data){
		$scope.paginator.setPages($scope.items.length);
		var i = 0;
		angular.forEach(data, function(v,k) { data[k]._id = i++; });
	});
	$scope.categories = Data('categories');
	$scope.answerers  = Data('answerers');

	$scope.selected  = [];
	$scope.paginator = {
		count: 3,
		page:  1,
		pages: 1,
		setPages: function(itemsCount){ this.pages = Math.ceil(itemsCount/this.count); }
	};

	$scope.tablehead = [
		{name:'title',    title:"Заголовок",  sort:-2},
		{name:'category', title:"Категория",  sort:1, list:$scope.categories},
		{name:'answerer', title:"Кому задан", list:$scope.answerers},
		{name:'author',   title:"Автор"},
		{name:'created',  title:"Задан"},
		{name:'answered', title:"Отвечен"},
		{name:'shown',    title:"Опубликован"}
	];

	$scope.sortBy = function() {
		var order = [];
		angular.forEach($scope.tablehead, function(h){
			if (h.sort>0) order[h.sort-1] = h.name;
			if (h.sort<0) order[Math.abs(h.sort)-1] = '-'+h.name;
		});
		return order;
	};
	$scope.sortReorder = function(col,e) {
		if (e.shiftKey) {
			var sortIndex = 0;
			angular.forEach($scope.tablehead, function(el) {
				if (Math.abs(el.sort)>sortIndex) sortIndex = Math.abs(el.sort);
			});
			angular.forEach($scope.tablehead, function(el) {
				if (el.name==col) el.sort = el.sort?-el.sort:sortIndex+1;
			});
		} else {
			angular.forEach($scope.tablehead, function(el) {
				if (el.name==col) el.sort = el.sort>0?-1:1; else el.sort = null;
			});
		}
	};

	$scope.disableItem = function() {
		var item = this.item;
		Items.toggle({id:item.id}, function(data) { if (data.ok) item.shown = item.shown>0?0:1; });
	};
	$scope.deleteItem = function(one) {
		if (one) {
			var _id = $scope.selected[0];
			Items['delete']({id:$scope.items[_id].id}, function() {
				$scope.items.splice(_id,1);
				$scope.selected = [];
			});
		} else {
				var ids = [];
				angular.forEach($scope.selected, function(_id) { ids.push($scope.items[_id].id); });
				Items['delete']({ids:ids}, function(){
					angular.forEach($scope.selected, function(_id) { $scope.items.splice(_id,1); });
					$scope.selected = [];
				});
			}
	};
	$scope.selectItem = function(e) {
		if ((e.target||e.srcElement).tagName!='TD') return;
		var state = this.item.selected = !this.item.selected, _id = this.item._id;
		if (state) $scope.selected.push(_id);
			else angular.forEach($scope.selected, function(v,k) {
			       if (v==_id) { $scope.selected.splice(k,1); return false; }
			     });
	};
	$scope.$watch('items',function(newValue, oldValue) {
		if (newValue!==oldValue) $scope.paginator.setPages($scope.items.length);
	});
	$scope.$watch('paginator.page',function(page,old) {
		var newPage = page;
		if (page<1) newPage = 1;
		if (page>$scope.paginator.pages) newPage = old;
		if (typeof(newPage)=='string') newPage = +newPage.replace(/[^0-9]/,'');
		if (page!==newPage) $scope.paginator.page = newPage;
		angular.forEach($scope.items, function(v,k) { $scope.items[k].selected = false; });
	});
}

function EditCtrl($scope, $routeParams, $location, Items, Data) {
	$scope.item = Items.get({id:$routeParams.id});
	$scope.categories = Data('categories');
	$scope.answerers  = Data('answerers');
	$scope.save = function() {
		$scope.item.$save({id:$scope.item.id}, function(){ $location.path('/list'); });
	};
	// TODO wysiwyg http://deansofer.com/posts/view/14/AngularJs-Tips-and-Tricks#wysiwyg
}

function NewCtrl($scope, $location, Items, Data) {
	$scope.item = {id:0,category:'',answerer:'',title:'',text:'',answer:'',author:''};
	$scope.categories = Data('categories');
	$scope.answerers  = Data('answerers');
	$scope.save = function() {
		Items.create($scope.item, function(){ $location.path('/list'); });
	};
}
