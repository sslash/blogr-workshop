import React from 'react';
import Footer from './Footer.react';
import Navbar from './Navbar.react';
import Jumbotron from './Jumbotron.react';
import PostList from './PostList.react';

class FrontPage extends React.Component {

    render () {
        console.log("##### render page");
        return (
            <div>
                <Navbar/>
                <Jumbotron/>
                <PostList/>
                <Footer/>
            </div>
        )
    }
}

export default FrontPage;
