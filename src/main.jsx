import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'

import { store } from './app/Store.js';
import DataFashion from './DataFashion.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <DataFashion />
    </Provider>

)
