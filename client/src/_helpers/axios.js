import axios from 'axios'

const endpoint =
    process.env.NODE_ENV === 'production'
        ? `https://jaunty-jalopies.herokuapp.com`
        : `http://localhost:4000`

const instance = axios.create({ baseURL: endpoint })
export default instance
