import React from 'react';
import { useLoaderData } from 'react-router';

export const About = () => {
  const games = useLoaderData();
  console.log(games);
  return (
    <div>
      {games.map((game) => (
        <p>{game.game_name}</p>
      ))}
    </div>
  );
};
