import React from 'react';
import './index.sass'

class Dashboard extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}
	
	componentDidMount(){
		const intervalId = setInterval(this.timer, 1000);
		// store intervalId in the state so it can be accessed later:
		this.setState({intervalId: intervalId});
	}
	componentWillUnmount(){
		clearInterval(this.state.intervalId);
	}

	timer = () => {
		//this.setState({ textColor: '#'+Math.floor(Math.random()*16777215).toString(16) });
	}
    render() {
        return (
            <div className="gutter-example button-demo">
				welcome
            </div>
        )
    }
}

export default Dashboard;