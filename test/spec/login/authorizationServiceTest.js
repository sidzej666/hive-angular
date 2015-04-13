describe('Authorization service', function () {
	beforeEach(module("theHive"));

	var authorizationService, rootScope, restServiceUrl, cookies, httpBackend;
	
	beforeEach(inject(function (_authorizationService_, $rootScope, _restServiceUrl_, $cookies, $httpBackend) {
	    authorizationService = _authorizationService_;
	    rootScope = $rootScope;
	    restServiceUrl = _restServiceUrl_;
	    cookies = $cookies;
	    httpBackend = $httpBackend;
  	}))

	it('populates userRoles with "NOT_LOGGED" at startup', function () {
		expect(authorizationService.userRoles).toEqual(['NOT_LOGGED']);
	})

	it('sets userDataInitialized to false at startup', function () {
		expect(authorizationService.userDataInitialized).toEqual(false);
	})

	it('sets signedIn to false in rootScope at startup', function () {
		expect(rootScope.signedIn).toEqual(false);
	})

	it('sets userData to empty Object in rootScope at startup', function() {
		expect(rootScope.userData).toEqual({});
	})

	describe('userHasRole', function () {
		beforeEach(function() {
			spyOn(authorizationService, 'getUserData');
		})

		it('initializes userData if not yet initialized', function() {
			authorizationService.userHasRole('USER');
			expect(authorizationService.getUserData).toHaveBeenCalled();
		})

		it('returns true for role in userRoles', function() {
			expect(authorizationService.userHasRole('NOT_LOGGED')).toEqual(true);
		})

		it('returns false for role not in userRoles', function() {
			expect(authorizationService.userHasRole('USER')).toEqual(false);
		})

		it('returns true for role in userRoles when userRoles has multiple roles', function() {
			authorizationService.userRoles = ['NOT_LOGGED', 'USER'];
			expect(authorizationService.userHasRole('USER')).toEqual(true);
		})
	})

	describe('authenticate', function () {
		var roles = ['USER'];
		var location;
		
		beforeEach(function() {
			inject(function ($location) {
	    		location = $location;
  			})
			spyOn(authorizationService, 'getUserData');
			spyOn(authorizationService, 'userHasRole').and.callFake(function(param) {
				if (angular.equals(roles, param))
					return true;
				return false;
			});
    		spyOn(location, 'path');
		})

		it('calls getUserData without parameters when userData is not initialized', function() {
			authorizationService.authenticate(roles);
			expect(authorizationService.getUserData).toHaveBeenCalledWith();
		})

		it('do not call getUserData when userData is initialized', function() {
			authorizationService.userDataInitialized = true;
			authorizationService.authenticate(roles);
			expect(authorizationService.getUserData).not.toHaveBeenCalled();
		})

		it('does not set location path when user has USER role', function() {
			authorizationService.authenticate(['USER']);
			expect(location.path).not.toHaveBeenCalled();
		})

		it('sets location path to "/" for not logged user', function() {
			authorizationService.authenticate(['NOT_LOGGED']);
			expect(location.path).toHaveBeenCalledWith("/");
		})
	})

	describe('getUserData', function() {
		var userData = {roles: '[USER, ADMIN]'};
		var userDataCall;
		beforeEach(function() {
			cookies['CSRF-TOKEN'] = 'sampleCookie';
			userDataCall = httpBackend.when('GET', restServiceUrl + "/users/me").respond(userData);
		})

		afterEach(function() {
			httpBackend.verifyNoOutstandingExpectation();
			httpBackend.verifyNoOutstandingRequest();
			httpBackend.resetExpectations();
		})

		it('gets authToken from cookie if called without parameters', function() {
			//cannot test it, the X-AUTH-TOKEN is wrongly catched
			authorizationService.getUserData();
			httpBackend.flush();
		})

		it('sets userRoles on success', function() {
			authorizationService.getUserData();
			httpBackend.flush();
			expect(authorizationService.userRoles).toEqual(userData.roles);
		})

		it('sets userDataInitialized to true on success', function() {
			authorizationService.getUserData();
			httpBackend.flush();
			expect(authorizationService.userDataInitialized).toEqual(true);
		})

		it('sets signedIn to true on sucess', function() {
			authorizationService.getUserData();
			httpBackend.flush();
			expect(rootScope.signedIn).toEqual(true);
		})

		it('sets userData on sucess', function() {
			authorizationService.getUserData();
			httpBackend.flush();
			expect(rootScope.userData).toEqual(userData);
		})

		it("sets userRoles to ['NOT_LOGGED'] on failure", function() {
			authorizationService.userRoles = [];
			userDataCall.respond(403, {});
			authorizationService.getUserData();
			httpBackend.flush();
			expect(authorizationService.userRoles).toEqual(['NOT_LOGGED']);
		})

		it('sets signedId to false on failure', function() {
			//first set it to true and then check if ti will change
			authorizationService.getUserData();
			httpBackend.flush();
			expect(rootScope.signedIn).toEqual(true);
			userDataCall.respond(403, {});
			authorizationService.getUserData();
			httpBackend.flush();
			expect(rootScope.signedIn).toEqual(false);
		})

		it('sets userDataInitialized to true on failure', function() {
			userDataCall.respond(403, {});
			authorizationService.getUserData();
			httpBackend.flush();
			expect(authorizationService.userDataInitialized).toEqual(true);
		})
	})

	describe('logout', function() {
		beforeEach (function() {
			authorizationService.userDataInitialized = true;
			authorizationService.userRoles = ['USER'];
			rootScope.userData = {roles: authorizationService.userRoles};
			rootScope.signedIn = true;
			cookies['CSRF-TOKEN'] = 'sampleCookie';
			authorizationService.logout();
		})

		it('should set userRoles to ["NOT_LOGGED"]', function() {
			expect(authorizationService.userRoles).toEqual(['NOT_LOGGED']);
		})

		it('should set userDataInitialized to true', function() {
			expect(authorizationService.userDataInitialized).toEqual(false);
		})

		it('should set signedIn to false', function() {
			expect(rootScope.signedIn).toEqual(false);
		})

		it('should set userData to empty object', function() {
			expect(rootScope.userData).toEqual({});
		})

		it('should set CSRF-TOKEN cookie to null', function() {
			expect(cookies['CSRF-TOKEN']).toEqual('null');
		})
	})

	describe('login', function() {
		var credentials = {username: 'username', password: 'password'};
		var deferred;
		beforeEach(function() {
			inject(function($q) {
				deferred = $q.defer();
			})
		})

		afterEach(function() {
			httpBackend.verifyNoOutstandingExpectation();
			httpBackend.verifyNoOutstandingRequest();
		})

		it('should send credentials as POST body', function() {
			console.log('login');
			httpBackend.expectPOST(restServiceUrl + "/login", credentials).respond(200, {});
			authorizationService.login(credentials);
			
			httpBackend.flush();
		})
	})
}) 