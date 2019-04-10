import { Injectable } from '@angular/core';
import { iCard } from 'src/interfaces/iCard';
import { CARDS } from 'src/constants';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor() { }
  getCards(): Promise<Array<iCard>>{
    // return fetch('https://api.myjson.com/bins/b5dwg')
    // .then(res => res.json());
    return new Promise((resolve, reject) => { resolve(JSON.parse(CARDS)) });
  }
}
