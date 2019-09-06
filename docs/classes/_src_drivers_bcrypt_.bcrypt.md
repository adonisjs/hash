**[@adonisjs/hash](../README.md)**

[Globals](../README.md) › ["src/Drivers/Bcrypt"](../modules/_src_drivers_bcrypt_.md) › [Bcrypt](_src_drivers_bcrypt_.bcrypt.md)

# Class: Bcrypt

Generates and verifies hash using Bcrypt as underlying
algorigthm.

## Hierarchy

* **Bcrypt**

## Implements

* BcryptContract

## Index

### Constructors

* [constructor](_src_drivers_bcrypt_.bcrypt.md#constructor)

### Properties

* [ids](_src_drivers_bcrypt_.bcrypt.md#ids)
* [version](_src_drivers_bcrypt_.bcrypt.md#version)

### Methods

* [hash](_src_drivers_bcrypt_.bcrypt.md#hash)
* [needsReHash](_src_drivers_bcrypt_.bcrypt.md#needsrehash)
* [verify](_src_drivers_bcrypt_.bcrypt.md#verify)

### Object literals

* [params](_src_drivers_bcrypt_.bcrypt.md#params)

## Constructors

###  constructor

\+ **new Bcrypt**(`_config`: BcryptConfigContract): *[Bcrypt](_src_drivers_bcrypt_.bcrypt.md)*

**Parameters:**

Name | Type |
------ | ------ |
`_config` | BcryptConfigContract |

**Returns:** *[Bcrypt](_src_drivers_bcrypt_.bcrypt.md)*

## Properties

###  ids

• **ids**: *Object* =  ['bcrypt']

___

###  version

• **version**: *number* = 98

## Methods

###  hash

▸ **hash**(`value`: string): *Promise‹string›*

Returns hash for a given value

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *Promise‹string›*

___

###  needsReHash

▸ **needsReHash**(`value`: string): *boolean*

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

###  rounds

• **rounds**: *"r"* = "r"