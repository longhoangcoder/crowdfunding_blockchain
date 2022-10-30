import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
   CampaignFactory.abi,
    '0x2b2d9C04E27d19e3A4DfA2E77E9C646A5543f3c1'
)

export default instance