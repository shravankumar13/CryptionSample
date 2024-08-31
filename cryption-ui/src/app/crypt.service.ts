import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptService {
  private readonly SECRET_KEY = 'my-secret-key-12';
  private readonly INIT_VECTOR = 'RandomInitVector';

  decrypt(data: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(this.INIT_VECTOR);
    
    const decrypted = CryptoJS.AES.decrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const decryptedMessage = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
  }

  encrypt(data: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(this.INIT_VECTOR);
    
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const encryptedMessage = encrypted.toString();
    return encryptedMessage;
  }
}
