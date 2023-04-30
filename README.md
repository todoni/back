# back
~~nest배워보자~~

backend

# 이론학습

[CORS](https://github.com/SongSongPaPa/learn_nest/blob/main/learn_nest/theory/CORS.md)



# handleConnection
---
## handleConnection
#### request
```c
// {
//   "access_token": "발급받은토큰"
// }
```

#### response
```c
{

}
```


## handleDisconnect
#### request
```c

```

#### response
```c
```


# Chat
## BroadCast
---
## createChat
#### request
```c
socket.on('createChatss', chat);

chat : {
  "name": "이름",
  "type": string ("public | private | protected" 셋 중 하나),
  "password" : string  (nullable) 
}

```

#### response_me
```c
socket.emit('single:chat:joinChat', data);
data: {
  "public": {
    "chatId" : number,
    "ownerId" : number,
    "adminId" : number,
    "type" : string ("public | private | protected" 셋 중 하나),
    "name" : string
  },
  "private" : {
    "room" : string,
    "password" : '' (nullable),
    "users" : <int>[],
    "kicked" : [
      {
        "userId": number,
        "expiredAt": number
      }
    ],
    "muted" : [
      {
        "userId": number,
        "expiredAt": number
      }
    ],
  }
};
```

### response_other
```c
socket.emit('broad:chat:joinChat', data);
data: {
  "public": {
    "chatId" : number,
    "ownerId" : number,
    "adminId" : number,
    "type" : "public | private | protected",
    "name" : string
  },
  "private" : {
    "room" : string,
    "password" : '' (nullable),
    "users" : <int>[],
    "kicked" : [
      {
        "userId": number,
        "expiredAt": number
      }
    ],
    "muted" : [
      {
        "userId": number,
        "expiredAt": number
      }
    ],
  }
};
```

## updateChat
#### request
```c

socket.on('updateChat', chat);
chat : {
  "name": "이름",
  "type": "public | private | protected",
  "password" : " "  (nullable) 
}

```

#### response
```c
socket.emit('broadcast:chat:updateChat', data);
data: {
  "chatId" : number,
  "ownerId" : number,
  "adminId" : number,
  "type" : "public | private | protected",
  "name" : string
};
```


## setAdmin
#### request
```c

socket.on('setAdmin', data);
data : {
  "userId": number
}

```

#### response
```c
socket.emit('broadcast:chat:setAdmin', data);
data: {
  "chatId": number,
  "adminId": number,
};
```

</br>

## Group
---

## joinChat
#### request
```c

socket.on('joinChat', chat);
chat : {
  "chatId": number,
  "password" : string  (nullable) 
}

```

#### response_me
```c
socket.emit('single:chat:joinChat', data);
data: {
  "public": {
    "chatId" : number,
    "ownerId" : number,
    "adminId" : number,
    "type" : "public | private | protected",
    "name" : string
  },
  "private" : {
    "room" : string,
    "password" : '' (nullable),
    "users" : <int>[],
    "kicked" : [
      {
        "userId": number,
        "expiredAt": number
      }
    ],
    "muted" : [
      {
        "userId": number,
        "expiredAt": number
      }
    ],
  }
};
```

#### response_other
```c
socket.emit('group:chat:joinChat', data);
data : {
  "userId": number
}
```
<br/>

## leaveChat
#### request
```c
socket.on('setleaveChatAdmin');
```

#### response -> request를 했다면 꼭 받는 것
```c
socket.emit('single:chat:leaveChat');
// 채팅방 나가기를 했다고 클라이언트에서 바로 나가기 처리하지말고,
// 이 리스폰스를 받아야 방을 나갈 수 있게 구현합시다
// ex, irc 논블로킹

//아래는 상황에 따라 추가로 받는 이벤트
```
#### response -> 내가 마지막으로 나간 사람일 경우
```c
socket.emit('broadcast:chat:deleteChat', data);
data: {
  "chatId": number
};
```
#### response -> 나간 사람이 admin이나 owner일경우
```c
socket.emit('broadcast:chat:setAdmin', data);
data: {
  "chatId": client.chat.id,
  "ownerId": chatState.ownerId, (undifinedable)
  "adminId": chatState.adminId  (undifinedable)
};
```
#### response -> 누가 나갔는지 알려주는 이벤트
```c
socket.emit('group:chat:leaveChat', data);
data: {
  "chatId": number
};
```
<br/>

## sendMessage
#### request
```c

socket.on('sendMessage', data);
data: {
  "message" : string
}

```

#### response
```c
socket.emit('group:chat:sendMessage', data);
data: {
  "sourceId": number (보낸사람),
  "message": string,
  "direct": false,
};
```
<br/>

## kickUser
#### request
```c

socket.on('kickUser', data);
data : {
  "userId": number
}

```

#### response
```c
socket.emit('group:chat:kickUser', data);
data : {
  "userId": number
}
```

<br/>

## muteUser
#### request
```c

socket.on('muteUser', data);
data : {
  "userId": number
}

```

#### response
```c
socket.emit('group:chat:muteUser', data);
data : {
  "userId": number
}
```

<br/>

## Single
---
## muteUser
#### request
```c

socket.on('sendDirectMessage', data);
data : {
  "userId" : number,
  "message" : string
}

```

#### response
```c
socket.emit('single:chat:sendMessage', data);
data: {
  "sourceId": number (보낸사람),
  "message": string,
  "direct": false,
};
```
<br/>

## inviteUser
#### request
```c

socket.on('sendDirectMessage', data);
data: {
  "userId" : number
}

```

#### response
```c
socket.emit('single:chat:inviteUser', data);
data: {
  "chatId":number,
  "sourceId": number
};
```


<br/>
<br/>

# User

## Broadcast
---
## updateDisplayName
#### request
```c

socket.on('updateDisplayName', data);
data: {
  "name" : string
}

```

#### response
```c
socket.emit('broadcast:user:updateDisplayName', data);
data: {
  "userId": number,
  "name": string,
};
```
<br/>

## updateImage
#### request
```c

socket.on('updateImage', data);
data: {
  "userId" : number
}

```

#### response
```c
socket.emit('broadcast:user:updateImage', data);
data: {
  "userId": number,
  "imageUrl": string,
};
```

<br/>

##Single
---
## followUser
#### request
```c

socket.on('followUser', data);
data : {
  "userId" : number
}

```

#### response
```c
socket.emit('single:user:followUser', data);
data: {
  "userId": number
};
```

<br/>

## unFollowUser
#### request
```c

socket.on('unFollowUser', data);
data : {
  "userId" : number
}

```

#### response
```c
socket.emit('single:user:unFollowUser', data);
data: {
  "userId": number
};
```
<br/>

## blockUser
#### request
```c

socket.on('blockUser', data);
data : {
  "userId" : number
}

```

#### response
```c
socket.emit('single:user:blockUser', data);
data: {
  "userId": number
};
```

<br/>


# Game
## Broadcase
---
## followUser
#### request
```c

socket.on('followUser', data);
data : {
  "userId" : number
}

```

#### response
```c
socket.emit('single:user:followUser', data);
data: {
  "userId": number
};
```


## unFollowUser
#### request
```c

socket.on('unFollowUser', data);
data : {
  "userId" : number
}

```

#### response
```c
socket.emit('single:user:unFollowUser', data);
data: {
  "userId": number
};
```

## blockUser
#### request
```c

socket.on('blockUser', data);
data : {
  "userId" : number
}

```

#### response
```c
socket.emit('single:user:blockUser', data);
data: {
  "userId": number
};
```
