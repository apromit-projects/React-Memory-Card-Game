import { useEffect, useState } from "react";

export const useGameLogic = (cardValues) => {
  // Единый объект состояния вместо множества useState
  const [gameState, setGameState] = useState({
    cards: [],
    flippedCards: [],
    matchedCards: [],
    score: 0,
    moves: 0,
    isLocked: false
  });

  // Деструктуризация для удобства использования в компоненте
  const { cards, flippedCards, matchedCards, score, moves, isLocked } = gameState;

  const shuffleArray = (array) => {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };

  const initializeGame = () => {
    // Перемешать карты
    const shuffled = shuffleArray(cardValues);

    const finalCards = shuffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false
    }));

    // Один вызов setState вместо многих
    setGameState({
      cards: finalCards,
      flippedCards: [],
      matchedCards: [],
      score: 0,
      moves: 0,
      isLocked: false
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initializeGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = (card) => {
    // Не кликабельна, если уже перевернута или уже совпала
    if (card.isFlipped || card.isMatched || isLocked || flippedCards.length === 2) {
      return;
    }

    // Обновляем состояние карты (переворачиваем)
    const newCards = gameState.cards.map((c) => {
      if (c.id === card.id) {
        return { ...c, isFlipped: true };
      }
      return c;
    });

    const newFlippedCards = [...flippedCards, card.id];

    // Обновляем состояние с новыми картами и перевернутыми картами
    setGameState({
      ...gameState,
      cards: newCards,
      flippedCards: newFlippedCards
    });

    // Проверяем, если это вторая карта (была уже одна перевернутая)
    if (flippedCards.length === 1) {
      // Блокируем игру
      setGameState(prev => ({
        ...prev,
        isLocked: true
      }));

      const firstCardId = flippedCards[0];
      const firstCard = gameState.cards.find(c => c.id === firstCardId);

      if (firstCard.value === card.value) {
        // Совпадение!
        setTimeout(() => {
          setGameState(prev => {
            // Обновляем карты, помечая их как совпавшие
            const updatedCards = prev.cards.map((c) => {
              if (c.id === card.id || c.id === firstCardId) {
                return { ...c, isMatched: true, isFlipped: true };
              }
              return c;
            });

            return {
              ...prev,
              cards: updatedCards,
              matchedCards: [...prev.matchedCards, firstCardId, card.id],
              score: prev.score + 1,
              flippedCards: [],
              isLocked: false
            };
          });
        }, 500);
      } else {
        // Не совпали - переворачиваем обратно
        setTimeout(() => {
          setGameState(prev => {
            // Переворачиваем обратно обе карты
            const flippedBackCards = prev.cards.map((c) => {
              if (prev.flippedCards.includes(c.id)) {
                return { ...c, isFlipped: false };
              }
              return c;
            });

            return {
              ...prev,
              cards: flippedBackCards,
              flippedCards: [],
              isLocked: false
            };
          });
        }, 1000);
      }

      // Увеличиваем счетчик ходов
      setGameState(prev => ({
        ...prev,
        moves: prev.moves + 1
      }));
    }
  };

  const isGameComplete = matchedCards.length === cardValues.length;

  return {
    cards,
    score,
    moves,
    isGameComplete,
    isLocked,
    initializeGame,
    handleCardClick
  };
};