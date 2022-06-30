import {
  getAllTracks,
  getAllSites,
  updateHistory,
  updateStatus,
} from "./functions.js";
import getPrice from "./fetchPrice.js";

const runBot = async () => {
  try {
    console.log("Bot running");
    const tracks = await getAllTracks();
    const sites = await getAllSites();

    tracks.map((track) => {
      const { _id, url, site, demandPrice, history } = track;
      const { priceLocation } = sites.filter((s) => s.name === site);

      const price = getPrice(url, site, priceLocation);

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
