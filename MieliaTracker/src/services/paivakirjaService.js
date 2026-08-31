import axios from 'axios'

const baseUrl = 'http://localhost:3001/paivakirjaEntries'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = (newEntry) => {
    return axios.post(baseUrl, newEntry).then(response => response.data)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, remove }