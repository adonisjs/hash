/*
 * @adonisjs/hash
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class HashProvider {
	constructor(protected app: ApplicationContract) {}

	public register() {
		this.app.container.singleton('Adonis/Core/Hash', () => {
			const config = this.app.container.use('Adonis/Core/Config').get('hash', {})
			const { Hash } = require('../src/Hash')
			return new Hash(this, config)
		})
	}
}
