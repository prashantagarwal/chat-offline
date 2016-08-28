import React, { Component } from 'react';
import Friends from './friends';
import ChatStore from '../stores/chat-store';
import AppConstants from '../constants/constants';

class FriendList extends Component {
    constructor(props){
        super(props);
        this.state = {
          friendList : ChatStore.getFriendList(),
          value : ""
        }
        this.onSearchChange = this.onSearchChange.bind(this);
        this.friendListChange = this.friendListChange.bind(this);
    }

    friendListChange(){
      this.setState({friendList : ChatStore.getFriendList()});
    }

    onSearchChange(){
        this.setState({value : document.getElementById('searchBox').value })
    }

    render(){
        var friends = this.state.friendList, list=[];

        for(let i=0 ;i <friends.length ;i++){

          if(friends[i].id === this.props.loggedInUser){
            continue;
          }

          if(!this.state.value){
            list.push(<Friends 
              name={friends[i].name}
              key={friends[i].id}
              id={friends[i].id}
              status={friends[i].status}
              avatar={friends[i].avatar}
            />)
          } else if(friends[i].name.toLowerCase().indexOf(this.state.value.toLowerCase()) !== -1) {
            list.push(<Friends 
              name={friends[i].name}
              key={friends[i].id}
              id={friends[i].id}
              status={friends[i].status}
              avatar={friends[i].avatar}
            />)
          }
        }

        if(list.length===0){
          list.push(<li id="no-items-found">No Friend found</li>);
        }
        return (
            <div className="people-list" id="people-list">
                <div className="search">
                  <input type="text" id="searchBox" value={this.state.value} placeholder="search" onChange={this.onSearchChange}/>
                  <i className="fa fa-search"></i>
                </div>
                <ul className="list">
                  {list}
                </ul>
            </div>
        );
    }

    componentDidMount(){
      ChatStore.on(AppConstants.FRIEND_LIST_UPDATED, this.friendListChange);
    }
}

export default FriendList;