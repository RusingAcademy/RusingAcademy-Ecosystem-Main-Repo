import { getApprovedCoaches } from './server/db';

async function queryCoaches() {
  const coaches = await getApprovedCoaches({});
  console.log(JSON.stringify(coaches, null, 2));
}

queryCoaches().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
