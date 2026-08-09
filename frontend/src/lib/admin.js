// Admin user configuration
const ADMIN_EMAILS = ['devlavaniya18@gmail.com']; // Add admin emails here

export const isAdmin = (user) => {
  return user?.emailAddresses?.[0]?.emailAddress && 
         ADMIN_EMAILS.includes(user.emailAddresses[0].emailAddress);
};