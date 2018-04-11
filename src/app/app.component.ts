import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
