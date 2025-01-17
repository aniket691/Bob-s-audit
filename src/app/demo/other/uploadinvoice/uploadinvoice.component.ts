import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // Import CommonModule
@Component({
  selector: 'app-uploadinvoice',
  standalone: true,
  templateUrl: './uploadinvoice.component.html',
  styleUrls: ['./uploadinvoice.component.scss'],
  imports: [  CommonModule],
})
export class UploadinvoiceComponent {
  isUploading: boolean = false; // Controls visibility of the upload status
  uploadMessage: string = ''; // Holds the message to display
  gallery: { name: string; url: string }[] = []; // List of uploaded files

  constructor(private http: HttpClient) {}

  // Triggered when a file is selected
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.startUpload(input.files[0]);
    }
  }

 // Starts the upload process
startUpload(file: File) {
  this.isUploading = true;
  this.uploadMessage = `Uploading ${file.name}...`;

  // Create form data for API request
  const formData = new FormData();
  formData.append('file', file);

  // Send file to the API
  this.http.post('http://localhost:5000/extract-data', formData).subscribe({
    next: (response) => {
      console.log('Response from API:', response);

      // Assuming the 'data' field in the response contains the raw JSON string
      const rawData = response['data'];

      // Clean the data by removing unwanted characters (e.g., \n, \/, \")
      const cleanedData = rawData
        .replace(/\\n/g, '')  // Remove \n characters
        .replace(/\\\//g, '/') // Remove escaped slashes (\\)
        .replace(/\\"/g, '"'); // Remove escaped double quotes (\\")

      // Parse the cleaned data
      let parsedData :any;
      try {
        parsedData = JSON.parse(cleanedData);
        console.log('Cleaned and parsed data:', parsedData);

        // Add the cleaned data to the gallery (or use it as needed)
        const fileURL = URL.createObjectURL(file);
        this.gallery.push({ name: file.name, url: fileURL});

        // Update upload status
        this.isUploading = false;
        this.uploadMessage = 'File uploaded and data extracted successfully!';
      } catch (e) {
        console.error('Error parsing cleaned data:', e);
        this.isUploading = false;
        this.uploadMessage = 'Failed to parse the data from the response.';
      }
    },
    error: (error) => {
      console.error('Error during upload:', error);
      this.isUploading = false;
      this.uploadMessage = 'Failed to upload file.';
    },
  });
}


  // Drag and drop event handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.startUpload(event.dataTransfer.files[0]);
    }
  }
}
