// getBalance - find player balance, creates if doesn't exist
// takes nothing, returns balance of player
function getBalance() {
  let x = Number(localStorage.getItem('bal'));
  if(x == null) { localStorage.setItem('bal', 5000); }
  return x;
}

// addBalance - get player balance, adds some amount
// takes in amount, returns new balance of player
// note : balance is *supposed* to not be negative, that won't be handled here
function addBalance(amount) {
  let bal = Number(getBalance());
  localStorage.setItem('bal', bal + amount);
  return bal + amount;
}

// setBalance - just like addBalance but set
function setBalance(amount) {
  let bal = getBalance();
  localStorage.setItem('bal', amount);
  return amount;
}

// randomEvent - random events happen sometimes
// takes in nothing, returns [text, bal amount]
// note: this assumes a random event will happen 100% of the time
function randomEvent() {
  let arr = [
    ['the monke has accused you of cheating, and has taken away some of your gold', -2000],
    ['the monke has accused you of cheating, and has taken away some of your gold', -1000],
    ['the monke has accused you of cheating, and has taken away some of your gold', -500],
    ['\"dang, you\'re really getting unlucky, aren\'t you?\"', 0]
  ];

  // if above penalty, then add -1 * penalty
  // if below penalty, set to 1 (we're not trying to print out how much monke has stolen)

  let bal = getBalance()
  let g = arr[Math.floor(Math.random() * arr.length)];
  bal -= g;
  if(bal < 0) { bal = 1; }
  setBalance(bal);
  
  return g;
}

// revealBal - reveals balance on the board
// takes in "before" and "after"
// before will have buttons
// after will set all buttons invisible
// better: 0 = player, 1 = monke, -1 = tie, -5 = error
function revealBal(better = -5) {
  // getButtonPlacement - gets gambling functions for buttons
  // takes in nothing, returns amount
  function getButtonPlacement() {
    let bal = getBalance();
    let t = 1;
    let thing = true;
    let buttons = '';

    while(thing) {
      if(bal >= t) {
        buttons += `<button type="button" onclick="bet(${ t })">+${ t }</button>`;
        t *= 10;
      } else {
        thing = false;
        return buttons;
      }
    }
  }

  let b = localStorage.getItem('bet');
  let bal = getBalance();
  
  /*
  document.getElementById('gambling').innerHTML = 
  `you currently have ${ getBalance() } monies<br> ${ getButtonPlacement() }${
    b > 0 ? `<br><p>you\'re currently wagering ${ b } monies` : ''
  }`;
  */

  document.getElementById('gambling').innerHTML = `you currently have ${ getBalance() } monies ${
    b > 0 ? `(currently betting ${ b })` : ''
  }<br>${ getButtonPlacement() }`

  if(better === -5) {
    return;
  }

  // find out who won
  // add/remove bet
  switch(better) {
    case 0: // player
      addBalance(2 * b);
      break;
    case 1: // monke
      break;
    case -1: // tie
      addBalance(Math.ceil(1.5 * b));
      break;
    default:
      addBalance(b);
      document.getElementById('errorMessage').innerHTML = 'uh oh! something broke! the monke has refunded your money';
      break;
  }

  bal = getBalance();
}

// bet - adds bet to hand
// takes in amount to bet and status
// status : adds to localStorage var called "bet", which is displayed on revealBal
function bet(amount) {
  let b = Number(localStorage.getItem('bet'));
  b += Number(amount);

  localStorage.setItem('bet', b);
  addBalance(-1 * amount);

  revealBal(-5);
  return b;
}

// bankruptcy - gives you spare money if you go bankrupt
// takes in nothing, returns number of times you've been bankrupted
function bankruptcy() {
  let bal = getBalance();
  
  let brt = Number(localStorage.getItem('bankrupt'));
  if(brt == null) { localStorage.setItem('bankrupt', 0); }
  document.getElementById('bankrupted').innerHTML = `you have been bankrupted ${ brt } time${ brt === 1 ? '' : 's' }`;

  if(bal > 1) { return brt; }

  localStorage.setItem('bankrupt', brt + 1);

  let g = Math.floor(Math.random() * 100) * 100;
  document.getElementById('errorMessage').innerHTML = `the monke has felt bad for bankrupting you, and has reimbursed you with ${ g } monies<br>` + document.getElementById('gambling').innerHTML;

  setBalance(g);
  return brt;
}