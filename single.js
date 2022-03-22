import Web3 from "web3";

import fs from 'fs';

var NFT_ABI = JSON.parse(fs.readFileSync('./build/contracts/RBCC.json'));

var NFT_ABI_CODE = NFT_ABI.abi;

(async () => {
  const web3 = new Web3(
     "https://matic-testnet-archive-rpc.bwarelabs.com "
  );

  // address of ERC721 NFT
  const nftAddress = "0x7AADFdbDa15B296C9DaE2415e73D82002BD097E4";
  // ERC721 abi to interact with contract
  const nftAbi = NFT_ABI_CODE;

  // interact with contract
  const nftContract = new web3.eth.Contract(nftAbi, nftAddress);
  
  
  var totalSupply = await web3.eth.call({
    to: nftAddress,
    data: nftContract.methods["totalSupply"]().encodeABI(),
  });
    
  var TOTAL_SUPPLY = web3.utils.hexToNumber(totalSupply); 

  console.log(TOTAL_SUPPLY); 

  for(var i = 1; i <= TOTAL_SUPPLY; i++)
  {
    const callData = nftContract.methods["ownerOf"](i).encodeABI();
    // call the blockchain to get the owner of token #2
    const ownerOfToken = await web3.eth.call({
      to: nftAddress,
      data: callData,
    });

    var FINAL_ADDRESS = web3.eth.abi.decodeParameter('address',ownerOfToken); 

    console.log(FINAL_ADDRESS);
  }

})();
