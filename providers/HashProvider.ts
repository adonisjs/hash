/*
 * @adonisjs/hash
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { IocContract } from '@adonisjs/fold'

export default class HashProvider {
	constructor(protected container: IocContract) {}

	public register() {
		this.container.singleton('Adonis/Core/Hash', () => {
			const config = this.container.use('Adonis/Core/Config').get('hash', {})
			const { Hash } = require('../src/Hash')
			return new Hash(this, config)
		})
	}
}
