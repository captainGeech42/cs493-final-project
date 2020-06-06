const redis = require("redis");

const { parseAuthToken } = require("./auth");

const host = process.env.REDIS_HOST || "localhost";
const port = process.env.REDIS_PORT || "6379";

const redisClient = redis.createClient(port, host);

// unauth requests are 5/min
// auth requests are 10/min
const rateLimitWindowMS = 60000;
const rateLimitNumUnauthRequests = 5;
const rateLimitNumAuthRequests = 10;

// pretty much https://github.com/osu-cs493-sp20/rate-limiting/blob/master/server.js#L15
function getUserTokenBucket(key, limit) {
    return new Promise((resolve, reject) => {
        redisClient.hgetall(key, (err, tokenBucket) => {
            if (err) {
                reject(err);
            } else {
                if (tokenBucket) {
                    tokenBucket.tokens = parseFloat(tokenBucket.tokens);
                } else {
                    tokenBucket = {
                        tokens: limit,
                        last: Date.now()
                    };
                }
                resolve(tokenBucket);
            }
        });
    });
}

// pretty much https://github.com/osu-cs493-sp20/rate-limiting/blob/master/server.js#L35
function saveUserTokenBucket(key, tokenBucket) {
    return new Promise((resolve, reject) => {
        redisClient.hmset(key, tokenBucket, (err, _) => err ? reject(err) : resolve());
    });
}

// pretty much https://github.com/osu-cs493-sp20/rate-limiting/blob/master/server.js#L47
async function applyRateLimit(req, res, next) {
    try {
        const jwtPayload = parseAuthToken(req.get("Authorization"));
        const limit = jwtPayload ? rateLimitNumAuthRequests : rateLimitNumUnauthRequests;
        const key = jwtPayload ? `user_${jwtPayload.sub}` : req.ip;

        const tokenBucket = await getUserTokenBucket(key, limit);
        const timestamp = Date.now();
        const ellapsedMilliseconds = timestamp - tokenBucket.last;
        const newTokens = ellapsedMilliseconds * (limit / rateLimitWindowMS);
        tokenBucket.tokens += newTokens;
        tokenBucket.tokens = Math.min(tokenBucket.tokens, limit);
        tokenBucket.last = timestamp;

        if (tokenBucket.tokens >= 1) {
            tokenBucket.tokens -= 1;
            await saveUserTokenBucket(key, tokenBucket);
            next();
        } else {
            await saveUserTokenBucket(key, tokenBucket);
            res.status(429).send({
                error: "You're doing that too much! Slow down"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Unable to apply rate limiting"
        });
    }
}

module.exports = applyRateLimit;