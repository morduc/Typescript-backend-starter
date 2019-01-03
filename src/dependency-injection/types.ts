const TYPES = {
    TestController: Symbol.for('TestController'),
    AuthenticationController: Symbol.for('AuthenticationController'),
    OrganisationController: Symbol.for('OrganisationController'),
    
    AuthenticationService: Symbol.for('AuthenticationService'),
    OrganisationService: Symbol.for('OrganisationService'),
    
    
    UserStore: Symbol.for('UserStore'),
    UserStoreConf: Symbol.for('UserStoreConf'),
    CouchDBStore: Symbol.for('CouchDBStore'),
    OrganisationConf: Symbol.for('OrganisationConf'),
    RegistrationClient: Symbol.for('RegistrationClient'),
}

export { TYPES }