# Admin Setup Guide

## Overview
CodeGrid uses role-based access control to secure admin functionality. Only users with the 'admin' role can create, edit, or delete problems.

## First-Time Setup

### Step 1: Create an Account
1. Navigate to `/auth` in your application
2. Sign up with your email and password
3. You'll be automatically logged in

### Step 2: Assign Admin Role

After creating your account, you need to assign yourself the admin role:

1. **Get Your User ID**:
   - Visit `/admin` - you'll see a setup page with your user ID
   - Copy your user ID from the page

2. **Open Backend Dashboard**:
   - Click on "View Backend" button in your Lovable project
   - Navigate to the SQL Editor

3. **Run This SQL Command**:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR_USER_ID_HERE', 'admin');
   ```
   Replace `YOUR_USER_ID_HERE` with the actual user ID you copied.

4. **Refresh the Page**:
   - After running the SQL command, refresh the `/admin` page
   - You should now have full admin access

## Security Features

- **Role-Based Access**: Only users with 'admin' role can access admin features
- **Server-Side Validation**: All admin actions are validated at the database level using RLS policies
- **Automatic Ownership**: All problems are automatically tagged with the creating user's ID
- **Protected Routes**: Admin routes check for authentication AND admin role before allowing access

## Adding Additional Admins

To add more admin users:

1. Have them create an account through `/auth`
2. Get their user ID (they'll see it on the admin setup page)
3. Run the same SQL command with their user ID:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('THEIR_USER_ID', 'admin');
   ```

## Troubleshooting

**Issue**: Can't access admin after assigning role
- **Solution**: Make sure you've refreshed the page after running the SQL command
- Check that the SQL command executed successfully without errors

**Issue**: Getting "Access Denied" errors when trying to add problems
- **Solution**: Verify your user ID in the user_roles table:
  ```sql
  SELECT * FROM public.user_roles WHERE user_id = 'YOUR_USER_ID';
  ```

**Issue**: Problems not appearing
- **Solution**: Check the RLS policies are enabled and correctly configured on the problems table

## Database Schema

### user_roles Table
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- role: app_role enum ('admin' or 'user')
- created_at: timestamp
```

### problems Table
```sql
- id: UUID (primary key)
- title: text
- description: text
- solution: text
- explanation: text
- difficulty: text
- reference_link: text (optional)
- youtube_explanation_link: text (optional)
- created_by: UUID (references auth.users, NOT NULL)
- created_at: timestamp
- updated_at: timestamp
```
