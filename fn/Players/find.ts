// tslint:disable:object-literal-key-quotes
import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import { AWSError, DynamoDB } from "aws-sdk";
import { normalize, schema } from "normalizr";

import { createPlayerSchema } from "../../schemas/player";
import { LowercasePlayerPlatform, PlayerPlatform } from "../../types/player";

type Error = AWSError;

type QueryInput = DynamoDB.DocumentClient.QueryInput;
type QueryOutput = DynamoDB.DocumentClient.QueryOutput;

type PutItemInput = DynamoDB.DocumentClient.PutItemInput;
type PutItemOutput = DynamoDB.DocumentClient.PutItemOutput;

// TODO:
const playerSchema = new schema.Entity("player", {}, {
  idAttribute: "PlayerId",
});

const dynamoDb = new DynamoDB.DocumentClient();

const Fortnite = require("fortnite-api");
const ftnt = new Fortnite([
  "i2ef@live.com",
  "~EpHXd3-[95Yv)Qpm%",
  "MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=",
  "ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ=",
]);

export const handler: Handler = (event: APIGatewayEvent, context: Context, cb?: Callback) => {
  const playersTableName = process.env.PLAYERS_TABLE;
  context.callbackWaitsForEmptyEventLoop = false;

  const playerHandle = event.pathParameters && decodeURIComponent(event.pathParameters.handle);
  const playerPlatform = event.queryStringParameters && event.queryStringParameters.platform;

  if (cb && playersTableName && playerHandle && playerPlatform) {
    // Try to get the specified player from the db
    const queryParams: QueryInput = {
      ExpressionAttributeValues: {
        ":handle": playerHandle.toLowerCase(),
        ":platform": playerPlatform.toUpperCase(),
      },
      FilterExpression: "Platform = :platform",
      IndexName: "LowercaseNameIndex",
      KeyConditionExpression: "IndexedName = :handle",
      TableName: playersTableName,
    };

    dynamoDb.query(queryParams, (queryError: AWSError, queryOutput: QueryOutput) => {
      // If we don't have it get it and store it
      if (queryOutput.Count === 0 || queryError) {
        ftnt.login().then(() => {
          ftnt.checkToken();
          ftnt.checkPlayer(playerHandle.toLowerCase(), playerPlatform.toLowerCase())
            .then((stats: any) => {
              const playerItem = createPlayerSchema(stats, playerPlatform as LowercasePlayerPlatform);
              const putParams: PutItemInput = {
                Item: playerItem,
                TableName: playersTableName,
              };

              dynamoDb.put(putParams, (putError: Error, putOutput: PutItemOutput) => {
                if (putError) {
                  return cb(null, {
                    body: JSON.stringify({
                      errorType: "UNKNONW_ERROR",
                      putError,
                    }),
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                    },
                    statusCode: 500,
                  });
                }

                const normalizedObject = normalize(playerItem, playerSchema);

                return cb(null, {
                  body: JSON.stringify(normalizedObject),
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                  },
                  statusCode: 200,
                });
              });
            })
            .catch((error: string) => {
              const errorType = () => {
                switch (error) {
                  case "Player Not Found":
                    return "PLAYER_NOT_FOUND";
                  case "Impossible to fetch User. User not found on this platform":
                    return "PLAYER_NOT_FOUND_IN_PLATFORM";
                  case "Please precise a good platform: ps4/xb1/pc":
                    return "BAD_PLATFORM_TYPE";
                  case "Please precise a good type FortniteApi.SOLO/FortniteApi.DUO/FortniteApi.SQUAD":
                    return "BAD_GAMEMODE_TYPE";
                  case "Impossible to fetch User.":
                  case "Impossible to fetch fortnite data":
                  case "Impossible to fetch fortnite data !":
                  default:
                    return "UNKNOWN_ERROR";
                }
              };

              return cb(null, {
                body: JSON.stringify({
                  errorType: errorType(),
                }),
                headers: {
                  "Access-Control-Allow-Origin": "*",
                },
                statusCode: 500,
              });
            });
        });
      } else if (queryOutput.Items) {
        // If we have it we simply return it
        const normalizedObject = normalize(queryOutput.Items[0], playerSchema);
        return cb(null, {
          body: JSON.stringify(normalizedObject),
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          statusCode: 200,
        });
      }
    });
  }
};
