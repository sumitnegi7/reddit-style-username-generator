import adjectives from './data/adjectives';
import colors from './data/colors';
import nouns from './data/nouns';
import HydrateUsernamesInRedis from "./redis"

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function getRandomNumber(min = 1, max = 999): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUsername(
  separator = "",
  enableColor = false,
  suffixNumber?: number
): string {
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  let color = "";

  if (enableColor) {
    color = colors[Math.floor(Math.random() * colors.length)];
  }

  let randomNumber = suffixNumber !== undefined ? suffixNumber : getRandomNumber();

  const formattedAdjective = capitalizeFirstLetter(adjective);
  const formattedColor = color ? capitalizeFirstLetter(color) : "";
  const formattedNoun = capitalizeFirstLetter(noun);

  return enableColor
    ? `${formattedAdjective}${separator}${formattedColor}${separator}${formattedNoun}${randomNumber}`
    : `${formattedAdjective}${separator}${formattedNoun}${randomNumber}`;
}

export { generateUsername, adjectives, nouns, colors, HydrateUsernamesInRedis };
