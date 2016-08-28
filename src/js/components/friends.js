import React, { Component } from 'react';
import AppActions from '../actions/app-actions';

class Friends extends Component {
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        AppActions.changeSelectedFriend(this.props.id);
    }

    render(){
        return (
            <li className="clearfix" onClick={this.onClick}>
              <img src={this.props.avatar} alt="avatar" />
              <div className="about">
                <div className="name">{this.props.name}</div>
                <div className="status">
                  <i className={"fa fa-circle "+this.props.status}></i>
                  {this.props.status}
                </div>
              </div>
            </li>
        );
    }
}

export default Friends;