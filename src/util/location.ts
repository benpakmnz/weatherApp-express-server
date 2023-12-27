import axios from "axios";
import dotenv from "dotenv";
import { BadRequestError } from "../common/errors/bad-request-error";

dotenv.config();

export const getLocationFromIp = async (ip: string) => {
  let response;
  response = await axios.get(`https://ipapi.co/${ip}/json`);
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
