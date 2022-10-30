import React, { Component } from 'react'
import Layout from '../../components/Layout'
import factory from '../../ethereum/factory'
import campaignFunction from '../../ethereum/campaign'
import { Card, Grid, GridColumn, Button } from 'semantic-ui-react'
import web3 from '../../ethereum/web3'
import ContributeForm from '../../components/ContributeForm'
import { Link } from '../../routes'

class CampaignShow extends Component {
    static async getInitialProps(props) {
        /*
            Because a user will get to a this page via a route defined in our routes.js file and this specific route has a query
            parameter in it, getInitialProps has some initial props and the way to get at the value of the query parameter names 
            'address' is 'props.query.address' 

            The props available to getInitialProps are not available to the other methods of this compononent so we have to pass
            the address in the return object below so it can be used elsewhere 
        */
       // console.log(props.query.address)
        const campaign = campaignFunction(props.query.address)
        
        const summary = await campaign.methods.getSummary().call()
        //console.log(summary)

        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        }
        //this return object becomes props available to the CampaignShow component 
    }

    renderCards() {
        
        const { balance, manager, minimumContribution, requestCount, approversCount } = this.props
        
        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campagin and create requests to withdraw money',
                style: { overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'Must contribute more than this amount of wei to become an approver'
            },
            {
                header: requestCount,
                meta: 'Number of Requests',
                description: 'Requests are for withdrawing money from the contract. All requests need to be approved'
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of contributors who have donated to this campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'How much Ether is available for this contract to spend'
            }

        ]

        return <Card.Group items={items} />
    }

    render() {
        //console.log('Show component this.props.address: ', this.props.address)
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <GridColumn width={10}>
                            {this.renderCards()}
                        </GridColumn>
                        <GridColumn width={6}>
                            <ContributeForm address={this.props.address} floated='right'/>
                        </GridColumn>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
           
        )
    }
    //Sematinc UI React GridColumns must add up to 16
    
}

export default CampaignShow