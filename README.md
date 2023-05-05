<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

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
  "userId" : number,
  "mimeType": string
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

## ##Single

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

<br/>

## createGame

#### request

```c

socket.on('createGame', data);
data : {
  "speed" : number
}

```

#### response - 모두에게 알리는 메세지

```c
socket.emit('broadcast:game:createGame', data);
data: {
  "gameId": number;
  "ownerId": number;
  "name": string;
  "speed": number;
};
```

#### response - 게임을 만든 사람한테 알리는 메세지 ( 게임만든 사람은 2개를 받는것임 )

```c
socket.emit('single:game:createGame', data);
data: {
  //GameSession
  "public": {
    "gameId": number,
    "ownerId": number,
    "name": string,
    "speed": number
  },
  "private": {
    "room": string,
    "players": [ // 총 2개 길이의 배열이 날라감
      {//GamePlayerDto
        "userId": number,
        "score": number = 0,
        "position": number[]
      },
      {
        "userId": number,
        "score": number = 0,
        "position": number[]
      }
    ],
    "watcher": int[],
    "ball": {
      //GameBallDto
      "speed": number,
      "position": number,
      "deltaX": number,
      "deltaY": number
    },
    "totalScore": number,
    "round": number,
    "pause": boolean,
    "onGame": boolean,
    "onRound": boolean,
    "gameInterval": boolean, //무시하셈
    "roundInterval": boolean, //무시하셈
  }
};
```

<br/>

# Game

## Group

---

<br/>

## joinGame

#### request

```c

socket.on('joinGame', data);
data : {
  "gameId" : number
}

```

#### response - 방에 이미 접속중인 사람이 보는 메세지

```c
socket.emit('group:game:joinGame', data);
data: { //GamePlayerDto
  "userId": number;
  "score": number = 0;
  "position": number[];
};
```

#### response - 방에 접속하려는 사람이 보는 메세지

```c
socket.emit('single:game:joinGame', data);
data: {
  //GameSession
  "public": {
    "gameId": number,
    "ownerId": number,
    "name": string,
    "speed": number
  },
  "private": {
    "room": string,
    "players": [ // 총 2개 길이의 배열이 날라감
      {//GamePlayerDto
        "userId": number,
        "score": number = 0,
        "position": number[]
      },
      {
        "userId": number,
        "score": number = 0,
        "position": number[]
      }
    ],
    "watcher": int[],
    "ball": {
      //GameBallDto
      "speed": number,
      "position": number,
      "deltaX": number,
      "deltaY": number
    },
    "totalScore": number,
    "round": number,
    "pause": boolean,
    "onGame": boolean,
    "onRound": boolean,
    "gameInterval": boolean, //무시하셈
    "roundInterval": boolean, //무시하셈
  }
};
```

<br/>

## watchGame

#### request

```c

socket.on('watchGame', data);
data : {
  "gameId" : number
}

```

#### response - 방에 이미 접속중인 사람이 보는 메세지

```c
socket.emit('group:game:watchGame', data);
data: {
  "userId": number;
};
```

#### response - 방에 접속하려는 사람이 보는 메세지

```c
socket.emit('single:game:watchGame', data);
data: {
  //GameSession
  "public": {
    "gameId": number,
    "ownerId": number,
    "name": string,
    "speed": number
  },
  "private": {
    "room": string,
    "players": [ // 총 2개 길이의 배열이 날라감
      {//GamePlayerDto
        "userId": number,
        "score": number = 0,
        "position": number[]
      },
      {
        "userId": number,
        "score": number = 0,
        "position": number[]
      }
    ],
    "watcher": int[],
    "ball": {
      //GameBallDto
      "speed": number,
      "position": number,
      "deltaX": number,
      "deltaY": number
    },
    "totalScore": number,
    "round": number,
    "pause": boolean,
    "onGame": boolean,
    "onRound": boolean,
    "gameInterval": boolean, //무시하셈
    "roundInterval": boolean, //무시하셈
  }
};
```

<br/>

## leaveGame

#### request

```c

socket.on('leaveGame', data);
data : {
  "gameId" : number
}

```

#### response - 나가는 사람이 방의 오너면 -> 방에 접속하지 않은 사람이 보는 메세지

```c
socket.emit('broadcast:game:deleteGame', data);
data: {
  "gameId": number;
};
```

#### response - 나가는 사람이 방의 오너면 -> 방에 접속한 사람이 보는 메세지

```c
socket.emit('group:game:deleteGame', data);
data: {
  "gameId": number;
};
```

#### response - 나가는 사람이 방의 오너가 아니면 -> 방에 있는 사람들이 (나포함)

```c
socket.emit('group:game:leaveGame', data);
data: {
  "userId": number;
};
```

<br/>

## startGame

#### request

```c

socket.on('startGame');

```

#### response - 방에 있는 사람들에게

```c
socket.emit('group:game:startGame');
```

#### response - 게임이 끝났을때

```c
socket.emit('group:game:endGame', data);
data:{
  "winner" :{
    //GamePlayerDto
    "userId": number,
    "score": number,
    "position": number[]
  },
  "looser" :{
    //GamePlayerDto
    "userId": number,
    "score": number,
    "position": number[]
  },
}
```

<br/>

## movePaddle

#### request

```c

socket.on('movePaddle', data);
data = {
  "keyCode" : number
}

```

#### response - 방에 있는 사람들에게

```c
socket.emit('group:game:movePaddle', data);
data= {
  "userId": number,
  "position": number[]
}
```

<br/>

# Game

## Single

---
