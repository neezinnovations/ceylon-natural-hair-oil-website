# Ceylon Natural Care Shop

A clean Create React App + Firebase starter for a fixed-product e-commerce flow.

## What Firebase is used for

- Firebase Authentication
- Firestore `users`
- Firestore saved addresses under `users/{uid}/addresses`
- Firestore `orders`
- Admin role stored in `users/{uid}.role`

Product photos and product content are fixed in the React project. They are **not** stored in Firebase.

Bank transfer receipts are uploaded to Cloudinary. Firestore stores only the returned receipt URL.

## 1. Install

```bash
npm install
```

## 2. Environment

Copy `.env.example` to `.env`, then fill in your Firebase and Cloudinary values.

```bash
cp .env.example .env
```

On Windows, simply duplicate `.env.example` and rename the copy to `.env`.

## 3. Firebase setup

1. Enable **Authentication > Email/Password**.
2. Create a **Firestore Database**.
3. Paste `firestore.rules` into Firestore Rules and publish.
4. Create a Firebase Web App and copy its config values into `.env`.

## 4. Admin setup

Create an admin user manually in Firebase Authentication. Copy that user's UID.

Create Firestore document:

`users/{ADMIN_UID}`


The Firestore document ID **must exactly match** the Firebase Authentication UID.

## 5. Cloudinary receipt upload

Create an unsigned upload preset in Cloudinary, for example `ceylon_receipts`, and put the cloud name and preset in `.env`.

For a production site, bank receipts should ideally use a signed/private upload flow rather than an unsigned public preset.

## 6. Edit your fixed product / bank details

Open:

`src/data/siteData.js`

Change product price, name, fixed image paths, bank details, contact information, etc.

Replace the placeholder files in `public/images/` with your real fixed images, or update the paths in `siteData.js`.

## 7. Run

```bash
npm start
```

Open:

- Customer website: `http://localhost:3000/`
- Customer account: `http://localhost:3000/account`
- Admin portal: `http://localhost:3000/admin`

## Important production note

This starter creates order totals in the browser because there is no backend server. For a production store, move trusted price validation, payment-state transitions, and any sensitive receipt access into a secure backend / Cloud Function.

## Storefront sections included
The homepage now includes separate React components for Header, Hero, Product, Ingredients, Benefits, Routine, About/Story, FAQ, Order CTA, Footer and a mobile sticky buy bar. Fixed product imagery remains in `public/images/`; no product images are stored in Firebase.
"# ceylon-natural-hair-oil-website" 
