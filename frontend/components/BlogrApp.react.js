import React from 'react';
import Footer from './Footer.react';
import Navbar from './Navbar.react';
import Jumbotron from './Jumbotron.react';
import PostList from './PostList.react';

class BlogrApp extends React.Component {

    render () {
        console.log("##### render BlogrApp");
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

export default BlogrApp;
