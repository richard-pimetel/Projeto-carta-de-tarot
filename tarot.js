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
      const response = await fetch(API_RANDOM_CARD);
      if (!response.ok) throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
  
      const data = await response.json();
      if (data.cards?.length) {
        const cartaSorteada = data.cards[0];
        const randomCard = document.getElementById('random-card');
        randomCard.innerHTML = `<h3>${cartaSorteada.name}</h3>`;
        randomCard.addEventListener('click', () => openModal(cartaSorteada));
      } else {
        console.error("Erro: Nenhuma carta recebida da API.");
        document.getElementById('random-card').innerHTML = `<h3>Erro ao buscar carta.</h3>`;
      }
    } catch (error) {
      console.error("Erro ao buscar carta aleatória:", error);
      document.getElementById('random-card').innerHTML = `<h3>Erro ao buscar carta.</h3>`;
    }
  }

  
async function searchCards(query) {
    if (!query.trim()) {
      document.getElementById('search-results').innerHTML = '<p>Por favor, digite algo para pesquisar.</p>';
      return;
    }
  
    try {
      const response = await fetch(API_ALL_CARDS);
      const data = await response.json();
      const cards = data.cards || [];
  
      const filteredCards = cards.filter(card => {
        if (query.toLowerCase() === "arcanos maiores") return arcanosMaiores.includes(card.name);
        if (query.toLowerCase() === "arcanos menores") return arcanosMenores.includes(card.name);
        return card.name.toLowerCase().includes(query.toLowerCase());
      });
  
      const searchResults = document.getElementById('search-results');
      searchResults.innerHTML = '';
  
      if (filteredCards.length) {
        filteredCards.forEach(card => {
          const cardElement = document.createElement('div');
          cardElement.className = 'card-item';
          cardElement.innerHTML = `<h3>${card.name}</h3>`;
          cardElement.addEventListener('click', () => openModal(card));
          searchResults.appendChild(cardElement);
        });
      } else {
        searchResults.innerHTML = '<p>Nenhuma carta encontrada.</p>';
      }
    } catch (error) {
      console.error("Erro ao pesquisar cartas:", error);
    }
  }
  

document.getElementById('draw-card-button').addEventListener('click', fetchRandomCard);
document.getElementById('search-button').addEventListener('click', () => {
  searchCards(document.getElementById('search-input').value);
});