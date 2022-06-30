import {
  getAllTracks,
  getAllSites,
  updateHistory,
  updateStatus,
} from "./functions.js";
import getPrice from "./fetchPrice.js";
import sendMail from "./sendMail.js";

const runBot = async () => {
  try {
    const tracks = await getAllTracks();
    const sites = await getAllSites();

    tracks.map(async (track) => {
      const { _id, url, site, demandPrice, history, user, type, name } = track;
      const { priceLocation } = sites.filter((s) => s.name === site)[0];

      const price = await getPrice(url, site, priceLocation);

      const newHistory = {
        price,
      };

      updateHistory(_id, [...history, newHistory]);

      if (price < demandPrice) {
        // make a custom message
        const message = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>Welcome Email</title>
        </head>
        <body>
          The price of the ${type} you were tracking on <a href="https://lootle.live">lootle</a> is now in your budget.
          <br />
          <strong>${type} name:</strong> ${name}
          <br />
          <strong>Current price:</strong> $${price}
          <br />
          <strong>Your entered price:</strong> $${demandPrice}
          <br />
          <br />
          
          You can visit now and buy the ${type} <a href="${url}">here</a> before the price rises up. 
          If the above link doesn't work then you can copy and paste this link: 
          ${url}
          <br />
          <br />

          Kind regards, <br />
          Aashish Panthi <br />
          CEO of lootle

        </body>
      </html>
        `;

        //mail the user
        sendMail(user, "Hurry up! The price is in your budget now", message);

        updateStatus(_id, true); // if mail is sent
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default runBot;
