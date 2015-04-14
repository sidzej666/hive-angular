describe('LoginController', function() {
	var scope, authorizationServiceMock;
	var invalidCredentials = {username: 'username', password: 'wrongPassword'};
	var correctCredentials = {username: 'username', password: 'goodPassword'};

	beforeEach(module('theHive'));

	//create service mock
	beforeEach(function() {
		mockedPromised = {
			successs: function() {

			}
		};
		authorizationServiceMock = {
			login: function(credentials) {
				if (credentials.username == correctCredentials.username 
					&& credentials.password == correctCredentials.password) {
					return {
						then: function() {success()}, 
						error: function() {return this},
						success: function() {console.log('aaaaaa'); return this}
					}
				} else {
					console.log('in error')
					return {
						then: function() {error()}, 
						error: function() {console.log('bbbb'); return this},
						success: function() {return this}
					}
				}
			},
			getUserData: function() {

			}
		}
		spyOn(authorizationServiceMock, 'login').and.callThrough();
	})

	beforeEach(inject(function($controller, $rootScope, $httpBackend, _restServiceUrl_) {
  		scope = $rootScope;
  		$controller('LoginCtrl', {$scope: scope, authorizationService: authorizationServiceMock});
  		httpBackend = $httpBackend;
  		restServiceUrl = _restServiceUrl_;
	}));

	it('should initialize invalidCredentials in scope to false', function() {
		expect(scope.invalidCredentials).toBe(false);
	})

	it('should send credentials from scope to service layer', function() {
		scope.username = 'username';
		scope.password = 'goodPassword';
		scope.login();
		expect(authorizationServiceMock.login).toHaveBeenCalledWith(correctCredentials);
	})

	it('should keep invalidCredentials to true when unsuccessfull login', function() {
		scope.password = 'badPassword';
		scope.login();
		httpBackend.expectGET(restServiceUrl + '/users/me').respond(400);
		httpBackend.flush()
		scope.$digest();
		expect(scope.invalidCredentials).toBe(true);
	})

	
})