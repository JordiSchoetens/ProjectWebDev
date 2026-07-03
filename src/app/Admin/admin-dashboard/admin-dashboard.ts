import { Component } from '@angular/core';
import { GameService } from '../../Game/game-service';
import { Game } from '../../Models/game';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterPipePipe } from '../../Pipes/filter-pipe-pipe';
import { GameItem } from '../../Game/game-item/game-item';
import { FormsModule } from '@angular/forms';
import { AdminVisibleDirective } from "../../Directives/admin-visible-directive";
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [FilterPipePipe, GameItem, FormsModule, AdminVisibleDirective],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

  games: Game[] = [];
  subGame?: Subscription;
  search: string = '';

  constructor(private gameService: GameService, private snackBar: MatSnackBar, private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.games = [];
    this.GetGames();
  }

  GetGames() {
    // subscribes to the observable returned from the service, must sub to execute
    this.subGame = this.gameService.GetAllButOwnGameCollection()
    .subscribe({
      // when new data is received it updates the games array
      next: (games) => {
        this.games = games;
      },
      error: (err) => {
        console.error('Error fetching games:', err);
      }
    });
  }

  ngOnDestroy(): void {
    // must unsubscribe to prevent memory leak
    this.subGame?.unsubscribe();
  }

  DeleteGame(gameId: string) {
    // subscribes to the delete observable returned by the service,
    // must be subscribed to, to execute, automatically unsubs when task completes
    this.gameService.DeleteGame(gameId).subscribe(() => {
      this.snackBar.open('Game deleted successfully!', undefined, { duration: 3000, panelClass: 'snack-success' });
      console.log(`Game with ID ${gameId} deleted.`);
    });
  }
}