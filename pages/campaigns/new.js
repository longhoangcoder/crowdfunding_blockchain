import React, { Component, createFactory }  from "react"
import Layout from '../../components/Layout'
//import 'semantic-ui-css/semantic.min.css' - moved this to the Layout component which is on every page and it works 
import { Form, Button, Input, Message } from 'semantic-ui-react'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import { Router } from '../../routes' //Router lets you programmatically redirect people from page to page

class CampaignNew extends Component {

    state = { 
        minimum: '',
        errorMessage: '',
        loading: false
    }
    //'minimum' is a string and should assume when dealing with user input you are dealing with a string
    
    onInputChange = (event) => {
        this.setState({ minimum: event.target.value })
        //console.log(this.state.minimum)
    }

    onSubmit = async (event) => {
        event.preventDefault()
        
        this.setState({ loading: true, errorMessage: '' })
        //set the error message to '' when user clicks the "Create" button again
        
        try{
            const accounts = await web3.eth.getAccounts() 
        
                await factory.methods.createCampaign(this.state.minimum).send({
                    from: accounts[0]
                })

                /*
                    when sending transaction within the browser don't have to specify gas because 
                    Metamask will automatically estimate and show to the user how much gas required
                */
                Router.pushRoute('/') //send user back to homepage after succefully creating a campaign

        } catch (err) {
            this.setState({ errorMessage: err.message })
        }
        this.setState({ loading: false })
    }

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input label='wei' labelPosition='right' onChange={this.onInputChange} value={this.state.minimum}/>
                    </Form.Field>
                    <Message error header='Oops!' content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary type='submit'>Create</Button>
                </Form>
            </Layout>
        )
    }
    /*
        semantic UI by default with not show a 'Message' component with 'error' prop. You can to put 'error' prop in enclosing form
        to get the 'Message' component to show up

        Empty string is interpreted as falsy so if errorMessage is set to '' it will set error=false on the Form component and 
        not show up

        The !!this.state.errorMessage is a trick for turning to a boolean to error message about passing a string instead of 
        boolean goes away
        this.state.errorMessage is falsy if it contains an empyty string ''
        !this.state.errorMessage evaluates to true
        !!this.state.errorMessage evaluates to false

    */
}

export default CampaignNew