export function randomElementFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }