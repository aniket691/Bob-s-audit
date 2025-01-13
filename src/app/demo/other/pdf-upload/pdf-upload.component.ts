import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-pdf-upload',
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.scss'],
  standalone: true,  // Marking it as a standalone component
  imports: [CommonModule]  // Import the required module for standalone components
})
export default class PdfUploadComponent {
  pdfFile: File | null = null;
  isDragOver = false;

  onFileSelected(event: any) {
    this.pdfFile = event.target.files[0];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file && file.type === 'application/pdf') {
      this.pdfFile = file;
      this.isDragOver = false;
    }
  }

  clearFile() {
    this.pdfFile = null;
  }
}
