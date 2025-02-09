import { request } from "graphql-request";
import { TaskData } from "../interfaces/task";
import { ItemData } from "../interfaces/items";

// Define the GraphQL endpoint and query
const GRAPHQL_URL = "https://api.tarkov.dev/graphql"; // replace with the actual endpoint

const GET_TASKS_QUERY = `
 query {
  tasks {
    wikiLink
    minPlayerLevel
    id
    taskImageLink
    taskRequirements {task {
      id, name
    }}
    name
    objectives {
      description 
      maps { name }
    }
    kappaRequired
    map {
      name
    }
    trader {
      name
      imageLink
    }
  }
}
`;

const GET_ITEMS_QUERY = `
 query {
   items {
    id
    name
    wikiLink
    basePrice
    avg24hPrice
    image512pxLink
    shortName
    description
    category {
      name
    }
    weight
  }
}
`;

// Function to fetch tasks from the API
export const fetchItems = async () => {
  try {
    const allowedNames = [
      "Old firesteel",
      "Antique axe",
      "Battered antique book",
      "#FireKlean gun lube",
      "Golden rooster figurine",
      "Silver Badge",
      "Deadlyslob's beard oil",
      "Golden 1GPhone smartphone",
      "Jar of DevilDog mayo",
      "Can of sprats",
      "Fake mustache",
      "Kotton beanie",
      "Raven figurine",
      "Pestily plague mask",
      "Shroud half-mask",
      "Can of Dr. Lupo's coffee beans",
      "42 Signature Blend English Tea",
      "Veritas guitar pick",
      "Evasion armband",
      "Armband (Evasion)",
      "Can of RatCola soda",
      "Loot Lord plushie",
      "Smoke balaclava",
      "WZ Wallet",
      "LVNDMARK's rat poison",
      "Missam forklift key",
      "Video cassette with the Cyborg Killer movie",
      'Video cassette with the movie Cyborg Killer from "Prokhodimec"',
      "BakeEzy cook book",
      "JohnB Liquid DNB glasses",
      "Baddie's red beard",
      "DRD body armor",
      "Gingy keychain",
      "Golden egg",
      "Press pass (issued for NoiceGuy)",
      "Axel parrot figurine",
      "BEAR Buddy plush toy",
      "Glorious E lightweight armored mask",
      "Inseq gas pipe wrench",
      "Viibiin sneaker",
      "Tamatthi kunai knife replica",
    ];
    const data: ItemData = await request(GRAPHQL_URL, GET_ITEMS_QUERY);
    console.log(data.items);
    const filteredItems = data.items.filter((item) =>
      allowedNames.includes(item.name)
    );

    console.log(filteredItems);

    return filteredItems; // return tasks data from the response
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};

export const fetchAllItems = async () => {
  try {
    const data: ItemData = await request(GRAPHQL_URL, GET_ITEMS_QUERY);
    return data.items; // return tasks data from the response
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};

// Function to fetch tasks from the API
export const fetchTasks = async () => {
  try {
    const data: TaskData = await request(GRAPHQL_URL, GET_TASKS_QUERY);

    return data.tasks; // return tasks data from the response
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};
