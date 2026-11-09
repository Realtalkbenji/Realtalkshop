# Real Talk shop

A clothing shop with a home page, catalog, product pages, a bag, and a checkout note. The bag stays in this browser. Checkout does not take a card yet — it checks the form and shows a confirmation on the page.

GitHub for this shop: https://github.com/Realtalkbenji/Realtalkshop

This app lives in the `real-talk-shop` folder. Keep it in that GitHub repository, not in the Garcias Painting and Janitorial one.

## Run it locally

From this folder:

```bash
npm install
npm run dev
```

Open http://127.0.0.1:47421.

## Add your photos

Phone and camera files are usually too large for the site as-is. Export a smaller copy first:

1. Open the photo on your computer.
2. Export or save as **JPEG**.
3. Keep the long edge around **1600 pixels** and the file under **500KB**.
4. Name it after the piece, for example `linen-shirt.jpg`.
5. Put it in `public/products/`.

The shop looks for `/products/{slug}.jpg`. If the file is missing, the page shows the cloth color instead of a broken image.

| Piece | Save the file as |
| --- | --- |
| Open collar linen shirt | `public/products/linen-shirt.jpg` |
| Heavyweight tee | `public/products/heavy-tee.jpg` |
| Merino crew | `public/products/merino-crew.jpg` |
| Wide wool trouser | `public/products/wool-trouser.jpg` |
| Canvas work jacket | `public/products/canvas-jacket.jpg` |
| Everyday chino | `public/products/everyday-chino.jpg` |
| Cotton overshirt | `public/products/cotton-overshirt.jpg` |
| Ribbed beanie | `public/products/ribbed-beanie.jpg` |
| Stripe oxford | `public/products/stripe-oxford.jpg` |

On a Mac, Preview → File → Export → JPEG, quality around 60, works well.

## Change the words, prices, and pieces

- Brand name, email, and about text: `src/lib/content.ts`
- Products, prices, sizes, and colors: `src/lib/products.ts`

To add a new piece, copy one of the objects in `src/lib/products.ts`, give it a new `id` and `slug`, and save a matching JPG.

## Scripts

- `npm run dev` starts the local site.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs the linter.
