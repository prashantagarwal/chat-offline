# Chat-offline

### Getting Started
```javascript
$ git clone https://github.com/prashantagarwal/chat-offline.git
$ cd chat-offline
$ npm install
$ npm start
//in new terminal
$ node server.js
```

- Goto `localhots:3000`
- Enter user Id (try out: prashant)
- Now without opening any new instance, try sending message to an offline user      (send some message to Abhijai)
- Now open a new browser and goto `localhost:3000` again.
- This time enter chat with different user Id (try: abhijai). You will find         messages are in sync.

### Features
- Offline support for reading previous messages
- Search through friend list.
- Auto update of online and offline user status
- Capability to send message to a user who is offline. Server will sync the message once this other user will come online.

### TODO
- Add Push Notification feature for new messages (for offline user)
- Capability to send message even when the send is offline (Background Sync API)


### Thanks
built using [create-react-app](https://github.com/facebookincubator/create-react-app)
