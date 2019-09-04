const HashMap = require('./hashmap');


function main() {
  const lor = new HashMap();
  HashMap.MAX_LOAD_RATIO = .5;
  HashMap.SIZE_RATIO = 3;

  lor.set('Hobbit', 'Bilbo');
  lor.set('Hobbit', 'Frodo');
  lor.set('Wizard', 'Gandolf');
  lor.set('Human', 'Aragon');
  lor.set('Elf', 'Legolas');
  lor.set('Maiar', 'The Necromancer');
  lor.set('Maiar', 'Sauron');
  lor.set('RingBearer', 'Gollum');
  lor.set('LadyOfLight', 'Galadriel');
  lor.set('HalfElven', 'Arwen');
  lor.set('Ent', 'Treebeard');

  console.log(lor);


}

// main();


// #2 The output of the code would 10 because the value at the key hello world was last set to ten.

function removeDuplicates(str) {

  let strHash = new HashMap();
  let result = '';

  for (let i = 0; i < str.length; i++) {
    try {
      strHash.get(str[i]);
    }
    catch (e) {
      strHash.set(str[i], str[i]);
      result += str[i];
    }
  }

  return result;


}

console.log(removeDuplicates('google'));

function anyPermAPalindrome(str){
  const freqTable=new HashMap();
  for(let i=0;i<str.length;i++){
    try{
      const count=freqTable.get(str.charAt(i));
      freqTable.set(str.charAt(i),count+1);
    }
    catch(e){
      freqTable.set(str.charAt(i),1);
    }
  }
  let countOdds=0;
  freqTable._hashTable.forEach(keyValObj=>{
    if(keyValObj.value%2===1){
      countOdds++;
    }
  });
  if(countOdds>1){
    return false;
  }
  return true;
}

function groupAnagrams(arr){
  let finalAnswer=[];
  arr.forEach(str=>{
    const freqTable=new HashMap();
    for(let i=0;i<str.length;i++){
      try{
        const count=freqTable.get(str.charAt(i));
        freqTable.set(str.charAt(i),count+1);
      }
      catch(e){
        freqTable.set(str.charAt(i),1);
      }
    }

    let isAnagram=false;
    let i=0;
    for(i=0; i<finalAnswer.length;i++){
      const oneOfTheFreqTables=finalAnswer[i].freqTable;
      if(oneOfTheFreqTables.length!==freqTable.length)
        continue;

      let countSuccess=0;
      freqTable._hashTable.forEach(keyValObject=>{
        countSuccess++;
        try{
          let count=oneOfTheFreqTables.get(keyValObject.key);
          if(count!==keyValObject.value){
            throw new Error;
          }
        }
        catch(e){
          countSuccess--;
        }
      });
      isAnagram=(countSuccess===freqTable.length)?true:false;
      if(isAnagram)
        break;
    }
    if(!isAnagram){
      finalAnswer.push({
        freqTable:freqTable,
        anagrams:[str]
      });
    }
    else if(isAnagram){
      finalAnswer[i].anagrams.push(str);
    }
    //console.log(JSON.stringify(finalAnswer));
  });
  let actuallyFinal=[];
  finalAnswer.forEach(obj=>{
    actuallyFinal.push(obj.anagrams);
  });
  return actuallyFinal;

}



class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    }
    else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }
  find(key) {
    // Start at the head
    let currNode = this.head;
    // If the list is empty
    if (!this.head) {
      return null;
    }
    // Check for the item 
    while (currNode.value.key !== key) {
      /* Return null if it's the end of the list 
         and the item is not on the list */
      if (currNode.next === null) {
        return null;
      }
      else {
        // Otherwise, keep looking 
        currNode = currNode.next;
      }
    }
    // Found it
    return currNode;
  }

  remove(key) {
    // If the list is empty
    if (!this.head) {
      return null;
    }
    // If the node to be removed is head, make the next node head
    if (this.head.value.key === key) {
      this.head = this.head.next;
      return;
    }
    // Start at the head
    let currNode = this.head;
    // Keep track of previous
    let previousNode = this.head;

    while ((currNode !== null) && (currNode.value.key !== key)) {
      // Save the previous node 
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log('Item not found');
      return;
    }
    previousNode.next = currNode.next;
  }
}

class ChainHashMap {
  constructor(initialCapacity=8) {
    this.length = 0;
    this._hashTable = [];
    this._capacity = initialCapacity;
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }
  get(key) {
    const index = this._findSlot(key);
    if (this._hashTable[index] === undefined) {
      throw new Error('Key error');
    }
    const nodeToFind=this._hashTable[index].find(key);
    if(nodeToFind===null)
      throw new Error('Key error'); 
    return nodeToFind.value.value;
  }
  set(key, value){
    const loadRatio = (this.length + 1) / this._capacity;
    if (loadRatio > ChainHashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * ChainHashMap.SIZE_RATIO);
    }
    //Find the slot where this key should be in
    const index = this._findSlot(key);

    if(!this._hashTable[index]){
      let list=new LinkedList();
      this._hashTable[index]=list;
    }
    let alreadyPresent=this._hashTable[index].find(key);
    if(alreadyPresent===null){
      this.length++;
      this._hashTable[index].insertLast({key,value});
    }
    else{
      alreadyPresent.value.value=value;
    }
  }
  
  delete(key) {
    const index = this._findSlot(key);
    let slot = this._hashTable[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }

    slot.remove(key);
    this.length--;
  }

  _findSlot(key) {
    const hash = ChainHashMap._hashString(key);
    const start = hash % this._capacity;
    return start;
   
  }
  _resize(size) {
    const oldSlots = this._hashTable;
    this._capacity = size;
    this.length = 0;
    this._deleted = 0;
    this._hashTable = [];

    for (const list of oldSlots) {
      if (list !== undefined) {
        let node=list.head;
        while(node!==null){
          this.set(node.value.key,node.value.value);
          node=node.next;
        }
      }
    }
  }
}

module.exports= ChainHashMap;


function displayList(list) {
  let str = '';
  let tempNode = list.head;
  while (tempNode !== null) {
    str = str + tempNode.value.key + ': '+tempNode.value.value+', ';
    tempNode = tempNode.next;
  }
  if(!str){
    return;
  }
  console.log(str);
}