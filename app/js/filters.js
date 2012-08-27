'use strict';

angular.module('admin.filters', [])
	.filter('list', function() {
		return function(value,list) {
			return list?list[value]:value;
		};
	})
	.filter('filterEx', function() {
		return function(items,tablehead,str) {
			if (!str) return items;
			var result = [], list, ok, regexp = new RegExp(str,'i');
			for (var i in items) {
				ok = false;
				for (var k in items[i])
					if (items[i].hasOwnProperty(k) && k[0]!='$') {
						list = find(tablehead,k);
						if (list && regexp.test(list[items[i][k]])
						         || regexp.test(items[i][k])) {ok = true; break;}
					}
				if (ok) result.push(items[i]);
			}
			return result;
		};
	})
	.filter('showPage', function() {
		return function(list, paginator) {
			if (paginator.page<1) paginator.page = 1;
			if (paginator.count<1) paginator.count = 1;
			if (paginator.pages && paginator.page>paginator.pages) paginator.page = paginator.pages;
			return list.slice(paginator.count*(paginator.page-1), paginator.count*paginator.page);
		};
	})
	.filter('orderByEx',orderByExFilter);

function orderByExFilter($parse){ // modified version of native Angular orderBy filter
  return function(array, tablehead, sortPredicate, reverseOrder) {
    if (!(array instanceof Array)) return array;
    if (!sortPredicate) return array;
    sortPredicate = angular.isArray(sortPredicate) ? sortPredicate: [sortPredicate];
    sortPredicate = map(sortPredicate, function(predicate){
      var descending = false, list, get = predicate || identity;
      if (angular.isString(predicate)) {
        if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
          descending = predicate.charAt(0) == '-';
          predicate = predicate.substring(1);
        }
        get = $parse(predicate);
      }
      // if list of values specified
      if (list = find(tablehead,predicate)) {
        return reverseComparator(function(a,b){ // return list-based comparator
          return compare(list[get(a)],list[get(b)]);
        }, descending);
      }
      return reverseComparator(function(a,b){ // else use native comparator
        return compare(get(a),get(b));
      }, descending);
    });
    var arrayCopy = [];
    for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
    return arrayCopy.sort(reverseComparator(comparator, reverseOrder));

    function comparator(o1, o2){
      for ( var i = 0; i < sortPredicate.length; i++) {
        var comp = sortPredicate[i](o1, o2);
        if (comp !== 0) return comp;
      }
      return 0;
    }
    function reverseComparator(comp, descending) {
      return !!(descending)
          ? function(a,b){return comp(b,a);}
          : comp;
    }
    function compare(v1, v2){
      var t1 = typeof v1;
      var t2 = typeof v2;
      if (t1 == t2) {
        if (t1 == "string") v1 = v1.toLowerCase();
        if (t1 == "string") v2 = v2.toLowerCase();
        if (v1 === v2) return 0;
        return v1 < v2 ? -1 : 1;
      } else {
        return t1 < t2 ? -1 : 1;
      }
    }
    function map (obj, iterator, context) { // copy of native Angular map function
      var results = [];
      angular.forEach(obj, function(value, index, list) {
        results.push(iterator.call(context, value, index, list));
      });
      return results;
    }
  }
}
orderByExFilter.$inject = ['$parse'];

// used in extended filters for finding list of values binded to column
function find(arr,name) {
  for(var i=0; i<arr.length; i++)
    if (arr[i].name==name) return arr[i].list;
};
