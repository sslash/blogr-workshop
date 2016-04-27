import React from 'react';
import req from 'axios';

class Post extends React.Component {
    render () {
        console.log("##### render Post");
        return (
            <div onClick={this.props.onClick}>
                <li>{this.props.title} - {this.props.body}</li>
            </div>
        )
    }
}

class ListPage extends React.Component {

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
        console.log("##### componentDidMount");
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
        console.log("##### handleClick");
    }

    render () {
        console.log("##### render List");
        return (
            <div>
                {this.state.error}
                <ul>
                    {this.state.posts.map(function(item, i) {
                      var boundClick = this.handleClick.bind(this, i);
                      return (
                        <Post onClick={boundClick} key={i} title={item.title} body={item.body} ref={'item' + i} />
                      );
                    }, this)}
                </ul>
            </div>
        )
    }
}

export default ListPage;
