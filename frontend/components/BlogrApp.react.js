import React from 'react';
import Footer from './Footer.react';
import Navbar from './Navbar.react';
import Jumbotron from './Jumbotron.react';
import PostList from './PostList.react';
import PostStore from '../stores/PostStore';

export default class BlogrApp extends React.Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this.state = PostStore.getPosts();
    console.log("##### constructor BlogrApp");
  }

  componentDidMount() {
    console.log("##### componentDidMount BlogrApp");
    PostStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    console.log("##### componentWillUnmount BlogrApp");
    PostStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    console.log("##### _onChange BlogrApp");
    this.setState(PostStore.getPosts());
  }

  render () {
    console.log("##### render BlogrApp");
    return (
        <div>
            <Navbar/>
            <Jumbotron/>
            <PostList posts={this.state.posts}/>
            <Footer/>
        </div>
    )
  }
}