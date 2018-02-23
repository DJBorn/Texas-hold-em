var model = myTable.getModel();
setInterval(() => {
    model = myTable.getModel();
    document.getElementById('gamephase').innerHTML = model.gamePhase;
    myTable.getCurrentBetterOptions();
    if(myTable.currentBetter) {
        document.getElementById('playersturn').innerHTML = myTable.currentBetter.playerId;
        let hand = myTable.currentBetter.hand;
        document.getElementById('cards').innerHTML = 
        `${hand[0] ? hand[0].rank : ''} ${hand[0] ? hand[0].suit : ''} ${hand[1] ? hand[1].rank : ''} ${hand[1] ? hand[1].suit : ''}`;
    }
    let cc = myTable.communityCards;
    document.getElementById('community').innerHTML = `${cc[0] ? cc[0].rank : ''} ${cc[0] ? cc[0].suit : ''} <br> 
    ${cc[1] ? cc[1].rank : ''} ${cc[1] ? cc[1].suit : ''} <br>
    ${cc[2] ? cc[2].rank : ''} ${cc[2] ? cc[2].suit : ''} <br>
    ${cc[3] ? cc[3].rank : ''} ${cc[3] ? cc[3].suit : ''} <br>
    ${cc[4] ? cc[4].rank : ''} ${cc[4] ? cc[4].suit : ''}`;
    document.getElementById('player0').innerHTML = 
    `Player 0 money: ${myTable.dealer.money} <br>
     Player 0 current bet: ${myTable.dealer.bet} <br>
     Player 1 money: ${myTable.dealer.next.money} <br>
     Player 1 current bet: ${myTable.dealer.next.bet} <br>`;
    if(myTable.getWinnerId() !== null)
        document.getElementById('winner').innerHTML = "Winner is player" + myTable.getWinnerId() + "!";

}, 100);

function playerMove(move) {
    let raise = document.getElementById('raise').value;
    myTable.makeMove(myTable.currentBetter.playerId, move, Number(raise));
}
console.log(model);