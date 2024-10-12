import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"aaaa-9fb9f","appId":"1:342205528522:web:89eb0a8ea87755363b7733","storageBucket":"aaaa-9fb9f.appspot.com","apiKey":"AIzaSyA3WBEV4kRTlU60DEyBr5JiMquwfbhA-VY","authDomain":"aaaa-9fb9f.firebaseapp.com","messagingSenderId":"342205528522","measurementId":"G-BFXLPQBBYR"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"salajuegos-bartel","appId":"1:500772714952:web:203ffc93567f0feb75e8fd","storageBucket":"salajuegos-bartel.appspot.com","apiKey":"AIzaSyDwWtnrBJsAhV_bpBgDDtJOH4ApwmFHfVw","authDomain":"salajuegos-bartel.firebaseapp.com","messagingSenderId":"500772714952"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
