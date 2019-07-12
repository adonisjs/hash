> **[@poppinss/hash](../README.md)**

[Globals](../README.md) / ["contracts"](_contracts_.md) /

# External module: "contracts"

### Index

#### Interfaces

* [ArgonContract](../interfaces/_contracts_.argoncontract.md)
* [BcryptContract](../interfaces/_contracts_.bcryptcontract.md)
* [HashContract](../interfaces/_contracts_.hashcontract.md)
* [HashDriverContract](../interfaces/_contracts_.hashdrivercontract.md)

#### Type aliases

* [ArgonConfigContract](_contracts_.md#argonconfigcontract)
* [BcryptConfigContract](_contracts_.md#bcryptconfigcontract)
* [HashConfigContract](_contracts_.md#hashconfigcontract)
* [HashDrivers](_contracts_.md#hashdrivers)

## Type aliases

###  ArgonConfigContract

Ƭ **ArgonConfigContract**: *object*

Shape of argon2 config

#### Type declaration:

___

###  BcryptConfigContract

Ƭ **BcryptConfigContract**: *object*

Shape of bcrypt config

#### Type declaration:

___

###  HashConfigContract

Ƭ **HashConfigContract**: *object & `ExtractDriversConfig<DriversList>`*

Shape of config accepted by the Hash module

___

###  HashDrivers

Ƭ **HashDrivers**: *object*

A list of default hash drivers. Upon extending, do make
sure to extend the given type aswell.

#### Type declaration: