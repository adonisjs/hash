**[@poppinss/hash](../README.md)**

[Globals](../README.md) › ["Drivers/Bcrypt"](../modules/_drivers_bcrypt_.md) › [Bcrypt](_drivers_bcrypt_.bcrypt.md)

# Class: Bcrypt

Generates and verifies hash using Bcrypt as underlying
algorigthm.

## Hierarchy

* **Bcrypt**

## Implements

* [BcryptContract](../interfaces/_contracts_.bcryptcontract.md)

## Index

### Constructors

* [constructor](_drivers_bcrypt_.bcrypt.md#constructor)

### Properties

* [ids](_drivers_bcrypt_.bcrypt.md#ids)
* [version](_drivers_bcrypt_.bcrypt.md#version)

### Methods

* [hash](_drivers_bcrypt_.bcrypt.md#hash)
* [needsReHash](_drivers_bcrypt_.bcrypt.md#needsrehash)
* [verify](_drivers_bcrypt_.bcrypt.md#verify)

### Object literals

* [params](_drivers_bcrypt_.bcrypt.md#params)

## Constructors

###  constructor

\+ **new Bcrypt**(`_config`: [BcryptConfigContract](../modules/_contracts_.md#bcryptconfigcontract)): *[Bcrypt](_drivers_bcrypt_.bcrypt.md)*

**Parameters:**

Name | Type |
------ | ------ |
`_config` | [BcryptConfigContract](../modules/_contracts_.md#bcryptconfigcontract) |

**Returns:** *[Bcrypt](_drivers_bcrypt_.bcrypt.md)*

## Properties

###  ids

• **ids**: *Object* =  ['bcrypt']

*Implementation of [BcryptContract](../interfaces/_contracts_.bcryptcontract.md).[ids](../interfaces/_contracts_.bcryptcontract.md#ids)*

___

###  version

• **version**: *number* = 98

## Methods

###  hash

▸ **hash**(`value`: string): *Promise‹string›*

*Implementation of [BcryptContract](../interfaces/_contracts_.bcryptcontract.md)*

Returns hash for a given value

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *Promise‹string›*

___

###  needsReHash

▸ **needsReHash**(`value`: string): *boolean*

*Implementation of [BcryptContract](../interfaces/_contracts_.bcryptcontract.md)*

Returns a boolean telling if hash needs a rehash. Returns true when
one of the original params have been changed.

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *boolean*

___

###  verify

▸ **verify**(`hashedValue`: string, `plainValue`: string): *Promise‹boolean›*

*Implementation of [BcryptContract](../interfaces/_contracts_.bcryptcontract.md)*

Verify hash to know if two values are same.

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |
`plainValue` | string |

**Returns:** *Promise‹boolean›*

## Object literals

###  params

### ▪ **params**: *object*

*Implementation of [BcryptContract](../interfaces/_contracts_.bcryptcontract.md).[params](../interfaces/_contracts_.bcryptcontract.md#params)*

###  rounds

• **rounds**: *"r"* = "r"