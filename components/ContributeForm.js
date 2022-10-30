import React, { Component } from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'
import campaignFunction from '../ethereum/campaign'
import web3 from '../ethereum/web3'
import { Router } from '../routes'

class ContributeForm extends Component {
    state = {
        value: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault()
        //console.log('ContributeForm props:', this.props.address)
        const campaign = campaignFunction(this.props.address)

        this.setState({ loading: true, errorMessage: '' })

        try {
            
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            
            })

            Router.replaceRoute(`/campaigns/${this.props.address}`)
            /*
                refreshes the page
                Router.push() creates a new entry in browser history so if user hits the back button will go back to same 
                page they were just on 
            */
        } catch (err) {
            this.setState({ errorMessage: err.message })
        }

        this.setState({ loading: false, value: '' })
    }
    
    render() {
        return (
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Amount to Contribute</label>
                        <Input 
                            label='ether'
                            labelPosition='right'
                            onChange={(event) => this.setState({ value: event.target.value} )}
                            value={this.state.value}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>
                        Contribute!
                    </Button>
                </Form>
        )
    }
}

export default ContributeForm