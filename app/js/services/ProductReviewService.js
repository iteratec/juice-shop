angular.module('juiceShop').factory('ProductReviewService', ['$http', function ($http) {
  'use strict'

  var host = '/rest/product'

  function get (id) {
    return $http.get(host + '/' + id + '/reviews')
  }

  function create (id, review) {
    return $http.put(host + '/' + id + '/reviews', review)
  }

  return {
    get: get,
    create: create
  }
}])
