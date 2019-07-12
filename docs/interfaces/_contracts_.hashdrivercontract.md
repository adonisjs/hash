> **[@poppinss/hash](../README.md)**

[Globals](../README.md) / ["contracts"](../modules/_contracts_.md) / [HashDriverContract](_contracts_.hashdrivercontract.md) /

# Interface: HashDriverContract

Every driver must implement the Hash driver
contract

## Hierarchy

* **HashDriverContract**

  * [BcryptContract](_contracts_.bcryptcontract.md)

  * [ArgonContract](_contracts_.argoncontract.md)

### Index

#### Properties

* [ids](_contracts_.hashdrivercontract.md#ids)
* [params](_contracts_.hashdrivercontract.md#params)

#### Methods

* [hash](_contracts_.hashdrivercontract.md#hash)
* [needsReHash](_contracts_.hashdrivercontract.md#needsrehash)
* [verify](_contracts_.hashdrivercontract.md#verify)

## Properties

###  ids

• **ids**: *string[]*

___

###  params

• **params**: *object*

#### Type declaration:

● \[▪ **key**: *string*\]: string

## Methods

###  hash

▸ **hash**(`value`: string): *`Promise<string>`*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *`Promise<string>`*

___

###  needsReHash

▸ **needsReHash**(`hashedValue`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |

**Returns:** *boolean*

___

###  verify

▸ **verify**(`hashedValue`: string, `plainValue`: string): *`Promise<boolean>`*

**Parameters:**

Name | Type |
------ | ------ |
`hashedValue` | string |
`plainValue` | string |

**Returns:** *`Promise<boolean>`*