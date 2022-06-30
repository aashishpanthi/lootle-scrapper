import {
  getAllTracks,
  getAllSites,
  updateHistory,
  updateStatus,
} from "./functions.js";
import getPrice from "./fetchPrice.js";

const runBot = async () => {
  try {
    const tracks = await getAllTracks();
    const sites = await getAllSites();

    tracks.map(async (track) => {
      const { _id, url, site, demandPrice, history } = track;
      const { priceLocation } = sites.filter((s) => s.name === site)[0];

      const price = await getPrice(url, site, priceLocation);

      const newHistory = {
        price,
      };

      updateHistory(_id, [...history, newHistory]);

      if (price < demandPrice) {
        //mail the user

        updateStatus(_id, true); // if mail is sent
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default runBot;
