import { Share } from 'react-native';

const STAR_EMOJIS = ['', '⭐', '⭐⭐', '⭐⭐⭐'];

export async function shareResult(levelId: number, stars: number, moves: number) {
  const starStr = STAR_EMOJIS[stars] ?? '⭐';
  const message =
    `I solved Level ${levelId} in ${moves} moves! ${starStr}\n` +
    `Can you beat me? Play UnitiFlow — the addictive pipe puzzle game! 🎮\n` +
    `#UnitiFlow #Puzzle #BrainTeaser`;

  try {
    await Share.share({ message });
  } catch {
    // user dismissed or not available
  }
}
