import React from 'react';
import GoogleIpAddress from './price_display/static_ip_address/google_ip_address';
import AzureIpAddress from './price_display/static_ip_address/azure_ip_address';
import AWSIpAddress from './price_display/static_ip_address/aws_ip_address';

export default class Home extends React.Component{

    render(){
        return <div>
                  <h2>Google</h2>
                  <GoogleIpAddress/>
                  <h2>Azure</h2>
                  <AzureIpAddress />
                  <h2>AWS</h2>
                  <AWSIpAddress />
                </div>;
    }
}