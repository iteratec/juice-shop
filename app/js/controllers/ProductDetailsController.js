angular.module('juiceShop').controller('ProductDetailsController', [
  '$scope',
  '$sce',
  '$q',
  '$http', //TODO In ProductReview Service auslagern
  '$uibModal',
  'ProductService',
  'UserService',
  'id',
  function ($scope, $sce, $q, $http, $uibModal, productService, userService, id) {
    'use strict'

    $q.all([
      productService.get(id),
      $http.get('/rest/product/' + id + '/reviews'),
      userService.whoAmI()
    ]).then(function (result) {
      $scope.product = result[0].data.data
      $scope.productReviews = result[1].data.data
      $scope.product.description = $sce.trustAsHtml($scope.product.description)

      if(result[2].data.email === undefined){
        $scope.author = 'Anonymous'
      }else{
        $scope.author = result[2].data.email
      }

    }, function (err) {
      console.log(err)
    })

    $scope.addComment = function(){
      var review = { msg: $scope.msg, author: $scope.author }
      $scope.productReviews.push(review)
      $http.put('/rest/product/' + id + '/reviews', review)
    }

  }])
