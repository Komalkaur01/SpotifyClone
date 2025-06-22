import React from 'react';

import { ArtistCard, Error, Loader } from '../components';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';

const TopArtists = () => {
  const { data, isFetching, error } = useGetTopChartsQuery();

  if (isFetching) return <Loader title="Loading artists..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Top Artists</h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.map((track, i) => {
          const artist = track?.relationships?.artists?.data?.[0];
          const artwork = track?.attributes?.artwork?.url;
          const artistName = track?.attributes?.artistName;

          // Only render if all required fields are present
          if (!artist || !artwork || !artistName) return null;

          return (
            <ArtistCard
              key={artist.id || i}
              artistId={artist.id}
              name={artistName}
              image={artwork}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TopArtists;
