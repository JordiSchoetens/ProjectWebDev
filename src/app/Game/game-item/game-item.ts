import { Component, input } from '@angular/core';
import { Game } from '../../Models/game';
import { GameService } from '../game-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StarPipePipe } from '../../Pipes/star-pipe-pipe';
import { Router } from '@angular/router';
import { ImageService } from '../../image-service';

@Component({
  selector: 'app-game-item',
  imports: [StarPipePipe],
  templateUrl: './game-item.html',
  styleUrl: './game-item.css',
})
export class GameItem {

  constructor(private gameService: GameService, private snackBar: MatSnackBar, private router: Router, private imageService: ImageService) {}

  // receive game data inputted from gamelist component
  GameItem = input<Game>();

  DeleteGame(gameId: string, imagePath: string) {
    // subscribes to the delete observable returned by the service,
    // must be subscribed to, to execute, automatically unsubs when task completes
    this.gameService.DeleteGame(gameId).subscribe(async () => {
      // after game deletion, deletes image
      await this.imageService.deleteImage(imagePath);
      this.snackBar.open('Game deleted successfully!', undefined, { duration: 3000, panelClass: 'snack-success' });
      console.log(`Game with ID ${gameId} deleted.`);
    });
  }

  EditGame(gameId: string) {
    // routes to Edit page, with gameId as parameter
    this.router.navigate(['Edit', gameId]);
  }
}