import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Game } from '../../Models/game';
import { GameService } from '../game-service';
import { GameItem } from "../game-item/game-item";
import { FormsModule } from '@angular/forms';
import { FilterPipePipe } from '../../Pipes/filter-pipe-pipe';

@Component({
  selector: 'app-game-list',
  imports: [GameItem, FormsModule, FilterPipePipe],
  templateUrl: './game-list.html',
  styleUrl: './game-list.css',
})
export class GameList implements OnInit, OnDestroy {
  games: Game[] = [];
  sub?: Subscription;
  search: string = '';

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.games = [];
    this.GetGames();
  }

  GetGames() {
    // call getcollection from gameservice
    this.sub = this.gameService.GetOwnedGameCollection()
    // subscribe to the observable it returns to actually execute it
    .subscribe({
      // when firebase fetch succesful, set games list to received games
      next: (games) => {
        this.games = games;
      },
      error: (err) => {
        console.error('Error fetching games:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}