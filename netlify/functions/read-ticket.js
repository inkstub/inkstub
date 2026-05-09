exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const { imageData, mediaType } = body;
  if (!imageData || !mediaType) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing image data' }) };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 600,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imageData,
                },
              },
              {
                type: 'text',
                text: `You are reading a ticket image. Extract the following fields and return ONLY a valid JSON object with no extra text, markdown, or explanation.

Fields to extract:
- name: The event or artist/team name (string)
- type: One of exactly: Concert, Sports, Theatre, Festival, Comedy, Other (string)
- venue: Venue name ONLY, no city or state e.g. "Wrigley Field" or "Ball Arena" (string)
- venueCity: City and state e.g. "Chicago, IL" (string)
- venueAddress: Full street address if visible on ticket e.g. "1060 W Addison St, Chicago, IL 60613" (string)
- date: Event date in readable format like "June 2, 2024" (string)
- seat: Section, row, and/or seat number (string)
- price: Ticket price including $ symbol if visible (string)

Important: For venueAddress, if the full street address is NOT printed on the ticket, use your knowledge to provide the real street address of the venue. For example if venue is "Madison Square Garden" and city is "New York", return "4 Pennsylvania Plaza, New York, NY 10001". Always try to provide a venueAddress.

If a field is not visible or determinable, use an empty string "".

Return only JSON like this example:
{"name":"Taylor Swift","type":"Concert","venue":"Wrigley Field","venueCity":"Chicago, IL","date":"June 2, 2024","seat":"Sec 205, Row C, Seat 14","price":"$189.50","venueAddress":"1060 W Addison St, Chicago, IL 60613","eventCode":"VN0802","ticketNumber":"TK-48291"}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error?.message || 'Claude API error' }),
      };
    }

    const text = data.content?.[0]?.text || '';

    let ticketData;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      ticketData = JSON.parse(clean);
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not parse ticket data', raw: text }),
      };
    }

    // Keep venue name only - city goes in venueAddress

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
