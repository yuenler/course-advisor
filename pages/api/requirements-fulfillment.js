// pages/api/requirements-fulfillment.js
import 'dotenv/config'
import OpenAI from 'openai';
import getRequirements from './helpers/getRequirements';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });

  const { courses, year, concentration, secondary, additionalInfo } = req.body;


  const data = await new Promise(async (resolve, reject) => {
    const requirements = getRequirements(concentration);
    try {
      const response = await openai.chat.completions.create({
        messages: [{
          role: 'user', content: `
          I have taken the following courses: ${JSON.stringify(courses)}.

          I am a ${year} at Harvard studying ${concentration} ${secondary ? `with a secondary in ${secondary}` : ''}.
          ${additionalInfo ? `Additional info: ${additionalInfo}` : ''}.

          The requirements for my concentration are: ${JSON.stringify(requirements)}.


          Based on the courses I have taken, I would like to know which requirements I have fulfilled and which ones I still need to fulfill.
          Please tell me this by formatting it as a JSON object with keys as the requirement and values as the code of the course I have already taken
          that fulfill that requirement. If there is a requirement like "Take at least 2 computer science course", separate that into 2 keys of "Computer
          Science course 1" and "Computer Science 2". Also, I will be using prewritten code to parse this json, so be sure that your
          output does not nest jsons within each other, and is just a simple 1 dimensional string to string json. The number of keys in your json
          should be equal to the number of courses required for the degree. If no requirement that I've taken fulfills the requirement, make the value
          an empty string. Finally, you may include a couple sentences for how you arrived at this conclusion if you believe there
          was any confusion about how you should interpret the requirements or the courses I have taken. Put these notes under the key "notes".
          
          For example:

          {
            "Math Class 1": "MATH 101",
            "Math Class 2": "MATH 102",
            "Science class": "CHEM 101",
            "Computer Science class": "",
            "notes": "It was unclear from the concentration requirements whether a class like MATH 101 would fulfill the requirement for Math Class 1, but I assumed it did because it was a math class."
          }
          `
        }],
        model: 'gpt-4-0125-preview',
      });
      const responseText = response.choices[0].message.content
      console.log('OpenAI response:', responseText);
      // parse response for first and last bracket
      const firstBracketIndex = responseText.indexOf('{');
      const lastBracketIndex = responseText.lastIndexOf('}');
      const jsonContent = responseText.slice(firstBracketIndex, lastBracketIndex + 1);
      // convert to JSON
      const json = JSON.parse(jsonContent);
      resolve(json);

    } catch (error) {
      reject(error);
    }
  });

  res.status(200).json(data);
}
