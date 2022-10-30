const path = require('path')
const solc = require('solc')
const fs = require('fs-extra')
/*
    fs-extra is a community made version of fs with some extra bells and whistles
*/

const buildPath = path.resolve(__dirname, 'build')
fs.removeSync(buildPath) //removeSync is fs-extra function for deleting a folder and its contents in a single command 

const campaignPath = path.resolve(__dirname, 'contracts', 'crowdfunding.sol')
const source = fs.readFileSync(campaignPath, 'utf8')

const input = {
    language: "Solidity",
    sources: {
      "crowdfunding.sol": {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
};



const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts["crowdfunding.sol"]

fs.ensureDirSync(buildPath) //ensureDirSync checks to see if a directory exists and if not will create it

//console.log(output)
for (let contract in output) { //"for in loop" iterates over keys of an object 
    //in this case 'contract' will be ':Campaign' or ':CampaignFactory'

    fs.outputJsonSync( //'outputJsonSync writes a json file to a specified path
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract] //this is the actual contents you want to write to the file
    )
}