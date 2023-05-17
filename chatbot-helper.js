const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
require("dotenv").config();

const { PROJECT_ID } = process.env;
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(projectId = PROJECT_ID, message) {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: message,
        // The language used by the client (en-US)
        languageCode: 'fr-FR',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);

  const result = responses[0].queryResult;

  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return result;
}
module.exports = {
  runSample
}