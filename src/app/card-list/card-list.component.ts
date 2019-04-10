import { Component, OnInit, HostListener } from '@angular/core';
import { CardService } from '../card.service';
import { iCard } from 'src/interfaces/iCard';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgxMasonryOptions } from 'ngx-masonry';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  animations: [
    trigger('shrink-out',[
      transition('* => void', [ style({overflow: 'hidden'}), animate(200, style({height: 0})) ]),
      transition('void => *', [ style({opacity: 0}), animate(200, style({opacity: 1})) ])
    ])
  ]
})
export class CardListComponent implements OnInit {

  columnsOfCards: Array<Array<iCard>> = [];

  masonaryOptions: NgxMasonryOptions = {
    transitionDuration: '0.3s'
  }

  constructor(private service:CardService) {}

  ngOnInit() {
    this.service.getCards().then(res => {
      const mixedArray = this.mixArray(res);
      let firstColLen = Math.floor(Math.random() * 3) + 3; // 3-5
      firstColLen = mixedArray.length >= firstColLen ?  firstColLen : mixedArray.length;
      this.columnsOfCards.push(mixedArray.splice(0,firstColLen).sort(this.cardComparer));
      this.columnsOfCards.push(mixedArray.splice(0,Math.floor(mixedArray.length/2)).sort(this.cardComparer));
      this.columnsOfCards.push(mixedArray.sort(this.cardComparer));
    });
  }

  onDeleteChild(arrInd:number, cardInd:number){
    if(arrInd < 0 || arrInd > 2)
      return;
    this.columnsOfCards[arrInd].splice(cardInd,1);
  }

  OnEditChild(ev:iCard, arrInd, cardInd){
    const card = this.columnsOfCards[arrInd][cardInd];
    card.theme = ev.theme;
    card.sourceText = ev.sourceText;
    card.translation = ev.translation;
    this.columnsOfCards[arrInd].sort(this.cardComparer);
  }

  pushCard(card:iCard){
    /*
      First I get ordered array of indexes     
    */
    const aa = this.columnsOfCards.map((c,i) => i)
      .sort((a,b) => {
        if(this.columnsOfCards[a].length > this.columnsOfCards[b].length)
          return 1;
        if(this.columnsOfCards[a].length < this.columnsOfCards[b].length)
          return -1;
        else
          return 0;        
      });
      if(aa[0] === 0 && this.columnsOfCards[aa[0]].length > 4){
        this.columnsOfCards[aa[1]].push(card);
        this.columnsOfCards[aa[1]].sort(this.cardComparer);
      }
      else{
        this.columnsOfCards[aa[0]].push(card);
        this.columnsOfCards[aa[0]].sort(this.cardComparer);
      }
  }

  // @HostListener('window:resize')
  // onresize(){

  // }
 

  private mixArray<T>(array:Array<T>):Array<T>{
    let result  = array.filter(() => true);
    let length = result.length;
    for (let i = 0; i<length; ++i){
      let curr = result[i];
      let randIndex = Math.floor(Math.random() * length);
      result[i] = result[randIndex];
      result[randIndex] = curr;     
    }
    return result;
  }

  private cardComparer(a:iCard,b:iCard){
    if (a.sourceText.length > b.sourceText.length)
      return 1;
    if (a.sourceText.length < b.sourceText.length)
      return -1;
    else
      return 0;
  }
}
