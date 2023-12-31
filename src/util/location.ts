import axios from "axios";
import dotenv from "dotenv";
import { BadRequestError } from "../common/errors/bad-request-error";

dotenv.config();
const ipapiBase = "https://ipapi.co";

export const getLocationFromIp = async (ip?: string | string[] | undefined) => {
  let response;
  response = await axios.get(`${ipapiBase}/${ip ? ip + "/json" : "json"}`);
  const data = response.data;

  if (!data) {
    const error = new BadRequestError("Could not find your current location");
    throw error;
  }
  const location = {
    city: data.city,
    lat: data.latitude,
    lon: data.longitude,
  };

  return location;
};
