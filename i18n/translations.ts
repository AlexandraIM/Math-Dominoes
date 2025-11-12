
export const translations = {
  en: {
    // App Header & Footer
    appTitle: "Math Dominoes",
    footerText: "Powered by React, Tailwind CSS, and Gemini",

    // GameSetup
    gameSetupTitle: "Game Setup",
    difficultyTypeLabel: "Difficulty Type:",
    standardButton: "Standard",
    schoolGradeButton: "School Grade",
    difficultyLabel: "Difficulty:",
    easy: "Easy",
    easyPlus: "Easy+",
    medium: "Medium",
    hard: "Hard",
    schoolGradeLabel: "School Grade (Ukraine):",
    grade1: "1st Grade",
    grade2: "2nd Grade",
    grade3: "3rd Grade",
    grade4: "4th Grade",
    gameModeLabel: "Game Mode:",
    vsComputer: "vs. Computer",
    vsPlayer: "vs. Player",
    aiDifficultyLabel: "AI Difficulty:",
    aiEasy: "Easy (Draws up to 1 tile)",
    aiNormal: "Normal (Draws up to 2 tiles)",
    aiHard: "Hard (Draws up to 3 tiles)",
    startGame: "Start Game",
    viewRules: "View Game Rules",
    loadingMessage: "Generating your unique domino set...",
    startGameError: "Failed to start game. Check your connection or API key.",
    
    // Game Controls
    heapLabel: "Heap:",
    tilesLeft: "tiles left",
    rulesButton: "Rules",
    drawTileButton: "Draw Tile",
    passTurnButton: "Pass Turn",
    
    // Player Hand
    player1HandTitle: "Player 1's Hand",
    player2HandTitle: "Player 2's Hand",
    computerHandTitle: "Computer's Hand",
    scoreLabel: "Score:",
    currentTurnIndicator: "(Current Turn)",
    noTilesLeft: "No tiles left!",
    
    // Game Over
    gameOverTitle: "Game Over!",
    playAgainButton: "Play Again",
    
    // Game Messages
    initialMessage: "Select game mode and difficulty to start.",
    player1Turn: "Player 1's turn. Match the expressions to the answers!",
    playerTurn: (player: string) => `${player}'s turn.`,
    computerTurn: "Computer's turn.",
    playerDrewTile: (player: string) => `${player} drew a tile.`,
    computerDrewTile: (draws: number, max: number) => `Computer draws a tile (${draws}/${max})...`,
    computerThinking: "Computer is thinking...",
    computerPlays: "Computer plays a tile!",
    computerPasses: "Computer has no moves and must pass.",
    cannotDraw: "Cannot draw any more tiles.",
    notAMatch: "That's not a match. Try again!",
    gameBlocked: (p1Score: number, p2Score: number, p2Name: string) => `Game is blocked! Scores - Player 1: ${p1Score}, ${p2Name}: ${p2Score}. `,
    player1WinsLowScore: "Player 1 wins with the lower score!",
    player2WinsLowScore: (p2Name: string) => `${p2Name} wins with the lower score!`,
    drawGame: "It's a draw!",
    playerWins: (player: string) => `Congratulations, ${player} wins!`,

    // Rules Modal
    rulesTitle: "Game Rules",
    objectiveHeader: "Objective",
    objectiveText: "Be the first player to place all of your dominoes on the board.",
    howToPlayHeader: "How to Play",
    howToPlayPoints: [
      "Each player starts with 5 dominoes. The game begins with one domino already on the board.",
      "On your turn, you must match one of your dominoes to an open end of the domino chain.",
      "Each domino has a math problem on one side and a number on the other.",
      "A match is made by connecting a problem to its correct solution. For example, if an open end is '10+5', you must play a domino with the number '15'. If an open end is '20', you must play a domino with a problem that equals 20, like '4x5'.",
      "If you cannot make a move, you must draw from the 'Heap'. You can draw up to 3 tiles per turn. If you still cannot play, you must pass your turn."
    ],
    winningHeader: "Winning the Game",
    winningPoints: [
      "The first player to run out of dominoes wins!",
      "If the game becomes blocked (neither player can make a move), the winner is the player with the **lowest score**. The score is the sum of the digits of all numbers on a player's remaining tiles."
    ],
  },
  ua: {
    // App Header & Footer
    appTitle: "Математичне Доміно",
    footerText: "Створено за допомогою React, Tailwind CSS та Gemini",
    
    // GameSetup
    gameSetupTitle: "Налаштування Гри",
    difficultyTypeLabel: "Тип складності:",
    standardButton: "Стандартний",
    schoolGradeButton: "Шкільний клас",
    difficultyLabel: "Складність:",
    easy: "Легкий",
    easyPlus: "Легкий+",
    medium: "Середній",
    hard: "Важкий",
    schoolGradeLabel: "Шкільний клас (Україна):",
    grade1: "1-й клас",
    grade2: "2-й клас",
    grade3: "3-й клас",
    grade4: "4-й клас",
    gameModeLabel: "Режим гри:",
    vsComputer: "проти Комп'ютера",
    vsPlayer: "проти Гравця",
    aiDifficultyLabel: "Складність ШІ:",
    aiEasy: "Легкий (Бере до 1 плитки)",
    aiNormal: "Нормальний (Бере до 2 плиток)",
    aiHard: "Важкий (Бере до 3 плиток)",
    startGame: "Почати гру",
    viewRules: "Переглянути правила гри",
    loadingMessage: "Генеруємо ваш унікальний набір доміно...",
    startGameError: "Не вдалося почати гру. Перевірте з'єднання або ключ API.",
    
    // Game Controls
    heapLabel: "Колода:",
    tilesLeft: "плиток залишилось",
    rulesButton: "Правила",
    drawTileButton: "Взяти плитку",
    passTurnButton: "Пропустити хід",
    
    // Player Hand
    player1HandTitle: "Рука Гравця 1",
    player2HandTitle: "Рука Гравця 2",
    computerHandTitle: "Рука Комп'ютера",
    scoreLabel: "Рахунок:",
    currentTurnIndicator: "(Ваш хід)",
    noTilesLeft: "Плиток не залишилось!",
    
    // Game Over
    gameOverTitle: "Гру завершено!",
    playAgainButton: "Грати ще раз",
    
    // Game Messages
    initialMessage: "Виберіть режим та складність, щоб почати.",
    player1Turn: "Хід Гравця 1. З'єднайте приклади з відповідями!",
    playerTurn: (player: string) => `Хід ${player}.`,
    computerTurn: "Хід комп'ютера.",
    playerDrewTile: (player: string) => `${player} взяв плитку.`,
    computerDrewTile: (draws: number, max: number) => `Комп'ютер бере плитку (${draws}/${max})...`,
    computerThinking: "Комп'ютер думає...",
    computerPlays: "Комп'ютер робить хід!",
    computerPasses: "Комп'ютер не має ходів і пропускає.",
    cannotDraw: "Більше не можна брати плитки.",
    notAMatch: "Це не збігається. Спробуйте ще раз!",
    gameBlocked: (p1Score: number, p2Score: number, p2Name: string) => `Гра заблокована! Рахунок - Гравець 1: ${p1Score}, ${p2Name}: ${p2Score}. `,
    player1WinsLowScore: "Гравець 1 перемагає з меншим рахунком!",
    player2WinsLowScore: (p2Name: string) => `${p2Name} перемагає з меншим рахунком!`,
    drawGame: "Нічия!",
    playerWins: (player: string) => `Вітаємо, ${player} переміг!`,
    
    // Rules Modal
    rulesTitle: "Правила Гри",
    objectiveHeader: "Мета",
    objectiveText: "Будьте першим гравцем, який викладе всі свої доміно на стіл.",
    howToPlayHeader: "Як грати",
    howToPlayPoints: [
      "Кожен гравець починає з 5 доміно. Гра починається з однієї плитки на столі.",
      "Під час свого ходу ви повинні з'єднати одну зі своїх плиток з відкритим кінцем ланцюжка доміно.",
      "Кожне доміно має математичну задачу з одного боку та число з іншого.",
      "З'єднання відбувається шляхом поєднання задачі з її правильною відповіддю. Наприклад, якщо відкритий кінець '10+5', ви повинні зіграти доміно з числом '15'. Якщо відкритий кінець '20', ви повинні зіграти доміно з задачею, що дорівнює 20, наприклад '4x5'.",
      "Якщо ви не можете зробити хід, ви повинні взяти плитку з 'Колоди'. Ви можете взяти до 3 плиток за хід. Якщо ви все ще не можете зробити хід, ви повинні пропустити хід."
    ],
    winningHeader: "Перемога в грі",
    winningPoints: [
      "Перший гравець, у якого закінчилися доміно, перемагає!",
      "Якщо гра заблокована (жоден гравець не може зробити хід), переможцем стає гравець з **найменшим рахунком**. Рахунок - це сума цифр усіх чисел на плитках, що залишилися у гравця."
    ],
  },
};
