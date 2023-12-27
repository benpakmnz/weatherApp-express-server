import { Request, Response, NextFunction } from "express";
import { HttpError } from "../common/errors/http-error";
import axios from "axios";
import { getLocationFromIp } from "../util/location";
import { BadRequestError } from "../common/errors/bad-request-error";
import { handleFindById, handleUpdateUser } from "../services/userService";

export const getWeather = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { location, uid } = req.body;
  const { WEATHERMAP_API_KEY } = process.env;
  const WEATHER_API_PATH = "https://api.openweathermap.org/data/2.5/weather";
  const WEATHER_ICON_PATH = "https://openweathermap.org/img/wn";
  let user: any;
  try {
    user = await handleFindById(uid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  const handleLocation = async () => {
    if (location) return location;
    if (user?.location) return user.location;
    const client_ip: any = req.headers["X-Forwarded-For"];
    console.log(req.headers);

    const resIp = await getLocationFromIp(client_ip);
    return resIp?.city;
  };

  if (user) {
    let weatherRes;
    const newLocation = await handleLocation();
    try {
      weatherRes = await axios(
        `${WEATHER_API_PATH}?units=metric&q=${newLocation}&appid=${WEATHERMAP_API_KEY}`
      );
      user.location = newLocation;
    } catch (err) {
      const error = new BadRequestError("Couldn't find the city");
      return next(error);
    }

    try {
      await handleUpdateUser(user);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not update place.",
        500
      );
      return next(error);
    }

    const { data } = weatherRes;
    const weatherObj = {
      cityName: data.name,
      info: {
        temp: data.main.temp,
        minTemp: data.main.temp_min,
        maxTemp: data.main.temp_max,
        feelLike: data.main.feels_like,
        windSpeed: data.wind.speed,
        clouds: data.clouds.all,
        humidity: data.main.humidity,
      },
      description: data.weather[0].description,
      icon: `${WEATHER_ICON_PATH}/${data.weather[0].icon}@4x.png`,
      timeStemp: new Date(),
    };

    res.status(201).send({ data: weatherObj });
  }
};
