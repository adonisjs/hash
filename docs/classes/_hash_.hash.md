**[@poppinss/hash](../README.md)**

[Globals](../README.md) › ["Hash"](../modules/_hash_.md) › [Hash](_hash_.hash.md)

# Class: Hash <**Drivers, Config, DefaultDriver**>

The Hash module exposes the API to hash values using an underlying
Hash driver.

## Type parameters

▪ **Drivers**: *DriverNodesList‹[HashDriverContract](../interfaces/_contracts_.hashdrivercontract.md), any›*

▪ **Config**: *[HashConfigContract](../modules/_contracts_.md#hashconfigcontract)‹Drivers›*

▪ **DefaultDriver**: *ExtractDefaultDriverImpl‹Drivers, Config›*

## Hierarchy

* Manager‹[HashDriverContract](../interfaces/_contracts_.hashdrivercontract.md), ExtractDriversImpl‹Drivers›, DefaultDriver›

  * **Hash**

## Implements

* ManagerContract‹[HashDriverContract](../interfaces/_contracts_.hashdrivercontract.md), ExtractDriversImpl‹Drivers›, DefaultDriver›
* [HashContract](../interfaces/_contracts_.hashcontract.md)‹Drivers›

## Index

### Constructors

* [constructor](_hash_.hash.md#constructor)

### Properties

* [$cacheDrivers](_hash_.hash.md#protected-$cachedrivers)
* [$container](_hash_.hash.md#protected-$container)
* [config](_hash_.hash.md#config)

### Methods

* [createArgon](_hash_.hash.md#protected-createargon)
* [createBcrypt](_hash_.hash.md#protected-createbcrypt)
* [driver](_hash_.hash.md#driver)
* [extend](_hash_.hash.md#extend)
* [getDefaultDriverName](_hash_.hash.md#protected-getdefaultdrivername)
* [hash](_hash_.hash.md#hash)
* [needsReHash](_hash_.hash.md#needsrehash)
* [verify](_hash_.hash.md#verify)

## Constructors

###  constructor

\+ **new Hash**(`container`: any, `config`: Config): *[Hash](_hash_.hash.md)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`container` | any |
`config` | Config |

**Returns:** *[Hash](_hash_.hash.md)*

## Properties

### `Protected` $cacheDrivers

• **$cacheDrivers**: *boolean* = true

*Overrides void*

___

### `Protected` $container

• **$container**: *any*

*Inherited from void*

___

###  config

• **config**: *Config*

## Methods

### `Protected` createArgon

▸ **createArgon**(): *any*

Creating argon driver. The manager will call this method anytime
someone will ask for the `argon` driver.

**Returns:** *any*

___

### `Protected` createBcrypt

▸ **createBcrypt**(): *any*

Creating bcrypt driver. The manager will call this method anytime
someone will ask for the `bcrypt` driver.

**Returns:** *any*

___

###  driver

▸ **driver**<**K**>(`name`: K): *DriversList[K]*

*Implementation of [HashContract](../interfaces/_contracts_.hashcontract.md)*

*Inherited from void*

**Type parameters:**

▪ **K**: *keyof ExtractDriversImpl<Drivers>*

**Parameters:**

Name | Type |
------ | ------ |
`name` | K |

**Returns:** *DriversList[K]*

▸ **driver**(`name`: string): *[HashDriverContract](../interfaces/_contracts_.hashdrivercontract.md)*

*Implementation of [HashContract](../interfaces/_contracts_.hashcontract.md)*

*Inherited from void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *[HashDriverContract](../interfaces/_contracts_.hashdrivercontract.md)*

▸ **driver**(): *DefaultDriver*

*Implementation of [HashContract](../interfaces/_contracts_.hashcontract.md)*

*Inherited from void*

**Returns:** *DefaultDriver*

___

###  extend

▸ **extend**(`name`: string, `callback`: function): *void*

*Inherited from void*

**Parameters:**

▪ **name**: *string*

▪ **callback**: *function*

▸ (`container`: any): *[HashDriverContract](../interfaces/_contracts_.hashdrivercontract.md)*

**Parameters:**

Name | Type |
------ | ------ |
`container` | any |

**Returns:** *void*

___

### `Protected` getDefaultDriverName

▸ **getDefaultDriverName**(): *HashConfigContract<Drivers>["driver"]*

*Overrides void*

Pulling the default driver name from the user config.

**Returns:** *HashConfigContract<Drivers>["driver"]*

___

###  hash

▸ **hash**(`value`: string): *ReturnType‹DefaultDriver["hash"]›*

*Implementation of [HashContract](../interfaces/_contracts_.hashcontract.md)*

Hash value using the default driver

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *ReturnType‹DefaultDriver["hash"]›*

___

###  needsReHash

▸ **needsReHash**(`hashedValue`: string): *ReturnType‹DefaultDriver["needsReHash"]›*

*Implementation of [HashContract](../interfaces/_contracts_.hashcontract.md)*

Find if value needs to be re-hashed as per the default driver.

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |

**Returns:** *ReturnType‹DefaultDriver["needsReHash"]›*

___

###  verify

▸ **verify**(`hashedValue`: string, `plainValue`: string): *ReturnType‹DefaultDriver["verify"]›*

*Implementation of [HashContract](../interfaces/_contracts_.hashcontract.md)*

Verify value using the default driver

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |
`plainValue` | string |

**Returns:** *ReturnType‹DefaultDriver["verify"]›*