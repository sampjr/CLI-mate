#!/usr/bin/env node
const chalk = require("chalk");
const ora = require("ora");
const moment = require('moment-timezone');
const pck = require("./package.json");
const options = require("./utils/options");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const menu = require("./utils/menu");

const cat = [];
const tac = [];
process.argv.forEach((val, index) => {
  if(`${val}`.match(/^[a-zA-Z]/) && `${index}` > 1) cat.push(`${val}`);
  else if(`${val}`.match(/^(--u)/)) tac.push(`${val}`);
});
const location = cat.toString().replace(",", "_");
const units = options.getUnits(tac[0]);
const spinner = ora();
const region = "America/".concat(location);

switch (location) {
  case undefined:
    menu();
    spinner.fail("Provide a location");
    break;
  case "--help" || "--h":
  case "--h":
    menu();
    break;
  case "--version" || "--v":
  case "--v":
    spinner.succeed(pck.version);
    break;
  case location:
    geocode(location, (err, { latitude, longitude, location } = {}) => {
      if (err) {
        return spinner.fail(err);
      }
      forecast(
        latitude,
        longitude,
        units,
        (err, { description, temp, feelsLike, tempScale } = {}) => {
          if (err) {
            return spinner.fail(err);
          }
          spinner.succeed(chalk.underline(location));
          console.log(
            chalk.cyanBright(
              `${description}. It is currently ${temp}${tempScale}, it feels like ${feelsLike}${tempScale}. The local time is: ${moment().tz(region).format("h:mmA ddd, MMM D, YYYY")}` 
            )
          );
        }
      );
    });
  default:
    break;
}
