var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var IdbStore = require('./idb-store')

var loggedInUser;

var messages={
};

var friendList = [];

var peopleList = [{
    id: "prashant",
    name: "Prashant Agrawal",
    status: "offline",
    avatar: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg"
},{
    id: "abhijai",
    name: "Abhijai",
    status: "offline",
    avatar: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_02.jpg"
},{
    id: "latika",
    name: "Latika",
    status: "offline",
    avatar: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_03.jpg"
},{
    id: "percy",
    name: "Percy",
    status: "offline",
    avatar: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_04.jpg"
},{
    id: "arpit",
    name: "Arpit Agrawal",
    status: "offline",
    avatar: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_05.jpg"
},{
    id: "akash",
    name: "Akash Goel",
    status: "offline",
    avatar: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_06.jpg"
},{
    id: "dolly",
    name: "Dolly Singh",
    status: "offline",
    avatar: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_07.jpg"
},{
    id: "numaan",
    name: "Numaan",
    status: "offline",
    avatar: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_08.jpg"
},{
    id: "avantika",
    name: "Avantika Pandey",
    status: "offline",
    avatar: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_09.jpg"
},{
    id: "prakhar",
    name: "Prakhar Sharma",
    status: "offline",
    avatar: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_10.jpg"
}];

var selectedFriend;

var ChatStore = assign({}, EventEmitter.prototype, {

    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback){
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback);
    },

    getLoggedInUser : function(){
        return loggedInUser;
    },

    getFriendList : function(){
        return friendList;
    },

    getSelectedFriend : function(){
        return selectedFriend;
    },

    getMessages : function(){
        return messages[selectedFriend.id] || []
    }


});

AppDispatcher.register(function(payload){
    
    var action = payload.action;
    switch(action.actionType) {

        case AppConstants.LOGIN_USER:
            loggedInUser = action.data.userId;
            for(let i=0 ;i <peopleList.length ;i++){

              if(peopleList[i].id === loggedInUser)
                continue;
              friendList.push(peopleList[i])
              selectedFriend = friendList[0];

            }
            ChatStore.emit(AppConstants.LOGIN_USER_SUCCESS);
            break;

        case AppConstants.USER_ONLINE:
            
            for(let i=0 ; i < friendList.length ; i++ ){
                if(action.data.users.indexOf(friendList[i].id)!==-1){
                    friendList[i].status = "online";
                } else {
                    friendList[i].status = "offline";
                }
            }
            ChatStore.emit(AppConstants.FRIEND_LIST_UPDATED);
            break;

        case AppConstants.CHANGE_FRIEND:
            for(let i=0 ; i < friendList.length ; i++ ){
                if(friendList[i].id === action.data.userId){
                    selectedFriend = friendList[i];
                }
            }
            ChatStore.emit(AppConstants.CHANGE_FRIEND_SUCCESS);
            break;

        case AppConstants.NEW_MESSAGE:
            var id;
            if(action.data.type==='SENDING'){
                id = action.data['to'];
            } else {
                if(action.data['to'] !== loggedInUser)
                    break;
                id = action.data['from'];
            }
            if(!messages[id])
                messages[id] = [];
            messages[id].push(action.data);

            IdbStore.set({id: id,messages:messages[id]});
            ChatStore.emit(AppConstants.NEW_MESSAGE);
            break;

        case AppConstants.SYNC_MESSAGE:
            for(let i=0 ; i < action.data.messages.length ; i++){
                if(!messages[action.data.messages[i].from]){
                    messages[action.data.messages[i].from] = [];
                }
                messages[action.data.messages[i].from].push(action.data.messages[i]);
                IdbStore.set({id: action.data.messages[i].from, messages:messages[action.data.messages[i].from]});
            }
            console.log('sync',action.data,messages);
            ChatStore.emit(AppConstants.NEW_MESSAGE);
            break;

        case AppConstants.OFFLINE_MODE:
            IdbStore.getAll(function(allObj){
                for(let i=0 ; i<allObj.length ;i++){
                    messages[allObj[i].id]=allObj[i].messages;
                }
                ChatStore.emit(AppConstants.NEW_MESSAGE);
            })
            break;



        default: console.log(payload)
    }
        
    return true;
});

module.exports = ChatStore;
