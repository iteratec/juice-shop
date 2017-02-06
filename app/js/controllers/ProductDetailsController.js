angular.module('juiceShop').controller('ProductDetailsController', [
  '$scope',
  '$sce',
  '$q',
  '$uibModal',
  'ProductService',
  'ProductReviewService',
  'UserService',
  'id',
  function ($scope, $sce, $q, $uibModal, productService, productReviewService, userService, id) {
    'use strict'

    $q.all([
      productService.get(id),
      productReviewService.get(id),
      userService.whoAmI()
    ]).then(function (result) {
      var product = result[0].data.data
      var reviews = result[1].data
      var user = result[2].data

      $scope.product = product
      $scope.product.description = $sce.trustAsHtml($scope.product.description)

      if (reviews.msg !== undefined && reviews.msg === 'No NoSQL Database availible') {
        $scope.reviewsDisabled = true
      } else {
        $scope.reviewsDisabled = false
        $scope.productReviews = reviews.data
      }

      if (user.email === undefined) {
        $scope.author = 'Anonymous'
      } else {
        $scope.author = user.email
      }
    },
    function (err) {
      console.log(err)
    }
    )

    $scope.addComment = function () {
      var review = { msg: $scope.msg, author: $scope.author }
      $scope.productReviews.push(review)
      productReviewService.create(id, review)
    }
  }])
