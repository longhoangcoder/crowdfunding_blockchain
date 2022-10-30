const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
  'wonder globe aerobic combine way poem immense guilt frown marriage insane hover',
  // remember to change this to your own phrase!
  'https://goerli.infura.io/v3/7f7b1febb20b42f98c8aa3c36a3719cd'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);


  const result = await new web3.eth.Contract(compiledFactory.abi)
  .deploy({ data: compiledFactory.evm.bytecode.object }).send({ gas: '1400000', from: accounts[0] });
  
  console.log(compiledFactory.abi)
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();