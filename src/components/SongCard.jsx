import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();

  // Detect Apple-style vs Shazam-style song
  const isApple = !!song?.attributes;

  const name = isApple ? song.attributes.name : song.title;
  const artistName = isApple ? song.attributes.artistName : song.subtitle;
  const artworkUrl = isApple
    ? song.attributes.artwork?.url?.replace('{w}', '250').replace('{h}', '250')
    : song.images?.coverart;

  const songId = song.id || song.key;
  const artistId = isApple
    ? song.relationships?.artists?.data?.[0]?.id
    : song.artists?.[0]?.adamid;

  const isCurrentSong =
    (activeSong?.attributes?.name || activeSong?.title) === name;

  const handlePauseClick = () => dispatch(playPause(false));

  const handlePlayClick = () => {
    // ✅ Apple-style songs with direct preview
    if (isApple && song.attributes?.previews?.[0]?.url) {
      dispatch(setActiveSong({ song, data, i }));
      dispatch(playPause(true));
      return;
    }

    // ✅ Shazam-style songs without URI (fetch full details)
    if (!song.hub?.actions?.[1]?.uri && song.key) {
      fetch(
        `https://shazam-core.p.rapidapi.com/v1/tracks/details?track_id=${song.key}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_SHAZAM_CORE_RAPID_API_KEY,
            'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com',
          },
        }
      )
        .then((res) => res.json())
        .then((fullSong) => {
          dispatch(setActiveSong({ song: fullSong, data, i }));
          dispatch(playPause(true));
        })
        .catch((err) => {
          console.error('Failed to fetch full song details', err);
        });
    } else {
      // ✅ Shazam-style with full info already
      dispatch(setActiveSong({ song, data, i }));
      dispatch(playPause(true));
    }
  };

  if (!name || !artworkUrl) return null;

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
            isCurrentSong ? 'flex bg-black bg-opacity-70' : 'hidden'
          }`}
        >
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        <img
          alt={name}
          src={artworkUrl}
          className="w-full h-full rounded-lg object-cover"
        />
      </div>

      <div className="mt-4 flex flex-col">
        <p className="font-semibold text-lg text-white truncate">
          <Link to={`/songs/${songId}`}>{name}</Link>
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
          <Link to={artistId ? `/artists/${artistId}` : '/top-artists'}>
            {artistName}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SongCard;
