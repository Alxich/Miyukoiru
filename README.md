<h1 align="center">Miyukoiru</h1>
<p align="center">
    A unique and playful chatbot project for Telegram and Discord
</p><br>
<p align="center">
<img src="https://i.imgur.com/6trGldG.gif" alt="example-image-of-working-project">
</p><br>

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Project Status](#project-status)
- [Installation](#installation)
- [Project Dependencies](#project-dependencies)
- [File Structure](#file-structure)

## Introduction

***Miyukoiru: Your Playful Chatbot Project***

Miyukoiru is a captivating chatbot project crafted for engaging interactions, built using classes for a structured and modular approach. Explore unique and entertaining conversations with Miyukoiru, making each interaction an enjoyable adventure.

**Project Highlights:** 

Engage in playful conversations filled with unpredictability.
<br>Experience intriguing interactions that keep you guessing.
<br>Enjoy the delightful charm of Miyukoiru as you chat. 🌟
<br>Miyukoiru is more than just a chatbot; it's a source of entertainment and fun conversations. 
<br>Dive in and discover the joy of interacting with Miyukoiru! 🚀


## Features

Miyukoiru is your interactive chatbot companion, designed to infuse a touch of whimsy into your conversations. Engage in unique and entertaining dialogues with Miyukoiru, where every exchange is an exciting journey of discovery.

- **Diverse Response Pool:** Miyukoiru boasts a vast repertoire of over 1000 random answers, ensuring that interactions with the bot are always engaging and unpredictable.

    <p align="center">
    <img src="https://i.imgur.com/B8xZWlB.gif" alt="example-image-of-working-project">
    </p>
- **Meme Sharing:** The bot enriches user experiences by sharing entertaining memes featuring adorable dogs and cats, adding a fun and lighthearted element to your conversations.

    <p align="center">
    <img src="https://i.imgur.com/1kKSTZH.gif" alt="example-image-of-working-project">
    </p>
- **Command List:** Miyukoiru understands a variety of commands, allowing users to interact with the bot in multiple ways. Some of the available commands include:
   - `/start`: Begin interactions.
   - `/info`: Retrieve information about this bot.
   - `/help`: Display a list of available features.
   - `/meme`: Access memes from Reddit using the API.
   - `/quiz`: Engage in a quiz game to find a random number from 0 to 9.
   - `/lang`: Select a language (For now, only "UA" or "EN" are supported).
   - `/doge`: Enjoy dog-related content from the API.
   - `/cat`: Explore cat-related content from the API.
   - `/emojy`: Access emojis, inspired by Japanese style `\-(¬‿¬)-/`.

Each command is equipped with helpful descriptions, ensuring users can navigate and enjoy Miyukoiru's functionalities effortlessly.

Miyukoiru is designed to offer a wide range of interactive and entertaining features to enhance your chatbot experience. 🌟

## Project Status

Miyukoiru is currently in a stable and finished state, ready for use. However, it's designed to be extensible, allowing for the addition of new features in the future. The architecture of the project is built with flexibility in mind, ensuring that it can be easily adapted for use on other platforms.

The main class, Miyukoiru, is designed to be flexible and adaptable. Its modular structure allows for the incorporation of new functions and the integration of Miyukoiru into different platforms or environments. Whether you're enhancing the bot's capabilities or integrating it into a new system, Miyukoiru's architecture is designed to accommodate future developments.

Feel free to explore the possibilities of Miyukoiru and extend its functionalities as needed to meet your evolving requirements.

## Installation


To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:
    

```bash
#~ Clone this repository
$ git clone https://github.com/[Please change this to my current name]/Miyukoiru

#~ Go into the repository
$ cd Miyukoiru

#~ Install dependencies
$ npm install

#~ Build current code
$ npm build

#~ Run the app
$ npm start
```

**Additional commands**

```bash
#~ To build the project
$ npm run build

#~ To stop the application
$ npm run stop

#~ For development with automatic reloading
$ npm run dev

#~ For testing
$ npm test

```

## Project Dependencies

Before you get started with this project, make sure you have the following dependencies installed:

- **Node.js:** [Download](https://nodejs.org/)

These additional libraries and packages are used to enhance the functionality of the project:

- **discord.js** [[Documentation](https://discord.js.org)]  - A powerful JavaScript library for interacting with the Discord API.
- **dotenv** [[Documentation](https://www.npmjs.com/package/doten)] - A module that loads environment variables from a `.env` file into `process.env`.
- **kleur** [[Documentation](https://www.npmjs.com/package/kler)] - A library for adding colors to terminal text output in Node.js.
- **nodemon** [[Documentation](https://www.npmjs.com/package/ndmon)] - A utility that automatically restarts the Node.js application when file changes are detected.
- **pm2** [[Documentation](https://pm2.keymetrics.io)] - A process manager for Node.js applications that simplifies process management and scaling.
- **telegraf** [[Documentation](https://telegraf.js.org)] - A modern Telegram Bot API framework for Node.js.
- **ts-node** [[Documentation](https://www.npmjs.com/package/ts-node)] - A TypeScript execution environment for Node.js, enabling TypeScript to be run directly.
- **tslint** [[Documentation](https://palantir.github.io/tslint)] - A static analysis tool that checks TypeScript code for readability, maintainability, and errors.
- **typescript** [[Documentation](https://www.typescriptlang.org)] - A superset of JavaScript that adds static typing to the language.

You can install these dependencies as needed to run the project successfully. For more details on installation and usage, please refer to the ***documentation*** of each dependency.

## File Structure

Understanding the organization of files and directories in this project is essential for effective development and customization. Below, you'll find a brief overview of the project's file structure.

```
│────────────────────────────│                                          
│ Miyukoiru (root directory) │                                          
│────────────────────────────│                                          
│   ├─ bin                                                             
│   │  └─ testimonal.js                                                
│   ├─ public                                                          
│   │  ├─ 8_ball_responses_emojis.txt                                  
│   │  ├─ 8_ball_responses_miyukoiru.txt                               
│   │  ├─ 8_ball_responses_miyukoiru_ua.txt                            
│   │  └─ logo.jpg                                                     
│   ├─ src                                                             
│   │  ├─ classes                                                      
│   │  │  ├─ index.ts                                                  
│   │  │  ├─ _discordBot.ts                                            
│   │  │  ├─ _miyukoiru.ts                                             
│   │  │  └─ _telegramBot.ts                                           
│   │  ├─ index.ts                                                     
│   │  ├─ languages                                                    
│   │  │  └─ languages.json                                            
│   │  └─ lib                                                          
│   │     ├─ functions.ts                                              
│   │     ├─ options.ts                                                
│   │     └─ types.ts                                                  
│   ├─ README.md                                                       
│   ├─ nodemon.json                                                    
│   ├─ package-lock.json                                               
│   ├─ package.json                                                    
│   ├─ .eslintrc.json                                                  
│   ├─ .gitignore                                                      
│   └─ tsconfig.json                                                   
│────────────────────────────│                                          

```
<br>

## Some last word and thanks :)

Congratulations, you've reached the end of this README! I hope this documentation has provided you with the information you need to get started with the project.

I extend my sincere thanks to ChatGPT for their invaluable assistance in creating this README.md file. Their support was instrumental in making this documentation clear and informative.

If you have any questions, encounter issues, or want to contribute, feel free to reach out to me via my GitHub repository

I value your feedback and contributions, as they help me improve and enhance this project. Thank you for your interest and support!

Happy coding! 🚀
