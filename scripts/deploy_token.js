import { Command } from 'commander';
import fs from 'fs';
import { Web3 } from 'web3';

const program = new Command();

program
    .requiredOption('-a, --address <address>', 'Ethereum Client Address', 'http://localhost:8545')
    .requiredOption('-tj --token-json <tokenJson>', 'Token JSON Config', 'token.json')
    .requiredOption('-tb --token-bin <tokenBin>', 'Token Binary File', 'token.bin')
    .requiredOption('-p, --private-key <privateKey>', 'Private key for deploying the contract')
    .option('-n, --name <name>', 'Token name', 'YourTokenName')
    .option('-s, --symbol <symbol>', 'Token symbol', 'YTN')
    .option('-d, --decimals <decimals>', 'Token decimals', '18')
    .option('-a, --amount <amount>', 'Token initial supply', '1000000000000000000000000')
    .parse(process.argv);

const clientAddress = program.clientAddress;
const tokenJson = program.tokenJson;
const tokenBin = program.tokenBin;
const privateKey = program.privateKey;
const tokenName = program.tokenName;
const tokenSymbol = program.tokenSymbol;
const tokenDecimals = program.tokenDecimals;
const initialSupply = program.initialSupply;

const web3 = new Web3(clientAddress)

const abi = JSON.parse(fs.readFileSync(tokenJson).toString())
const bytecode = '0x' + fs.readFileSync(tokenBin).toString()

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        const gasPrice = await web3.eth.getGasPrice();

        const contract = new web3.eth.Contract(abi);

        const deployTransaction = contract.deploy({
            data: bytecode,
            arguments: [tokenName, tokenSymbol, tokenDecimals, initialSupply]
        });

        const options = {
            data: deployTransaction.encodeABI(),
            // Adjust the gas limit accordingly
            gas: 2000000,
            gasPrice: gasPrice,
            // use the first account for deployment
            from: accounts[0],
        };

        const signedTransaction = await web3.eth.accounts.signTransaction(options, ADMIN_PRIVATE_KEY);
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        console.log(`Contract deployed at : `, receipt.contractAddress);
    } catch (error) {
        console.error('Error deploying contract:', error.message);
    }
};

deploy();