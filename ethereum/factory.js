import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
   CampaignFactory.abi,
    '0x9aCD8cF37bE771e6dBA025D24c8c7914d8Ef3a00'
)

export default instance