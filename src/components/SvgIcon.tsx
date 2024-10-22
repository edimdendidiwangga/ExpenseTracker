import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface SvgIconProps {
  name: 'dashboard' | 'add' | 'view';
  color?: string;
  size?: number;
}

const SvgIcon: React.FC<SvgIconProps> = ({ name, color = 'black', size = 24 }) => {
  const icons: Record<string, string> = {
    dashboard: 'M3 13h2v-2H3v2zm0-4h2V7H3v2zm4 4h2v-6H7v6zm4-2h2V3h-2v8zm4-4h2v10h-2V7z',
    add: 'M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z',
    view: 'M12 4.5c-4.56 0-8.36 3.1-10 7.5 1.64 4.4 5.44 7.5 10 7.5s8.36-3.1 10-7.5c-1.64-4.4-5.44-7.5-10-7.5zm0 13c-3.14 0-5.93-2.17-7.24-5 1.31-2.83 4.1-5 7.24-5s5.93-2.17 7.24 5c-1.31-2.83-4.1 5-7.24 5zm0-9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
  };

  if (!icons[name]) {
    console.error(`Icon "${name}" is not defined.`);
    return null; 
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d={icons[name]} />
    </Svg>
  );
};

export default SvgIcon;
