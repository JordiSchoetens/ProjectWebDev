import { EnvironmentInjector, Injectable, runInInjectionContext } from '@angular/core';
import { collection, collectionData, Firestore, CollectionReference, where, query, deleteDoc, doc, updateDoc, setDoc, docData, DocumentReference } from '@angular/fire/firestore';
import { Game } from '../Models/game';
import { from, Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class GameService {

  constructor(private firestore: Firestore, private injector: EnvironmentInjector, private auth: Auth) {  }

  GetOwnedGameCollection(): Observable<Game[]> {
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // gets a reference to the gamecollection collection
      const GameCollectionPath = collection(this.firestore, 'GameCollection') as CollectionReference<Game>;
      // create query to filter games owned by current user
      const AuthorOnly = query(GameCollectionPath, where('Author', '==', this.auth.currentUser!.uid));
      console.log("Loading owned game collection");
      // returns observable that emits list of games owned by current user, binds doc id to Id field
      return collectionData<Game>(AuthorOnly, { idField: 'Id' });
    });
  }
  
  GetAllButOwnGameCollection(): Observable<Game[]> {
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // gets a reference to the gamecollection collection
      const GameCollectionPath = collection(this.firestore, 'GameCollection') as CollectionReference<Game>;
      // create query to filter games not owned by current user
      const NotOwned = query(GameCollectionPath, where('Author', '!=', this.auth.currentUser!.uid));
      console.log("Loading all but owned games");
      // returns observable that emits list of games not owned by current user, binds doc id to Id field
      return collectionData<Game>(NotOwned, { idField: 'Id' });
    });
  }

  GetGameById(gameId: string): Observable<Game|undefined> {
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // gets a reference to the document with the given gameId
      const GameDoc = doc(this.firestore, `GameCollection/${gameId}`) as DocumentReference<Game>;
      console.log("Loading game with ID:", gameId);
      // returns an observable that emits the game data, binds doc id to Id field
      return docData<Game>(GameDoc, { idField: 'Id' });
    });
  }

  // because add/update/delete use from, they return observables made from a promise,
  // this unsubs automatically when completed

  AddGame(game: Game, Id: string){
    // sets author of game to current user id
    game.Author = this.auth.currentUser!.uid;
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // make reference to document with given Id
      const GameDoc = doc(this.firestore, `GameCollection/${Id}`);
      // writes the game data to the referenced document and returns an observable
      return from(setDoc(GameDoc, game));
    });
  }

  DeleteGame(gameId: string){
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // reference to document with given gameId
      const GameDoc = doc(this.firestore, `GameCollection/${gameId}`);
      // deletes the document and returns an observable
      return from(deleteDoc(GameDoc));
    });
  }

  UpdateGame(updatedGame: Game){
    console.log("Updating game:", updatedGame);
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // reference to document with given game id
      const GameDoc = doc(this.firestore, `GameCollection/${updatedGame.Id}`);
      // updates the document with the new game data and returns an observable
      // fields are given, otherwise, doc ID would be saved inside the document aswell
      return from(updateDoc(GameDoc, { Name: updatedGame.Name, Type: updatedGame.Type, Description: updatedGame.Description, Rating: updatedGame.Rating, ImgUrl: updatedGame.ImgUrl }));
    });
  }

  createGameId() {
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // asks firestore to create a new id, doesnt create or save any document
      return doc(collection(this.firestore, 'id')).id;
    });
  }
}