export function shuffleArray<T>(array:T[]) {
    // Loop from the end to the beginning of the array
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i (inclusive)
      const randomIndex = Math.floor(Math.random() * (i + 1));
  
      // Swap elements between current index and random index
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
  
    // Return the shuffled array
    return array;
  }