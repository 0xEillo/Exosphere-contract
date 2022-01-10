const { expect } = require("chai");

describe("Exosphere contract", function () {

  let Exosphere;
  let exosphere;
  let token;
  let tokenAddress;
  let owner;
  let addr1;
  let addr2;
  

  // `beforeEach` will run before each test, re-deploying the contract everytime
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Exosphere = await ethers.getContractFactory("Exosphere");
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, tokenAddress] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    exosphere = await Exosphere.deploy();
    token = await Token.deploy();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    it("Deployement should assign the total token supply to the owner", async () => {
        const ownerBalance = await token.balanceOf(owner.address);
        expect(await token.totalSupply()).to.equal(ownerBalance);
    })
  });

  describe("Transactions", function () {
    it("Create market item transaction should revert as the price cannot be set to 0", async () => {
        expect(exosphere.createMarketItem(tokenAddress.address, 1, 0)).to.be.revertedWith("Price must be greater than 0");
    })

    it("Create market item transaction should be successfull", async () => {
        await exosphere.createMarketItem(tokenAddress.address, 1, 1);
        await expect(exosphere.fetchMarketItems()).to.emit(exosphere, "MarketItemsFetched").withArgs(1);
    })

    it("Create market sale should revert as the price is lower than the nft price", async () => {
        await exosphere.createMarketItem(tokenAddress.address, 1, 2);
        expect(exosphere.createMarketSale(tokenAddress.address, 1)).to.be.revertedWith("Please submit the asking price in order to complete the purchase");
    })

    it("Create market sale should revert as the price is lower than the nft price", async () => {
        await exosphere.createMarketItem(tokenAddress.address, 1, 1);
        expect(exosphere.connect(addr1).createMarketSale(tokenAddress.address, 1, {  value: 2 })).to.be.revertedWith("Please submit the asking price in order to complete the purchase");
    })

    it("Create market sale should run successfully", async () => {
        await exosphere.createMarketItem(tokenAddress.address, 1, 1);
        
        await expect(exosphere.fetchMarketItems()).to.emit(exosphere, "MarketItemsFetched").withArgs(1);
        await exosphere.connect(addr1).createMarketSale(tokenAddress.address, 1, {  value: 1 });
        await expect(exosphere.fetchMarketItems()).to.emit(exosphere, "MarketItemsFetched").withArgs(0);
    })
  });
});