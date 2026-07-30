import { Gamepad2 } from 'lucide-react';

export default function GameModeLauncher({ onEnter }: { onEnter: () => void }) {
  return <button className="game-launcher" onClick={onEnter} data-cursor="START" aria-label="Enter optional Game Mode">
    <Gamepad2 size={15}/><span><small>PRESS START</small>GAME MODE</span><i aria-hidden="true"/>
  </button>;
}
