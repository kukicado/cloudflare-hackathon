This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Environment Setup

Before running the application, you need to set up your environment variables. Create a `.env` file in the root directory of the project and add the following:


Replace `your_mongodb_connection_string` with your actual MongoDB connection string. This should include your username, password, cluster information, and database name.

For example:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/your_database_name?retryWrites=true&w=majority
```


Make sure to keep your `.env` file secure and never commit it to version control. Add `.env` to your `.gitignore` file if it's not already there.



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Cloudflare Worker

This project includes a Cloudflare Worker that acts as a movie recommendation service. The worker file is located at `cloudflare-worker.js` in the root directory of the project.

### How it works

The Cloudflare Worker uses AI to determine if a suggested movie is a good fit for the user based on their preferences. Here's a brief overview of its functionality:

1. It receives a POST request with a JSON payload containing `movieTitle` and `userPreferences`.
2. The worker then creates a chat-style input for the AI model, including:
   - A system message defining the AI's role as a movie oracle
   - The suggested movie title
   - The user's preferences
3. The worker sends this input to the Cloudflare AI model (`@cf/meta/llama-3-8b-instruct`).
4. Finally, it returns the AI's response as a JSON object.

To use this worker, make sure you have the necessary Cloudflare Worker environment set up and deploy the `cloudflare-worker.js` file to your Cloudflare account.

### Updating the Cloudflare Worker URL

If you're deploying your own Cloudflare Worker, you'll need to update the URL in the `pages/api/proxy.js` file. Locate the following line:

```
const response = await fetch('https://cloudlfare-hackathon.adoxyz.workers.dev/', {
```

