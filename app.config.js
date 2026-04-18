// eslint-disable-next-line @typescript-eslint/no-require-imports
const appJson = require('./app.json');

const androidMapsKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;
const iosMapsKey = process.env.GOOGLE_MAPS_IOS_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;

/** Merged static config from app.json + build-time native Maps keys (EAS env / local). */
module.exports = {
  expo: {
    ...appJson.expo,
    android: {
      ...appJson.expo.android,
      ...(androidMapsKey
        ? {
            config: {
              ...appJson.expo.android?.config,
              googleMaps: {
                ...appJson.expo.android?.config?.googleMaps,
                apiKey: androidMapsKey,
              },
            },
          }
        : {}),
    },
    ios: {
      ...appJson.expo.ios,
      ...(iosMapsKey
        ? {
            config: {
              ...appJson.expo.ios?.config,
              googleMapsApiKey: iosMapsKey,
            },
          }
        : {}),
    },
  },
};
