const { fetch } = require("undici");
const querystring = require("querystring");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const apiKey = process.env.EMAILOCTOPUS_API_KEY;
  const listId = process.env.EMAILOCTOPUS_LIST_ID;

  // Parse form-encoded body (from HTML form)
  const parsedBody = querystring.parse(event.body);
  const email = parsedBody.email;

  console.log(`Received a submission: ${email}`);

  try {
    const response = await fetch(`https://emailoctopus.com/api/1.6/lists/${listId}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        email_address: email,
        status: "SUBSCRIBED",
      }),
    });

    const responseText = await response.text();
    console.log("response:", responseText);

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
        Location: "/thanks.html"
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