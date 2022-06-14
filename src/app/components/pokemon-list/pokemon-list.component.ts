import { Component, OnInit } from '@angular/core';
import { delay, map } from 'rxjs/operators';
import { Pokemon } from 'src/app/models/pokemon';
import { ApiService } from 'src/app/services/api.service';
import { PokemonItemComponent } from '../pokemon-item/pokemon-item.component';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  nbPokemonsToGet = 20;
  nextPokemonsUrl!: string;
  pokemonsAreAdding = false;
  currentAddTimeout: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getPokemon(this.nbPokemonsToGet);
  }

  getPokemon(nbPokemonsToGet: number) {
    this.apiService.fetchPokemon(nbPokemonsToGet).subscribe((response) => {
      console.log('response :', response);
      this.nextPokemonsUrl = response.next;
      this.pokemons = [...response.results];

      this.getData(this.pokemons);
    });
  }

  getData(pokemons: Pokemon[]) {
    for (let index = 0; index < pokemons.length; index++) {
      const pokemon = pokemons[index];
      this.apiService
        .getPokemonData(pokemon)
        .subscribe((pokemonData: Pokemon['data']) => {
          pokemon.data = pokemonData;
        });
    }
  }

  addPokemon() {
    if (this.currentAddTimeout) return;

    console.log('addPokemon');
    this.apiService
      .fetchMorePokemon(this.nextPokemonsUrl)
      .subscribe((response) => {
        console.log('response :', response);
        this.nextPokemonsUrl = response.next;
        this.getData(response.results);
        this.pokemons = [...this.pokemons, ...response.results];
      });
  }

  loadMore(event: Event) {
    // console.log('event :', event);
    let scrollTop = document.documentElement.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight;
    let clientHeight = document.documentElement.clientHeight;
    let positionScrolling = clientHeight + scrollTop;
    let positionToLoadMore = scrollHeight - 200;
    let scrollingIsOnLoadMore = positionScrolling >= positionToLoadMore;

    if (scrollingIsOnLoadMore) {
      console.log('scrollingIsOnLoadMore :', scrollingIsOnLoadMore);
      console.log('loadMore');
      this.addPokemon();
      this.currentAddTimeout = setTimeout(() => {
        this.currentAddTimeout = null;
        this.pokemonsAreAdding = true;
      }, 1000);
    }
  }
}
