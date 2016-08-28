import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/constants';
import io from 'socket.io-client'


var socket = io.connect('http://localhost:5000');
socket.on('connect', function(){
    console.log('connected');
})
socket.on('user online',function(data){
    console.log(data);
    AppDispatcher.handleAction({
        "actionType": AppConstants.USER_ONLINE,
        "data": {
            users: data.users
        }
    });
});

socket.on('new message', function(data){
    data.type = 'RECEIVING';
    AppDispatcher.handleAction({
        "actionType": AppConstants.NEW_MESSAGE,
        "data": data
    });
});

socket.on('sync message', function(data){
    AppDispatcher.handleAction({
        "actionType": AppConstants.SYNC_MESSAGE,
        "data": data
    });
});

const AppActions={
    getLoginUser : function(id){
        AppDispatcher.handleAction({
            "actionType": AppConstants.LOGIN_USER,
            "data": {
                userId: id
            }
        });
        socket.emit('user online', id)
    },

    sendMessage : function(from,to,message){
        var data = {from ,to, message, type: 'SENDING',time : new Date()};
        AppDispatcher.handleAction({
            "actionType": AppConstants.NEW_MESSAGE,
            "data": data
        });
        socket.emit('new message', data);
    },

    changeSelectedFriend : function(id){
        AppDispatcher.handleAction({
            "actionType": AppConstants.CHANGE_FRIEND,
            "data": {
                userId: id
            }
        });
    },

    offlineMode :function(){
        AppDispatcher.handleAction({
            "actionType": AppConstants.OFFLINE_MODE,
        });
    }
};

export default AppActions;