import React from 'react';
import { Wave } from 'react-animated-text';
import ServerlessButton from './button.js'
import TableDisplay from './table_display.js'
import './summary.scss';

//import { Wave } from 'react-animated-text';

export default class Summary extends React.Component{

  constructor(props){
        super(props);

        this.state = { gcp_loading: true, gcp_current_price: {}, gcp_prices: [] , aws_loading:true, aws_current_price:{}, aws_prices: [], azure_loading: true, azure_current_price:{}, azure_prices: [] };

        this.handleChange = this.handleChange.bind(this);
        this.findRegionRecord = this.findRegionRecord.bind(this);

        var ws = "https://api.pricekite.io/v1/gcp-compute-serverless-prices";

        this.xhr = new XMLHttpRequest();
        this.xhr.open('GET', ws);
        this.xhr.onload = () => {
            if(this.xhr.status === 200){
                console.log(this.xhr.responseText);
                var local_gcp_hearbeat = {};
                local_gcp_hearbeat = JSON.parse(xhr.responseText);
                this.setState({gcp_prices:local_gcp_hearbeat.status});
                this.setState({gcp_loading: false});
            }
            else{
                console.log("Error calling web service.");
                this.setState({gcp_alive:'Dead'});
                this.setState({gcp_loading: false});
            }
        };
        //this.xhr.send();

        var ws_aws = "https://api.pricekite.io/v1/aws-compute-serverless-prices";

        this.xhr_aws = new XMLHttpRequest();
        this.xhr_aws.open('GET', ws_aws);
        this.xhr_aws.onload = () => {
            if(this.xhr_aws.status === 200){
                console.log(this.xhr_aws.responseText);
                var local_aws_prices = {};
                local_aws_prices = JSON.parse(this.xhr_aws.responseText);
                local_aws_prices = JSON.parse(local_aws_prices.body);

                var local_price = this.findRegionRecord(1000, local_aws_prices);

                this.setState({aws_current_price:local_price});
                this.setState({aws_prices: local_aws_prices});
                this.setState({aws_loading: false});
            }
            else{
                console.log("Error calling AWS heartbeat service.")
                //this.setState({aws_alive:'Dead'});
                this.setState({aws_loading: false});
            }
        };
        this.xhr_aws.send();


        var ws_azure = "https://api.pricekite.io/v1/azure-compute-serverless-prices";

        this.xhr_azure = new XMLHttpRequest();
        this.xhr_azure.open('GET', ws_azure);
        this.xhr_azure.onload = () => {
            if(this.xhr_azure.status === 200){
                console.log(this.xhr_azure.responseText);
                var local_azure_prices = {};
                local_azure_prices = JSON.parse(this.xhr_azure.responseText);
                local_azure_prices = JSON.parse(local_azure_prices);

                var local_price = this.findRegionRecord(1000, local_azure_prices);

                this.setState({azure_prices: local_azure_prices});
                this.setState({azure_current_price:local_price});
                this.setState({azure_loading: false});
            }
            else{
                console.log("Error calling Azure heartbeat service.")
                //this.setState({azure_alive:'Dead'});
                this.setState({azure_loading: false});
            }
        };
        this.xhr_azure.send();

    }

    handleChange(key, evt){
      console.log(evt);

      var value = evt.currentTarget.attributes[0].value;

      var aws_record = this.findRegionRecord(value, this.state.aws_prices);
      this.setState({aws_current_price:aws_record});

      var azure_record = this.findRegionRecord(value, this.state.azure_prices);
      this.setState({azure_current_price:azure_record});

    }


  render(){

    var gcpLoading = this.state.gcp_loading;
    var awsLoading = this.state.aws_loading;
    var azureLoading = this.state.azure_loading;

    //const gcpPrices = this.state.gcp_prices;
    const localAwsPrices = this.state.aws_current_price;
    const localAzurePrices = this.state.azure_current_price;

    return <div>{ (awsLoading || azureLoading) ? <Wave text="Thinking..." effect="fadeOut"/> : <div>
        <div className='buttonDiv'><ServerlessButton  OnChangeDone={this.handleChange}/></div>
        <div></div>
        <div>
          <TableDisplay azurePrices={localAzurePrices} awsPrices={localAwsPrices} />
          <div><p>*What would your function cost if it ran all day?  This tends to provide a more human readable $ amount, as well as contextual scale.</p></div>
        </div>
        </div>} </div>;
  }

  findRegionRecord(regionId, records)
  {

    var regionRecord = {provider: 'Not Found', daily: 0.00 };
    var i = 0;
    regionId = parseInt(regionId);

      for(i; i < records.length; i++)
      {
        if(records[i].pricekiteRegionId === regionId)
        {
          regionRecord = records[i];
        }
      }

      return regionRecord;
  }

}
