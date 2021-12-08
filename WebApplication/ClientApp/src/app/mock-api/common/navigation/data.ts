import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id  : 'divider-1',
        type: 'divider'
    },
    {
        id   : 'profile',
        title: 'navigation.profile',
        type : 'basic',
        icon : 'heroicons_outline:user-circle',
        link : '/profile'
    },
    {
        id   : 'dating',
        title: 'navigation.dating',
        type : 'basic',
        icon : 'heroicons_outline:fire',
        link : '/dating'
    },
    {
        id   : 'chat',
        title: 'navigation.chat',
        type : 'basic',
        icon : 'heroicons_outline:mail',
        link : '/chat'
    },
    {
        id   : 'favorites',
        title: 'navigation.favorites',
        type : 'basic',
        icon : 'heroicons_outline:star',
        link : '/favorites'
    },
    // {
    //     id   : 'calendar',
    //     title: 'navigation.calendar',
    //     type : 'basic',
    //     icon : 'heroicons_outline:calendar',
    //     link : '/calendar'
    // },
    {
        id   : 'settings',
        title: 'navigation.settings',
        type : 'basic',
        icon : 'heroicons_outline:cog',
        link : '/settings'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'profile',
        title: 'navigation.profile',
        type : 'basic',
        icon : 'heroicons_outline:user-circle',
        link : '/profile'
    },
    {
        id   : 'dating',
        title: 'navigation.dating',
        type : 'basic',
        icon : 'heroicons_outline:fire',
        link : '/dating'
    },
    {
        id   : 'chat',
        title: 'navigation.chat',
        type : 'basic',
        icon : 'heroicons_outline:mail',
        link : '/chat'
    },
    {
        id   : 'favorites',
        title: 'navigation.favorites',
        type : 'basic',
        icon : 'heroicons_outline:star',
        link : '/favorites'
    },
    // {
    //     id   : 'calendar',
    //     title: 'navigation.calendar',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/calendar'
    // },
    {
        id   : 'settings',
        title: 'navigation.settings',
        type : 'basic',
        icon : 'heroicons_outline:cog',
        link : '/settings'
    }
];
