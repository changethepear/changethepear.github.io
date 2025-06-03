// netlify/functions/subscribe.js
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email } = JSON.parse(event.body);
  const apiKey = process.env.EMAILOCTOPUS_API_KEY;
  const listId = process.env.EMAILOCTOPUS_LIST_ID;

    const response = await fetch(`https://api.emailoctopus.com/lists/${listId}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      email_address: email,
      status: "SUBSCRIBED"
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { statusCode: response.status, body: error };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "subscription successful!" }),
  };
};