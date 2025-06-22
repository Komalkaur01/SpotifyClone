import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Error, Loader, SongCard } from '../components';
import { genres } from '../assets/constants';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';
import { selectGenreListId } from '../redux/features/playerSlice';

const Discover = () => {
  const dispatch = useDispatch();
  const { genreListId, activeSong, isPlaying } = useSelector((state) => state.player);

  const { data, isFetching, error } = useGetTopChartsQuery();

  // Filter songs by selected genre (Apple Music style)
  const filteredSongs = genreListId
    ? data?.filter(song =>
        song?.attributes?.genreNames?.some(genre => genre.toLowerCase().includes(genreListId.toLowerCase()))
      )
    : data;

  const handleGenreChange = (e) => {
    dispatch(selectGenreListId(e.target.value));
  };

  if (isFetching) return <Loader title="Loading top charts..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">
          Discover {genreListId ? genres.find((g) => g.value === genreListId)?.title : ''}
        </h2>

        <select
          onChange={handleGenreChange}
          value={genreListId}
          className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {filteredSongs?.map((song, i) => (
          <SongCard
            key={song.id || i}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={filteredSongs}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Discover;
