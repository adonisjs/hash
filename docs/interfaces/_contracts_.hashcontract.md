> **[@poppinss/hash](../README.md)**

[Globals](../README.md) / ["contracts"](../modules/_contracts_.md) / [HashContract](_contracts_.hashcontract.md) /

# Interface: HashContract <**Drivers, Config, DefaultDriver**>

Hash mananger interface

## Type parameters

▪ **Drivers**: *`DriverNodesList<HashDriverContract, any>`*

▪ **Config**: *[HashConfigContract](../modules/_contracts_.md#hashconfigcontract)‹*`Drivers`*›*

▪ **DefaultDriver**: *`ExtractDefaultDriverImpl<Drivers, Config>`*

## Hierarchy

* `ManagerContract<HashDriverContract, ExtractDriversImpl<Drivers>, DefaultDriver>`

  * **HashContract**

## Implemented by

* [Hash](../classes/_hash_.hash.md)

### Index

#### Methods

* [driver](_contracts_.hashcontract.md#driver)
* [extend](_contracts_.hashcontract.md#extend)
* [hash](_contracts_.hashcontract.md#hash)
* [needsReHash](_contracts_.hashcontract.md#needsrehash)
* [verify](_contracts_.hashcontract.md#verify)

## Methods

###  driver

▸ **driver**<**K**>(`name`: `K`): *`DriversList[K]`*

*Inherited from void*

**Type parameters:**

▪ **K**: *keyof ExtractDriversImpl<Drivers>*

**Parameters:**

Name | Type |
------ | ------ |
`name` | `K` |

**Returns:** *`DriversList[K]`*

▸ **driver**(`name`: string): *[HashDriverContract](_contracts_.hashdrivercontract.md)*

*Inherited from void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *[HashDriverContract](_contracts_.hashdrivercontract.md)*

▸ **driver**(): *`DefaultDriver`*

*Inherited from void*

**Returns:** *`DefaultDriver`*

___

###  extend

▸ **extend**(`name`: string, `callback`: function): *void*

*Inherited from void*

**Parameters:**

▪ **name**: *string*

▪ **callback**: *function*

▸ (`container`: any): *[HashDriverContract](_contracts_.hashdrivercontract.md)*

**Parameters:**

Name | Type |
------ | ------ |
`container` | any |

**Returns:** *void*

___

###  hash

▸ **hash**(`value`: string): *`ReturnType<DefaultDriver["hash"]>`*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *`ReturnType<DefaultDriver["hash"]>`*

___

###  needsReHash

▸ **needsReHash**(`hashedValue`: string): *`ReturnType<DefaultDriver["needsReHash"]>`*

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |

**Returns:** *`ReturnType<DefaultDriver["needsReHash"]>`*

___

###  verify

▸ **verify**(`hashedValue`: string, `plainValue`: string): *`ReturnType<DefaultDriver["verify"]>`*

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |
`plainValue` | string |

**Returns:** *`ReturnType<DefaultDriver["verify"]>`*