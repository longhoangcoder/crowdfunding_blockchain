const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')
const { parse } = require('path')

let accounts
let factory
let campaignAddress
let campaign

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas:'1400000' })

    await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1000000'});

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call()
    /*
        this is array destructuring vs object destructuring 
        because createCampaign() returns an array [campaignAddress] says pull off the first element of the array and 
        put it in the variable campaignAddressF
    
    */

    campaign = await new web3.eth.Contract(
        compiledFactory.abi,
        campaignAddress
    )
    //this is a javascript represenatation of the campaign that has already been deployed

    /*
        Note that we are not resetting the account balances of the accounts provided by ganache before each test
        At present time no good way to do this 
    */
})

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call()
        assert.equal(accounts[0], manager) //(what you want it to be, what it actually is)
    })

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        })

        let isApprover = await campaign.methods.approvers(accounts[1]).call()
        assert(isApprover)
    })

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            })
            assert(false) 
            /*
                if the await statement above ever executes successfully (which it should not) we will reach this 
                assert and immediately fail the test 
            */
        } catch(err) {
            assert(err) //makes sure we have an error here
        }
    })

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest('buy batteries', '100', accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        })

        const request = await campaign.methods.requests(0).call()
        assert.equal('buy batteries', request.description)
        //could check all properties of request are set correctly but just checking for one here
    })

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        })

        await campaign.methods.createRequest('some description', web3.utils.toWei('5', 'ether'), accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        })

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        let balance = await web3.eth.getBalance(accounts[1]) //this returns a string
        balance = web3.utils.fromWei(balance, 'ether')
        balance = parseFloat(balance) //parseFloat is a built-in helper in Javascript
        
        console.log("account 1 balance: ", balance)
        assert(balance > 104)
    })
})
