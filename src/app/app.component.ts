import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private domain = 'http://localhost:4201';
  private platformUuid: string = '57045692-a37d-4df2-91ef-27ccff38eec2'; // your-platform-uuid-here

  showCreateForm = true;

  createFormIframeSrc!: SafeUrl;
  socialUnlockIFrameSrc!: SafeUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const url = `${this.domain}/platform/${this.platformUuid}/create`;
    this.createFormIframeSrc =
      this.sanitizer.bypassSecurityTrustResourceUrl(url);

    window.addEventListener('message', (event) => {
      const response = event.data;
      if (response.type === 'created') {
        this.setCreatedSocialUnlockIFrame(response.data.uuid);
        this.showCreateForm = false;
      }

      if (response.type === 'unlocked') {
        alert(JSON.stringify(response));
        console.log(event.data);
        // Implement actions upon unlock completion
      }
    });
  }

  setCreatedSocialUnlockIFrame(socialUnlockUuid: string) {
    const url = `${this.domain}/platform/${this.platformUuid}/${socialUnlockUuid}`;
    this.socialUnlockIFrameSrc =
      this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
