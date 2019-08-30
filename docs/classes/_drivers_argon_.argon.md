**[@poppinss/hash](../README.md)**

[Globals](../README.md) › ["Drivers/Argon"](../modules/_drivers_argon_.md) › [Argon](_drivers_argon_.argon.md)

# Class: Argon

Hash driver built on top of argon hashing algorithm. The driver adheres
to `phc` string format.

## Hierarchy

* **Argon**

## Implements

* [ArgonContract](../interfaces/_contracts_.argoncontract.md)

## Index

### Constructors

* [constructor](_drivers_argon_.argon.md#constructor)

### Properties

* [ids](_drivers_argon_.argon.md#ids)
* [version](_drivers_argon_.argon.md#version)

### Methods

* [hash](_drivers_argon_.argon.md#hash)
* [needsReHash](_drivers_argon_.argon.md#needsrehash)
* [verify](_drivers_argon_.argon.md#verify)

### Object literals

* [params](_drivers_argon_.argon.md#params)

## Constructors

###  constructor

\+ **new Argon**(`_config`: [ArgonConfigContract](../modules/_contracts_.md#argonconfigcontract)): *[Argon](_drivers_argon_.argon.md)*

**Parameters:**

Name | Type |
------ | ------ |
`_config` | [ArgonConfigContract](../modules/_contracts_.md#argonconfigcontract) |

**Returns:** *[Argon](_drivers_argon_.argon.md)*

## Properties

###  ids

• **ids**: *Object* =  ['argon2d', 'argon2i', 'argon2id']

*Implementation of [ArgonContract](../interfaces/_contracts_.argoncontract.md).[ids](../interfaces/_contracts_.argoncontract.md#ids)*

A list of ids to find if hash belongs to this driver
or not.

___

###  version

• **version**: *number* = 19

The current argon version in use

## Methods

###  hash

▸ **hash**(`value`: string): *Promise‹string›*

*Implementation of [ArgonContract](../interfaces/_contracts_.argoncontract.md)*

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

*Implementation of [ArgonContract](../interfaces/_contracts_.argoncontract.md)*

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

*Implementation of [ArgonContract](../interfaces/_contracts_.argoncontract.md)*

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

*Implementation of [ArgonContract](../interfaces/_contracts_.argoncontract.md).[params](../interfaces/_contracts_.argoncontract.md#params)*

A list of params encoded to the hash value.

###  iterations

• **iterations**: *"t"* = "t"

###  memory

• **memory**: *"m"* = "m"

###  parallelism

• **parallelism**: *"p"* = "p"