# 02 - TODO homework Notes

The Questions are in the Homework_questions.md file.

## Answer 1 

> Q: What's the initial prompt you gave to AI to start the implementation?

The prompt I gave was:

> I have a project to do with the following requirements, please generate an initial implmentation and note in the README.md which tasks are completed.

```
In this homework, we'll build an end-to-end application with AI.

You can use any tool you want: ChatGPT, Claude, GitHub Copilot, Codex, Cursor, Antigravity, etc.

With chat-based applications you will need to copy code back-and-forth, so we recommend that you use an AI assistant in your IDE with agent mode.

We will implement a platform for online coding interviews.

The app should be able to do the following:

- Create a link and share it with candidates
- Allow everyone who connects to edit code in the code panel
- Show real-time updates to all connected users
- Support syntax highlighting for multiple languages
- Execute code safely in the browser

You can choose any technologies you want. For example:

- Frontend: React + Vite
- Backend: Express.js

We recommend using JavaScript for frontend, because with other technologies, some of the homework requirements may be difficult to implement.

But you can experiment with alternatives, such as Streamlit.

You don't need to know these technologies for doing this homework.
```

## Answer 2

> Q: What's the terminal command you use for executing tests?

```
cd server
npm test
```

## Answer 3

> Q: What's the command you have in `package.json` for `npm dev` for running both?

```
concurrently "npm run server" "npm run client"
```

## Answer 4

> Q: Which library did AI use for syntax highlighting?

```
It uses the monaco editor which has syntax highlighting for multiple languages (and is extensible via monarch).
```

## Answer 5

> Q: Which library did AI use for compiling Python to WASM?

```
pyodide
```

## Answer 6

> Q: What's the base image you used for your Dockerfile?

```
node:20-alpine
```

## Answer 7

> Q: Which service did you use for deployment?

```
Had an unused oci free-tier vm running, so used that (added as a subdomain to the domain I have from one.com). 
```