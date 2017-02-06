angular.module('juiceShop').controller('ProductCommentEditController', [
  '$scope',
  '$sce',
  '$q',
  '$uibModal',
  'ProductService',
  'ProductReviewService',
  'UserService',
  'comment',
  function ($scope, $sce, $q, $uibModal, productService, productReviewService, userService, comment) {
    'use strict'

    $scope.id = comment._id
    $scope.message = comment.message

    $scope.editComment = function () {
      productReviewService.patch({id: $scope.id, message: $scope.message}).success(function (result) {
        //TODO Update the UI for the User or/ and notify him that his changes were saved
      }).error(function (err) {
        console.log(err)
      })
    }
  }])
