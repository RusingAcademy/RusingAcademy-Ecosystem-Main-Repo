# Debug Notes

The invoices API returns data successfully (11 records), but the response shows "[Max Depth]" for nested objects. This is a superjson serialization depth issue. The API returns `{ invoice: {...}, customerName: "..." }` but superjson is truncating the nested invoice object.

The page shows a spinner because the data arrives but the nested fields are "[Max Depth]" strings instead of actual data, causing the normalizer to produce empty rows.

The fix should be to flatten the API response in the router instead of returning nested objects, or increase superjson depth.

Better approach: Flatten the response in the router so it returns `{ id, invoiceNumber, invoiceDate, total, status, customerName }` instead of `{ invoice: {...}, customerName }`.
