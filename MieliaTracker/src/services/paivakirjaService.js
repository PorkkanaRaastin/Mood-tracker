const baseUrl = 'http://localhost:3001/paivakirjaEntries'

const getAll = () => {
    return fetch(baseUrl).then(response => response.json())
}

const create = (newEntry) => {
    return fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
    }).then(response => response.json())
}

const remove = (id) => {
    return fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    })
}

export default { getAll, create, remove }