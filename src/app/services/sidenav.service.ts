import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
    providedIn: 'root'
})
export class SidenavService {
    sidenav: MatSidenav;
    isOpenInFullscreen: boolean = false;

    setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    open() {
        return this.sidenav.open();
    }

    close() {
        return this.sidenav.close();
    }

    toggle(): void {
        this.sidenav.toggle();
    }

    toggleFullscreen(): void {
        this.isOpenInFullscreen = !this.isOpenInFullscreen;
    }
}