angular.module('juiceShop').controller('ChallengeSolvedNotificationController', [
  '$scope',
  '$translate',
  'socket',
  function ($scope, $translate, socket) {
    'use strict'

    $scope.notifications = []

    $scope.closeNotification = function (index) {
      $scope.notifications.splice(index, 1)
    }

    socket.on('challenge solved', function (data) {
      if (data && data.challenge && !data.hidden) {
        $translate('CHALLENGE_SOLVED', { challenge: data.challenge }).then(function (challengeSolved) {
          $scope.notifications.push({message: challengeSolved, flag: data.flag, country: data.country})
        }, function (translationId) {
          $scope.notifications.push({message: translationId, flag: data.flag, country: data.country})
        })
        socket.emit('notification received', data.flag)
      }
    })
  } ])
