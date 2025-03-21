import { TranslateService } from "@ngx-translate/core";
import { INavbarData } from "./helper";
import { SessionService } from "src/app/authorization/services/session.service";

export class NavbarData {
    constructor( private translate: TranslateService, private sessionService: SessionService ) {}

    getNavbarData(): INavbarData[] {
        return [
            {
                routeLink: 'dashboard',
                icon: 'fal fa-tachometer',
                adminGuard: false,
                label: this.translate.instant('sidebar.dashboard')
            },
            {
                routeLink: 'properties',
                icon: 'fal fa-home',
                adminGuard: false,
                label: this.translate.instant('sidebar.properties.title'),
                items: [
                    {
                        routeLink: 'properties/property/create',
                        icon: 'fal fa-plus-square-o',
                        label: this.translate.instant('sidebar.properties.add'),
                        adminGuard: false,
                    },
                    {
                        routeLink: 'properties/list',
                        icon: 'fal fa-list',
                        label: this.translate.instant('sidebar.properties.list'),
                        adminGuard: false,
                    },
                ]
            },
            {
                routeLink: 'energy-labels',
                icon: 'fal fa-plug',
                label: this.translate.instant('sidebar.energy_labels'),
                adminGuard: false,
            },
            {
                routeLink: 'points-table',
                icon: 'fal fa-table',
                label: 'Points Table',
                adminGuard: false,
            },
            {
                routeLink: 'settings',
                icon: 'fal fa-cog',
                label: this.translate.instant('sidebar.settings.title'),
                adminGuard: false,
                expanded: true,
                items: [
                    {
                        routeLink: 'settings/layout',
                        icon: 'fal fa-paint-brush',
                        label: this.translate.instant('sidebar.settings.appearance'),
                        adminGuard: false,
                    },
                    {
                        routeLink: 'settings/users',
                        icon: 'fal fa-user-cog',
                        label: this.translate.instant('sidebar.settings.users'),
                        adminGuard: true,
                    },
                    {
                        routeLink: 'settings/invitations',
                        icon: 'fal fa-user-cog',
                        label: this.translate.instant('sidebar.settings.invitations'),
                        adminGuard: false,
                    },
                ]
            },
        ]
    }
}
