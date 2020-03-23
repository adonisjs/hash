[@adonisjs/hash](../README.md) › ["src/Hash"](../modules/_src_hash_.md) › [Hash](_src_hash_.hash.md)

# Class: Hash <**Config, DefaultItem**>

The Hash module exposes the API to hash values using an underlying
Hash driver.

## Type parameters

▪ **Config**: *HashConfigContract*

▪ **DefaultItem**: *ReturnValueContract*

## Hierarchy

* Manager‹HashDriverContract, HashDriverContract, object›

  ↳ **Hash**

## Implements

* ManagerContract‹HashDriverContract, HashDriverContract, object, DefaultItem›
* HashContract‹HashDriverContract›

## Index

### Constructors

* [constructor](_src_hash_.hash.md#constructor)

### Properties

* [$cacheMappings](_src_hash_.hash.md#protected-cachemappings)
* [$container](_src_hash_.hash.md#protected-container)
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
* [release](_src_hash_.hash.md#release)
* [use](_src_hash_.hash.md#use)
* [verify](_src_hash_.hash.md#verify)
* [wrapDriverResponse](_src_hash_.hash.md#protected-wrapdriverresponse)

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

*Inherited from [Hash](_src_hash_.hash.md).[$container](_src_hash_.hash.md#protected-container)*

___

###  config

• **config**: *Config*

## Methods

### `Protected` createArgon2

▸ **createArgon2**(`_`: string, `config`: any): *any*

Creating argon driver. The manager will call this method anytime
someone will ask for the `argon` driver.

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |
`config` | any |

**Returns:** *any*

___

### `Protected` createBcrypt

▸ **createBcrypt**(`_`: string, `config`: any): *any*

Creating bcrypt driver. The manager will call this method anytime
someone will ask for the `bcrypt` driver.

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |
`config` | any |

**Returns:** *any*

___

###  extend

▸ **extend**(`name`: string, `callback`: function): *void*

*Inherited from [Hash](_src_hash_.hash.md).[extend](_src_hash_.hash.md#extend)*

Extend by adding new driver. The compositon of driver
is the responsibility of the callback function

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

▸ **hash**(`value`: string): *never | any*

Hash value using the default driver

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *never | any*

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

###  release

▸ **release**<**K**>(`name`: K): *void*

*Inherited from [Hash](_src_hash_.hash.md).[release](_src_hash_.hash.md#release)*

Removes the mapping from internal cache.

**Type parameters:**

▪ **K**: *keyof object*

**Parameters:**

Name | Type |
------ | ------ |
`name` | K |

**Returns:** *void*

▸ **release**(`name`: string): *void*

*Inherited from [Hash](_src_hash_.hash.md).[release](_src_hash_.hash.md#release)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *void*

___

###  use

▸ **use**<**K**>(`name`: K): *object[K]*

*Inherited from [Hash](_src_hash_.hash.md).[use](_src_hash_.hash.md#use)*

Returns the instance of a given driver. If `name` is not defined
the default driver will be resolved.

**Type parameters:**

▪ **K**: *keyof object*

**Parameters:**

Name | Type |
------ | ------ |
`name` | K |

**Returns:** *object[K]*

▸ **use**(`name`: string): *HashDriverContract*

*Inherited from [Hash](_src_hash_.hash.md).[use](_src_hash_.hash.md#use)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *HashDriverContract*

▸ **use**(): *DefaultItem*

*Inherited from [Hash](_src_hash_.hash.md).[use](_src_hash_.hash.md#use)*

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

___

### `Protected` wrapDriverResponse

▸ **wrapDriverResponse**(`_`: string, `value`: HashDriverContract): *HashDriverContract*

*Inherited from [Hash](_src_hash_.hash.md).[wrapDriverResponse](_src_hash_.hash.md#protected-wrapdriverresponse)*

Optional method to wrap the driver response

**Parameters:**

Name | Type |
------ | ------ |
`_` | string |
`value` | HashDriverContract |

**Returns:** *HashDriverContract*
