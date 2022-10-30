import React, { Component } from 'react'
import Layout from '../../../components/Layout'
import { Button, Table } from 'semantic-ui-react'
import { Link } from '../../../routes'
import campaignFunction from '../../../ethereum/campaign'
import RequestRow from '../../../components/RequestRow'

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query
        const campaign = campaignFunction(address)
        const requestCount = await campaign.methods.getRequestsCount().call()
        //getRequestsCount returns an number inside a string so we parse it below in the Array().fill() 
        const approversCount = await campaign.methods.approversCount().call()
        

        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call()
            })
            /*
                Array(1).fill() -> [undefined]
                Array(3).fill() -> [undefined, undefined, undefined]
            */
        )

        console.log(requests)

        return { address, requests, requestCount, approversCount }
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return (
                <RequestRow 
                    key={index}
                    id={index}
                    request={request}
                    address={this.props.address}
                    approversCount={this.props.approversCount}
                />
            ) 
        })
    }
    
    
    render() {
        const { Header, Row, HeaderCell, Body } = Table //pulling off stuff from Table so don't have to write Table.Header etc...
        //how does it know the correct things to pull of for every thing though?

        return (
            <Layout>
                <h3>Requests</h3>

                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button style={{ marginBottom: 10 }} floated='right' primary>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>

                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>

                <div>Found {this.props.requestCount} request(s)</div>
            </Layout>
        )
    }
}

export default RequestIndex
