var piles = [3, 4, 5]; // Quantidade inicial de palitos em cada pilha
var currentPlayer = 1; // Jogador atual (1 = jogador humano, 2 = IA)

//verificar fim do jogo
function checkEndGame() {
    var totalSticks = piles.reduce(function (acc, val) { // Calcula a soma total de palitos em todas as pilhas
        return acc + val;
    }, 0);

    return totalSticks === 0; // Retorna verdadeiro se não houver mais nenhum palito no tabuleiro, indicando que o jogo chegou ao fim
}

//função para a jogada do humano
function makeMove(sticksToRemove) {
    if (currentPlayer === 1) { // Verifica se é a vez do jogador humano (jogador 1)
        var pileIndex = -1; // Índice da pilha onde será removido o palito

        for (var i = 0; i < piles.length; i++) { // Itera sobre as pilhas
            if (piles[i] >= sticksToRemove) { // Verifica se a pilha tem pelo menos a quantidade de palitos a serem removidos
                pileIndex = i; // Armazena o índice da pilha onde a remoção será feita
                break; // Sai do loop, pois encontrou uma pilha válida
            }
        }

        if (pileIndex !== -1) { // Verifica se foi encontrada uma pilha válida
            piles[pileIndex] -= sticksToRemove; // Remove os palitos da pilha selecionada
            renderBoard(); // Atualiza a renderização do tabuleiro na tela

            if (checkEndGame()) { // Verifica se o jogo chegou ao fim
                //alert("Fim de jogo! Você venceu!");
                voceVenceu(); // Exibe uma mensagem de vitória para o jogador humano
                resetGame(); // Reinicia o jogo
                return;
            }

            currentPlayer = 2; // Passa a vez para o jogador IA (jogador 2)
            setTimeout(makeAIMove, 500); // Aguarda um pequeno intervalo em ms e chama a função makeAIMove para a jogada da IA
        }
    }
}

// Função para a jogada da IA
function makeAIMove() {
    var bestMove = null; // Variável para armazenar a melhor jogada
    var bestValue = Number.NEGATIVE_INFINITY; // Valor inicial da melhor pontuação é negativo infinito
    var profundidade = 2;

    for (var i = 0; i < piles.length; i++) { // Percorre as pilhas
        for (var sticksToRemove = 1; sticksToRemove <= 3; sticksToRemove++) { // Percorre as quantidades de palitos a serem removidos
            if (piles[i] >= sticksToRemove) { // Verifica se é possível remover a quantidade de palitos atual
                piles[i] -= sticksToRemove; // Realiza a jogada simulada

                var value = minimax(piles, profundidade, false, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY); // Chama a função minimax para avaliar o estado após a jogada simulada
                console.log("valor retornado do minimax: "+ value);
                console.log("pontuação encontrada até o momento: "+ bestValue);
                piles[i] += sticksToRemove; // Desfaz a jogada simulada

                if (value > bestValue) { // Verifica se a pontuação obtida é melhor que a melhor pontuação encontrada até o momento
                    bestValue = value; // Atualiza a melhor pontuação
                    bestMove = { pileIndex: i, sticksToRemove: sticksToRemove }; // Armazena a jogada como a melhor jogada
                }
            }
        }
    }

    piles[bestMove.pileIndex] -= bestMove.sticksToRemove; // Realiza a jogada com base na melhor jogada encontrada

    if (checkEndGame()) { // Verifica se o jogo chegou ao fim
        IAVenceu(); // Função para lidar com o fim do jogo quando a IA vence
        resetGame(); // Reinicia o jogo
        return;
    }

    currentPlayer = 1; // Define o próximo jogador como o jogador humano
    renderBoard(); // Renderiza o tabuleiro
}

//função mini-max
function minimax(piles, depth, isMaximizingPlayer, alpha, beta) {
    if (checkEndGame(piles)) { // Verifica se o jogo chegou ao fim
        return evaluate(piles, depth); // Retorna a pontuação do estado atual
    }
    console.log("entrando no minimax");
    if (isMaximizingPlayer) { // Se for o jogador maximizador
        var value = Number.NEGATIVE_INFINITY; // Valor inicial é negativo infinito

        for (var i = 0; i < piles.length; i++) { // Percorre as pilhas
            for (var sticksToRemove = 1; sticksToRemove <= 3; sticksToRemove++) { // Percorre as quantidades de palitos a serem removidos
                if (piles[i] >= sticksToRemove) { // Verifica se é possível remover a quantidade de palitos atual
                    piles[i] -= sticksToRemove; // Realiza a jogada simulada

                    value = Math.max(value, minimax(piles, depth + 1, false, alpha, beta)); // Chama recursivamente o minimax para o próximo nível, alternando o jogador

                    piles[i] += sticksToRemove; // Desfaz a jogada simulada

                    alpha = Math.max(alpha, value); // Atualiza o valor de alfa como o máximo valor encontrado até o momento

                    if (alpha >= beta) { // Verifica se ocorreu a poda alfa-beta
                        break; // Sai do loop
                    }
                }
            }
        }
        return value; // Retorna o melhor valor encontrado para o jogador maximizador
    } else { // Se for o jogador minimizador
        var value = Number.POSITIVE_INFINITY; // Valor inicial é positivo infinito

        for (var i = 0; i < piles.length; i++) { // Percorre as pilhas
            for (var sticksToRemove = 1; sticksToRemove <= 3; sticksToRemove++) { // Percorre as quantidades de palitos a serem removidos
                if (piles[i] >= sticksToRemove) { // Verifica se é possível remover a quantidade de palitos atual
                    piles[i] -= sticksToRemove; // Realiza a jogada simulada

                    value = Math.min(value, minimax(piles, depth + 1, true, alpha, beta)); // Chama recursivamente o minimax para o próximo nível, alternando o jogador

                    piles[i] += sticksToRemove; // Desfaz a jogada simulada

                    beta = Math.min(beta, value); // Atualiza o valor de beta como o mínimo valor encontrado até o momento

                    if (beta <= alpha) { // Verifica se ocorreu a poda alfa-beta
                        break; // Sai do loop
                    }
                }
            }
        }
        return value; // Retorna o melhor valor encontrado para o jogador minimizador
    }
}
function evaluate(piles, depth) {
    var totalSticks = piles.reduce(function (acc, val) {
        return acc + val;
    }, 0);

    if (totalSticks === 0) {
        if (depth % 2 === 0) { //isso sempre de acordo com a profundide passada
            return -1; // A IA vence
        } else {
            return 1; // O jogador humano vence
        }
    } else {
        // Se o total de palitos for par, retorna -1
        // Se o total de palitos for ímpar, retorna 1
        if (totalSticks % 2 === 0) {
            return -1;
        } else {
            return 1;
        }
    }
}

//renderizar o tabuleiro na tela
function renderBoard() {
    var boardElement = document.getElementById("board"); // Obtém o elemento HTML que representa o tabuleiro
    boardElement.innerHTML = ""; // Limpa o conteúdo do elemento

    piles.forEach(function (pile, index) { // Itera sobre cada pilha no array 'piles'
        var pileElement = document.createElement("div"); // Cria um elemento HTML para representar a pilha
        pileElement.className = "pile"; // Define a classe CSS para o elemento da pilha
        pileElement.id = "pile" + index; // Define o ID do elemento da pilha com base no índice

        for (var i = 0; i < pile; i++) { // Itera sobre o número de palitos na pilha
            var stickElement = document.createElement("div"); // Cria um elemento HTML para representar um palito
            stickElement.className = "stick"; // Define a classe CSS para o elemento do palito
            pileElement.appendChild(stickElement); // Adiciona o elemento do palito ao elemento da pilha
        }

        boardElement.appendChild(pileElement); // Adiciona o elemento da pilha ao elemento do tabuleiro
    });
}

//Reiniciar o jogo
function resetGame() {
    piles = [3, 4, 5];
    currentPlayer = 1;
    renderBoard();
}

//parte do historico de ganhadores
function IAVenceu(){
  var card = document.getElementById("idHistorico");
  card.innerHTML += "<div class='alert alert-danger' role='alert'><i class='fa-solid fa-thumbs-down'></i> IA Venceu!!</div>";
}
//parte do historico de ganhadores
function voceVenceu(){
  var card = document.getElementById("idHistorico");
  card.innerHTML += "<div class='alert alert-success' role='alert'><i class='fa-solid fa-trophy'></i> Parabéns, você venceu!!</div>";
  //chama função para lançar animação de confetes
  confetti({
    particleCount: 150
  });
  //duração da animação
  setTimeout(() => {
    confetti.reset();
  }, 3000);
}
//inicia o jogo
renderBoard();