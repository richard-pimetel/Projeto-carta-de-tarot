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

// Função para buscar uma carta aleatória
async function fetchRandomCard() {
  try {
    const response = await fetch(API_RANDOM_CARD)
    if (!response.ok) throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)

    const data = await response.json()
    const randomCardContainer = document.getElementById('random-card')

    // Limpa o conteúdo anterior de forma segura
    while (randomCardContainer.firstChild) {
      randomCardContainer.removeChild(randomCardContainer.firstChild)
    }

    if (data.cards?.length) {
      const cartaSorteada = data.cards[0]

      // Cria o elemento para exibir o nome da carta
      const cardName = document.createElement('h3')
      cardName.textContent = cartaSorteada.name
      randomCardContainer.appendChild(cardName)

      // Adiciona o evento de clique para abrir o modal
      randomCardContainer.addEventListener('click', () => openModal(cartaSorteada))
    } else {
      console.error("Erro: Nenhuma carta recebida da API.")
      const errorMessage = document.createElement('h3')
      errorMessage.textContent = "Erro ao buscar carta."
      randomCardContainer.appendChild(errorMessage)
    }
  } catch (error) {
    console.error("Erro ao buscar carta aleatória:", error)
    const errorMessage = document.createElement('h3')
    errorMessage.textContent = "Erro ao buscar carta."
    const randomCardContainer = document.getElementById('random-card')
    while (randomCardContainer.firstChild) {
      randomCardContainer.removeChild(randomCardContainer.firstChild)
    }
    randomCardContainer.appendChild(errorMessage)
  }
}

// Função para abrir o modal com os detalhes da carta
function openModal(card) {
  const modal = document.getElementById('modal')
  document.getElementById('modal-card-name').textContent = card.name
  document.getElementById('modal-card-description').textContent = card.meaning_up
  modal.style.display = 'flex'
}

// Função para fechar o modal
function closeModal() {
  document.getElementById('modal').style.display = 'none'
}

// Event listeners para fechar o modal
document.querySelector('.close-modal').addEventListener('click', closeModal)
document.getElementById('modal').addEventListener('click', (event) => {
  if (event.target === document.getElementById('modal')) closeModal()
})

// Função para pesquisar cartas
async function searchCards(query) {
  const searchResultsContainer = document.getElementById('search-results')

  // Limpa os resultados anteriores de forma segura
  while (searchResultsContainer.firstChild) {
    searchResultsContainer.removeChild(searchResultsContainer.firstChild)
  }

  if (!query.trim()) {
    const message = document.createElement('p')
    message.textContent = 'Por favor, digite algo para pesquisar.'
    searchResultsContainer.appendChild(message)
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
        searchResultsContainer.appendChild(cardElement)
      });
    } else {
      const message = document.createElement('p')
      message.textContent = 'Nenhuma carta encontrada.'
      searchResultsContainer.appendChild(message)
    }
  } catch (error) {
    console.error("Erro ao pesquisar cartas:", error)
  }
}

// Event listeners para os botões
document.getElementById('draw-card-button').addEventListener('click', fetchRandomCard)
document.getElementById('search-button').addEventListener('click', () => {
  searchCards(document.getElementById('search-input').value)
})