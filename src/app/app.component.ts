import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],  // Ensure RouterOutlet is imported
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bobs_audit_frontend';
}
