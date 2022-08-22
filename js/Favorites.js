export class GithubUser {
    static search(userName) {
        const endpoint = `https://api.github.com/users/${userName}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(({login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}

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

    // O método JSON.stringfy, converte o JSON em String para salvar os dados no localStorage
    save() {
        localStorage.setItem("@github-fav:", JSON.stringify(this.entries))
    }

    /** Utilizando o async e await, criamos uma promisse,
     * Ela tem a mesma utilidade de quando usamos o fetch e vamos criando o passo
     * a passo do que precisamos
     * 
     * Este método busca o usuário na API do Github pelo userName ao clicar no botão de busca
     */
    async add(username) {
        try {
            const user = await GithubUser.search(username)

            console.log(user)

            if(user.login === undefined) {
                throw new Error(`Usuário não encontrado!`)
            }

            /** ...this é um "spread operator", estamos utilizando para trazer
             * os dados do array antigo para o novo, sem ferir a imutabilidade.
             * Ele está inserindo o novo usuário e "espalhando" os que já estavam
             * cadastrados para esse novo array também.
             */
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }

    /** Ao utilizar o filter, não deletamos o array anterior e sim criamos um novo
     * array com os campos desejados, isso é o PRINCIPIO DE IMUTABILIDADE.
     * Nesse caso, verificamos se o valor da entrada do userName é diferente dos já 
     * existentes. Caso seja falso, vai criar um novo array sem a entrada deletada
     */
    delete(user) {
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()

        this.addNewFavorite()
    }

    /** O método onclick, funciona da mesma maneira que criar um addEventListener('click')
     * Temos de tomar cuidado ao utilizá-lo dessa maneira, ele só é funcional caso tenhamos
     * certeza de que esse evento de clique vai existir apenas uma vez, caso contrário
     * vai dar erro. Nesse caso, clicamos no botão uma vez apenas a cada inserção de 
     * favorito.
     */
    addNewFavorite() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    /** Esta função vai ser executada toda vez que houver alguma alteração na aplicação
     */
    update() {
        // Remove todas as linhas de favoritos da tabela
        this.removeAllTr()

        // Busca os dados dos favoritos e constroi as linhas
        this.entries.forEach(user => {
            const newRow = this.createRow()

            newRow.querySelector('.user img').src = `https://github.com/${user.login}.png`
            newRow.querySelector('.user img').alt = `Imagem de ${user.name}`
            newRow.querySelector('.user p').textContent = user.name
            newRow.querySelector('.user span').textContent = user.login
            newRow.querySelector('.repositories ').textContent = user.publicRepos
            newRow.querySelector('.followers').textContent = user.followers

            // Verifica se o botão de deletar favorito foi clicado e executa caso seja true
            newRow.querySelector('.remove').onclick = () => {
                const isOk = confirm("Tem certeza que deseja deletar esse favorito?")
                if(isOk) {
                    this.delete(user)
                }
            }
            // O método append, cria uma nova linha ao final do array
            this.tbody.append(newRow)
        })

    }

    // Método de "fabrica" de uma linha na tabela, inserimos a estrutura que vamos precisar nele
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

    // Método que deleta todas as linhas da tabela
    removeAllTr() {
        
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }
}