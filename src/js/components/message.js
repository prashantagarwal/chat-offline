import React, { Component } from 'react';
import moment from 'moment';

class Message extends Component {
    render(){
        var identifier = [];
        if(this.props.type === 'myMessage'){

          identifier.push(<span className="message-data-name" >{this.props.name}</span>);
          identifier.push(<span className="message-data-time" >{moment(this.props.time).calendar()}</span>);

        } else {

          identifier.push(<span className="message-data-time" >{moment(this.props.time).calendar()}</span>);
          identifier.push(<span className="message-data-name" >{this.props.name}</span>);
        } 
        return (
            <li className={this.props.className || ""}>
              <div className={"message-data "+ (this.props.type === 'myMessage' ? "" : "align-right")}>
                {identifier}
              </div>
              <div className={"message " + (this.props.type === 'myMessage' ? "my-message" : "other-message")}>
                {this.props.message}
              </div>
            </li>
        );
    }
}

export default Message;