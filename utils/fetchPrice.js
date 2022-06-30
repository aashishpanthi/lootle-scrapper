import axios from "axios";
import * as cheerio from "cheerio";

const fetchPrice = async (url, site, priceLocation) => {
  try {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    let price = Number(
      $(priceLocation)
        .text()
        .replace(/([$,₹])/g, "")
    );

    console.log(price);

    if (site == "flipkart.com") {
      try {
        const { data } = await axios.get(
          "https://api.exchangerate.host/convert?from=INR&to=USD"
        );

        price = price * data.result;
      } catch (error) {
        console.log(error);
      }
    }

    // return current price
    return price;
  } catch (error) {
    throw error;
  }
};

export default fetchPrice;
