import { WordCategory, WordDifficulty } from "@shared/schema";

export const WORDS: Record<WordCategory, Record<WordDifficulty, string[]>> = {
  [WordCategory.FOOD]: {
    [WordDifficulty.EASY]: ["Pizza", "Apple", "Bread", "Cake", "Ice Cream", "Banana", "Sandwich", "Milk", "Cookie", "Cheese"],
    [WordDifficulty.MEDIUM]: ["Spaghetti", "Hamburger", "Popcorn", "Salad", "Muffin", "Taco", "Yogurt", "Cereal", "Peanut Butter", "Chicken"],
    [WordDifficulty.HARD]: ["Croissant", "Quiche", "Sushi", "Ravioli", "Guacamole", "Eggplant", "Avocado", "Falafel", "Pomegranate", "Wasabi"],
  },
  [WordCategory.ANIMALS]: {
    [WordDifficulty.EASY]: ["Dog", "Cat", "Cow", "Fish", "Horse", "Duck", "Bird", "Pig", "Rabbit", "Lion"],
    [WordDifficulty.MEDIUM]: ["Elephant", "Giraffe", "Kangaroo", "Panda", "Penguin", "Zebra", "Bear", "Monkey", "Snake", "Dolphin"],
    [WordDifficulty.HARD]: ["Armadillo", "Platypus", "Narwhal", "Chameleon", "Wombat", "Axolotl", "Sloth", "Tarantula", "Iguana", "Hedgehog"],
  },
  [WordCategory.MOVIES_TV]: {
    [WordDifficulty.EASY]: ["Frozen", "Toy Story", "Spider-Man", "Minions", "Batman", "Cars", "Moana", "Shrek", "Harry Potter", "Star Wars"],
    [WordDifficulty.MEDIUM]: ["Jurassic Park", "Finding Nemo", "Black Panther", "Aladdin", "Lion King", "Home Alone", "E.T.", "Cinderella", "Encanto", "Up"],
    [WordDifficulty.HARD]: ["Inception", "Casablanca", "The Godfather", "Parasite", "Interstellar", "Amélie", "Jaws", "Titanic", "La La Land", "Gladiator"],
  },
  [WordCategory.SPORTS]: {
    [WordDifficulty.EASY]: ["Soccer", "Basketball", "Baseball", "Football", "Tennis", "Hockey", "Golf", "Swimming", "Running", "Volleyball"],
    [WordDifficulty.MEDIUM]: ["Badminton", "Bowling", "Rugby", "Skateboarding", "Surfing", "Lacrosse", "Karate", "Gymnastics", "Archery", "Dodgeball"],
    [WordDifficulty.HARD]: ["Polo", "Curling", "Fencing", "Equestrian", "Biathlon", "Triathlon", "Javelin", "Bocce", "Squash", "Cricket"],
  },
  [WordCategory.PLACES]: {
    [WordDifficulty.EASY]: ["School", "Park", "Beach", "Home", "Zoo", "Farm", "Playground", "Mall", "Hospital", "Library"],
    [WordDifficulty.MEDIUM]: ["City Hall", "Stadium", "Airport", "Theater", "Aquarium", "Museum", "Restaurant", "Castle", "Mountain", "Bridge"],
    [WordDifficulty.HARD]: ["Pyramids", "Eiffel Tower", "Great Wall", "Taj Mahal", "Colosseum", "Machu Picchu", "Stonehenge", "Sydney Opera House", "Statue of Liberty", "Mount Everest"],
  },
  [WordCategory.JOBS]: {
    [WordDifficulty.EASY]: ["Teacher", "Doctor", "Chef", "Farmer", "Nurse", "Firefighter", "Police Officer", "Singer", "Athlete", "Pilot"],
    [WordDifficulty.MEDIUM]: ["Librarian", "Engineer", "Lawyer", "Dancer", "Mechanic", "Scientist", "Actor", "Author", "Soldier", "Baker"],
    [WordDifficulty.HARD]: ["Archaeologist", "Astronomer", "Mathematician", "Fashion Designer", "Diplomat", "Geologist", "Biologist", "Sculptor", "Politician", "Architect"],
  },
  [WordCategory.OBJECTS]: {
    [WordDifficulty.EASY]: ["Ball", "Chair", "Book", "Phone", "Bed", "Table", "Shoes", "Hat", "Pen", "Clock"],
    [WordDifficulty.MEDIUM]: ["Backpack", "Camera", "Guitar", "Bicycle", "Umbrella", "Mirror", "Radio", "Blanket", "Suitcase", "Microwave"],
    [WordDifficulty.HARD]: ["Telescope", "Typewriter", "Microscope", "Projector", "Compass", "Thermometer", "Accordion", "Saxophone", "Sewing Machine", "Drone"],
  },
  [WordCategory.VEHICLES]: {
    [WordDifficulty.EASY]: ["Car", "Bus", "Bike", "Boat", "Truck", "Train", "Plane", "Taxi", "Van", "Scooter"],
    [WordDifficulty.MEDIUM]: ["Helicopter", "Motorcycle", "Sailboat", "Tractor", "Submarine", "Jeep", "Limousine", "Hot Air Balloon", "Skateboard", "Rocket"],
    [WordDifficulty.HARD]: ["Segway", "Monorail", "Rickshaw", "Gondola", "Hovercraft", "Cable Car", "Zeppelin", "Tuk Tuk", "Snowmobile", "Amphibious Vehicle"],
  },
  [WordCategory.HOLIDAYS]: {
    [WordDifficulty.EASY]: ["Birthday", "Christmas", "Halloween", "Easter", "New Year", "Thanksgiving", "Wedding", "Graduation", "Valentine's Day", "Party"],
    [WordDifficulty.MEDIUM]: ["Fireworks", "Parade", "Pumpkin", "Santa Claus", "Hanukkah", "Costume", "Cake", "Gift", "Balloon", "Turkey"],
    [WordDifficulty.HARD]: ["Piñata", "Diwali", "Ramadan", "Kwanzaa", "Lantern Festival", "Oktoberfest", "Mardi Gras", "Passover", "Holi", "Cinco de Mayo"],
  },
  [WordCategory.SCHOOL]: {
    [WordDifficulty.EASY]: ["Teacher", "Desk", "Book", "Pencil", "Eraser", "Notebook", "Ruler", "Backpack", "Lunch", "Bus"],
    [WordDifficulty.MEDIUM]: ["Calculator", "Globe", "Blackboard", "Test", "Science", "History", "Dictionary", "Marker", "Recess", "Homework"],
    [WordDifficulty.HARD]: ["Microscope", "Thesis", "Graduation", "Laboratory", "Debate", "Scholarship", "Periodic Table", "Geometry", "Physics", "Biology"],
  },
  [WordCategory.SILLY]: {
    [WordDifficulty.EASY]: ["Banana Peel", "Unicorn", "Slime", "Chicken Nugget", "Bubble", "Robot", "Pickle", "Mustache", "Toilet", "Clown"],
    [WordDifficulty.MEDIUM]: ["Rubber Chicken", "Disco Ball", "Llama", "Kazoo", "Waffle", "Flamingo", "Donut", "Pirate", "Dinosaur Costume", "Taco Truck"],
    [WordDifficulty.HARD]: ["Whoopee Cushion", "Platypus", "Loch Ness Monster", "Yeti", "Marshmallow Cannon", "Giant Rubber Duck", "Sasquatch", "Narwhal", "UFO", "Time Machine"],
  },
  [WordCategory.FANTASY]: {
    [WordDifficulty.EASY]: ["Dragon", "Fairy", "Wizard", "Giant", "Mermaid", "Troll", "Elf", "Unicorn", "Witch", "Knight"],
    [WordDifficulty.MEDIUM]: ["Griffin", "Phoenix", "Centaur", "Minotaur", "Pegasus", "Cyclops", "Goblin", "Genie", "Werewolf", "Vampire"],
    [WordDifficulty.HARD]: ["Chimera", "Kraken", "Basilisk", "Hydra", "Leviathan", "Banshee", "Sphinx", "Thunderbird", "Golem", "Djinn"],
  },
  [WordCategory.TECHNOLOGY]: {
    [WordDifficulty.EASY]: ["Phone", "Laptop", "TV", "Headphones", "Camera", "Tablet", "Mouse", "Keyboard", "Watch", "Remote"],
    [WordDifficulty.MEDIUM]: ["Drone", "Printer", "Microphone", "Projector", "Smartwatch", "Video Game", "Calculator", "Telescope", "Robot", "Flashlight"],
    [WordDifficulty.HARD]: ["3D Printer", "Virtual Reality", "Quantum Computer", "Satellite", "Supercomputer", "Nanobot", "Hoverboard", "AI Assistant", "Cryptominer", "Hologram"],
  },
  [WordCategory.NATURE]: {
    [WordDifficulty.EASY]: ["Tree", "Rock", "River", "Sun", "Moon", "Flower", "Grass", "Mountain", "Cloud", "Leaf"],
    [WordDifficulty.MEDIUM]: ["Volcano", "Glacier", "Canyon", "Desert", "Jungle", "Waterfall", "Ocean", "Storm", "Rainbow", "Cave"],
    [WordDifficulty.HARD]: ["Aurora Borealis", "Tsunami", "Earthquake", "Meteor", "Eclipse", "Black Hole", "Sandstorm", "Tornado", "Coral Reef", "Fossil"],
  },
  [WordCategory.MUSIC]: {
    [WordDifficulty.EASY]: ["Guitar", "Piano", "Song", "Dance", "Singer", "Drum", "Radio", "Movie", "Game", "Stage"],
    [WordDifficulty.MEDIUM]: ["Violin", "Trumpet", "DJ", "Orchestra", "Actor", "Musical", "Karaoke", "Popcorn", "Audience", "Costume"],
    [WordDifficulty.HARD]: ["Didgeridoo", "Harpsichord", "Theremin", "Sitar", "Bagpipes", "Sousaphone", "Ballet", "Opera", "Mime", "Shakespeare"],
  },
};

export function getRandomWord(category: WordCategory, difficulty: WordDifficulty): string {
  const words = WORDS[category][difficulty];
  return words[Math.floor(Math.random() * words.length)];
}
