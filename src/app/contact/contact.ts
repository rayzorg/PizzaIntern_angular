import { Component } from '@angular/core';
import { MapLocation } from '../map-location/map-location';
import { ContactForm } from '../models/contact-form';
import { ContactService } from '../services/contactService';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MapLocation, CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contact: ContactForm = {
    name: '',
    email: '',
    id: '',
    subject: 'question',
    phoneNumber: '',
    message: '',
  };

  backendErrors: Record<string, string> = {};
  errorMessages: string[] = [];
  successMessage = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private contactService: ContactService,
    private cdr: ChangeDetectorRef,
  ) {}

  submit() {
    // reset previous messages
    this.errorMessages = [];
    this.fieldErrors = {};
    this.successMessage = '';

    this.contactService.sendContactForm(this.contact).subscribe({
      next: () => {
        this.successMessage = 'Message sent successfully';
        this.contact = {
          name: '',
          email: '',
          id: '',
          phoneNumber: '',
          subject: 'question',
          message: '',
        };
        this.cdr.markForCheck();
      },
      error: (err) => {
        if (err.status === 400 && Array.isArray(err.error)) {
          this.errorMessages = err.error;
          err.error.forEach((msg: string) => {
            const parts = msg.split(':');
            if (parts.length === 2) {
              const field = parts[0].trim();
              const message = parts[1].trim();
              this.fieldErrors[field] = message;
            } else {
              // fallback for generic messages
              this.errorMessages.push(msg);
            }
          });
        } else {
          this.errorMessages = ['Something went wrong. Please try again.'];
        }
        this.cdr.markForCheck();
      },
    });
  }
}
