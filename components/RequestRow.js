import React, { Component } from 'react'
import { Table, Button } from 'semantic-ui-react'
import web3 from '../ethereum/web3'
import campaignFunction from '../ethereum/campaign'

class RequestRow extends Component {
    
    
    onApprove = async () => { //using arrow functions because if not have to do some "bind" stuff in the JSX 
        const campaign = campaignFunction(this.props.address)

        const accounts = await web3.eth.getAccounts()
        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        })
    }

    onFinalize = async () => {
        const campaign = campaignFunction(this.props.address)

        const accounts = await web3.eth.getAccounts()
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        })
    }
    
    render() {
        const { Row, Cell } = Table
        const { id, request, approversCount } = this.props
        const readyToFinalize = request.approvalCount > approversCount/2


        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{approversCount}</Cell>
                <Cell>
                    {request.complete ? 'Request Completed' : (
                        <Button color='green' basic onClick={this.onApprove}>Approve</Button>
                    )}
                </Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button color='teal' basic onClick={this.onFinalize}>Finalize</Button>
                    )}
                </Cell>
            </Row>
        )
    }
    /*
        'disabled' prop on <Row> will grey out row if there's a cell where request.complete is true
        'positive' prop on <Row> will highlight in green a row where there's a cell where its condition is true
    */
}

export default RequestRow