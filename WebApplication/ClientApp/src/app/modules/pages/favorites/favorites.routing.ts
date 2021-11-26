import { Route } from '@angular/router';
import { FavoritesComponent } from 'app/modules/pages/favorites/favorites.component';

export const favoritesRoutes: Route[] = [
    {
        path     : '',
        component: FavoritesComponent
    }
];
