import { Web3 } from 'web3';

const web3 = new Web3('INFURA_ENDPOINT')

const ADMIN_CONTRACT_ADDRESS = process.env.ADMIN_CONTRACT_ADDRESS;

const contractAddress = ADMIN_CONTRACT_ADDRESS;
const abi = 'token.bin'

const contract = new web3.eth.Contract(abi, contractAddress);

module.exports = (server, channel) => {
    server.get('/balance/:address', async (req, res) => {
        const { address } = req.params;
        try {
            const balance = await contract.methods.balanceOf(address).call();
            res.json({ balance });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    server.post('/transfer', express.json(), async (req, res) => {
        const { from, to, amount, privateKey } = req.body;
        // Validate request params
        if (!from || !to || !amount || !privateKey) {
            return res.status(400).json({ error: 'Invalid params' });
        }

        const data = contract.methods.transfer(to, amount).encodeABI();
        const gas = await contract.methods.transfer(to, amount).estimateGas({ from });

        const signedTransaction = await web3.eth.accounts.signTransaction(
            {
                to: contractAddress,
                data,
                gas,
                gasPrice: '1000000000',
                nonce: await web3.eth.getTransactionCount(from),
            },
            privateKey
        );

        // Send transaction
        try {
            const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
            res.json({ transactionHash: result.transactionHash });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}