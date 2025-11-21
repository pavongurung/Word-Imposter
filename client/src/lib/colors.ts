// Vibrant player colors for avatars
export const PLAYER_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#FFE66D", // Yellow
  "#95E1D3", // Mint
  "#F38181", // Pink
  "#AA96DA", // Purple
  "#FCBAD3", // Light Pink
  "#A8D8EA", // Sky Blue
  "#FFAAA5", // Salmon
  "#C7CEEA", // Lavender
  "#B4F8C8", // Light Green
  "#FBE7C6", // Cream
  "#A0E7E5", // Aqua
  "#FFAEBC", // Rose
  "#B4DDDD", // Seafoam
  "#E4C1F9", // Lilac
];

export function getRandomColor(): string {
  return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
}

export function getPlayerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}
