# Smart Grid Enabled

### Run on Hardhat Network
Run Hardhat locally with `npx hardhat node`. Then
```
npx hardhat run scripts/deploy.ts --network localhost
```
### Run on Ganache
```
npx hardhat compile
npx hardhat run scripts/deploy.ts --network ganache
```