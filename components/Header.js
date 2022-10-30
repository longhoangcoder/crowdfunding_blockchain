import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "../routes";

const Header = () => {
  /*
        for inline styles with React need to pass it an  object
        style={color: blue} will not work because the first set of brackets indicate a JS expression is coming but no object is
        passed. You need a second second set of brackets 
            style={{ color: 'blue' }}
        also the 'blue' is not wrapped in quotes the first incorrect example. It needs to be a string given this is a JS object

        also the CSS properties are camelCase where there is a '-' in pure CSS so margin-top -> marginTop
    */
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">Crowndfunding Project</a>
      </Link>
      <Menu.Menu position="right">
        <Link route="/campaigns/new">
          <a className="item">
            <Icon name="plus" /> Create a new Campaign
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;

/*
    old way 

    return (
        <Menu style={{ marginTop: '10px' }}>
            <Menu.Item>
                CrowdCoin
            </Menu.Item>
            <Menu.Menu position='right'>
                <Menu.Item>
                    Campaigns
                </Menu.Item>
                <Menu.Item>
                    <Icon name="plus"/>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )

*/
