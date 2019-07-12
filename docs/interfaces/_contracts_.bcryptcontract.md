> **[@poppinss/hash](../README.md)**

[Globals](../README.md) / ["contracts"](../modules/_contracts_.md) / [BcryptContract](_contracts_.bcryptcontract.md) /

# Interface: BcryptContract

Bcrypt driver contract

## Hierarchy

* [HashDriverContract](_contracts_.hashdrivercontract.md)

  * **BcryptContract**

## Implemented by

* [Bcrypt](../classes/_drivers_bcrypt_.bcrypt.md)

### Index

#### Properties

* [ids](_contracts_.bcryptcontract.md#ids)
* [params](_contracts_.bcryptcontract.md#params)

#### Methods

* [hash](_contracts_.bcryptcontract.md#hash)
* [needsReHash](_contracts_.bcryptcontract.md#needsrehash)
* [verify](_contracts_.bcryptcontract.md#verify)

## Properties

###  ids

• **ids**: *["bcrypt"]*

*Overrides [HashDriverContract](_contracts_.hashdrivercontract.md).[ids](_contracts_.hashdrivercontract.md#ids)*

___

###  params

• **params**: *object*

*Overrides [HashDriverContract](_contracts_.hashdrivercontract.md).[params](_contracts_.hashdrivercontract.md#params)*

#### Type declaration:

## Methods

###  hash

▸ **hash**(`value`: string): *`Promise<string>`*

*Inherited from [HashDriverContract](_contracts_.hashdrivercontract.md).[hash](_contracts_.hashdrivercontract.md#hash)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *`Promise<string>`*

___

###  needsReHash

▸ **needsReHash**(`hashedValue`: string): *boolean*

*Inherited from [HashDriverContract](_contracts_.hashdrivercontract.md).[needsReHash](_contracts_.hashdrivercontract.md#needsrehash)*

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |

**Returns:** *boolean*

___

###  verify

▸ **verify**(`hashedValue`: string, `plainValue`: string): *`Promise<boolean>`*

*Inherited from [HashDriverContract](_contracts_.hashdrivercontract.md).[verify](_contracts_.hashdrivercontract.md#verify)*

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |
`plainValue` | string |

**Returns:** *`Promise<boolean>`*