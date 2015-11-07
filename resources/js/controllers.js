var alphabetGame = angular.module("alphabetGame", []);

alphabetGame.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true);    
}]);

/**
 * Problem Controller
 */
alphabetGame.controller('ProblemCtrl', function($scope, $http, $location){
	// the possible variables
	$scope.variables = ['A','B','C','D','E'];
	
	// solver type from tye url?type=(pomdp or random)
	var solverType = $location.search().type;
	if (solverType != 'pomdp' && solverType != 'random') {
		solverType = 'pomdp';
	}
	
	// the prompt from the server
	$scope.problem;
	
	// the user's solution. It is simply an array of ints
	$scope.answers = [];
	
	// this is set to true if failed
	$scope.validationFailed = false;
	$scope.complete = false;
	$scope.promptMessage = "You will be given one clue at a time. Can you guess the letters?";
	
	// checks if xhr is in progress
	$scope.xhrInProgress = true;
	
	// Initialize the solver on the server
	$http.get(INIT_URL + "?type=" + solverType).success(function(data) {
		$scope.xhrInProgress = false;
		$scope.problem = data.prompt;
		
		// set the possible variables
		$scope.variables = [];
		for (var i = 0; i < data.solution.length; i++) {
			$scope.variables.push(String.fromCharCode(i + 65));
		}
		
		// send to tracker
		//logData({}, ACTION_STARTED);
	});
	
	/**
	 * validate the user's input, and submit to server if correct
	 */
	$scope.submitAnswer = function() {
		// reset booleans
		$scope.validationFailed = false;
		
		// did user fill in all answers?
		if ($scope.answers.length != $scope.variables.length) {
			$scope.validationFailed = true;
			return;
		}
		
		// answer is not 0 or 1
		for (var i in $scope.variables) {
			if ($scope.answers[i] == undefined || 
					$scope.answers[i] < 0 || 
					$scope.answers[i] > 1) {
				$scope.validationFailed = true;
				return;
			}
		}
		
		// do the math to check if the answers are correct
		/*for (var i in $scope.problem.prompt) {
			var eqn = $scope.problem.prompt[i];
			var var0 = $scope.answers[$scope.variables.indexOf(eqn[0])];
			var var1 = $scope.answers[$scope.variables.indexOf(eqn[1])];
			var sum = eqn[2];
		
			if (var0 + var1 != sum) {
				$scope.checkAnswerMessage = "Wrong!";
				return;
			}
		}
		$scope.checkAnswerMessage = "Correct!";*/
		
		// sends the response to the server
		$scope.xhrInProgress = true;
		$http.get(SUBMIT_URL + "?answer=" + $scope.answers.join(","))
			.success(function(data) {
				$scope.xhrInProgress = false;
				if (!data.correct) {
					$scope.problem = data.prompt;
					$scope.promptMessage = "Here is your next clue.";
					numberOfClues += 1;
				} else {
					$scope.complete = true;
					var data = {
						solverType: solverType,
						playTime: new Date().getTime() - startTime,
						clues: numberOfClues
					};
					logData(data, ACTION_COMPLETE);
				}
			});
	};
	
	// values used for logging
	$scope.username = guid();
	var startTime = new Date().getTime();
	var numberOfClues = 1;
	
	// -------------- private functions -----------------
	
	/**
	 * Track data in data logger
	 */
	var logData = function(data, actionCode) {
			
		var params = {
			user: $scope.username,
			actionCode: actionCode,
			appName: APP_NAME,
			data: JSON.stringify(data)
		};
		
		$.ajax({
			type: 'POST',
			url: TRACKER_URL,
			data: $.param(params)
		});
	};
	
	/**
	 * GUID Generator
	 */
	function guid() {
		function s4() {
			return 	Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
	}
});