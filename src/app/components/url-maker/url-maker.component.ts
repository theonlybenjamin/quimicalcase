import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-url-maker',
  templateUrl: './url-maker.component.html',
  styleUrls: ['./url-maker.component.scss']
})
export class UrlMakerComponent implements OnInit {

  trackId = new FormControl('');
  isCopied = false;
  constructor() { }

  ngOnInit(): void {
  }

  clickToCopy() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = `=HIPERVINCULO("https://quimicalcase.netlify.app/?id=${this.trackId.value}","${this.trackId.value}")`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.isCopied = true;
  }
}
