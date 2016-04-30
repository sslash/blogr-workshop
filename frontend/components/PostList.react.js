import React from 'react';
import req from 'axios';
import Post from './Post.react';
import { clickPost } from '../actions/PostActions';

export default class PostList extends React.Component {

    constructor(props) {
        console.log("Constructor");
        console.log(props);
        super(props);
    }

    deleteRow()  {
        console.log("##### DELETE ROW");
    }

    componentDidMount () {
        console.log("##### PostList componentDidMount");
    }

    handleClick(index){
        console.log("##### handleClick ("+index+")");
        var selectedPost = this.state.posts[index];
        clickPost(index);
    }

    render () {
        console.log("##### render List");
        console.log(this.props.posts);

        return (
            <div className="container">
                <div className="row">
                    {this.props.posts.map(function(item, i) {
                      var boundClick = this.handleClick.bind(this, i);
                      return (
                        <Post onClick={boundClick} key={i} title={item.title} body={item.body} ref={'item' + i} />
                      );
                    }, this)}
                </div>
            </div>
        )
    }
}

PostList.propTypes = {
  posts: React.PropTypes.array,
};