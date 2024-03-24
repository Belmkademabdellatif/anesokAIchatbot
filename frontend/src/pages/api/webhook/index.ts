import { usersTable } from '@anesok/schema';
import { db } from '@anesok/server/db';
import { eq } from 'drizzle-orm';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { buffer } from 'micro'

export interface ClerkWebhook {
  data:    {
    email_addresses:{
      email_address: string;
      verification:  {
        attempts:  null;
        expire_at: null;
        status:    string;
        strategy:  string;
      }
    }[];
    first_name:                      null;
    has_image:                       boolean;
    image_url:                       string;
    last_name:                       null;
    passkeys:                        any[];
    password_enabled:                boolean;
    profile_image_url:               string;
  }
  object: string;
  type:   string;
}


export const config = {
  api: {
    bodyParser: false,
  }
}
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405)
  }
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
 
  // Get the headers
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;
 
 
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Error occured -- no svix headers' })
  }
 
  console.log('headers', req.headers, svix_id, svix_signature, svix_timestamp)
  // Get the body
  const body = (await buffer(req)).toString()
 
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent
 
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({ 'Error': err })
  }
 
  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
 
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)


    // 👉 Parse the incomign event body into a ClerkWebhook object
    const webhook = JSON.parse(body) as ClerkWebhook
    try {
      
      // 👉 `webhook.type` is a string value that describes what kind of event we need to handle

      // 👉 If the type is "user.updated" the important values in the database will be updated in the users table
      if (webhook.type === 'user.updated' && !!webhook.data.email_addresses.at(0)?.email_address) {
        await db
          .update(usersTable)
          .set({
            name: `${webhook.data.first_name} ${webhook.data.last_name}`,
            email:webhook.data.email_addresses[0]?.email_address,
            imgUrl: webhook.data.image_url
          })
          .where(eq(usersTable.email, webhook.data.email_addresses[0]?.email_address??''))
      }

      // 👉 If the type is "user.created" create a record in the users table
      if (webhook.type === 'user.created') {
        console.log({
          name: `${webhook.data.first_name??''} ${webhook.data.last_name??''}`,
          email:webhook.data.email_addresses[0]?.email_address??'',
          imgUrl: webhook.data.image_url,
        })
        await db.insert(usersTable).values({
          name: `${webhook.data.first_name} ${webhook.data.last_name}`,
          email:webhook.data.email_addresses[0]?.email_address??'',
          imgUrl: webhook.data.image_url,
        })
      }

      // 👉 If the type is "user.deleted", delete the user record and associated blocks
      if (webhook.type === 'user.deleted') {
        await db.delete(usersTable).where(eq(usersTable.email, webhook.data.email_addresses[0]?.email_address??''))
      }

      return res.status(200).json({ message: 'Webhook received' });
      return {
        statusCode: 200
      }
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'An error occurred' });
      return {
        statusCode: 500
      }
    }
 
}