# Pedroth's Corner

Website where I share some notes and projects about topics I like.

Check [here](https://pedroth.github.io/)

## Concept

Pedroth's Corner is my personal website. Here I will:

- Write about things I like
- Distill knowledge
- Showcase demos and software projects
- I will also share my contact and places on the web, such as youtube, github, twitter, etc...

## Features

- All post will be organized by:
  - Set of tags (similar post should have common tags)
  - Creation and update date
  - Title
- Search engine
  - Search by title and tag
- Visual post representation
- Posts written in [nabladown.js](https://github.com/pedroth/nabladown.js)
- Minimal dependencies

# Architecture

## Folder Structure
- jslib
- others
- posts
- scripts
- resources
	- db
	- papers
	- processor
- static
	- app
	- main
	- nav
	- search
	- styles
	- webfont
	- about.html
	- tags.html 
- index.html
- index.js
- index.css

## DB Structure

```javascript
DB := {
    posts: Array<Post>
}

Post := {
	id: String,
	title: String,
	date: Date(String),
	src: Address(String),
	tags: Array<String>
}
```
