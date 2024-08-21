export default {
  async fetch(request, env) {

    const { movieTitle, userPreferences } = await request.json();
    const tasks = [];
    // messages - chat style input
    let chat = {
      messages: [
        { role: 'system', content: 'You are a movie oracle. Your job is to decide weather or not the suggested movie is a good fit for the user based on the users preference. You will be provided a movie first, and then users preferences.' },
        { role: 'user', content: `Movie is: ${movieTitle}` },
        { role: 'user', content: `User preferences are: ${userPreferences}`}
      ]
    };
    let response = await env.AI.run('@cf/meta/llama-3-8b-instruct', chat);
    tasks.push({ inputs: chat, response });

    return Response.json(response);
    }
};