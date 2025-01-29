import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useEffect, useState } from 'react';
import { AppButton } from './app-button';

interface CooldownButtonProps {
  buttonText: string;
  cooldownDuration: number;
  onAction: () => void;
  icon?: IconDefinition;
}

export function CooldownButton({
  buttonText,
  cooldownDuration = 30,
  onAction,
  icon,
}: CooldownButtonProps) {
  const [cooldown, setCooldown] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown !== null && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (cooldown === 0) {
      setCooldown(null);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleClick = () => {
    onAction();
    setCooldown(cooldownDuration);
  };

  return (
    <AppButton
      type="button"
      variant="fill"
      width="fit-content"
      padding="4px 20px"
      icon={icon}
      onClick={handleClick}
      disabled={cooldown !== null}
    >
      {cooldown !== null ? `Wait ${cooldown}s` : buttonText}
    </AppButton>
  );
}
