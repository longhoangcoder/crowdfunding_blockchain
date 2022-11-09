import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
   CampaignFactory.abi,
    '0xd446B1F278417770E62b4B700AB41c6ba47447F9'
)

export default instance