import React, { Component } from 'react';
import '../App.css';
import ChatStore from './stores/chat-store';
import AppActions from './actions/app-actions';
import AppConstants from './constants/constants';

import FriendList from './components/friend-list';
import ChatSection from './components/chat-section';

class App extends Component {
	constructor(props){
		super(props);
		
		this.submit = this.submit.bind(this);
		this.onChange = this.onChange.bind(this);	
	}

	onChange() {
		this.setState({loggedInUser : ChatStore.getLoggedInUser()})
	}

	submit() {
		AppActions.getLoginUser(document.getElementById('loginUser').value);
	}


	render() {

		if(!ChatStore.getLoggedInUser()){
			return (
				<div className="loginPage">
					<input type="text" id="loginUser" placeholder="Enter Your Id"/>
					<button onClick={this.submit}>
						Enter
					</button>
				</div>
			);
		} else {
		    return (
		        <div className="container clearfix">
		            <FriendList loggedInUser={this.state.loggedInUser}/>      		
		            <ChatSection loggedInUser={this.state.loggedInUser}/>    
				</div>
		    );
		}
	}

  	componentDidMount(){
  		ChatStore.on(AppConstants.LOGIN_USER_SUCCESS, this.onChange);	
  		AppActions.offlineMode();
  	}
}

export default App;
