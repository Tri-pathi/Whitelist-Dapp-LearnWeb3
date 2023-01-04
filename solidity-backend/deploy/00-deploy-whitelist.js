const { network } = require("hardhat");

module.exports=async({deployments,getNamedAccounts})=>{
    const{log,deploy}=deployments;
    const{deployer}=await getNamedAccounts();
    const chainId=network.config.chainId;
const args=[10];
    const whitelist=await deploy("Whitelist",{
        from:deployer,
        args:args,
        log:true,
        waitConfirmations:network.config.blockConfirmation||1
    })

    log(` Whitelist deployed at ${whitelist.address}`);


}
//for deploying in hardhat/localhost use.. (yarn hardhat deploy)
// and for deploying in testnet i.e goerli.. (yarn hardhat deploy --network goerli)


//deployed contract address in goerli=0xF1B0b3762086B7867986043Cdbffd69F6Adb0179
