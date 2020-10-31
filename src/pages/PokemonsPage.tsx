import React, { useEffect } from "react";
import PokemonForm from "../components/PokemonForm";

import Layout from "../components/Layout";
import InfiniteScroll from "../components/InfiniteScroll";
import PokemonCard from "../components/PokemonCard";
import { useDispatch, useSelector } from "react-redux";
import { pokemonsSelector, getPokemons } from "../features/pokemonSlice";
import { SliceStatus } from "../globals";
import {
  cachedPokemonsSelector,
  getCachedPokemons,
} from "../features/cachedPokemonsSlice";
import PokemonSkeleton from "../components/PokemonSkeleton";

const PokemonsPage = () => {
  const pokemons = useSelector(pokemonsSelector);
  const cachedPokemons = useSelector(cachedPokemonsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCachedPokemons());
    // eslint-disable-next-line
  }, []);

  const onSubmit = () => {};

  return (
    <Layout title="Home">
      <div className="px-6 md:px-24 lg:px-64 mt-6 md:mt-10">
        <h1 className="text-3xl lg:text-5xl font-semibold text-center sm:text-left">
          React Pokédex
        </h1>

        <InfiniteScroll
          paginationHandler={(page: number) =>
            getPokemons({ page, cachedPokemons: cachedPokemons.data })
          }
          isLoading={pokemons.status.state === SliceStatus.LOADING}
        >
          {({ resetPage }) => (
            <>
              <div className="my-4 md:my-6 lg:my-8 w-full">
                <PokemonForm
                  submitHandler={onSubmit}
                  placeholder="Search for a pokémon..."
                />
              </div>
              <div className="mx-auto w-full text-center">
                {!(
                  cachedPokemons.status.state === SliceStatus.LOADING ||
                  cachedPokemons.status.state === SliceStatus.IDLE
                ) && (
                  <InfiniteScroll.Container>
                    {({ numCols }) => (
                      <>
                        {pokemons.data.map((pokemon, index) =>
                          pokemon === null ? (
                            <div key={`loading-${index}`}>
                              <PokemonSkeleton />
                            </div>
                          ) : (
                            <PokemonCard
                              key={pokemon.id}
                              {...pokemon}
                              position={index % numCols}
                              numCols={numCols}
                            />
                          )
                        )}
                      </>
                    )}
                  </InfiniteScroll.Container>
                )}
                <InfiniteScroll.Button />
              </div>
            </>
          )}
        </InfiniteScroll>
      </div>
    </Layout>
  );
};
export default PokemonsPage;
