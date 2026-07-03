import { Component, model } from '@angular/core';
import { CanComponentDeactivate } from '../../Guards/unsaved-changes-guard';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../../Models/game';
import { GameService } from '../../Game/game-service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AutoFocusInputDirective } from '../../Directives/auto-focus-input-directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ImageService } from '../../image-service';
import { doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-edit-game',
  imports: [ReactiveFormsModule, AutoFocusInputDirective],
  templateUrl: './edit-game.html',
  styleUrl: './edit-game.css',
})

export class EditGame implements CanComponentDeactivate {

  EditForm!: FormGroup;

  IsSaved: boolean = false;
  
  games: Game[] = [];
  GameFound?: Game;

  stars = [1, 2, 3, 4, 5];

  ratingModel = model(0);

  sub?: Subscription;

  file: File | null = null;

  constructor(private auth: Auth, private route: ActivatedRoute, private gameService: GameService, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router, private imageService: ImageService) { }

  // sets the rating model to the selected rating
  setRating(rating: number) 
  {
    this.ratingModel.set(rating);
  }

  ngOnInit() {
    // get game id from route params, sub to it to react to route changes
    // without this, changing the url would have any effect
    this.route.params.subscribe(params => {
      const gameId = params['id'];

      // call getgamebyid from gameservice with id from route
      this.sub = this.gameService.GetGameById(gameId)
        // sub to observable returned by getgamebyid to actually execute it
        .subscribe({
          // when fetch succes
          next: (game) => {
            // check if game was found
            if (game) {
              // when not owner, navigate away
              if(game.Author !== this.auth.currentUser!.uid){
                this.snackBar.open('You do not have permission to edit this game.', undefined, { duration: 3000, panelClass: 'snack-error' });
                this.IsSaved = true;
                this.router.navigate(['Games']);
                return;
              }
              console.log("Game found for editing:", game);
              this.GameFound = game;
              this.Name.setValue(game.Name);
              this.Type.setValue(game.Type);
              if (game.Description) {
                this.Description.setValue(game.Description);
              }
              this.ratingModel.set(game.Rating);
            } else {
              this.snackBar.open('Game not found', undefined, { duration: 3000, panelClass: 'snack-error' });
              this.IsSaved = true;
              this.router.navigate(['Games']);
            }
          },
          error: (err) => {
            console.error('Error fetching game:', err);
            this.snackBar.open('Error fetching game.', undefined, { duration: 3000, panelClass: 'snack-error' });
            this.IsSaved = true;
            this.router.navigate(['Games']);
          }
        });
    });

    // creates reactive form group for editing a game with name, description and type fields
    this.EditForm = this.formBuilder.group({
      Name: ['', { 
        validators: [Validators.required]
      }],
      Description: ['', { 
        validators: []
      }],
      Type: ['', { 
        validators: [Validators.required]
      }]
    });
  }

  // getters for easy access to form controls
  get Name() {
    return this.EditForm.controls['Name'];
  }

  get Type() {
    return this.EditForm.controls['Type'];
  }

  get Description() {
    return this.EditForm.controls['Description'];
  }

  // implementation of unsaved changes guard
  canDeactivate(): boolean {
    if(!this.GameFound) return true;
    if(!this.IsSaved)
    {
      return confirm("Are you sure you want to leave? All edits will be lost");
    }
    return true;
  }

  async onSubmit() {
    // disables the buttons, because the img upload is async and takes some time,
    // without this its possible to spam the button and upload the img multiple times
    document.querySelectorAll('button').forEach(button => button.disabled = true);
    if (this.EditForm.valid) {
      // fill the updatedgame object with values from form
      const updatedGame = this.EditForm.value;

      // when a new file is selected
      if(this.file){
        // first delete the old img, to prevent ghost images in storage
        await this.imageService.deleteImage(this.GameFound!.ImgUrl!);
        const path = 'games/' + this.GameFound!.Id + '/' + this.file.name;
        // await upload of new img and get new url, set new url as imgurl in updatedgame
        updatedGame.ImgUrl = await this.imageService.uploadImage(this.file, path);
      }
      else
      {
        // when no new img was selected, keep old imgurl, without this, imgurl would be null 
        // => lost ref to img
        updatedGame.ImgUrl = this.GameFound!.ImgUrl;
      }

      updatedGame.Rating = this.ratingModel();
      updatedGame.Id = this.GameFound!.Id;
      console.log('Updated Game:', updatedGame);

      this.IsSaved = true;

      // call updategame from gameservice with updatedgame object
      this.gameService.UpdateGame(updatedGame)
      // sub to observable to actually execute it
      .subscribe({
        // when call to firebase succesful
        next: () => {
          this.snackBar.open('Game updated successfully!', undefined, { duration: 3000, panelClass: 'snack-success' });
          this.router.navigate(['Games']);
        },
        error: (err) => {
          console.error('Error updating game:', err);
          this.snackBar.open('Error updating game. Please try again.', undefined, { duration: 3000, panelClass: 'snack-error' });
        }
      });
    }
    // enable button again
    document.querySelectorAll('button').forEach(button => button.disabled = false);
  }

  onFileSelected(event: Event) {
    // get the input element from the event and casts to inputelement
    const input = event.target as HTMLInputElement;
    // checks if a file was selected
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    } else {
      this.file = null;
    }
    console.log('Selected file:', this.file);
  }

}