declare module '@ioc:Adonis/Core/Hash' {
	interface HashersList {
		argon: HashDrivers['argon']
		bcrypt: HashDrivers['bcrypt']
	}
}
