import React from 'react'
import { render } from 'react-dom'
import { App } from './App'

// setup fake backend
//comment out these two lines if connecting to database with mock data
// import { configureFakeBackend } from './_helpers';
// configureFakeBackend();

render(<App />, document.getElementById('app'))
