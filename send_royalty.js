const Web3 = require("web3");

const fs = require('fs');

const axios = require('axios')

//const EthereumTx = require('ethereumjs-tx').Transaction;

const log = require('ololog').configure({ time: true })

const ansi = require('ansicolor').nice

require('dotenv').config();

//-----------------------------------------------------

const URL = process.env.RPC_URL;

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

const ADDRESS = process.env.WALLET_ADDRESS;

var R_ABI = JSON.parse(fs.readFileSync('./build/contracts/TransferRoyalty.json'));

var R_ABI_CODE = R_ABI.abi;

//------------------------------------------------------

/**
 * Fetch the current transaction gas prices from https://ethgasstation.info/
 * 
 * @return {object} Gas prices at different priorities
 */
 const getCurrentGasPrices = async () => {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    }
   
    console.log("\r\n")
    log (`Current ETH Gas Prices (in GWEI):`.cyan)
    console.log("\r\n")
    log(`Low: ${prices.low} (transaction completes in < 30 minutes)`.blue)
    log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`.yellow)
    log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`.red)
    console.log("\r\n")
   
    return prices
  }

//------------------------------------------------------

let main = async () => {
  const web3 = new Web3(
     URL
  );

  // address of ERC721 NFT
  const RAddress = web3.utils.toChecksumAddress("0x20bEe6053FE79E1D6235178de64F9B018557dB73");
  // ERC721 abi to interact with contract
  const RAbi = R_ABI_CODE;

  // interact with contract
  const RContract = new web3.eth.Contract(RAbi, RAddress);
  
  
  var getOwner = await web3.eth.call({
    to: RAddress,
    data: RContract.methods["getOwner"]().encodeABI(),
  });
    
  var FINAL_ADDRESS = web3.eth.abi.decodeParameter('address',getOwner);

  console.log(FINAL_ADDRESS); 
  
  console.log("--------------------------------------------------------"); 

  //-----------------------------------------------------------

  var addresses = 
  [
    "0x4E1faCf3d28698Acc950d08deb5491984F61a6a3",
    "0x1b02aBbE779B6C5B696FE575fb41Ce07a3Ef8cF4",
    "0xf79036dd1df0A8BaB8Ba5361b0bbD742D2940E70",
    "0x8CEA23Bffd45979Dc188F5119ff9C48ADB3E0453",
    "0xdEc53402Af2d5cdd0EC58c8da954A1F3301d761B",
    "0x76B02beDA0e5144F026FbA2144EdAb0c3ED2a3f1",
    "0xEc2f9ABf71af0AAD600b4a06567fb0437939AF0B",
    "0xc11BB8E0e9F1E7887045aEBDFb2a417d2ea8102b",
    "0x7193297a49d25bfC28e519F2F9cED4d3402FcE9E"

  ];

  let myBalanceWei = await web3.eth.getBalance(RAddress)
  //let myBalance = await web3.utils.fromWei((myBalanceWei/2).toString(), 'ether');
  //let amountToSend = String(myBalance);
 
  log(`Your wallet balance is currently ${myBalanceWei} ETH`.green)
 
 
  /**
   * With every new transaction you send using a specific wallet address,
   * you need to increase a nonce which is tied to the sender wallet.
   */
  let nonce = await web3.eth.getTransactionCount(ADDRESS)
  log(`The outgoing transaction count for your wallet address is: ${nonce}`.magenta)
 
 
  /**
   * Fetch the current transaction gas prices from https://ethgasstation.info/
   */
  let gasPrices = await getCurrentGasPrices()
 
 
  /**
   * Build a new transaction object and sign it locally.
   */
 details = {
    //'from': ADDRESS,
    'to': RAddress,
    //'contractAddress': RAddress,
    //'value': web3.utils.toHex(web3.utils.toWei("1", 'ether')),
    'gas':  60000,
    'gasLimit': 6721975,
    'gasPrice': await web3.utils.toHex(gasPrices.high * 1000000000), // converts the gwei price to wei
    'nonce': await web3.utils.toHex(nonce),
    'data': RContract.methods.withdrawls(addresses).encodeABI(),
    'chainId': await web3.eth.getChainId() // EIP 155 chainId - mainnet: 1, rinkeby: 4
  }
 
  var signedTx = await web3.eth.accounts.signTransaction(details, PRIVATE_KEY).then(console.log());

  await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  .then(receipt => console.log("Transaction receipt: ", receipt))  
  .catch(err => console.error(err));

  /* for(var i = 0; i <=addresses.length; i++)
  {
    let myBalanceWei = await web3.eth.getBalance(web3.utils.toChecksumAddress(addresses[i]))
    let myBalance = await web3.utils.fromWei((myBalanceWei).toString(), 'ether')
    
    log(`Wallet balance is currently ${myBalance} ETH`.green) 
  } */

}

setInterval(main, 10000);