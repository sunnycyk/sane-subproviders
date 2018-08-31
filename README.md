## @0xproject/subproviders

A few useful web3 subproviders forked off from https://github.com/0xProject/0x-monorepo/tree/development/packages/subproviders but with a focus on a small number of dependencies and no support for usb hardware.

0x have written up a [Wiki](https://0xproject.com/wiki#Web3-Provider-Examples) article detailing some use cases of their subprovider package.
Their documentation can also be applied to this package.

### Read the [Documentation](https://0xproject.com/docs/subproviders).

## Installation

```
pnpm install sane-subproviders
```

If your project is in [TypeScript](https://www.typescriptlang.org/), add the following to your `tsconfig.json`:

```json
"compilerOptions": {
    "typeRoots": ["node_modules/@0xproject/typescript-typings/types", "node_modules/@types"],
}
```
