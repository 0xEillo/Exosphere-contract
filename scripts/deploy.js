async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
    const nftMarketplace = await NftMarketplace.deploy();
  
    console.log("Contract address:", nftMarketplace.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

    
  