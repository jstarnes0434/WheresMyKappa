import { request } from "graphql-request";
import { TaskData } from "../interfaces/task";
import { ItemData } from "../interfaces/items";
import { CraftingData } from "../interfaces/crafts";
import { HideoutData } from "../interfaces/hideoutupgrade";
import { RequiredFIRTaskData } from "../interfaces/requiredFIRQuestItem";

// Define the GraphQL endpoint and query
const GRAPHQL_URL = "https://api.tarkov.dev/graphql"; // replace with the actual endpoint

const GET_CRAFTS_QUERY = `
   query {crafts {
    id
    duration
    source
    sourceName
    level
    rewardItems {
      item {
        name
        wikiLink
        shortName
        baseImageLink
        image512pxLink
      }
    }
    requiredItems {
      item {
        name
        wikiLink
        shortName
        baseImageLink
        image512pxLink
      }
    }
  }
}`;

const GET_QUEST_ITEMS_REQUIRED = ` 
query {
  tasks(gameMode: regular) {
    experience
    name
    objectives {
      ... on TaskObjectiveItem {
        id
        count
        item {
          name
        }
        foundInRaid
      }
    }
  }
} `;

const GET_HIDEOUT_UPGRADE_QUERY = `
query {
  hideoutStations {
    name
    normalizedName
    imageLink
    id
    levels {
      description
      constructionTime
      id
      level
      itemRequirements {
        id
        item {
          name
          craftsFor {
            requiredItems {
              item {
                name
              }
            }
          }
        }
        count
      }
    }
  }
}`;

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
      name parent { name }
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

export const fetchHideoutUpgrades = async () => {
  try {
    const data: HideoutData = await request(
      GRAPHQL_URL,
      GET_HIDEOUT_UPGRADE_QUERY
    );
    return data; // return tasks data from the response
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};

export const fetchRequiredFIRQuestItems = async () => {
  try {
    const data: RequiredFIRTaskData = await request(
      GRAPHQL_URL,
      GET_QUEST_ITEMS_REQUIRED
    );
    return data.tasks; // return tasks data from the response
  } catch (error) {
    console.error("Error fetching required FIR Items:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};

export const fetchCultistCircleItems = async () => {
  try {
    const data: ItemData = await request(GRAPHQL_URL, GET_ITEMS_QUERY);

    // List of parent names to exclude
    const excludedCategories = ["Stackable item", "Key", "Weapon", "Repair"];

    // Filter out items whose parent category is in the excluded list
    const filteredItems = data.items.filter(
      (item) => !excludedCategories.includes(item.category.parent?.name || "")
    );

    return filteredItems; // Return the filtered items
  } catch (error) {
    console.error("Error fetching cultist circle items:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};

export const fetchCrafts = async () => {
  try {
    const data: CraftingData = await request(GRAPHQL_URL, GET_CRAFTS_QUERY);
    return data; // Return the filtered items
  } catch (error) {
    console.error("Error fetching crafts", error);
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
