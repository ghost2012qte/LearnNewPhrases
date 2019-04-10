import { Component, ViewChild, OnInit } from '@angular/core';
import { CardListComponent } from './card-list/card-list.component';
import { iCard } from 'src/interfaces/iCard';
import { state, style, transition, animate, trigger, AnimationEvent} from '@angular/animations';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('shown-hidden', [
      state('hidden', style({marginLeft: '-250px'})),
      state('shown', style({marginLeft: '10px'})),
      transition('shown <=> hidden', animate(200))
    ])
  ]
})
export class AppComponent implements OnInit{
  
  @ViewChild(CardListComponent, {read: CardListComponent}) cardListComp: CardListComponent;
  @ViewChild('card', {read: CardComponent}) asideCardComp: CardComponent;
  asideCardState = 'hidden';
  cardCreationRequired = false;
  today = new Date();
  color:FunctionStringCallback;

  ngOnInit(){
    console.log(this.cardListComp);
    console.log(this.asideCardComp);
  }

  toggleAsideCardState(){
    this.asideCardState = this.asideCardState === 'hidden'?'shown':'hidden';
  }

  createNewCard(){
    this.cardCreationRequired = true;
    this.toggleAsideCardState();
  }

  onAsideCardTransitionDone(ev:AnimationEvent){
    if (this.cardCreationRequired && ev.toState === 'hidden'){
      this.cardCreationRequired = false;
      this.cardListComp.pushCard({
        theme: this.asideCardComp.theme,
        sourceText: this.asideCardComp.text,
        translation: this.asideCardComp.translation
      });
      this.resetAsideCard();
    }
  }

  resetAsideCard(){
    this.asideCardComp.generateClassName();
    this.asideCardComp.editMode = true;
    this.asideCardComp.theme = '';
    this.asideCardComp.text = '';
    this.asideCardComp.translation = '';
  }
  
}
