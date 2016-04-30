import React from 'react';
import req from 'axios';
import Post from './Post.react';
import { clickPost } from '../actions/PostActions';

export default class PostList extends React.Component {

    constructor(props) {
        console.log("##### constructor PostList");
        super(props);
    }

    deleteRow()  {
        console.log("##### DELETE ROW");
    }

    handleClick(index){
        console.log("##### handleClick ("+index+")");
        clickPost(index);
    }

    render () {
        console.log("##### render List");
        let rows = [];
        if (this.props.posts) {
          this.props.posts.map((item, i) => {
            var boundClick = this.handleClick.bind(this, i);
            rows.push(<Post onClick={boundClick} key={i} title={item.title} body={item.body} ref={'item' + i} />);
          });
        }
        return (
            <div className="container">
                <div className="row">
                    {rows}
                </div>
            </div>
        )
    }
}

PostList.propTypes = {
  posts: React.PropTypes.array,
};