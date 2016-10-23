import React from 'react';

class Post extends React.Component {
    render () {
        return (
            <div className="col-md-4">
                <h2>{this.props.title}</h2>
                <p>{this.props.body}</p>
                <p><a className="btn btn-default" href="#" role="button" onClick={this.props.onClick}>View details &raquo;</a></p>
            </div>
        )
    }
}

export default Post;