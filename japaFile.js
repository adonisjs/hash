const { join, isAbsolute, sep } = require('path')
require('ts-node').register({
	files: true,
})

function getTestFiles() {
	let userDefined = process.argv.slice(2)[0]
	if (!userDefined) {
		return 'test/**/*.spec.js'
	}

	if (isAbsolute(userDefined)) {
		userDefined = userDefined.replace(`${join(__dirname)}${sep}`, '')
	}
	return userDefined
}

const { configure } = require('japa')
configure({
	files: [getTestFiles()],
})
