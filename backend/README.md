## deployments

Mumbai:
```
$ RPC=https://polygon-mumbai... HOST=0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9 SUPERTOKEN=0x918e0d5c96cac79674e2d38066651212be3c9c48 npx hardhat --network any run scripts/deploy.js
contract deployed to 0xBB9DEbDDb943B46703e205D26583e129dcd3cF3d
```

Gnosis Chain
```
$ RPC=https://xdai-mainnet.rpc... HOST=0x2dFe937cD98Ab92e59cF3139138f18c823a4efE7 SUPERTOKEN=0x2bF2ba13735160624a0fEaE98f6aC8F70885eA61 npx hardhat --network any run scripts/deploy.js
contract deployed to 0x6B7f3c66BCb255f2d9C88aeeBE95143Da9546e65
```

Note: The used SuperAppBaseCFA has a flaw, uses `registerApp` instead of `registerAppWithKey`, thus won't be able to deploy to permissioned mainnets. Was hacked in node_modules for deploying.