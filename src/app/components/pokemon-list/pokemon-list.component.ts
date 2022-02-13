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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getPokemon();
  }

  getPokemon() {
    this.apiService.fetchAllPokemon().subscribe((response) => {
      this.pokemons = [...response.results];

      for (let index = 0; index < this.pokemons.length; index++) {
        const pokemon = this.pokemons[index];
        this.apiService
          .getPokemonData(pokemon)
          .subscribe((pokemonData: Pokemon['data']) => {
            pokemon.data = pokemonData;
          });
      }
    });
  }
}
