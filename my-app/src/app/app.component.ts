import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
  <div class="container">
    <h1>Contact Us</h1>

    <!-- Loading -->
    <div *ngIf="loading()" class="loading">
      <div class="spinner"></div>
      <p>Sending message...</p>
    </div>

    <!-- Success or error message -->
    <div *ngIf="!loading() && message()" 
         class="message-box" 
         [class.success]="messageType() === 'success'" 
         [class.error]="messageType() === 'error'">
      <p>{{ message() }}</p>
      <button (click)="resetForm()">Send another message</button>
    </div>

    <!-- Form -->
    <form *ngIf="!loading() && !message()" (ngSubmit)="onSubmit()">
      <input type="text" [(ngModel)]="name" name="name" placeholder="Name" required />
      <p *ngIf="submitted() && !name" class="error-text">Name is required.</p>

      <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required />
      <p *ngIf="submitted() && !email" class="error-text">Email is required.</p>

      <textarea [(ngModel)]="messageBody" name="messageBody" placeholder="Message" required></textarea>
      <p *ngIf="submitted() && !messageBody" class="error-text">Message is required.</p>

      <button type="submit" [disabled]="loading()">Submit</button>
    </form>
  </div>
`,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = signal('');
  email = signal('');
  messageBody = signal('');
  
  submitted = signal(false);
  loading = signal(false);
  message = signal('');
  messageType = signal('');

  async onSubmit() {
    this.submitted.set(true);

    if (!this.name() || !this.email() || !this.messageBody()) {
      return;
    }

    this.loading.set(true);
    this.message.set('');
    this.messageType.set('');

    try {
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name(),
          email: this.email(),
          message: this.messageBody(),
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      this.message.set('Your message has been sent successfully!');
      this.messageType.set('success');

    } catch (error) {
      this.message.set('Failed to send message. Please try again.');
      this.messageType.set('error');
    } finally {
      this.loading.set(false);
    }
  }

  resetForm() {
    this.name.set('');
    this.email.set('');
    this.messageBody.set('');
    this.submitted.set(false);
    this.message.set('');
    this.messageType.set('');
  }
}
