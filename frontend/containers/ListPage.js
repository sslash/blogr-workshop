import React from 'react';
import req from 'axios';

class Footer extends React.Component{
    render() {
        console.log("##### render Footer");
        return (
            <div>
                <hr/>
                <footer>
                    <p>&copy; 2015 Company, Inc.</p>
                </footer>
            </div>
        )
    }
}

class Jumbotron extends React.Component{
    render() {
        console.log("##### render Jumbotron");
        return (
            <div className="jumbotron">
                <div className="container">
                    <h1>Hello, world!</h1>
                    <p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
                    <p><a className="btn btn-primary btn-lg" href="#" role="button">Learn more &raquo;</a></p>
                </div>
            </div>
        )
    }
}

class Post extends React.Component {
    render () {
        console.log("##### render Post");
        return (
            <div className="col-md-4" onClick={this.props.onClick}>
                <h2>{this.props.title}</h2>
                <p>{this.props.body}</p>
                <p><a className="btn btn-default" href="#" role="button">View details &raquo;</a></p>
            </div>
        )
    }
}

class Navbar extends React.Component {
    render () {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Project name</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <form className="navbar-form navbar-right">
                            <div className="form-group">
                                <input type="text" placeholder="Email" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <input type="password" placeholder="Password" className="form-control"/>
                            </div>
                            <button type="submit" className="btn btn-success">Sign in</button>
                        </form>
                    </div>
                </div>
            </nav>
        )
    }
}

class PostList extends React.Component {

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
    }

    render () {
        console.log("##### render List");
        return (
            <div>
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

class ListPage extends React.Component {

    render () {
        console.log("##### render page");
        return (
            <div className="container">
                <Navbar/>
                <Jumbotron/>
                <PostList/>
                <Footer/>
            </div>
        )
    }
}

export default ListPage;
