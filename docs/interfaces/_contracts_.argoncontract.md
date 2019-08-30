**[@poppinss/hash](../README.md)**

[Globals](../README.md) › ["contracts"](../modules/_contracts_.md) › [ArgonContract](_contracts_.argoncontract.md)

# Interface: ArgonContract

Argon2 driver contract

## Hierarchy

* [HashDriverContract](_contracts_.hashdrivercontract.md)

  * **ArgonContract**

## Implemented by

* [Argon](../classes/_drivers_argon_.argon.md)

## Index

### Properties

* [ids](_contracts_.argoncontract.md#ids)
* [params](_contracts_.argoncontract.md#params)

### Methods

* [hash](_contracts_.argoncontract.md#hash)
* [needsReHash](_contracts_.argoncontract.md#needsrehash)
* [verify](_contracts_.argoncontract.md#verify)

## Properties

###  ids

• **ids**: *["argon2d", "argon2i", "argon2id"]*

*Overrides [HashDriverContract](_contracts_.hashdrivercontract.md).[ids](_contracts_.hashdrivercontract.md#ids)*

___

###  params

• **params**: *object*

*Overrides [HashDriverContract](_contracts_.hashdrivercontract.md).[params](_contracts_.hashdrivercontract.md#params)*

#### Type declaration:

## Methods

###  hash

▸ **hash**(`value`: string): *Promise‹string›*

*Inherited from [HashDriverContract](_contracts_.hashdrivercontract.md).[hash](_contracts_.hashdrivercontract.md#hash)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *Promise‹string›*

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

▸ **verify**(`hashedValue`: string, `plainValue`: string): *Promise‹boolean›*

*Inherited from [HashDriverContract](_contracts_.hashdrivercontract.md).[verify](_contracts_.hashdrivercontract.md#verify)*

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |
`plainValue` | string |

**Returns:** *Promise‹boolean›*