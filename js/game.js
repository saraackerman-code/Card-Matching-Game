/** @author Sara Aazarou*/
document.addEventListener("DOMContentLoaded", function() { 
 //constants
    const shuffleButton = document.getElementById("shuffle-button");
    const boardSizeRadios = document.querySelectorAll('input[type="radio"]');
    const lossModal = document.getElementById("loss-modal");
    const winModal = document.getElementById("win-modal");

//variables
        let isLocked = false;
        let matches = 0;
        let gameStarted = false;
        let isShuffled = false;

   // Create 24 cards and display the first 8 cards on the board by default.

  function createCards(){
    const board = document.querySelector(".board");
     const types = ["club", "diamond" ,"heart","spade"];   
                   for (let rank = 1; rank<=6; rank++){
                     types.forEach (type => {
        const card = document.createElement("div");
        card.classList.add("flip-card");
        card.innerHTML = `
        <div class="content">
            <div class = "front">
                <img src="images/${type}_${rank}.png" alt="${type}_${rank}" class="card" id="${type}_${rank}">
            </div>
            <div class="back">
                <img src="images/back.jpg" alt="back" class="back-card">
            </div>
        </div>`;
        board.appendChild(card);})}}       
createCards();
//default display 
          const cards = document.querySelectorAll('.flip-card');
          for (let i = 0; i < 16; i++) {
            cards[i].style.display = "block";
           }
//the board size
    function onSizeChange(event){
        const selectedSize = event.target.value;
        if (selectedSize === "2x4") {
            cards.forEach(card => card.style.display = "none");
            for (let i = 0; i < 8; i++) {
                cards[i].style.display = "block";}}
        if (selectedSize === "4x4") {
       
            cards.forEach(card => card.style.display = "none");
            for (let i = 0; i < 16; i++) {
                cards[i].style.display = "block";}}
        else if (selectedSize === "6x4") {
            cards.forEach(card => card.style.display = "none");
            for (let i = 0; i < 24; i++) {
                cards[i].style.display = "block"; }}
          
            }
            
   
    // Watch out for change in the board size
   function watchSizeChange(){
    boardSizeRadios.forEach(radio => {
        radio.addEventListener('change', onSizeChange);
    });
   }


   
// Shuffle the displayed cards when the shuffle button is pressed and display the shuffled cards on the board.
 
    shuffleButton.addEventListener("click", shuffleCards);

    function shuffleCards(){
            const list = Array.from(cards)    
        for (let i= list.length-1; i>0; i--){
            const j =Math.floor((i+1)*Math.random());
            const temp = list[i];   
            list[i] = list[j];
            list[j] = temp;}
        //clear the board
        const board = document.querySelector(".board");
        board.innerHTML = "";
        //add the shuffled cards to the board
        list.forEach(card => board.appendChild(card));
        isShuffled = true;
    }



// Add 1 each time a card is clicked and display the number of clicks in the game info section.
function updateClicks(){
    const backCards = document.querySelectorAll('.back');
    const numberOfClicks = document.getElementById("clicks-num");

    let clicks = 0; 
    backCards.forEach(backCard => {
        backCard.addEventListener('click', () => {
            clicks++; 
         numberOfClicks.textContent = `No. of clicks: ${clicks}`;
        checkLoss(clicks);})   
    })
}

//lose logic
   function checkLoss(clicks){
    
      const boardSizeRadios = document.querySelectorAll('input[type="radio"]');
    if (boardSizeRadios[0].checked && clicks === 16 || boardSizeRadios[1].checked && clicks === 32 || boardSizeRadios[2].checked && clicks === 48) {
        lossModal.style.display = "block";}
   }
// Win Logic
function checkWin(matches){
     const boardSizeRadios = document.querySelectorAll('input[type="radio"]');
   if (matches === 4 && boardSizeRadios[0].checked || matches === 8 && boardSizeRadios[1].checked || matches === 12 && boardSizeRadios[2].checked) {
    winModal.style.display = "block";
   }
}
// Click event listener for each card to flip the card when clicked and check for a match.
   function flip() {
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (isLocked) return;
            if (card.dataset.matched === "true") return;
            if (card.querySelector('.content').classList.contains('hidden')) return;

            card.querySelector('.content').classList.toggle('hidden');
            checkMatch();
        })
})
  }

// flip all the cards
function flipAll() {
    cards.forEach(card => {
        card.querySelector('.content').classList.toggle('hidden');
    })
}

//   Check if the card flipped is a match with another flipped card meaning they have the same rank. 
// If it is a match, keep the cards flipped and update the number of matches in the game info section. 
// If it is not a match, flip the cards back after 1 second.


function checkMatch() {
    if (isLocked) return;

    const flippedCards = [];
    const numberOfMatches = document.querySelector("#pairs-num");

    cards.forEach(card => {
        if (
            card.querySelector('.content').classList.contains('hidden') &&
            card.dataset.matched !== "true"
        ) {
            flippedCards.push(card);
        }
    });

    if (flippedCards.length === 2) {
        isLocked = true;

        const id1 = flippedCards[0].querySelector('.front img').id;
        const id2 = flippedCards[1].querySelector('.front img').id;

        if (id1.split('_')[1] === id2.split('_')[1]) {
            // Match
            flippedCards.forEach(card => {
                card.querySelector('.front').style.border = "2px solid yellow";
                card.dataset.matched = "true";
            });
            matches++;
            numberOfMatches.textContent = `No. of pairs: ${matches}`;
            isLocked = false;
            checkWin(matches);
        } else {
            setTimeout(() => {
                flippedCards.forEach(card =>
                    card.querySelector('.content').classList.remove('hidden')
                );
                isLocked = false;
            }, 1000);
        }
    }
}

 
// Reload after Win/Loss
function reloadPage(){
playAgainButton = document.getElementById("play-again-button");
tryAgainButton = document.getElementById("try-again-button");

    playAgainButton.addEventListener("click", () => {
        location.reload();})
    tryAgainButton.addEventListener("click", () => {
        location.reload();})
    }

//--- Main function to start the game ----

function main(){
    startButton = document.getElementById("start-button");
        startButton.addEventListener("click", () => {
        gameStarted = true;

    if (gameStarted === true && isShuffled === true){
        flipAll();
        startButton.disabled = true;
        shuffleButton.disabled = true;
        boardSizeRadios.forEach(radio => radio.disabled = true);
        flip();
        updateClicks();
        reloadPage();

    }
      
       if (gameStarted === true && isShuffled === false){
    window.alert("Please shuffle the cards before starting the game!");
       }
         }) 
    if (gameStarted=== false && isShuffled === false){
    
        flipAll();
        watchSizeChange();
       
    }
   
}
main();
});
