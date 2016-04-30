import React from 'react';
import Footer from './Footer.react';
import Navbar from './Navbar.react';
import Jumbotron from './Jumbotron.react';
import PostList from './PostList.react';
import PostStore from '../stores/PostStore';
import { loadPosts } from '../actions/PostActions';

export default class BlogrApp extends React.Component {
  constructor(props) {
    console.log("##### constructor BlogrApp");
    super(props);

    this._onChange = this._onChange.bind(this);
    this.state = PostStore.getPosts();

    loadPosts();
  }

  componentDidMount() {
    PostStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
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