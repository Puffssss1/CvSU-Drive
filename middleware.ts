export { default } from 'next-auth/middleware';

export const config = { matcher: [
    '/', 
    '/accounts', 
    '/add-accounts',
    '/approval', 
    '/document-tracking', 
    '/files',
    '/files/:path*',
    '/log-history',
    '/profile',
    '/messages', 
    '/sent-files',
    '/files'
] };