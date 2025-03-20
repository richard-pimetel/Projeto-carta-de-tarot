'use strict'

const API_ALL_CARDS = "https://tarotapi.dev/api/v1/cards"
const API_RANDOM_CARD = "https://tarotapi.dev/api/v1/cards/random"

const arcanosMaiores = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
]

const arcanosMenores = [
    "Ace of Wands", "Two of Cups", "Three of Swords", "Four of Pentacles",
    "Five of Wands", "Six of Cups", "Seven of Swords", "Eight of Pentacles",
    "Nine of Wands", "Ten of Cups", "Page of Swords", "Knight of Pentacles",
    "Queen of Wands", "King of Cups"
]

async function fetchRandomCard() {
    try {
        const response = await fetch(API_RANDOM_CARD)
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)

        const data = await response.json()
        const randomCard = document.getElementById('random-card')
        randomCard.innerHTML = '' // Limpa o conteúdo anterior

        if (data.cards?.length) {
            const cartaSorteada = data.cards[0]
            const cardName = document.createElement('h3')
            cardName.textContent = cartaSorteada.name
            randomCard.appendChild(cardName)
            randomCard.addEventListener('click', () => openModal(cartaSorteada))
        } else {
            console.error("Erro: Nenhuma carta recebida da API.")
            const errorMessage = document.createElement('h3')
            errorMessage.textContent = "Erro ao buscar carta."
            randomCard.appendChild(errorMessage)
        }
    } catch (error) {
        console.error("Erro ao buscar carta aleatória:", error)
        const errorMessage = document.createElement('h3')
        errorMessage.textContent = "Erro ao buscar carta."
        document.getElementById('random-card').appendChild(errorMessage)
    }
}

function openModal(card) {
    const modal = document.getElementById('modal')
    document.getElementById('modal-card-name').textContent = card.name
    document.getElementById('modal-card-description').textContent = card.meaning_up
    modal.style.display = 'flex'
}

function closeModal() {
    document.getElementById('modal').style.display = 'none'
}

document.querySelector('.close-modal').addEventListener('click', closeModal)
document.getElementById('modal').addEventListener('click', (event) => {
    if (event.target === document.getElementById('modal')) closeModal()
})

async function searchCards(query) {
    const searchResults = document.getElementById('search-results')
    searchResults.innerHTML = '' // Limpa os resultados anteriores

    if (!query.trim()) {
        const message = document.createElement('p')
        message.textContent = 'Por favor, digite algo para pesquisar.'
        searchResults.appendChild(message)
        return
    }

    try {
        const response = await fetch(API_ALL_CARDS)
        const data = await response.json()
        const cards = data.cards || []

        const filteredCards = cards.filter(card => {
            if (query.toLowerCase() === "arcanos maiores") return arcanosMaiores.includes(card.name)
            if (query.toLowerCase() === "arcanos menores") return arcanosMenores.includes(card.name)
            return card.name.toLowerCase().includes(query.toLowerCase())
        })

        if (filteredCards.length) {
            filteredCards.forEach(card => {
                const cardElement = document.createElement('div')
                cardElement.className = 'card-item'
                const cardName = document.createElement('h3')
                cardName.textContent = card.name
                cardElement.appendChild(cardName)
                cardElement.addEventListener('click', () => openModal(card))
                searchResults.appendChild(cardElement)
            })
        } else {
            const message = document.createElement('p')
            message.textContent = 'Nenhuma carta encontrada.'
            searchResults.appendChild(message)
        }
    } catch (error) {
        console.error("Erro ao pesquisar cartas:", error)
    }
}

document.getElementById('draw-card-button').addEventListener('click', fetchRandomCard)
document.getElementById('search-button').addEventListener('click', () => {
    searchCards(document.getElementById('search-input').value)
})