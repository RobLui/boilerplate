import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  styles: [
    `.demo-test-div {
        height: 100px;
        background-size: contain;
        line-height: 100px;
        text-align: center;
        border-bottom: 1px solid grey;
    }`
  ]
})
export class AppComponent {
    title = 'app';

    dummyData = ['dynamic CONTENT', 'dynamic CONTENT', 'dynamic CONTENT', 'dynamic CONTENT'];

    leftAction(): void {
        console.log('left');
    }
    rightAction(): void {
        console.log('right');
    }
}
