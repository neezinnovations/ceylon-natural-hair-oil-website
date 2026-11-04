# Security and deployment

The repository includes error recovery, active-account route checks, safe receipt links,
bounded cart quantities, fixed catalog prices, and restrictive Firestore rules. Browser
checks improve the interface; the deployed Firestore rules enforce database access.

## Required before production

1. Test `firestore.rules` with the Firebase Emulator Suite against your project data,
   then publish the rules in Firebase. Changing this local file does not change the live
   database. The current workspace has not run emulator tests or deployed these rules.
2. The trusted catalog in `firestore.rules` currently allows one product,
   `laceylon-herbal-hair-oil`, at LKR 1,800, with a quantity of 1–99 and free delivery.
   Update the rules and `src/data/siteData.js` together when changing the catalog.
3. Configure Firebase Authentication password policy, email enumeration protection,
   authorized domains, and abuse protection. Use MFA for administrator accounts where
   supported. Configure and enforce Firebase App Check after testing valid clients.
4. Replace unsigned, public Cloudinary receipt uploads with an authenticated backend
   issuing signed uploads and private/authenticated receipt access. Never put the
   Cloudinary API secret or Firebase Admin credentials in `REACT_APP_*` variables.
   Those variables are included in the public browser bundle. The existing unsigned
   upload flow remains compatible, but receipt privacy and upload abuse are unresolved
   until the backend and Cloudinary settings are configured. Client MIME/size checks
   do not replace server-side restrictions.
5. Apply the Vercel configuration when deploying to Vercel; configure equivalent
   security headers and HTTPS on other hosts. The configured headers prevent framing,
   disable MIME sniffing, restrict device permissions, and suppress referrers.
6. Run dependency auditing with network access and address advisories. Do not apply
   forced dependency upgrades without testing; this project still uses Create React App.

For a larger catalog, move order creation, authoritative pricing, payment transitions,
rate limits, and upload authorization into a trusted backend. Do not treat an uploaded
receipt or its claimed amount as proof of payment; administrators must verify the bank
transaction independently. Current rules reserve payment updates for active admins.

## Verification

```sh
npm test -- --watchAll=false --runInBand
npm run build
npm audit
```

The regression tests cover cart corruption and price manipulation, unsafe receipt URLs,
dashboard request recovery, invalid order quantities, and registration rollback. They
do not substitute for live configuration review or Firestore emulator tests.

Before publishing rules, verify these cases in an emulator: anonymous access denied;
cross-customer reads and writes denied; role/status/UID/email edits denied to customers;
inactive users denied orders and addresses; valid bank and COD orders allowed; altered
prices, totals, payment state, quantities, timestamps, and unknown fields denied; active
admin payment updates allowed; inactive admin updates denied.

References: [Firestore field restrictions](https://firebase.google.com/docs/firestore/security/rules-fields),
[Firebase Authentication API](https://firebase.google.com/docs/reference/js/auth), and
[email enumeration protection](https://docs.cloud.google.com/identity-platform/docs/admin/email-enumeration-protection).
