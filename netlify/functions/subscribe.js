const fetch = require("undici");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { email } = JSON.parse(event.body);
    const apiKey = process.env.EMAILOCTOPUS_API_KEY;
    const listId = process.env.EMAILOCTOPUS_LIST_ID;

    const response = await fetch(`https://emailoctopus.com/api/1.6/lists/${listId}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        email_address: email,
        status: "SUBSCRIBED",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        statusCode: 302,
        headers: {
        Location: "/error.html"
        }
      };
    }

    return {
      statusCode: 302,
      headers: {
        location: "/thanks.html"
      },
    };

  } catch (err) {
    return {
      statusCode: 302,
      headers: {
        Location: "/error.html"
      }
    };
  }
};