import React from 'react';

const Track = ({ isPlaying, isActive, activeSong }) => {
  const artwork = activeSong?.attributes?.artwork?.url?.replace('{w}', '125').replace('{h}', '125');
  const title = activeSong?.attributes?.name || 'No active Song';
  const artist = activeSong?.attributes?.artistName || 'Unknown Artist';

  return (
    <div className="flex-1 flex items-center justify-start">
      <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden sm:block h-16 w-16 mr-4`}>
        <img src={artwork} alt="cover art" className="rounded-full" />
      </div>
      <div className="w-[50%]">
        <p className="truncate text-white font-bold text-lg">{title}</p>
        <p className="truncate text-gray-300">{artist}</p>
      </div>
    </div>
  );
};

export default Track;
