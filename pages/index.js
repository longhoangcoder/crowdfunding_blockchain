//index.js is the file for the root route aka '/' route 
import React, { Component } from 'react'
import factory from '../ethereum/factory'
import 'semantic-ui-css/semantic.min.css'
import { Card, Button } from 'semantic-ui-react'
import Layout from '../components/Layout'
import { Link } from '../routes'

class CampaignIndex extends Component {
   
   static async getInitialProps() {
      const campaigns = await factory.methods.getDeployedCampaigns().call()
      

      return { campaigns }
   }
   /*
      when using next.js, it will not fetch data in the componentDidMount() function
      In a regular React project fetching data in componentDidMount() is fine but not when using next.js
      You have to use a special next.js lifecycle function called getInitialProps()
      getInitialProps() HAS to be a static function so that next.js can fetch the data without rendering an instance of the component
      The returned data is then provided to the compoenent being rendered on the next.js server as props    
   */
  renderCampaigns() {
     const items = this.props.campaigns.map(address => {
        return {
           header: address,
           description: (
            <Link route={`/campaigns/${address}`}>
               <a>View Campaign</a>
            </Link>
           ),
           fluid: true
        }
     })

     return <Card.Group items={items} />
  }
  //'fluid' will make the cards take up the full length of their container

   render() {
      return (
         <Layout>
            <div>
               <h3>Open Campaigns</h3>
               <Link route='/campaigns/new'>
                  <a>
                     <Button 
                     floated='right'
                     content='Create Campaign'
                     icon='add circle'
                     primary
                     />
                  </a>
               </Link>
               {this.renderCampaigns()}
            </div>
         </Layout>
      )
   }
   //when a passing a prop with a state of true you can just state the prop (e.g. primary='true' same as 'primary')
   //when we put JSX inside the Layout component all that code gets passed a prop to Layout called 'children'

   //'floated' applies CSS property of 'float'. Doing style={{ float: 'right' }} does the same thing

   //wrapping the Button in an anchor tag gives you the tradition right-click functionality of being able to open link in new tab
}

export default CampaignIndex
//next.js always expects a React component to be exported from the index.js file 