import { Component, inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  data = inject<string>(MAT_SNACK_BAR_DATA);
  snackBarRef = inject(MatSnackBarRef);
}
