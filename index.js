//require inquirer
var inquirer = require('inquirer');
var isLetter = require('is-letter');
//require objects/exports
var Word = require('./word.js');

var newWord = ['IRON MAN', 'CAPTAIN AMERICA', 'THOR', 'BLACK WIDOW', 'HAWKEYE', 'SCARLET WITCH', 'FALCON', 'SPIDER MAN', 'THE HULK', 'STAR LORD', 'GAMORA', 'ANT MAN', 'VISION',
];

var hangman = {
    wordBank: newWord,
    guessesRemaining: 10,
    //empty array to hold letters guessed by user. And checks if the user guessed the letter already
    guessedLetters: [],


    startGame: function () {
        var that = this;

        //asks user if they are ready to play
        inquirer.prompt([{
            name: "play",
            type: "confirm",
            message: "Ready to guess the superhero?"
        }]).then(function (answer) {
            if (answer.play) {
                that.newGame();
            } else {
                console.log("Then why are you here?");
            }
        })
    },


    //Starts a new game if confirm is yes
    newGame: function () {
        console.log("Name that hero!");
        console.log('====================');

        //random selction from word bank using a random generated number
        var randNum = Math.floor(Math.random() * this.wordBank.length);
        this.currentWord = new Word(this.wordBank[randNum]);
        this.currentWord.getLetters();

        //displays current word as blanks.
        console.log(this.currentWord.wordMaker());
        this.guessLetterPrompt();
    },

    guessLetterPrompt: function () {
        var that = this;
        //asks player for a letter
        inquirer.prompt([{
            name: "choseLetter",
            type: "input",
            message: "Choose a letter:",
               //isLetter package makes sure more then 1 letter isnt entered (ex a vs adx)
            validate: function (value) {
                if (isLetter(value)) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function (ltr) {
            //toUpperCase to keep everything looking uniform
            var letterReturned = (ltr.choseLetter).toUpperCase();
            //adds to the guessedLetters array if it isn't already there
            var guessedAlready = false;
            for (var i = 0; i < that.guessedLetters.length; i++) {
                if (letterReturned === that.guessedLetters[i]) {
                    guessedAlready = true;
                }
            }
            //if the letter wasn't guessed already - multiple steps are run
            if (guessedAlready === false) {
                that.guessedLetters.push(letterReturned);

                var found = that.currentWord.wasLetterFound(letterReturned);

                //if none were found tell user they were wrong
                if (found === 0) {
                    console.log('Letter not found.');
                    //reduces guesses remaining and displays them
                    that.guessesRemaining--;
                    console.log('Guesses remaining: ' + that.guessesRemaining);

                    //pulls word maker function to display word progress
                    console.log('\n====================');
                    console.log(that.currentWord.wordMaker());
                    console.log('\n====================');

                    console.log("Letters guessed: " + that.guessedLetters);
                } else {
                    console.log('Letter found.');
                    //checks to see if user won
                    if (that.currentWord.didWeFindTheWord() === true) {
                        console.log(that.currentWord.wordMaker());
                        console.log('You Won! You Guessed The Hero!');

                    } else {
                        // display the user how many guesses remaining and word so far if havnt won
                        console.log('Guesses remaining: ' + that.guessesRemaining);
                        console.log(that.currentWord.wordMaker());
                        console.log('\n====================');
                        console.log("Letters guessed: " + that.guessedLetters);
                    }
                }

                //run guess letter prompt again if guesses still remain and word is not complete
                if (that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
                    that.guessLetterPrompt();

                //Game over - out of guesses    
                } else if (that.guessesRemaining === 0) {
                    console.log('Game over!');
                    console.log('The word you were guessing was: ' + that.currentWord.word);
                }

                //Letter has already been guessed - runs guess letter prompt again and tells them letter has been guessed
            } else {
                console.log("You've guessed that letter already. Try again.")
                that.guessLetterPrompt();
            }
        });
    }
}

hangman.startGame();