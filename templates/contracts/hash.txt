/**
 * Contract source: https://git.io/Jee3t
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

declare module '@ioc:Adonis/Core/Hash' {
  interface HashList {
    bcrypt: {
      config: BcryptConfigContract,
      implementation: BcryptContract,
    },
    argon: {
      config: ArgonConfigContract,
      implementation: ArgonContract,
    }
  }
}
