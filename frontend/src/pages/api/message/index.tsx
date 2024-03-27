import type { NextApiRequest, NextApiResponse } from 'next';

export default async  function handler(req:NextApiRequest,res:NextApiResponse){

    res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const text = `In this example, we create a new EventSource object and pass the URL of our API endpoint to the constructor.`
  
  

  for (const token of text.split(' ')) {
    res.write(`${token} `);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate delay
  }

  res.end();
//   try {

//     const content = req.body.content





//     res.json(result)
//   } catch (error) {
//     console.error(error);
//     res.json({ error: 'Imagekit had an error' });
//   }
}
