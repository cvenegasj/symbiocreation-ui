import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
    providedIn: 'root'
})
export class SidenavService {
    sidenav: MatSidenav;
    isOpenInFullscreen: boolean = false;

    sidenavAnalytics: MatSidenav;

    setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    setSidenavAnalytics(sidenavAnalytics: MatSidenav) {
        this.sidenavAnalytics = sidenavAnalytics;
    }

    open() {
        return this.sidenav.open();
    }

    close() {
        return this.sidenav.close();
    }

    closeSidenavAnalytics() {
        return this.sidenavAnalytics.close();
    }

    toggle(): void {
        this.sidenav.toggle();
    }

    toggleFullscreen(): void {
        this.isOpenInFullscreen = !this.isOpenInFullscreen;
    }
}