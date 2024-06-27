# reddit-style-username-generator

A utility for generating and storing unique username combinations in Redis. This package reads usernames from a file, generates combinations with specified colors and nouns, and stores them in a Redis set.

## Installation

To install the package, run the following command:

```sh
npm install reddit-style-username-generator
```

## Usage

### Importing the Class

First, import the class in your TypeScript or JavaScript file:

```typescript
import { HydrateUsernamesInRedis } from 'reddit-style-username-generator';
```

### Example Usage of generateUsername()

generateUsername() function generates a username by combining a random noun, an optional color, and an optional suffix number. It allows customization of the username format using a separator and the option to include a color.

### Function Parameters

- **separator (string)**: A string that separates different parts of the username. Default is an empty string.
- **enableColor (boolean)**: A boolean flag to include a color in the username. Default is false.
- **suffixNumber (number, optional)**: An optional number to be appended at the end of the username. If not provided, a random number is generated.

### Function Behavior

1. **noun**: Randomly selects a noun from a predefined list.
2. **adjective**: Randomly selects an adjective from a predefined list.
3. **color**: (Optional) Randomly selects a color from a predefined list if `enableColor` is true.
4. **randomNumber**: Uses the provided `suffixNumber` if given, otherwise generates a random number.
5. **formattedAdjective**: Capitalizes the first letter of the adjective.
6. **formattedColor**: (Optional) Capitalizes the first letter of the color if `enableColor` is true.
7. **formattedNoun**: Capitalizes the first letter of the noun.

The function then constructs the username based on the provided parameters and returns it.

### Examples

```javascript
// Example 1: Default parameters (no color, no separator, random number)
generateUsername();
// Possible output: "HappyCat42"

// Example 2: With a separator and color enabled
generateUsername('_', true);
// Possible output: "Happy_Red_Cat57"

// Example 3: With a specific suffix number
generateUsername('-', false, 99);
// Possible output: "Happy-Cat99"

// Example 4: With a separator, color enabled, and specific suffix number
generateUsername('.', true, 7);
// Possible output: "Happy.Red.Cat7"
```

### Example Usage for redis hydration

Here's a complete example demonstrating how to use the package:

```typescript
import { HydrateUsernamesInRedis } from 'reddit-style-username-generator';

const redisOptions = {
  host: 'localhost',
  port: 6379,
};

const hydrateUsernames = new HydrateUsernamesInRedis(redisOptions);

const filePath = './combinations.txt';
const redisKey = 'uniqueUsernames';

// Call the method to store usernames from file to Redis
hydrateUsernames
  .storeUsernamesFromFile(filePath, redisKey)
  .then(() => {
    console.log('Usernames stored successfully.');
  })
  .catch((error) => {
    console.error('Error storing usernames:', error);
  });
```

### Usage

You can use this function to generate usernames for various purposes such as user account names, display names, or any scenario where a unique and customizable username is required. The flexibility in formatting allows for a wide range of possible username combinations.

## Contributing

Feel free to contribute by opening issues or submitting pull requests.

## License

This project is licensed under the MIT License.
