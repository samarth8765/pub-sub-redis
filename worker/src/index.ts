import { createClient } from "redis";
const redisClient = createClient();

async function processSubmission(submission: Response) {
  const data = JSON.parse(submission.element);
  await new Promise((res) => setTimeout(res, 3000));
  console.log("Finished Processing the submission\n", data);
  redisClient.PUBLISH("problems", submission.element);
  console.log(submission.element);
}

async function startWorker() {
  try {
    await redisClient.connect();
    console.log("Worker connected to redis");

    while (true) {
      const response = await redisClient.brPop("problems", 0);
      // @ts-ignore
      await processSubmission(response);
    }
  } catch (err) {
    console.log(err);
  }
}

interface Response {
  key: string;
  element: string;
}

startWorker();
