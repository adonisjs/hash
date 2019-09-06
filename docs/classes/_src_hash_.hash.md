**[@adonisjs/hash](../README.md)**

[Globals](../README.md) › ["src/Hash"](../modules/_src_hash_.md) › [Hash](_src_hash_.hash.md)

# Class: Hash <**Config, DefaultItem**>

The Hash module exposes the API to hash values using an underlying
Hash driver.

## Type parameters

▪ **Config**: *HashConfigContract*

▪ **DefaultItem**: *DriverContract*

## Hierarchy

* Manager‹HashDriverContract, object›

  * **Hash**

## Implements

* ManagerContract‹HashDriverContract, object, DefaultItem›
* HashContract

## Index

### Constructors

* [constructor](_src_hash_.hash.md#constructor)

### Properties

* [$cacheMappings](_src_hash_.hash.md#protected-$cachemappings)
* [$container](_src_hash_.hash.md#protected-$container)
* [config](_src_hash_.hash.md#config)

### Methods

* [createArgon2](_src_hash_.hash.md#protected-createargon2)
* [createBcrypt](_src_hash_.hash.md#protected-createbcrypt)
* [extend](_src_hash_.hash.md#extend)
* [getDefaultMappingName](_src_hash_.hash.md#protected-getdefaultmappingname)
* [getMappingConfig](_src_hash_.hash.md#protected-getmappingconfig)
* [getMappingDriver](_src_hash_.hash.md#protected-getmappingdriver)
* [hash](_src_hash_.hash.md#hash)
* [needsReHash](_src_hash_.hash.md#needsrehash)
* [use](_src_hash_.hash.md#use)
* [verify](_src_hash_.hash.md#verify)

## Constructors

###  constructor

\+ **new Hash**(`container`: any, `config`: Config): *[Hash](_src_hash_.hash.md)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`container` | any |
`config` | Config |

**Returns:** *[Hash](_src_hash_.hash.md)*

## Properties

### `Protected` $cacheMappings

• **$cacheMappings**: *boolean* = true

*Overrides void*

___

### `Protected` $container

• **$container**: *any*

*Inherited from void*

___

###  config

• **config**: *Config*

## Methods

### `Protected` createArgon2

▸ **createArgon2**(`_mappingName`: string, `config`: any): *any*

Creating argon driver. The manager will call this method anytime
someone will ask for the `argon` driver.

**Parameters:**

Name | Type |
------ | ------ |
`_mappingName` | string |
`config` | any |

**Returns:** *any*

___

### `Protected` createBcrypt

▸ **createBcrypt**(`_mappingName`: string, `config`: any): *any*

Creating bcrypt driver. The manager will call this method anytime
someone will ask for the `bcrypt` driver.

**Parameters:**

Name | Type |
------ | ------ |
`_mappingName` | string |
`config` | any |

**Returns:** *any*

___

###  extend

▸ **extend**(`name`: string, `callback`: function): *void*

*Inherited from void*

**Parameters:**

▪ **name**: *string*

▪ **callback**: *function*

▸ (`container`: any, `mappingName`: string, `config`: any): *HashDriverContract*

**Parameters:**

Name | Type |
------ | ------ |
`container` | any |
`mappingName` | string |
`config` | any |

**Returns:** *void*

___

### `Protected` getDefaultMappingName

▸ **getDefaultMappingName**(): *string*

*Overrides void*

Pulling the default driver name from the user config.

**Returns:** *string*

___

### `Protected` getMappingConfig

▸ **getMappingConfig**(`name`: string): *any*

*Overrides void*

Returns the config for a mapping

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *any*

___

### `Protected` getMappingDriver

▸ **getMappingDriver**(`name`: string): *string | undefined*

*Overrides void*

Returns the driver name for a mapping

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *string | undefined*

___

###  hash

▸ **hash**(`value`: string): *Promise‹string›*

Hash value using the default driver

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *Promise‹string›*

___

###  needsReHash

▸ **needsReHash**(`hashedValue`: string): *boolean*

Find if value needs to be re-hashed as per the default driver.

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |

**Returns:** *boolean*

___

###  use

▸ **use**<**K**>(`name`: K): *MappingsList[K]*

*Inherited from void*

**Type parameters:**

▪ **K**: *keyof object*

**Parameters:**

Name | Type |
------ | ------ |
`name` | K |

**Returns:** *MappingsList[K]*

▸ **use**(`name`: string): *HashDriverContract*

*Inherited from void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *HashDriverContract*

▸ **use**(): *DefaultItem*

*Inherited from void*

**Returns:** *DefaultItem*

___

###  verify

▸ **verify**(`hashedValue`: string, `plainValue`: string): *Promise‹boolean›*

Verify value using the default driver

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |
`plainValue` | string |

**Returns:** *Promise‹boolean›*