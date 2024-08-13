import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  displaySpinner: boolean = true;
  durationTime: number = 1600;

  constructor() {}

  ngOnInit() {
    this.runSpinner();
  }

  runSpinner() {
    setTimeout(() => {
      this.displaySpinner = false;
    }, this.durationTime);
  }
}
