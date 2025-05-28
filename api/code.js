export default async function handler(req, res) {
  const DISCORD_WEBHOOK_URL = process.env.WEBHOOK

  if (req.method !== 'POST') return res.status(500).json({error: "Invalid Request"})
  if (!DISCORD_WEBHOOK_URL) return res.status(500).json({error: "Missing webhook URL"})

  const body = JSON.parse(req.body);
  let message = `\nIP: ${req.headers['x-real-ip'] || req.connection.remoteAddress}`;
  Object.keys(req.query).forEach((key) => message += `\n${key}: ${req.query[key]}.`);
  Object.keys(body).forEach((key) => message += `\n${key}: ${body[key]}.`);
  const payload = JSON.stringify({content: message})

  try {
    fetch(
      DISCORD_WEBHOOK_URL,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: payload,
      }
    )
      .then(response => {
        if (!response.ok) return res.status(500).json({error: "Error messaging discord"});
        return res.status(200).json({success: true, message: "Notification sent"});
      })
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
}
