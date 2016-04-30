import React from 'react';
import req from 'axios';
import Post from './Post.react';
import { clickPost } from '../actions/PostActions';

export default class PostList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            post: ''
        }
    }

    deleteRow()  {
        console.log("##### DELETE ROW");
    }

    componentDidMount () {
        this.loadPosts();
    }

    loadPosts(){
        req.get('/posts')
        .then((result) => {
            this.setState({
                posts: result.data.data
            });
        })
        .catch(() => {
            this.setState({
                error: 'Something went wrong'
            });
        });
    }


    handleClick(index){
        console.log("##### handleClick ("+index+")");
        var selectedPost = this.state.posts[index];
        clickPost(index);
    }

    render () {
        console.log("##### render List");
        return (
            <div className="container">
                <a href="#">Posts <span className="badge">{this.state.posts.length}</span></a><br/>
                {this.state.error}
                <div className="row">
                    {this.state.posts.map(function(item, i) {
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