export { default } from 'next-auth/middleware';

export const config = { matcher: [
    '/', 
    '/accounts', 
    '/add-accounts',
    '/approval', 
    '/document-tracking', 
    '/files',
    '/log-history',
    '/profile',
    '/messages', 
    '/files'
] };