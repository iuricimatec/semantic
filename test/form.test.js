const assert = require('chai').assert;
const request = require('supertest');
const app = require('../app');
const { processFormInput, submittedWords } = require('../game');




describe('Form Processing', () => {
  it('should add a word to the submittedWords array', () => {
    processFormInput('apple');
    assert.equal(submittedWords.length, 1);
    assert.equal(submittedWords[0], 'apple');
  });

  it('should handle 100 rounds of form submissions', () => {
    for (let i = 1; i <= 100; i++) {
      processFormInput(`word${i}`);
    }

    assert.equal(submittedWords.length, 100);
    assert.deepEqual(submittedWords, [
        "Cabeça",
        "Verde",
        "Água",
        "Cantar",
        "Morte",
        "Grande",
        "Barco",
        "Pagar",
        "Janela",
        "Querida",
        "Mesa",
        "Perguntar",
        "Aldeia",
        "Frio",
        "Vara",
        "Dançar",
        "Lagoa",
        "Doente",
        "Orgulho",
        "Cozinhar",
        "Tinta",
        "Mau",
        "Agulha",
        "Nadar",
        "Viagem",
        "Azul",
        "Lanterna",
        "Pecar",
        "Pão",
        "Rico",
        "Árvore",
        "Furar",
        "Pena",
        "Amarelo",
        "Montanha",
        "Morrer",
        "Sal",
        "Novo",
        "Costume",
        "Orar",
        "Dinheiro",
        "Besta",
        "Caderno",
        "Desprezar",
        "Dedo",
        "Caro",
        "Pássaro",
        "Cair",
        "Livro",
        "Injusto",
        "Sapo",
        "Partir",
        "Fome",
        "Branco",
        "Criança",
        "Atenção",
        "Caneta",
        "Triste",
        "Uva",
        "Casar",
        "Casa",
        "Amor",
        "Copo",
        "Brigar",
        "Couro",
        "Comprido",
        "Batata",
        "Pintar",
        "Parte",
        "Velho",
        "Flor",
        "Bater",
        "Caixa",
        "Animal",
        "Família",
        "Lavar",
        "Vaca",
        "Estranho",
        "Felicidade",
        "Mentir",
        "Educação",
        "Apertado",
        "Irmão",
        "Medo",
        "Cegonha",
        "Falso",
        "Temer",
        "Beijar",
        "Noiva",
        "Puro",
        "Porta",
        "Escolher",
        "Grama",
        "Satisfeito",
        "Pirraça",
        "Dormir",
        "Mês",
        "Chique",
        "Mulher",
        "Bronca"
    ]);
  });
});
