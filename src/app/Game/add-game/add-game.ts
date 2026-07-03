import { Component, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GameService } from '../game-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutoFocusInputDirective } from '../../Directives/auto-focus-input-directive';
import { ImageService } from '../../image-service';
import { doc } from '@angular/fire/firestore';


@Component({
  selector: 'app-add-game',
  imports: [ReactiveFormsModule, AutoFocusInputDirective],
  templateUrl: './add-game.html',
  styleUrl: './add-game.css',
})
export class AddGame {

  gameForm!: FormGroup; 

  stars = [1, 2, 3, 4, 5];

  ratingModel = model(0);

  ratingError: boolean = false;
  fileError: boolean = false;

  file: File | null = null;

  id: string = '';

  // sets the rating model to the selected rating
  setRating(rating: number) 
  {
    this.ratingModel.set(rating);
  }

  constructor(private formBuilder: FormBuilder, private gameService: GameService, private router: Router, private snackBar: MatSnackBar, private imageService: ImageService) {  }

  ngOnInit() {
    // creates reactive form group for adding a game with name, description and type fields
    this.gameForm = this.formBuilder.group({
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
    return this.gameForm.controls['Name'];
  }

  get Description() {
    return this.gameForm.controls['Description'];
  }

  get Type() {
    return this.gameForm.controls['Type'];
  }

  async onSubmit() {
    // disables the buttons, because the img upload is async and takes some time,
    // without this its possible to spam the button and upload the img multiple times
    document.querySelectorAll('button').forEach(button => button.disabled = true);
    if (this.ratingModel() == 0 && !this.file) {
      this.fileError = true;
      this.ratingError = true;
      return;
    } 
    else if(this.ratingModel() == 0) {
      this.ratingError = true;
      this.fileError = false;
      return;
    }
    else if (!this.file) {
      this.fileError = true;
      this.ratingError = false;
      return;
    }
    else 
    {
      this.ratingError = false;
      this.fileError = false;
    }

    if (this.gameForm.valid) {
      // generates a new id
      this.id = this.gameService.createGameId();

      // makes a game object with the form values
      const newGame = this.gameForm.value;
      // gets the rating from the model, and puts it into the game object
      newGame.Rating = this.ratingModel();

      // constructs the image path
      const path = 'games/' + this.id + '/' + this.file!.name;

      // awaits the upload of the image and gets the download url and puts it into the game object
      newGame.ImgUrl = await this.imageService.uploadImage(this.file!, path);

      console.log('New Game:', newGame);

      // calls the addgame function from the gameservice
      this.gameService.AddGame(newGame, this.id)
      // sub to the observable returned by addgame to actually execute it
      .subscribe({
        // when succes
        next: () => {
          this.snackBar.open('Game added successfully!', undefined, { duration: 3000, panelClass: 'snack-success' });
          this.router.navigate(['Games']);
        },
        error: (err) => {
          console.error('Error adding game:', err);
          this.snackBar.open('Error adding game. Please try again.', undefined, { duration: 3000, panelClass: 'snack-error' });
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