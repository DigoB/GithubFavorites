export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.loadData()
    }

    loadData() {

        this.entries = JSON.parse(localStorage
            .getItem("@github-fav:")) || []

            console.log(this.entries)
    }

    delete(user) {
        const filteredEntries = this.entries
            .filter(entry => entry.userName !== user.userName)

        this.entries = filteredEntries
        this.update()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const newRow = this.createRow()

            newRow.querySelector('.user img').src = `https://github.com/${user.userName}.png`
            newRow.querySelector('.user img').alt = `Imagem de ${user.name}`
            newRow.querySelector('.user p').textContent = user.name
            newRow.querySelector('.user span').textContent = user.userName
            newRow.querySelector('.repositories ').textContent = user.publicRepos
            newRow.querySelector('.followers').textContent = user.followers

            newRow.querySelector('.remove').onclick = () => {
                const isOk = confirm("Tem certeza que deseja deletar esse favorito?")
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(newRow)
        })

    }

    createRow() {

        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/DigoB.png" alt="Imagem de Rodrigo Braz">
            <a href="https://github.com/DigoB" target="_blank">
                <p>Rodrigo Braz</p>
                <span>DigoB</span>
            </a>
        </td>
        <td class="repositories">20</td>
        <td class="followers">30</td>
        <td>
            <button class="remove">&times;</button>
        </td>
        `

        return tr
    }

    removeAllTr() {
        
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }
}

export class GithubUser {
    static search(userName) {
        const endpoint = `https://api.github.com/users/${userName}`
        return fetch(endpoint)
        .then(data.json())
        .then((userName, name, publicRepos, followers) => ({
            userName,
            name,
            publicRepos,
            followers
        }))
    }
}