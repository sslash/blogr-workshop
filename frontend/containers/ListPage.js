import React from 'react';
import req from 'axios';

class ListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }

    componentDidMount () {
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

    render () {
        return (
            <div>
                {this.state.error}
                {this.state.posts.map((post, i) => (
                    <div key={`post-${i}`}>{post.body}</div>
                ))}
            </div>
        )
    }
}


export default ListPage;
