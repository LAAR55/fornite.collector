// tslint:disable:object-literal-key-quotes
import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import { AWSError, DynamoDB } from "aws-sdk";
import { normalize, schema } from "normalizr";

import { createPlayerStatsSchema, updatePlayerStatsSchema } from "../../schemas/playerStats";
import { PlayerPlatform } from "../../types/player";

type Error = AWSError;

type GetItemInput = DynamoDB.DocumentClient.GetItemInput;
type GetItemOutput = DynamoDB.DocumentClient.GetItemOutput;

type PutItemInput = DynamoDB.DocumentClient.PutItemInput;
type PutItemOutput = DynamoDB.DocumentClient.PutItemOutput;

// TODO:
const playerStatsSchema = new schema.Entity("playerStats", {}, {
  idAttribute: "PlayerId",
});

const dynamoDb = new DynamoDB.DocumentClient();

// TODO:
const Fortnite = require("fortnite-api");
const ftnt = new Fortnite([
  "i2ef@live.com",
  "~EpHXd3-[95Yv)Qpm%",
  "MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=",
  "ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ=",
]);

export const handler: Handler = (event: APIGatewayEvent, context: Context, cb?: Callback) => {
  const playerStatsTableName = process.env.PLAYER_STATS_TABLE;
  context.callbackWaitsForEmptyEventLoop = false;

  const playerId = event.pathParameters && event.pathParameters.handle;
  const playerPlatform = event.queryStringParameters && event.queryStringParameters.platform;

  if (cb) {
    const getParams: GetItemInput = {
      Key: {
        PlayerId: playerId,
      },
      TableName: playerStatsTableName,
    };

    dynamoDb.get(getParams, (queryError: Error, getOutput: GetItemOutput) => {
      if (queryError) {
        // If no stats were returned we then poll the FTNT API
        // and save the stats
        ftnt.login().then(() => {
          ftnt.checkToken();
          ftnt.getStatsBRFromID(playerId, playerPlatform.toLowerCase())
            .then((stats: any) => {
              const playerStatsItem = createPlayerStatsSchema(stats);
              const putParams: PutItemInput = {
                Item: playerStatsItem,
                TableName: playerStatsTableName,
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

                return cb(null, {
                  body: JSON.stringify(normalize(playerStatsItem, playerStatsSchema)),
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                  },
                  statusCode: 200,
                });
              });
            }).catch((error: any) => {
              return cb(null, {
                body: JSON.stringify({
                  errorType: "UNKNOWN_ERROR",
                }),
                headers: {
                  "Access-Control-Allow-Origin": "*",
                },
                statusCode: 500,
              });
            });
        });
      }

      // Otherwise, if we find stats, we check the data
      // freshness
      if (getOutput.Item) {
        const thirtyMinutes = 1800000;  // 30 minutes
        const updatedAtTimestamp = new Date(getOutput.Item.Timestamps.UpdatedAt).getTime();

        // If the updatedAt timestamp plus 30 minutes is less than
        // now's timestamp
        if ((updatedAtTimestamp + thirtyMinutes) <= new Date().getTime()) {
          // Data is rotten
          ftnt.login().then(() => {
            ftnt.checkToken();
            ftnt.getStatsBRFromID(playerId, playerPlatform.toLowerCase())
              .then((stats: any) => {
                const playerStatsItem = updatePlayerStatsSchema(stats, new Date().getTime());
                const putParams: PutItemInput = {
                  Item: playerStatsItem,
                  ReturnValues: "ALL_OLD",
                  TableName: playerStatsTableName,
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

                  return cb(null, {
                    body: JSON.stringify(normalize(playerStatsItem, playerStatsSchema)),
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                    },
                    statusCode: 200,
                  });
                });
              }).catch((error: any) => {
                return cb(null, {
                  body: JSON.stringify({
                    errorType: "UNKNOWN_ERROR",
                  }),
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                  },
                  statusCode: 500,
                });
              });
          });
        } else {
          // If fresh, return the stats
          return cb(null, {
            body: JSON.stringify(normalize(getOutput.Item, playerStatsSchema)),
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            statusCode: 200,
          });
        }
      }
    });
  }
};
