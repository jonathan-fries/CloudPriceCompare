import {Route} from "react-router-dom";
import Home from "./home";
import React from 'react';
import Navigation from "./navigation";
import About from './about';
import './appcontainer.scss';
import Footer from './footer';

export default class AppContainer extends React.Component {

    render() {
        return <div>
                <Navigation />
                <div className='clearBoth'></div>
                <Route exact path="/" component={Home}/>
                <Route path="/about" component={About}/>
                <Footer/>
            </div>;
    }
}
