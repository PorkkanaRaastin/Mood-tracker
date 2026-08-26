import axios from 'axios'
const baseUrl = 'http://localhost:3001/entries'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = (newEntry) => {
    return axios.post(baseUrl, newEntry).then(response => response.data)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, updatedEntry) => {
    return axios.put(`${baseUrl}/${id}`, updatedEntry).then(response => response.data)
}

export default {
    getAll: getAll,
    create: create,
    remove: remove,
    update: update
}