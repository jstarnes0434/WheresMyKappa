import { request } from "graphql-request";
import { TaskData } from "../interfaces/task";

// Define the GraphQL endpoint and query
const GRAPHQL_URL = "https://api.tarkov.dev/graphql"; // replace with the actual endpoint

const GET_TASKS_QUERY = `
  query {
    tasks {
      id
      name
      taskRequirements {
          task {name}
      }
      wikiLink
      objectives {
      description
    }
      kappaRequired
      descriptionMessageId
      trader {
        name
        imageLink
      }
    }
  }
`;

// Function to fetch tasks from the API
export const fetchTasks = async () => {
  try {
    const data: TaskData = await request(GRAPHQL_URL, GET_TASKS_QUERY);
    console.log(data.tasks);
    return data.tasks; // return tasks data from the response
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};
