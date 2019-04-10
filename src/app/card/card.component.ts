import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef,  } from '@angular/core';
import { CLASSES } from 'src/constants';
import { iCard } from 'src/interfaces/iCard';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {
  
  @Input() theme: string = '';
  @Input() text: string = '';
  @Input() translation: string = '';
  @Input() editMode = false;
  @Input() className: string;

  @Output() deleteEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter<iCard>();
  
  showTranslation: boolean = false;
  timer = null;


  constructor() {
  }

  ngOnInit() {
    if (!this.className)
      this.generateClassName();
  }

  ngOnDestroy(): void {
    this.disposeTimer();
  }

  generateClassName(){
    this.className = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  }

  toggleTranslation(){
    this.disposeTimer();
    this.showTranslation = !this.showTranslation;
    if (this.showTranslation){
      this.timer = setTimeout(() => {
        this.showTranslation = false;
        this.timer = null;
      }, 3000);
    }    
  }

  onEditClick(ev:MouseEvent){
    ev.stopPropagation();
    this.disposeTimer();
    this.showTranslation = false;
    this.editMode = true;
  }

  onEditApplyClick(form:NgForm){
    if(!form.valid)
      return;
    this.editMode = false;
    this.editEvent.emit({theme: this.theme, sourceText: this.text, translation: this.translation});
  }

  private disposeTimer(){
    if (this.timer)
      clearTimeout(this.timer);
  }
}
