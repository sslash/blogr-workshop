import React from 'react';

class Footer extends React.Component{
    render() {
        console.log("##### render Footer");
        return (
            <div className="container">
                <hr/>
                <footer>
                    <p>&copy; 2015 Company, Inc.</p>
                </footer>
            </div>
        )
    }
}

export default Footer;