import React, { Component } from 'react';
import ChatStore from '../stores/chat-store';
import AppActions from '../actions/app-actions';
import AppConstants from '../constants/constants';
import Message from './message';

class ChatSection extends Component {
    constructor(props){
      super(props);
      this.state = {
        currentFriend : ChatStore.getSelectedFriend(),
        messages : ChatStore.getMessages(),

      }
      this.sendMessage = this.sendMessage.bind(this);
      this.onFriendChange = this.onFriendChange.bind(this);
      this.onNewMessage = this.onNewMessage.bind(this);
    }
    sendMessage(){
      AppActions.sendMessage(this.props.loggedInUser, this.state.currentFriend.id ,document.getElementById('msgBox').value);
      document.getElementById('msgBox').value = "";
    }

    onFriendChange(){
      this.setState({
        currentFriend : ChatStore.getSelectedFriend(),
        messages : ChatStore.getMessages()

      });
    }

    onNewMessage(){
      this.setState({messages : ChatStore.getMessages()},function(){
        document.querySelector('.chat-history').scrollTop=document.querySelector('.chat-history').scrollHeight;
      });
    }
    render(){
        var messages=[];
        for(let i=0 ; i < this.state.messages.length ;i++){
          if(this.state.messages[i].from === this.state.currentFriend.id){
            messages.push(<Message className={"clearfix"}
                    key={this.state.currentFriend.id+'_'+i}
                    type={"myMessage"}
                    time={this.state.messages[i].time}
                    name={this.state.currentFriend.name}
                    message={this.state.messages[i].message} 
                />)
          } else {
            messages.push(<Message className={"clearfix"}
                      key={this.props.loggedInUser+'_'+i}
                      type={"otherMessage"}
                      time={this.state.messages[i].time}
                      name={"Me"}
                      message={this.state.messages[i].message} 
                  />)
          }
        }
        return (
          <div className="chat">
          <div className="chat-header clearfix">
              <img src={this.state.currentFriend.avatar} alt="avatar" />
            
              <div className="chat-about">
                  <div className="chat-with">
                    {"Chat with "+this.state.currentFriend.name}
                  </div>
              </div>
              <i className="fa fa-star"></i>
          </div>
          
          <div id="chatHistory" className="chat-history">
              <ul>
                {messages}
              </ul>
          </div>
          
          <div className="chat-message clearfix">
            <textarea id="msgBox" name="message-to-send" placeholder="Type your message" rows="3"></textarea>
            <button onClick={this.sendMessage}>Send</button>
          </div> 
          </div>
        );
    }
    componentDidMount(){
      ChatStore.on(AppConstants.CHANGE_FRIEND_SUCCESS, this.onFriendChange);
      ChatStore.on(AppConstants.NEW_MESSAGE, this.onNewMessage);
    }
}

export default ChatSection;