# Terminal Chat

https://github.com/eriklm42/chat/blob/main/chat-exemple.png

### How install?

run (use your favorite package manager):

```
cd server; npm install
```

and

```
cd client; npm install
```

### How can run?

#### You can run anonymous using the command:

```
cd client; npm run chat:start
```

#### But if you prefer enter your nickname, you can use the command:
```
cd client; node index.js --username yourNickName
```
#### You have two parameters optional

The Room, defines which room your chat will run in

```
--room yourRoom (default room is 1)
```

The hostUri, defines which domain your chat will run in

```
--hostUri yourUri (default hostUri is http://localhost:9898)
```
