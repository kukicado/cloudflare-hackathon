export default async function handler(req, res) {
  const response = await fetch('https://cloudlfare-hackathon.adoxyz.workers.dev/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  console.log(data);
  res.status(200).json(data);
}