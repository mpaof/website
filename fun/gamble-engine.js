// dealCards - puts your hand at 5 cards
// takes in hand, returns hand
function dealCards(hand1) {
  for(let i = hand1.length; i < 5; i++) {
    let h = cards.splice(Math.floor(Math.random() * cards.length), 1);
    let g = [h[0][0], h[0][1]];
    hand1.push(g);
  }
  return hand1
}

// evalHand - sorts hand
// takes in hand, returns [text hand ranking, number hand ranking]
function evalHand(hand1) {
  function ifFlush(hand2) {
    if(
      hand2[0][1] === hand2[1][1]
      && hand2[1][1] === hand2[2][1]
      && hand2[2][1] === hand2[3][1]
      && hand2[3][1] === hand2[4][1]
    ) {
      return 1;
    }
    return 0;
  }

  function ifStraight(hand) {
    if((
        hand[0][0] - 1 === hand[1][0]
      && hand[1][0] - 1 === hand[2][0]
      && hand[2][0] - 1 === hand[3][0]
      && hand[3][0] - 1 === hand[4][0]
    ) || (
    // a-5 straight; 1 - 1 = 2, ...; 0 = 14
        hand[1][0] - 1 === hand[2][0]
      && hand[2][0] - 1 === hand[3][0]
      && hand[3][0] - 1 === hand[4][0]
      && hand[0][0] === 14 && hand[4][0] === 2
    )) {
      return 1;
    }
    return 0;
  }

  function isPair(hand) {
    const counts = {};
    for(let [value] of hand) {
      counts[value] = (counts[value] || 0) + 1;
    }

    let pairCount = 0;
    for(let count of Object.values(counts)) {
      if(count >= 2) {
        pairCount += Math.floor(count / 2);
      }
    }

    return pairCount
  }

  // rf, sf, f
  if(ifFlush(hand1)) {
    if(ifStraight(hand1)) {
      if(hand1[0][0] === 13 && hand1[4][0] === 1) { return ['royal flush!', 9]; }
      else return ['straight flush!', 8]; }
    else { return ['flush!', 5]; }
  }

  // st
  else if(ifStraight(hand1)) {
    return ['straight!', 4];
  }

  // 4
  else if(
      hand1[1][0] === hand1[2][0]
    && hand1[2][0] === hand1[3][0]
    && (hand1[0][0] === hand1[1][0] || hand1[3][0] === hand1[4][0])
    ) { return ['4 of a kind!', 7]; }

  // fh, 3
  else if(
    (hand1[0][0] === hand1[1][0] && hand1[1][0] === hand1[2][0])
    || (hand1[1][0] === hand1[2][0] && hand1[2][0] === hand1[3][0])
    || (hand1[2][0] === hand1[3][0] && hand1[3][0] === hand1[4][0])
  ) {
    if(
    hand1[0][0] === hand1[1][0] && hand1[3][0] === hand1[4][0]
    ) { return ['full house!', 6]; }
    else { return ['3 of a kind!', 3]; }
  }

  // 2p, p
  else if(isPair(hand1) >= 1) {
    if(isPair(hand1) >= 2) {
      return ['two pair!', 2];
    } else { return ['pair!', 1] }
  }

  // hc
  else { return ['high card!', 0]; }
}

// sortHand - sorts hand
// takes in hand, returns hand
function sortHand(hand1) {
  hand1 = hand1.sort(
    (a, b) => b[0] !== a[0] ? b[0] - a[0] : a[1] - b[1]
  );
  return hand1
}

// evalTiedHands - evaluates tied hands
// takes in two hands and evaluation, 
// returns 0 for player win, 1 for monke win, -1 for tie
function evalTiedHands(hand1, hand2, hand1eval, hand2eval) {
  // failsafe for idiots (me)
  if(hand1eval[1] > hand2eval[1]) { return 0; }
  else if(hand1eval[1] < hand2eval[1]) { return 1; }

  /**
   * what hands should be evaluated as what
   * 9 rf - evaluated as same
   * 7 4k - highest trip (eval middle, no chance of tie)
   * 6 fh - ^
   * 3 3k - ^
   * 2 2p - highest cards, make sure you know what's a pair
   * 1 1p - ^
   * 5 fl - highest cards
   * 0 hc - ^
   * 4 st - ^
   * 8 sf - ^
   */

  function evalMainCards(hand1, hand2) {
    for(let i = 0; i < hand1.length; i++) {
      if(hand1[i][0] > hand2[i][0]) { return 0; } 
      else if(hand1[i][0] < hand2[i][0]) { return 1; }
    }
    return -1;
  }

  // takes in hand
  // returns { pairCount, pairs } (number of pairs, what is a pair)
  function stripPairs(hand) {
    const counts = {};
    for(let [value] of hand) {
      counts[value] = (counts[value] || 0) + 1;
    }

    const pairs = [];
    for(let [value, count] of Object.entries(counts)) {
      if(count >= 2) {
        pairs.push(Number(value));
      }
    }

    return {
      pairCount: pairs.length,
      pairs: pairs, // array of values that form pairs
    };
  }

  let x = -5;
  // high card, straight, flush, straight flush
  if([0, 4, 5, 8].includes(hand1eval[1])) {
    x = evalMainCards(hand1, hand2);
    return x;
  }

  // pair, two pair
  else if(hand1eval[1] === 1 || hand1eval[1] === 2) {
    let myPairs = stripPairs(hand1)
    let monkePairs = stripPairs(hand2);

    // NOTE
    // sometimes the pair vs pair doesn't evaluate properly

    if (myPairs.pairCount === 2 && monkePairs.pairCount === 2) {
      // Sort pairs descending for high-to-low comparison
      let [myHigh, myLow] = myPairs.pairs.sort((a, b) => b - a);
      let [monkeHigh, monkeLow] = monkePairs.pairs.sort((a, b) => b - a);

      if (myHigh > monkeHigh) return 0;
      if (myHigh < monkeHigh) return 1;

      if (myLow > monkeLow) return 0;
      if (myLow < monkeLow) return 1;

      // Strip both pairs to compare kickers
      hand1 = hand1.map(c => (c[0] === myHigh || c[0] === myLow ? [0, c[1]] : c));
      hand2 = hand2.map(c => (c[0] === monkeHigh || c[0] === monkeLow ? [0, c[1]] : c));

      hand1 = sortHand(hand1);
      hand2 = sortHand(hand2);

      return evalMainCards(hand1, hand2);
    }

    if (myPairs.pairCount === 1 && monkePairs.pairCount === 1) {
      let myp = myPairs.pairs[0];
      let monkep = monkePairs.pairs[0];

      if (myp > monkep) return 0;
      if (myp < monkep) return 1;

      hand1 = hand1.map(c => (c[0] === myp ? [0, c[1]] : c));
      hand2 = hand2.map(c => (c[0] === monkep ? [0, c[1]] : c));

      hand1 = sortHand(hand1);
      hand2 = sortHand(hand2);

      return evalMainCards(hand1, hand2);
    }

    // fallback
    return evalMainCards(hand1, hand2);
  }

  // three of a kind, full house, four of a kind
  else if([3, 6, 7]) {
    if(hand1[2][0] > hand2[2][0]) { return 0; }
    else { return 1; }
  }

  else return -1;
}

// makeHandLookGood - sorts hand
// takes in hand, returns hand
function makeHandLookGood(hand) {
  let newHand = [];
  for(let i = 0; i < 5; i++) {
    let h = hand[i];
    let s = '';
    
    if(h[1] === 3) { s = '♧'; }
    else if(h[1] === 2) { s = '♢'; }
    else if(h[1] === 1) { s = '♡'; }
    else { s = '♤'; }

    if(h[0] === 1 || h[0] === 14) { h = 'A'; }
    else if(h[0] === 11) { h = 'J'; }
    else if(h[0] === 12) { h = 'Q'; }
    else if(h[0] === 13) { h = 'K'; }

    newHand[i] = `${ s }${ h[0] ?? h }`;
  }

  return newHand;
}

// -- -- -- //

// takes in myHandEval, monkeHandEval
// shows monke hand
// shows hand evaluation
async function reveal(myHandEval, monkeHandEval, better) {  
  document.getElementById('monkeHand').innerHTML = `<p>the monke is thinking</p>`
  await new Promise((res) => setTimeout(res, 750));
  document.getElementById('monkeHand').innerHTML = `<p>the monke is thinking.</p>`
  await new Promise((res) => setTimeout(res, 750));
  document.getElementById('monkeHand').innerHTML = `<p>the monke is thinking..</p>`
  await new Promise((res) => setTimeout(res, 750));
  document.getElementById('monkeHand').innerHTML = `<p>the monke is thinking...</p>`
  await new Promise((res) => setTimeout(res, 750));

  await new Promise(
    (res) => setTimeout(res, Math.floor(Math.random() * 20) * 100)
  );

  document.getElementById('monkeHand').innerHTML = `<p>the monke is holding => ${ makeHandLookGood(monkeHand) } => ${ monkeHandEval[0] }
  </p><p>you ${
  monkeHandEval[1] <= myHandEval[1] 
    ? monkeHandEval[1] === myHandEval[1] ? `have ${ better === 0 ? 'won against' : 'lost to' } the monke` : 'have won against the monke'
    : 'have lost to the monke'
  }</p><br><button onclick="window.location.reload();">try again?</button>
  `;
}

// credit: chatgpt
// whatToDiscard - takes in both hands and both evaluations
// returns array of 5 elements on what to discard
function whatToDiscard(hand1, evaluation, oppHand, oppEvaluation) {
  // returns where to slice
  function getNLowestCardIndexes(cards, n) {
    let filtered = [];

    for(let i = 0; i < cards.length; i++) {
      let rank = cards[i][0];
      if(rank !== 1) {
        filtered.push({ index: i, rank: rank });
      }
    }

    filtered.sort((a, b) => a.rank - b.rank);

    let result = [];
    for(let i = 0; i < Math.min(n, filtered.length); i++) {
      result.push(filtered[i].index);
    }

    return result;
  }

  // NOTE: RETURNS PAIR LOCATIONS, NOT WHERE TO SLICE
  function sameFunctionForPairs(hand) {
    const counts = {};
    const valueToIndexes = {};

    hand.forEach(([value], index) => {
      if(value === 1) return; // ignore 1s
      counts[value] = (counts[value] || 0) + 1;
      if(!valueToIndexes[value]) valueToIndexes[value] = [];
      valueToIndexes[value].push(index);
    });

    const pairIndexes = [];

    for(let [value, count] of Object.entries(counts)) {
      if(count >= 2) {
        pairIndexes.push(...valueToIndexes[value]);
      }
    }

    return pairIndexes;
  }

  // takes in two hands, returns array of indices of where they match
  function findMatchingCards(hand1, hand2) {
    let matches = [];

    for (let i = 0; i < hand1.length; i++) {
      for (let j = 0; j < hand2.length; j++) {
        if (hand1[i][0] === hand2[j][0]) {
          matches.push([i, j]);
        }
      }
    }

    return matches;
  }

  // flush function, returns flush locations, not where to slice
  function findNearFlush(hand) {
    const suitMap = new Map();

    // Map suit values to their indexes
    hand.forEach((card, index) => {
      const suit = card[1];
      if (!suitMap.has(suit)) {
        suitMap.set(suit, []);
      }
      suitMap.get(suit).push(index);
    });

    // Check for any suit with 4 or more matches
    for (const [suit, indexes] of suitMap.entries()) {
      if (indexes.length >= 4) {
        return indexes.slice(0, 4); // Return first 4 matching indexes
      }
    }

    return []; // No match found
  }

  // finds near straight, returns outliers
  // credit: chatgpt
  function isStraight(ranks) {
    let unique = [...new Set(ranks)].sort((a, b) => a - b);
    if (unique.length !== ranks.length) return false; // no duplicates

    // Normal straight check (5 cards)
    for (let i = 0; i < unique.length - 1; i++) {
      if (unique[i + 1] - unique[i] !== 1) {
        // not consecutive, check wraparound next
        if (i === unique.length - 2 && unique[0] === 2 && unique[unique.length - 1] === 14) {
          // ace low wraparound check: [2,3,4,5,14]
          // If ranks are exactly [2,3,4,5,14], it's a straight
          const aceLow = [2, 3, 4, 5, 14];
          if (unique.toString() === aceLow.toString()) {
            return true;
          }
        }
        return false;
      }
    }
    return true;
  }

  // credit: chatgpt
  function isFourCardStraight(ranks) {
    let unique = [...new Set(ranks)].sort((a, b) => a - b);
    if (unique.length < 4) return false;

    for (let i = 0; i <= unique.length - 4; i++) {
      if (
        unique[i + 1] - unique[i] === 1 &&
        unique[i + 2] - unique[i + 1] === 1 &&
        unique[i + 3] - unique[i + 2] === 1
      ) {
        return true;
      }
    }
    return false;
  }

  // credit: chatgpt
  function findNearStraight(hand) {
    let ranks = hand.map(card => card[0]);

    // 1. Check if entire hand is a perfect straight
    if (isStraight(ranks)) return null;

    for (let i = 0; i < hand.length; i++) {
      let subsetRanks = hand
        .filter((_, idx) => idx !== i)
        .map(card => card[0]);

      // Try both ace high and ace low representations
      const aceHighRanks = subsetRanks;
      const aceLowRanks = subsetRanks.map(r => (r === 14 ? 1 : r));

      if (
        isFourCardStraight(aceHighRanks) || 
        isFourCardStraight(aceLowRanks)
      ) {
        return i;
      }
    }

    return null;
  }


  let a = [0, 0, 0, 0, 0]; // keep mask
  let b = [1, 1, 1, 1, 1]; // discard mask

  /**
   * one away from flush
   * one away from straight
   * otherwise, what hands should be evaluated as what
   * 9 rf - keep
   * 8 sf - ^
   * 7 4k - ^
   * 6 fh - keep unless opponent has better
   * 5 fl - ^
   * 4 st - ^
   * 3 3k - 50% discard lower kickers, 50% discard both kickers
   * 2 2p - discard kicker if opponent has higher kicker
   * 1 1p - discard two lowest
   * 0 hc - discard three lowest (boosted high card shenanigans)
  */

  // near flush
  let fnf = findNearFlush(hand1);
  let fns = findNearStraight(hand1);

  if(fnf.length > 0) {
    for(let i = 0; i < fnf.length; i++) {
      b[fnf[i]] = 0;
    }

    return b;
  }

  // royal, straight flush, quads
  if([7, 8, 9].includes(evaluation[1])) {
    // if you get this, you deserve to win
    return a;
  }

  // full house
  else if(evaluation[1] === 6) { // full house
    if(oppEvaluation[1] > 6) {
      // strip pair, keep trips
      const counts = {};
      const trips = [], pair = [];

      hand1.forEach(([val], i) => {
        if(val !== 1) counts[val] = (counts[val] || []).concat(i);
      });

      for(let val in counts) {
        if(counts[val].length === 3) {
          trips.push(...counts[val]);
        } else if(counts[val].length === 2) {
          pair.push(...counts[val]);
        }
      }

      for(let i of pair) {
        b[i] = 0; // keep only trips
      }

      return b;
    } else {
      return a;
    }
  }

  // flush or straight
  else if([4, 5].includes(evaluation[1])) { 
    if(oppEvaluation[1] > evaluation[1]) {
      // discard one random lowest card
      let toCut = getNLowestCardIndexes(hand1, 1);
      for(let i = 0; i < toCut.length; i++) {
        a[toCut[i]] = 1;
      }
      return a;
    } else {
      return [0, 0, 0, 0, 0]; // keep if opponent doesn’t beat us
    }
  }

  // is not a straight exactly, but has 4 of 5 cards for straight
  else if(fns != null) {
    a[fns] = 1;
    return a;
  }

  // three of a kind
  else if(evaluation[1] === 3) { 
    // discard both kickers
    let triplets = sameFunctionForPairs(hand1); // gives indexes of all cards in any pair (or better)
    for(let i = 0; i < triplets.length; i++) {
      a[triplets[i]] = 1;
    }
    let toDiscard = [];
    for(let i = 0; i < 5; i++) {
      if(!a[i]) toDiscard.push(i);
    }
    // flip the 0/1 meaning so discard becomes 1
    let output = [0, 0, 0, 0, 0];
    for(let i of toDiscard) {
      output[i] = 1;
    }
    return output;
  }

  // two pair
  else if(evaluation[1] === 2) { 
    // discard the one kicker
    let thing = sameFunctionForPairs(hand1);
    for(let i = 0; i < 5; i++) {
      if(thing.includes(i)) {
        b[i] = 0;
      }
    }
    return b;
  }

  // pair
  else if(evaluation[1] === 1) {
    let thing = sameFunctionForPairs(hand1);
    for(let i = 0; i < thing.length; i++) {
      b[thing[i]] = 0;
    }
    return b;
  }

  // high card
  else {
    // remove duplicates from other player's hand
    let m = findMatchingCards(hand1, oppHand);
    let thing = '';
    /**
     * function findMatchingCards
     * 5, 4, or 3 duplicates: don't bother with getNLowest...
     * 2 duplicates: strip hand1, and getNLowest(hand1, 1)
     * 1 duplicate: see above for 2
     * 0 duplicates: nothing
     */

    /*
    if(m[0] != null) {
      switch(m[0].length) {
        case 5: case 4: case 3: {
          for(let i = 0; i < m.length; i++) {
            a[m[0][i]] = 1;
          }
          break;
        }
        case 2: {
          // Mark the two matches
          for (let i = 0; i < m.length; i++) {
            a[m[i][0]] = 1;
          }

          // Get 1 additional *non-matching* index
          let usedIndexes = new Set(m.map(pair => pair[0]));
          let additional = getNLowestCardIndexes(
            hand1.filter((_, i) => !usedIndexes.has(i)), 1
          );

          // Convert filtered index to original index
          let filteredIndexes = [...hand1.keys()].filter(i => !usedIndexes.has(i));
          if (additional[0] != null) {
            a[filteredIndexes[additional[0]]] = 1;
          }
          break;
        }

        case 1: {
          // Mark the one match
          a[m[0][0]] = 1;

          // Get 2 additional *non-matching* indexes
          let usedIndexes = new Set([m[0][0]]);
          let additional = getNLowestCardIndexes(
            hand1.filter((_, i) => !usedIndexes.has(i)), 2
          );

          // Convert filtered indexes to original indexes
          let filteredIndexes = [...hand1.keys()].filter(i => !usedIndexes.has(i));
          for (let i = 0; i < additional.length; i++) {
            a[filteredIndexes[additional[i]]] = 1;
          }
          break;
        }
        default: { break; }
      }
    }
    */

    if(false) {}
    else {
      thing = getNLowestCardIndexes(hand1, 3);
      for(let i = 0; i < thing.length; i++) {
        a[thing[i]] = 1;
      }
    }
    return a;
  }
}

// discardCards - discards cards and draws new ones
// takes in hand, monke discard thing, and if monke
// returns discarded hand
function discardCards(hand1, monkeDiscard = [], monke = 0) {
  let check1 = monkeDiscard[0] ?? document.getElementById('discard1').checked;
  let check2 = monkeDiscard[1] ?? document.getElementById('discard2').checked;
  let check3 = monkeDiscard[2] ?? document.getElementById('discard3').checked;
  let check4 = monkeDiscard[3] ?? document.getElementById('discard4').checked;
  let check5 = monkeDiscard[4] ?? document.getElementById('discard5').checked;

  // done so we know how many cards to deal
  let checkTotal = check1 + check2 + check3 + check4 + check5;

  if(checkTotal > 3) {
    document.getElementById('errorMessage').innerHTML = '<p>please only select up to three cards to discard at at time :)</p>'
    return; 
  }

  let b = Number(localStorage.getItem('bet'));
  if(b < 1) {
    document.getElementById('errorMessage').innerHTML = `<p>please make a bet of at least one :)</p>`
    return; 
  }

  // good
  // hand.splice(0, 1)
  let toSplice = [];
  if(check5) { toSplice.push(4); }
  if(check4) { toSplice.push(3); }
  if(check3) { toSplice.push(2); }
  if(check2) { toSplice.push(1); }
  if(check1) { toSplice.push(0); }
  toSplice.sort((a, b) => b - a);

  for(let i = 0; i < toSplice.length; i++) {
    hand1.splice(toSplice[i], 1);
    // i log it awkwardly because otherwise dev tools is stupid
  }

  dealCards(hand1);
  hand1 = sortHand(hand1);

  if(monke) { return hand1; }

  document.getElementById('errorMessage').innerHTML = '';
  document.getElementById('hand').innerHTML = `<p>now you are holding => ${ makeHandLookGood(hand1) } => ${ evalHand(hand1)[0] }</p>`;
  document.getElementById('discard-button').style.display = 'none';

  // better :
  // * 0 = player better (which we don't want)
  // * 1 = monke better (which we don't want)
  // * -1 = true tie (extremely rare, also don't want)
  hand1Eval = evalHand(hand1);
  let better = evalTiedHands(hand1, monkeHand, hand1Eval, monkeHandEval);
  // revealBal(better);

  // NOTE: sometimes the evalHand function gives random errors
  // apologies for not fixing it sooner, i'm tired

  // if monke better
    // reveal
  // if player better OR tie
    // start discarding and re-evaluating

  if(better === 1) {
    reveal(hand1Eval, monkeHandEval, better);
    return;
  }

  // else { ... }
  let monkeDiscardAmount = Math.min(
    Math.floor(Math.random() * 20 + 2),
    Math.floor(Math.random() * 20 + 2)
  );

  if(monkeDiscardAmount > 13) { monkeDiscardAmount = 13; }

  let wtd = whatToDiscard(monkeHand, monkeHandEval, hand1, hand1Eval);

  for(let i = 0; i < monkeDiscardAmount; i++) {
    wtd = whatToDiscard(monkeHand, monkeHandEval, hand1, hand1Eval)
    monkeHand = discardCards(monkeHand, wtd, 1);
    monkeHandEval = evalHand(monkeHand);

    // failsafe so that monke doesn't seem too sus
    // one part of the failsafe failing is it checks if our hand rank is better, not necessarily if the hand itself is better
    if(monkeHandEval[1] > hand1Eval[1]) {
      better = 1;
      i += 20; 
    }
    else if(monkeHandEval[1] === hand1Eval[1]) {
      better = evalTiedHands(hand1, monkeHand, hand1Eval, monkeHandEval);
      if(better === 1) { i += 20; }
    }
  }

  // ! always make sure you're passing in the right variables, kids
  reveal(hand1Eval, monkeHandEval, better);
  revealBal(better);
}