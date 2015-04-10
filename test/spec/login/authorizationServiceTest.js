describe('Authorization service', function () {
	beforeEach(module("theHive"));

	var authorizationService, rootScope;
	
	beforeEach(inject(function (_authorizationService_, $rootScope) {
	    authorizationService = _authorizationService_;
	    rootScope = $rootScope.$new();
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
		var cookies;
		beforeEach(function() {
			inject(function ($cookies) {
				cookies = $cookies;
			})
			cookies['CSRF-TOKEN'] = 'sampleCookie';
		})

		it('gets authToken from cookie if called without parameters', function(){
			
		})
	})
}) 