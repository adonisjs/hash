[@adonisjs/hash](../README.md) › ["src/Drivers/Argon"](../modules/_src_drivers_argon_.md) › [Argon](_src_drivers_argon_.argon.md)

# Class: Argon

Hash driver built on top of argon hashing algorithm. The driver adheres
to `phc` string format.

## Hierarchy

* **Argon**

## Implements

* ArgonContract

## Index

### Constructors

* [constructor](_src_drivers_argon_.argon.md#constructor)

### Properties

* [ids](_src_drivers_argon_.argon.md#ids)
* [version](_src_drivers_argon_.argon.md#version)

### Methods

* [hash](_src_drivers_argon_.argon.md#hash)
* [needsReHash](_src_drivers_argon_.argon.md#needsrehash)
* [verify](_src_drivers_argon_.argon.md#verify)

### Object literals

* [params](_src_drivers_argon_.argon.md#params)

## Constructors

###  constructor

\+ **new Argon**(`config`: ArgonConfig): *[Argon](_src_drivers_argon_.argon.md)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | ArgonConfig |

**Returns:** *[Argon](_src_drivers_argon_.argon.md)*

## Properties

###  ids

• **ids**: *ArgonContract["ids"]* = ['argon2d', 'argon2i', 'argon2id']

A list of ids to find if hash belongs to this driver
or not.

___

###  version

• **version**: *number* = 19

The current argon version in use

## Methods

###  hash

▸ **hash**(`value`: string): *Promise‹string›*

Hash a value using argon algorithm. The options can be used to override
default settings.

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *Promise‹string›*

___

###  needsReHash

▸ **needsReHash**(`value`: string): *boolean*

Returns a boolean telling if the hash needs a rehash or not. The rehash is
required when

1. The argon2 version is changed
2. Number of iterations are changed.
3. The memory value is changed.
4. The parellelism value is changed.
5. The argon variant is changed.

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *boolean*

___

###  verify

▸ **verify**(`hashedValue`: string, `plainValue`: string): *Promise‹boolean›*

Verifies the hash against a plain value to find if it's
a valid hash or not.

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |
`plainValue` | string |

**Returns:** *Promise‹boolean›*

## Object literals

###  params

### ▪ **params**: *object*

A list of params encoded to the hash value.

###  iterations

• **iterations**: *"t"* = "t"

###  memory

• **memory**: *"m"* = "m"

###  parallelism

• **parallelism**: *"p"* = "p"
