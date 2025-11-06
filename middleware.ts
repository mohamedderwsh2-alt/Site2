export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/deposit/:path*',
    '/withdraw/:path*',
    '/referral/:path*',
    '/support/:path*',
    '/admin/:path*',
  ],
};
