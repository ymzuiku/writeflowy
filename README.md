# Writeflowy

Website: [writeflowy.com](writeflowy.com)

By using AI, we analyze your context, English paragraphs, and movie subtitles to extract memory and association suggestions for individual sentences. Additionally, we employ the principles of the forgetting curve to assist you in managing the content you need to study daily.

# Why Use AGPL?

The purpose of open-sourcing this project is for sharing and learning. No one is allowed to make any form of commercial deployment.

- This project utilizes engineering-related content based on technologies such as Bun, SvelteKit, TRPC, Tailwind Variants, Prisma, Playwright, and bun test, which are relatively new in September 2023.
- i18n for the entire application using GPT for automatic translation.
- SSR full-stack single file deploy.

# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## .env

You must configure the following environments:

```
DEV=true
HOST="0.0.0.0"
PORT="6060"
ORIGIN="https://xxxxxxxxx.com"
XFF_DEPTH=2
SERVERDEV=true

DATABASE_URL="postgres://..?sslmode=disable"
REDIS_URL="redis://..."
SMTP_HOST="smtp.xxxx.com"
SMTP_PORT="xxx"
SMTP_FROM="xxx@xxx.com"
SMTP_PWD="xxx"

unsplash_access="xxxx"

AWS_ACCESS_KEY_ID="xxxx"
AWS_SECRET_ACCESS_KEY="xxxx"
AWS_REGION="us-west-1"
AWS_REGION2="us-west-2"
AWS_S3_SENTENCES="xxxx"

OPENAI_CLIENT="xxxx"
OPENAI_ORG="xxxx"


SCRIPE_WEBHOOK_SECRET="xxxxxxxxx"
SCRIPE_CLIENT="xxxxxxxx"
SCRIPE_SECRET="xxxxxxx"
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run es
```

You can preview the production build with `bun run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Update i18n

Use in code:

```
i18n`The text`  // front-end i18n, auto translate 6 language, return browser now language
i18nKey(`The text`)  // back-end i18n, auto translate 6 language, only return "The text"
i18nFromKey(`The text`)  // use "The text" return browser now language
```

Build in CLI:

```
bun run i18n
```

## migrate

If error:

```sh
bun: command not found
bunx: command not found
pm2: command not found
```

In target server add migrate.sh, and set nvm, bun path:

```sh
export PATH="$PATH:/home/ubuntu/.nvm/versions/node/v18.15.0/bin"
export PATH="$PATH:/home/ubuntu/.bun/bin"

bunx prisma generate
bunx prisma migrate deploy
pm2 stop your_pm2_server_name
pm2 start your_pm2_server_name
```
