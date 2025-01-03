# FoodGram Backend

A REST API server for the FoodGram social media application where users can share food-related posts.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Winston (Logging)
- Multer (File uploads)
- Bcrypt (Password hashing)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with:
```
DATABASE_URL="postgresql://username:password@localhost:5432/foodgram"
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev
```

4. Seed the database:
```bash
npx prisma db seed
```

5. Start development server:
```bash
npm run dev
```

## Available Endpoints

### Guest Routes
- `GET /` - Health check endpoint
- `POST /register` - Register new user
- `POST /login` - User login

### Authenticated Routes
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `PUT /users/:id/password` - Update password

## Project Structure

```
src/
  ├── app.ts              # Express app setup
  ├── routes/            
  │   ├── guest-route.ts      # Public routes
  │   └── authenticated-route.ts  # Protected routes
  ├── middleware/         # Custom middleware
  └── logger.ts          # Winston logger config

prisma/
  ├── schema.prisma      # Database schema
  └── seed.ts           # Seed data
```

## License

ISC
