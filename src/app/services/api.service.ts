import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  fetchPokemon(nbPokemons: number): Observable<any> {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${nbPokemons}`;
    return this.httpClient.get<any>(url);
  }

  fetchMorePokemon(url: string): Observable<any> {
    return this.httpClient.get<any>(url);
  }

  getPokemonData(pokemon: Pokemon): Observable<any> {
    let name = pokemon.name;
    let url = `https://pokeapi.co/api/v2/pokemon/${name}/`;
    return this.httpClient.get(url);
  }
}
