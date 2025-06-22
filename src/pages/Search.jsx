import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsBySearchQuery } from '../redux/services/shazamCore';

const Search = () => {
  const { searchTerm } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongsBySearchQuery(searchTerm);

  const hits = data?.tracks?.hits || [];

  const songs = hits.map(hit => hit.track || hit);

  console.log("Search hits:", hits);
  console.log("Mapped songs:", songs);

  if (isFetching) return <Loader title={`Searching ${searchTerm}...`} />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Showing results for <span className="font-black text-[#00ffff]">"{searchTerm}"</span>
      </h2>

      {songs.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">No results found.</p>
      ) : (
        <div className="flex flex-wrap sm:justify-start justify-center gap-8">
          {songs.map((song, i) => (
            <SongCard
              key={song.key || song.id || i}
              song={song}
              data={songs}
              isPlaying={isPlaying}
              activeSong={activeSong}
              i={i}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
