export type QuizSound =
  | 'goodChime'
  | 'badChime'
  | 'popChime'
  | 'streakChime'
  | 'queueClearedChime'
  | 'roundCompleteChime';

const players = new Map<QuizSound, HTMLAudioElement>();

export function playQuizSound(sound: QuizSound) {
  if (typeof window === 'undefined') return;
  const player =
    players.get(sound) ??
    new Audio(new URL(`audio/${sound}.mp3`, document.baseURI).href);
  players.set(sound, player);
  player.volume = 0.2;
  player.currentTime = 0;
  void player.play().catch(() => player.load());
}
